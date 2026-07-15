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
import { router } from 'expo-router';
import { ChevronLeft, Save, MapPin, Leaf } from 'lucide-react-native';
import { LinearGradientSvg } from '../src/presentation/components/ui/LinearGradientSvg';
import CameraWidget from '../src/presentation/components/feature/camera/CameraWidget';

export default function RegistrarAvistamientoScreen() {
  const [titulo, setTitulo] = useState('');
  const [notas, setNotas] = useState('');
  const [ubicacion, setUbicacion] = useState('Reserva Ecológica Manglares Churute, Ecuador');
  const [photos, setPhotos] = useState<string[]>([]);
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
    // Simular guardado
    setTimeout(() => {
      setSaving(false);
      Alert.alert(
        'Avistamiento Guardado',
        'El avistamiento ha sido registrado localmente de forma exitosa y está listo para sincronizar con la nube.',
        [
          {
            text: 'Excelente',
            onPress: () => router.replace('/'),
          },
        ]
      );
    }, 1200);
  };

  return (
    <LinearGradientSvg colors={['#fcf7e3', '#fdf3d1', '#e8f3d6']} style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}
      >
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <ChevronLeft size={22} color="#6b5b3e" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Registrar Avistamiento</Text>
          <View style={{ width: 38 }} /> {/* Spacer */}
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {/* Tarjeta de introducción */}
          <View style={styles.introCard}>
            <View style={styles.introIcon}>
              <Leaf size={20} color="#4d7c0f" />
            </View>
            <View style={styles.introTextContainer}>
              <Text style={styles.introTitle}>Nueva Registro de Campo</Text>
              <Text style={styles.introDesc}>
                Completa la información y captura fotos. La inteligencia artificial y la comunidad verificarán tu registro.
              </Text>
            </View>
          </View>

          {/* Formulario */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Especie o Título del Avistamiento *</Text>
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
            <Text style={styles.label}>Ubicación / Coordenadas *</Text>
            <View style={styles.inputWithIconContainer}>
              <MapPin size={18} color="#8c7651" style={styles.inputIcon} />
              <TextInput
                style={styles.inputWithIcon}
                placeholder="Coordenadas GPS o nombre del sitio"
                placeholderTextColor="#9a8968"
                value={ubicacion}
                onChangeText={setUbicacion}
              />
            </View>
          </View>

          {/* Cámara Widget */}
          <CameraWidget photos={photos} onPhotosChange={setPhotos} />

          {/* Notas de Campo */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Notas de Campo y Observaciones</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Describe comportamiento, estado físico, clima u otros detalles de interés para la conservación..."
              placeholderTextColor="#9a8968"
              value={notas}
              onChangeText={setNotas}
              multiline
              numberOfLines={4}
            />
          </View>

          {/* Botón de guardar */}
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
    </LinearGradientSvg>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? 45 : 20,
    height: 90,
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#fff7e9',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#342a1a',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  introCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
    borderRadius: 20,
    padding: 14,
    marginBottom: 20,
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
    marginBottom: 18,
  },
  label: {
    fontSize: 12,
    fontWeight: '800',
    color: '#6b5425',
    marginBottom: 6,
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
    paddingHorizontal: 16,
  },
  inputIcon: {
    marginRight: 10,
  },
  inputWithIcon: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 13,
    color: '#2d2418',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  saveButton: {
    flexDirection: 'row',
    backgroundColor: '#4d7c0f',
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4d7c0f',
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 3,
    marginTop: 10,
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
});
