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
  Modal,
  Pressable,
} from 'react-native';
import { useLocalSearchParams, router, Stack } from 'expo-router';
import { ChevronLeft, Plus, MapPin, BookOpen, X } from 'lucide-react-native';
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

  const [assignedSpecies, setAssignedSpecies] = useState<any[]>([{
    id: params.especieId,
    nombre: params.especieNombre,
    cientifico: params.especieCientifico,
    foto: params.especieFoto
  }]);
  const [showSpeciesModal, setShowSpeciesModal] = useState(false);

  // Mock list of available species
  const availableSpecies = [
    { id: '1', nombre: 'Sapo Minero', cientifico: 'Dendrobates leucomelas', foto: 'https://images.unsplash.com/photo-1579624584285-b1a7d65608c0?q=80&w=200&auto=format&fit=crop' },
    { id: '2', nombre: 'Rana de Cristal', cientifico: 'Centrolenidae', foto: 'https://images.unsplash.com/photo-1596700813959-1e359a39e830?q=80&w=200&auto=format&fit=crop' },
    { id: '3', nombre: 'Jaguar', cientifico: 'Panthera onca', foto: 'https://images.unsplash.com/photo-1517409249715-728b76fc7b9c?q=80&w=200&auto=format&fit=crop' },
  ];

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
          categoriasTaxonomicas: [params.especieNombre as any],
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
    <LinearGradientSvg colors={['#f7f0df', '#f4ecd7', '#f7f0df']} style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
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
          <View style={styles.speciesHeaderContainer}>
            <Text style={styles.speciesLabel}>ESPECIE ASIGNADA</Text>
            <TouchableOpacity style={styles.addButton} onPress={() => setShowSpeciesModal(true)}>
              <Plus size={14} color="#92400e" />
              <Text style={styles.addButtonText}>Agregar especie</Text>
            </TouchableOpacity>
          </View>

          {assignedSpecies.map((s: any, idx: number) => (
            <View key={idx} style={[styles.speciesCard, { marginBottom: 8 }]}>
              <Image source={{ uri: s.foto }} style={styles.speciesImage} />
              <View>
                <Text style={styles.speciesName}>{s.nombre}</Text>
                <Text style={styles.speciesScientific}>{s.cientifico}</Text>
              </View>
            </View>
          ))}

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

        {/* Species Selection Modal */}
        <Modal visible={showSpeciesModal} transparent animationType="fade" onRequestClose={() => setShowSpeciesModal(false)}>
          <Pressable style={styles.modalBackdrop} onPress={() => setShowSpeciesModal(false)}>
            <Pressable style={styles.modalCard} onPress={() => {}}>
              <View style={styles.modalHeader}>
                <View>
                  <Text style={styles.modalTitle}>Agregar especie</Text>
                  <Text style={styles.modalSubtitle}>Selecciona especies para el proyecto</Text>
                </View>
                <TouchableOpacity style={styles.modalCloseButton} onPress={() => setShowSpeciesModal(false)}>
                  <X size={16} color="#7c6a4c" />
                </TouchableOpacity>
              </View>
              <ScrollView style={styles.speciesList}>
                {availableSpecies.map((s) => (
                  <TouchableOpacity
                    key={s.id}
                    style={styles.speciesListItem}
                    onPress={() => {
                      if (!assignedSpecies.find(x => x.id === s.id)) {
                        setAssignedSpecies([...assignedSpecies, s]);
                      }
                      setShowSpeciesModal(false);
                    }}
                  >
                    <Image source={{ uri: s.foto }} style={styles.speciesListImage} />
                    <View>
                      <Text style={styles.speciesListTitle}>{s.nombre}</Text>
                      <Text style={styles.speciesListSubtitle}>{s.cientifico}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </Pressable>
          </Pressable>
        </Modal>

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
    paddingTop: 60, // Aumentado de 40 a 60
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
  modalCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    maxHeight: '80%',
    width: '100%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#1f2937',
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  modalCloseButton: {
    padding: 4,
  },
  speciesList: {
    gap: 12,
  },
  speciesListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 16,
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    gap: 16,
  },
  speciesListImage: {
    width: 48,
    height: 48,
    borderRadius: 12,
  },
  speciesListTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1f2937',
  },
  speciesListSubtitle: {
    fontSize: 13,
    color: '#6b7280',
    fontStyle: 'italic',
  },
  speciesHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});
