import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { ChevronLeft, Search, Leaf } from 'lucide-react-native';
import { LinearGradientSvg } from '../../src/presentation/components/ui/LinearGradientSvg';
import { BottomNav } from '../../src/presentation/components/ui/BottomNav';
import { SafeAreaView } from 'react-native-safe-area-context';

// @ts-ignore
const dbMockData = require('../../../contracts/mocks/dbMockData.json');

export default function SpeciesObservationsScreen() {
  const { especieId } = useLocalSearchParams<{ especieId?: string }>();
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, [especieId]);

  const especie = (dbMockData.especies as any[]).find((item: any) => item.id === especieId);
  const observaciones = (dbMockData.avistamientos as any[]).filter((item: any) => {
    if (!especieId || especieId === 'all') return true;
    return item.especie_verificada_id === especieId;
  });

  if (isLoading) {
    return (
      <LinearGradientSvg colors={['#fdf7e3', '#fdf3d1', '#e8f3d6']} style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#4d7c0f" />
      </LinearGradientSvg>
    );
  }

  return (
    <LinearGradientSvg colors={['#fdf7e3', '#fdf3d1', '#e8f3d6']} style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <ChevronLeft size={22} color="#1f2937" />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.categoryText}>OBSERVACIONES</Text>
            <Text style={styles.commonNameText}>{especie?.nombre_comun || 'Todas las especies'}</Text>
            <Text style={styles.scientificNameText}>{especie?.nombre_cientifico || 'Resultados filtrados'}</Text>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.summaryCard}>
            <View style={styles.summaryIconContainer}>
              <Search size={16} color="#4d7c0f" />
            </View>
            <View style={styles.summaryTextContainer}>
              <Text style={styles.summaryTitle}>{observaciones.length} observaciones encontradas</Text>
              <Text style={styles.summarySubtitle}>Filtradas a partir del catálogo de especies</Text>
            </View>
          </View>

          {observaciones.length > 0 ? (
            observaciones.map((item: any) => {
              const autor = (dbMockData.usuarios as any[]).find((user: any) => user.id === item.autor_id);
              return (
                <View key={item.id} style={styles.observationCard}>
                  <View style={styles.observationHeader}>
                    <Text style={styles.observationTitle}>{item.especie_verif_nombre || 'Especie sin verificar'}</Text>
                    <Text style={styles.observationMeta}>{item.estado}</Text>
                  </View>
                  <Text style={styles.observationText}>{item.descripcion_experiencia}</Text>
                  <View style={styles.observationFooter}>
                    <View style={styles.observationBadge}>
                      <Leaf size={12} color="#4d7c0f" />
                      <Text style={styles.observationBadgeText}>{autor?.nombre || 'Usuario'}</Text>
                    </View>
                    <Text style={styles.observationLocation}>{item.ubicacion_texto}</Text>
                  </View>
                </View>
              );
            })
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateTitle}>No hay observaciones para esta especie</Text>
              <Text style={styles.emptyStateText}>Prueba con otra selección o vuelve al detalle para explorar más registros.</Text>
            </View>
          )}
        </ScrollView>

        <BottomNav />
      </SafeAreaView>
    </LinearGradientSvg>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  safeArea: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 15,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    marginTop: 5,
  },
  headerTitleContainer: { flex: 1 },
  categoryText: { fontSize: 10, fontWeight: '800', color: '#9ca3af', letterSpacing: 1, marginBottom: 2 },
  commonNameText: { fontSize: 22, fontWeight: '900', color: '#1f2937', marginBottom: 2 },
  scientificNameText: { fontSize: 12, color: '#8c7a5f', fontStyle: 'italic' },
  scrollContent: { paddingHorizontal: 15, paddingBottom: 120 },
  summaryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 14,
    marginBottom: 14,
  },
  summaryIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ecfdf5',
    marginRight: 12,
  },
  summaryTextContainer: { flex: 1 },
  summaryTitle: { fontSize: 14, fontWeight: '800', color: '#1f2937' },
  summarySubtitle: { fontSize: 12, color: '#6b7280', marginTop: 2 },
  observationCard: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 14,
    marginBottom: 12,
  },
  observationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  observationTitle: { fontSize: 14, fontWeight: '800', color: '#1f2937' },
  observationMeta: { fontSize: 11, fontWeight: '700', color: '#4d7c0f' },
  observationText: { fontSize: 13, color: '#52525b', lineHeight: 18 },
  observationFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  observationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0fdf4',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    gap: 4,
  },
  observationBadgeText: { fontSize: 11, fontWeight: '700', color: '#166534' },
  observationLocation: { fontSize: 12, color: '#6b7280' },
  emptyState: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 20,
    alignItems: 'center',
  },
  emptyStateTitle: { fontSize: 15, fontWeight: '800', color: '#1f2937', marginBottom: 6 },
  emptyStateText: { fontSize: 13, color: '#6b7280', textAlign: 'center' },
});
