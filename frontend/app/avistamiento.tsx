import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ChevronLeft, Save, MapPin, Leaf } from 'lucide-react-native';
import * as Location from 'expo-location';
import CameraWidget from '../src/presentation/components/feature/camera/CameraWidget';
import { RegistrarAvistamientoUseCase } from '../src/application/useCases/RegistrarAvistamientoUseCase';
import { WatermelonAvistamientoRepository } from '../src/infrastructure/adapters/watermelon/avistamiento/WatermelonAvistamientoRepository';
import { WatermelonPerfilRepository } from '../src/infrastructure/adapters/watermelon/perfil/WatermelonPerfilRepository';

export default function RegistrarAvistamientoScreen() {
  const params = useLocalSearchParams<{ 
    photos?: string;
    latitude?: string;
    longitude?: string;
    locationSource?: string;
  }>();
  const [titulo, setTitulo] = useState('');
  const [notas, setNotas] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  const [photos, setPhotos] = useState<string[]>(() => {
    try {
      return params.photos ? (JSON.parse(params.photos) as string[]) : [];
    } catch {
      return [];
    }
  });
  const [latitud, setLatitud] = useState<number | null>(() => {
    if (params.latitude) {
      const parsed = parseFloat(params.latitude);
      return isNaN(parsed) ? null : parsed;
    }
    return null;
  });
  const [longitud, setLongitud] = useState<number | null>(() => {
    if (params.longitude) {
      const parsed = parseFloat(params.longitude);
      return isNaN(parsed) ? null : parsed;
    }
    return null;
  });
  const [fuenteUbicacion, setFuenteUbicacion] = useState<string | null>(params.locationSource || null);
  const [saving, setSaving] = useState(false);


  const handleSave = async () => {
    if (!titulo.trim()) {
      Alert.alert('Campo Requerido', 'Por favor ingresa el nombre de la especie o título del avistamiento.');
      return;
    }
    if (photos.length === 0) {
      Alert.alert('Evidencia Requerida', 'Por favor agrega al menos una foto del avistamiento.');
      return;
    }

    setSaving(true);
    try {
      const avistamientoRepo = new WatermelonAvistamientoRepository();
      const perfilRepo = new WatermelonPerfilRepository();
      const useCase = new RegistrarAvistamientoUseCase(avistamientoRepo, perfilRepo);

      await useCase.execute({
        especieVerifNombre: titulo.trim(),
        notas: notas.trim(),
        ubicacion: ubicacion.trim(),
        fotoUrl: photos[0],
        fotosExtra: photos.slice(1),
        latitud: latitud !== null ? latitud : undefined,
        longitud: longitud !== null ? longitud : undefined,
      });


      setSaving(false);
      Alert.alert(
        '¡Avistamiento Guardado!',
        'El registro fue guardado correctamente y ya aparece en tu perfil.',
        [{ text: 'Excelente', onPress: () => router.replace('/') }]
      );
    } catch (error: any) {
      setSaving(false);
      Alert.alert('Error al Guardar', error.message || 'Ocurrió un error inesperado.');
    }
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <ChevronLeft size={22} color="#6b5b3e" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Nuevo Avistamiento</Text>
          <View style={{ width: 38 }} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* ── FOTOS AL TOPE ── */}
          <CameraWidget
            photos={photos}
            onPhotosChange={setPhotos}
            onLocationCaptured={async (lat, lon, src) => {
              setLatitud(lat);
              setLongitud(lon);
              setFuenteUbicacion(src);

              // Autocompletar la dirección si el usuario no ha escrito nada
              if (!ubicacion.trim()) {
                try {
                  const [address] = await Location.reverseGeocodeAsync({ latitude: lat, longitude: lon });
                  if (address) {
                    const parts = [];
                    if (address.name && address.name !== address.street) {
                      parts.push(address.name);
                    }
                    if (address.street) {
                      parts.push(address.street);
                    }
                    if (address.district) {
                      parts.push(address.district);
                    }
                    if (address.city || address.subregion) {
                      parts.push(address.city || address.subregion);
                    }
                    if (address.region) {
                      parts.push(address.region);
                    }
                    if (address.country) {
                      parts.push(address.country);
                    }
                    const readableAddress = parts.filter(Boolean).join(', ');
                    if (readableAddress) {
                      setUbicacion(readableAddress);
                    }
                  }
                } catch (e) {
                  console.error('Error en geocodificación inversa:', e);
                }
              }
            }}
          />


          {/* Separador visual */}
          <View style={styles.divider} />

          {/* Tarjeta de introducción */}
          <View style={styles.introCard}>
            <View style={styles.introIcon}>
              <Leaf size={20} color="#4d7c0f" />
            </View>
            <View style={styles.introTextContainer}>
              <Text style={styles.introTitle}>Datos del Avistamiento</Text>
              <Text style={styles.introDesc}>
                Completa la información. La comunidad y la IA verificarán tu registro.
              </Text>
            </View>
          </View>

          {/* Especie / Título */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Especie o Título *</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej. Rana Flecha Dorada, Bromelia Gigante..."
              placeholderTextColor="#9a8968"
              value={titulo}
              onChangeText={setTitulo}
            />
          </View>

          {/* Ubicación */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Ubicación *</Text>
            <View style={styles.inputWithIconContainer}>
              <MapPin size={16} color="#8c7651" style={styles.inputIcon} />
              <TextInput
                style={styles.inputWithIcon}
                placeholder="Ej. Parque Cachamay, Puerto Ordaz, Bolívar"
                placeholderTextColor="#b5a98a"
                value={ubicacion}
                onChangeText={setUbicacion}
              />
            </View>
          </View>

          {/* Notas */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Notas de Campo</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Comportamiento, estado físico, clima, contexto de conservación..."
              placeholderTextColor="#9a8968"
              value={notas}
              onChangeText={setNotas}
              multiline
              numberOfLines={4}
            />
          </View>

          {/* Guardar */}
          <TouchableOpacity
            style={[styles.saveButton, saving && styles.saveButtonDisabled]}
            onPress={handleSave}
            disabled={saving}
          >
            <Save size={20} color="#fff" style={{ marginRight: 8 }} />
            <Text style={styles.saveButtonText}>
              {saving ? 'Guardando...' : 'Guardar Avistamiento'}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fdf8ee',
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? 48 : 20,
    paddingBottom: 12,
    backgroundColor: '#fdf8ee',
    borderBottomWidth: 1,
    borderColor: '#f2e8cf',
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#fff7e9',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#342a1a',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 48,
    gap: 16,
  },
  divider: {
    height: 1,
    backgroundColor: '#f0e4ce',
    marginVertical: 4,
  },
  introCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderRadius: 20,
    padding: 14,
    borderWidth: 1,
    borderColor: '#efe2c5',
  },
  introIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#ecfdf5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  introTextContainer: {
    flex: 1,
  },
  introTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#271f13',
  },
  introDesc: {
    fontSize: 10,
    color: '#7d6a4e',
    lineHeight: 14,
    marginTop: 2,
  },
  formGroup: {
    gap: 6,
  },
  label: {
    fontSize: 12,
    fontWeight: '800',
    color: '#6b5425',
    marginLeft: 4,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#efe2c5',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 13,
    color: '#2d2418',
  },
  inputWithIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#efe2c5',
    borderRadius: 16,
    paddingHorizontal: 14,
  },
  inputIcon: {
    marginRight: 8,
  },
  inputWithIcon: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 13,
    color: '#2d2418',
  },
  textArea: {
    height: 110,
    textAlignVertical: 'top',
  },
  saveButton: {
    flexDirection: 'row',
    backgroundColor: '#4d7c0f',
    height: 54,
    borderRadius: 27,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4d7c0f',
    shadowOpacity: 0.28,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 12,
    elevation: 4,
    marginTop: 8,
  },
  saveButtonDisabled: {
    backgroundColor: '#9ca3af',
    shadowColor: '#9ca3af',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '800',
  },
  coordContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  coordInputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#efe2c5',
    borderRadius: 16,
    paddingHorizontal: 12,
  },
  coordPrefix: {
    fontSize: 11,
    fontWeight: '800',
    color: '#8c7651',
    marginRight: 6,
  },
  coordTextInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 13,
    color: '#2d2418',
  },
  helperText: {
    fontSize: 11,
    color: '#4d7c0f',
    marginTop: 4,
    marginLeft: 6,
  },
});

