// @ts-ignore
import * as FileSystem from 'expo-file-system';
// @ts-ignore
import * as Sharing from 'expo-sharing';
import ExcelJS from 'exceljs';
import { Buffer } from 'buffer';

export class ExportarDarwinCoreUseCase {
  async execute(avistamientos: any[]): Promise<void> {
    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('DarwinCore');

      // Darwin Core Headers
      worksheet.columns = [
        { header: 'occurrenceID', key: 'id', width: 30 },
        { header: 'scientificName', key: 'scientificName', width: 25 },
        { header: 'eventDate', key: 'eventDate', width: 15 },
        { header: 'decimalLatitude', key: 'lat', width: 15 },
        { header: 'decimalLongitude', key: 'lng', width: 15 },
        { header: 'associatedMedia', key: 'media', width: 40 },
        { header: 'Imagen (Incrustada)', key: 'imagen', width: 25 },
      ];

      for (let i = 0; i < avistamientos.length; i++) {
        const av = avistamientos[i];
        const row = worksheet.addRow({
          id: av.id,
          scientificName: av.titulo || 'Desconocido',
          eventDate: new Date().toISOString().split('T')[0], // Mock date
          lat: 8.2934, // Mock lat
          lng: -62.7233, // Mock lng
          media: av.imagenUrl || '',
        });

        // Try to add image if present
        if (av.imagenUrl) {
          try {
            // Fetch image and convert to base64
            // Since it might be a network or local uri, we can use fetch/FileSystem depending on URI type.
            // Assuming local uri for offline first:
            let base64 = '';
            if (av.imagenUrl.startsWith('file://')) {
              base64 = await (FileSystem as any).readAsStringAsync(av.imagenUrl, { encoding: (FileSystem as any).EncodingType.Base64 });
            } else {
              // For mock urls like https://
              const response = await fetch(av.imagenUrl);
              const blob = await response.blob();
              base64 = await new Promise((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
                reader.readAsDataURL(blob);
              });
            }

            if (base64) {
              const imageId = workbook.addImage({
                base64: base64,
                extension: 'jpeg',
              });
              
              // Row index is i + 2 (1-based, 1 is header)
              // Column index is 6 (0-based)
              worksheet.addImage(imageId, {
                tl: { col: 6, row: i + 1 },
                ext: { width: 100, height: 100 }
              });
              
              worksheet.getRow(i + 2).height = 80;
            }
          } catch (imgError) {
            console.log('Could not embed image', imgError);
          }
        }
      }

      // Write to buffer
      const buffer = await workbook.xlsx.writeBuffer();
      
      // Save locally
      const fileUri = (FileSystem as any).documentDirectory + 'DarwinCore_Export.xlsx';
      
      // We need to convert ArrayBuffer back to Base64 to write with FileSystem
      const base64Data = Buffer.from(buffer).toString('base64');
      await (FileSystem as any).writeAsStringAsync(fileUri, base64Data, {
        encoding: (FileSystem as any).EncodingType.Base64
      });

      // Share
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri, {
          mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          dialogTitle: 'Exportar DarwinCore',
        });
      }

    } catch (e) {
      console.error('Error exporting to Excel', e);
      throw e;
    }
  }
}
