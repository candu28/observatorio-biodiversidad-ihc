import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { ChevronLeft, Plus, MapPin, BookOpen } from 'lucide-react-native';
import { LinearGradientSvg } from '../src/presentation/components/ui/LinearGradientSvg';
import { BottomNav } from '../src/presentation/components/ui/BottomNav';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CrearProyectoUseCase } from '../src/application/useCases/CrearProyectoUseCase';
import { MockProyectoRepository } from '../src/infrastructure/adapters/mock/proyecto/MockProyectoRepository';

export default function CreateProjectScreen() {
  const params = useLocalSearchParams();
  const [titulo, setTitulo] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  const [tareas, setTareas] = useState(['']);

  const handleAddTarea = () => {
    setTareas([...tareas, '']);
  };

  const handleUpdateTarea = (text: string, index: number) => {
    const newTareas = [...tareas];
    newTareas[index] = text;
    setTareas(newTareas);
  };

  const handleConfirm = async () => {
    if (!titulo || !ubicacion || tareas.some(t => !t)) {
      Alert.alert('Error', 'Por favor completa todos los campos.');
      return;
    }

    try {
      const useCase = new CrearProyectoUseCase(new MockProyectoRepository());
      const proyectoId = `proj-${Date.now()}`;

      await useCase.execute({
        proyecto: {
          id: proyectoId,
          creadorId: 'mock-user-1',
          titulo,
          descripcion: `Proyecto sobre ${params.especieNombre}`,
          bioma: 'Selva Tropical', // Default
          categoriasTaxonomicas: [params.especieNombre as string],
          ubicacionGeografica: ubicacion,
          fechaInicio: new Date().toISOString(),
          cantidadParticipantes: 1
        },
        tareas: tareas.map((t, i) => ({
          proyectoId,
          tareaId: `task-${proyectoId}-${i}`,
          tituloTarea: t,
          descripcionInstrucciones: t
        }))
      });

      Alert.alert('Éxito', 'Proyecto creado correctamente', [
        { text: 'OK', onPress: () => router.push('/') }
      ]);
    } catch (error) {
      Alert.alert('Error', 'No se pudo crear el proyecto');
    }
  };

  return (
    <LinearGradientSvg colors={['#fdf7e3', '#fdf3d1', '#e8f3d6']} style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['left', 'right']}>

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <ChevronLeft size={22} color="#1f2937" />
          </TouchableOpacity>
          <View>
            <Text style={styles.headerSubtitle}>NUEVO PROYECTO</Text>
            <Text style={styles.headerTitle}>Crear proyecto</Text>
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

          {/* Species Preview */}
          <View style={styles.speciesCard}>
            <Image source={{ uri: params.especieFoto as string }} style={styles.speciesImage} />
            <View>
              <Text style={styles.speciesLabel}>ESPECIE ASIGNADA</Text>
              <Text style={styles.speciesName}>{params.especieNombre}</Text>
              <Text style={styles.speciesScientific}>{params.especieCientifico}</Text>
            </View>
          </View>

          {/* Title Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>TÍTULO DEL PROYECTO *</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Ej. Alimentación del Sapo Minero"
              value={titulo}
              onChangeText={setTitulo}
            />
          </View>

          {/* Tasks Input */}
          <View style={styles.inputGroup}>
            <View style={styles.rowBetween}>
              <Text style={styles.inputLabel}>Tareas de colaboración</Text>
              <TouchableOpacity style={styles.addButton} onPress={handleAddTarea}>
                <Plus size={14} color="#92400e" />
                <Text style={styles.addButtonText}>Agregar</Text>
              </TouchableOpacity>
            </View>

            {tareas.map((tarea, index) => (
              <View key={index} style={styles.tareaInputRow}>
                <View style={styles.indexCircle}>
                  <Text style={styles.indexText}>{index + 1}</Text>
                </View>
                <TextInput
                  style={styles.tareaInput}
                  placeholder={`Descripción de tarea ${index + 1}...`}
                  value={tarea}
                  onChangeText={(text) => handleUpdateTarea(text, index)}
                />
              </View>
            ))}
          </View>

          {/* Location Input */}
          <View style={styles.inputGroup}>
            <View style={styles.row}>
              <MapPin size={14} color="#92400e" />
              <Text style={[styles.inputLabel, { marginLeft: 6 }]}>UBICACIÓN DEL PROYECTO</Text>
            </View>
            <TextInput
              style={styles.textInput}
              placeholder="Ej. Río Caura, Bolívar, Venezuela"
              value={ubicacion}
              onChangeText={setUbicacion}
            />
          </View>

          {/* Confirm Button */}
          <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
            <BookOpen size={20} color="#716040" />
            <Text style={styles.confirmButtonText}>Confirmar proyecto</Text>
          </TouchableOpacity>

        </ScrollView>
        <BottomNav />
      </SafeAreaView>
    </LinearGradientSvg>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 20,
    gap: 15,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  headerSubtitle: {
    fontSize: 10,
    fontWeight: '800',
    color: '#9ca3af',
    letterSpacing: 1,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#1f2937',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  speciesCard: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 12,
    alignItems: 'center',
    gap: 15,
    marginBottom: 20,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  speciesImage: {
    width: 60,
    height: 60,
    borderRadius: 12,
  },
  speciesLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#9ca3af',
    marginBottom: 2,
  },
  speciesName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1f2937',
  },
  speciesScientific: {
    fontSize: 11,
    color: '#8c7a5f',
    fontStyle: 'italic',
  },
  inputGroup: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 16,
    marginBottom: 15,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  inputLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#9ca3af',
    marginBottom: 10,
    letterSpacing: 0.5,
  },
  textInput: {
    fontSize: 15,
    color: '#1f2937',
    fontWeight: '500',
    paddingVertical: 5,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef3c7',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    gap: 4,
    borderWidth: 1,
    borderColor: '#fde68a',
  },
  addButtonText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#92400e',
  },
  tareaInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
    paddingBottom: 8,
  },
  indexCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#fef3c7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  indexText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#92400e',
  },
  tareaInput: {
    flex: 1,
    fontSize: 14,
    color: '#4b5563',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  confirmButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e6dfd1',
    paddingVertical: 18,
    borderRadius: 20,
    gap: 10,
    marginTop: 10,
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#716040',
  },
});
