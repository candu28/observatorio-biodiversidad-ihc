import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Image, useWindowDimensions } from 'react-native';
import { useLocalSearchParams, router, Stack } from 'expo-router';
import { ChevronLeft, Search, Leaf, Heart, CheckCircle2 } from 'lucide-react-native';
import { LinearGradientSvg } from '../../src/presentation/components/ui/LinearGradientSvg';
import { BottomNav } from '../../src/presentation/components/ui/BottomNav';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WatermelonHomePageRepository } from '../../src/infrastructure/adapters/watermelon/homepage/WatermelonHomePageRepository';
import { HomePageCard } from '../../src/application/ports/IHomePagePort';

// @ts-ignore
const dbMockData = require('../../../contracts/mocks/dbMockData.json');

export default function SpeciesObservationsScreen() {
  const { especieId } = useLocalSearchParams<{ especieId?: string }>();
  const [isLoading, setIsLoading] = React.useState(true);
  const [cards, setCards] = React.useState<HomePageCard[]>([]);
  const { width } = useWindowDimensions();

  React.useEffect(() => {
    async function load() {
      const repo = new WatermelonHomePageRepository();
      const allCards = await repo.getAvistamientos();
      
      const filtered = allCards.filter(card => {
        const rawAvistamiento = (dbMockData.avistamientos as any[]).find(a => a.id === card.id);
        if (!especieId || especieId === 'all') return true;
        return rawAvistamiento && rawAvistamiento.especie_verificada_id === especieId;
      });
      
      setCards(filtered);
      setIsLoading(false);
    }
    load();
  }, [especieId]);

  const especie = (dbMockData.especies as any[]).find((item: any) => item.id === especieId);

  const numColumns = Math.max(2, Math.min(15, Math.floor(width / 300)));
  const masonryColumns = React.useMemo(() => {
    const columns = Array.from({ length: numColumns }, () => ({
      height: 0,
      items: [] as HomePageCard[],
    }));

    cards.forEach((item) => {
      let shortestIndex = 0;
      let minHeight = columns[0].height;

      for (let i = 1; i < numColumns; i++) {
        if (columns[i].height < minHeight) {
          shortestIndex = i;
          minHeight = columns[i].height;
        }
      }

      columns[shortestIndex].items.push(item);
      columns[shortestIndex].height += item.height;
    });

    return columns.map((col) => col.items);
  }, [cards, numColumns]);

  const LikeButton = ({ itemId }: { itemId: string }) => {
    const [liked, setLiked] = React.useState(false);
    
    const handleLike = async () => {
      setLiked(!liked);
      try {
        const { RegistrarInteresUseCase } = require('../../src/application/useCases/RegistrarInteresUseCase');
        const { WatermelonPerfilRepository } = require('../../src/infrastructure/adapters/watermelon/perfil/WatermelonPerfilRepository');
        const useCase = new RegistrarInteresUseCase(new WatermelonPerfilRepository());
        await useCase.execute(itemId);
      } catch (err) {
        console.error(err);
      }
    };

    return (
      <TouchableOpacity style={styles.heartButton} onPress={handleLike}>
        <Heart size={16} color={liked ? "#4d7c0f" : "#9ca3af"} fill={liked ? "#4d7c0f" : "transparent"} />
      </TouchableOpacity>
    );
  };

  if (isLoading) {
    return (
      <LinearGradientSvg colors={['#f7f0df', '#f4ecd7', '#f7f0df']} style={styles.loaderContainer}>
        <Stack.Screen options={{ headerShown: false }} />
        <ActivityIndicator size="large" color="#4d7c0f" />
      </LinearGradientSvg>
    );
  }

  return (
    <LinearGradientSvg colors={['#f7f0df', '#f4ecd7', '#f7f0df']} style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
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


          {masonryColumns.length > 0 && masonryColumns[0].length > 0 ? (
            <View style={styles.gridContainer}>
              {masonryColumns.map((columnData, colIndex) => (
                <View key={`col-${colIndex}`} style={styles.masonryColumn}>
                  {columnData.map((item: any) => (
                    <TouchableOpacity
                      key={item.id}
                      style={[styles.card, { height: item.height }]}
                      onPress={() => router.push(`/detalle/${item.id}`)}
                      activeOpacity={0.8}
                    >
                      <Image source={{ uri: item.fotoUrl }} style={styles.cardImage} />
                      <View style={styles.cardOverlay}>
                        <View style={styles.statusPill}>
                          <CheckCircle2 size={12} color="#15803d" />
                          <Text style={styles.statusText}>{item.estado}</Text>
                        </View>
                        <LikeButton itemId={item.id} />
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              ))}
            </View>
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
  gridContainer: { flexDirection: 'row', gap: 10 },
  masonryColumn: { flex: 1, gap: 10 },
  card: { backgroundColor: '#fff', borderRadius: 20, overflow: 'hidden' },
  cardImage: { width: '100%', height: '100%' },
  cardOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  statusPill: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.95)', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20, gap: 4 },
  statusText: { fontSize: 11, fontWeight: '700', color: '#1f2937' },
  heartButton: { width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.9)', justifyContent: 'center', alignItems: 'center' },
  emptyState: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 20,
    alignItems: 'center',
  },
  emptyStateTitle: { fontSize: 15, fontWeight: '800', color: '#1f2937', marginBottom: 6 },
  emptyStateText: { fontSize: 13, color: '#6b7280', textAlign: 'center' },
});
