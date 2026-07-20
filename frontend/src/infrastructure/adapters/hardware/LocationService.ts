import * as Location from 'expo-location';
import { Alert, Platform } from 'react-native';

export interface LocationCoords {
  latitude: number;
  longitude: number;
}

export class LocationService {
  /**
   * Solicita permisos de ubicación al dispositivo.
   * Si no están activos los servicios de ubicación (GPS), solicita activarlos.
   * Devuelve las coordenadas actuales si se obtuvieron con éxito, de lo contrario null.
   */
  static async requestAndGetCurrentLocation(): Promise<LocationCoords | null> {
    try {
      // 1. Verificar si los servicios de ubicación están habilitados a nivel de dispositivo
      const servicesEnabled = await Location.hasServicesEnabledAsync();
      if (!servicesEnabled) {
        if (Platform.OS === 'android') {
          try {
            // Intenta pedirle al usuario de Android que active el proveedor de ubicación
            await Location.enableNetworkProviderAsync();
          } catch (error) {
            Alert.alert(
              'Servicios de Ubicación Desactivados',
              'El GPS está desactivado. Por favor, actívalo en los ajustes de tu dispositivo para poder guardar la localización.'
            );
            return null;
          }
        } else {
          Alert.alert(
            'Servicios de Ubicación Desactivados',
            'Por favor, activa el GPS de tu dispositivo en Ajustes para conectar la foto con el mapa de calor.'
          );
          return null;
        }
      }

      // 2. Solicitar permisos de primer plano al usuario
      const { status: currentStatus } = await Location.getForegroundPermissionsAsync();
      let finalStatus = currentStatus;

      if (currentStatus !== 'granted') {
        const { status } = await Location.requestForegroundPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        // El usuario denegó el permiso, no arrojamos error para permitir continuar sin ubicación
        console.log('Permiso de ubicación denegado por el usuario.');
        return null;
      }

      // 3. Obtener la posición actual
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
        timeInterval: 5000, // Evitar retrasos prolongados en la espera del GPS
      });

      return {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
    } catch (error) {
      console.error('Error al obtener la ubicación actual:', error);
      return null;
    }
  }

  /**
   * Parsea un string en formato DMS (Grados, Minutos, Segundos) a grados decimales.
   * e.g., "8/1, 18/1, 4032/100"
   */
  private static parseDMS(dmsString: string): number | null {
    try {
      const parts = dmsString.split(',').map(part => {
        const subparts = part.trim().split('/');
        if (subparts.length === 2) {
          return parseFloat(subparts[0]) / parseFloat(subparts[1]);
        }
        return parseFloat(part);
      });
      
      if (parts.length >= 1 && !parts.some(isNaN)) {
        const degrees = parts[0] || 0;
        const minutes = parts[1] || 0;
        const seconds = parts[2] || 0;
        return degrees + minutes / 60 + seconds / 3600;
      }
    } catch (e) {
      console.error('Error parseando cadena DMS EXIF:', e);
    }
    return null;
  }

  /**
   * Extrae la latitud y longitud a partir de la metadata EXIF de una imagen.
   * Devuelve { latitude, longitude } o null.
   */
  static parseExifGPS(exif: any): LocationCoords | null {
    if (!exif) return null;

    // Diferentes plataformas o librerías pueden guardar las coordenadas bajo nombres distintos
    let lat = exif.GPSLatitude;
    let lon = exif.GPSLongitude;

    if (lat === undefined || lon === undefined) {
      lat = exif.latitude !== undefined ? exif.latitude : exif.GpsLatitude;
      lon = exif.longitude !== undefined ? exif.longitude : exif.GpsLongitude;
    }

    if (lat === undefined || lon === undefined) {
      return null;
    }

    const parseVal = (val: any): number | null => {
      if (typeof val === 'number') return val;
      if (typeof val === 'string') {
        if (val.includes(',') || val.includes('/')) {
          return this.parseDMS(val);
        }
        const parsed = parseFloat(val);
        if (!isNaN(parsed)) return parsed;
      }
      return null;
    };

    let parsedLat = parseVal(lat);
    let parsedLon = parseVal(lon);

    if (parsedLat === null || parsedLon === null) return null;

    const latRef = exif.GPSLatitudeRef || exif.latitudeRef;
    const lonRef = exif.GPSLongitudeRef || exif.longitudeRef;

    if (latRef === 'S' && parsedLat > 0) {
      parsedLat = -parsedLat;
    }
    if (lonRef === 'W' && parsedLon > 0) {
      parsedLon = -parsedLon;
    }

    return {
      latitude: parsedLat,
      longitude: parsedLon,
    };
  }
}
