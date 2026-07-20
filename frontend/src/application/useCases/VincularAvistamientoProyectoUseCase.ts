import { ILocalProyectoRepository } from '../ports/ILocalProyectoRepository';

export class VincularAvistamientoProyectoUseCase {
  constructor(private readonly proyectoRepo: ILocalProyectoRepository) {}

  async execute(proyectoId: string, avistamientoId: string): Promise<void> {
    // Ideally this goes to a table linking Avistamiento <-> Proyecto
    // Assuming we can use addAporte as a way to link it (as an aporte multimedia for now)
    
    await this.proyectoRepo.addAporte({
      aporteId: Date.now().toString(),
      proyectoId,
      tareaId: 'general', // Or whatever default task
      usuarioId: 'vinculacion',
      tipoMultimedia: 'Foto', // Using Foto as fallback since avistamiento is not in the type
      archivoUrl: avistamientoId, // using this field to store the avistamiento ID
      comentarioDescriptivo: 'Avistamiento vinculado',
      fechaAporte: new Date().toISOString(),
    });
  }
}
