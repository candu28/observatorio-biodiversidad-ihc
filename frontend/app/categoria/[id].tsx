import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Image, useWindowDimensions } from 'react-native';
import { useLocalSearchParams, router, Stack } from 'expo-router';
import { ChevronLeft, Search, Leaf, Heart, CheckCircle2 } from 'lucide-react-native';
import { LinearGradientSvg } from '../../src/presentation/components/ui/LinearGradientSvg';
import { BottomNav } from '../../src/presentation/components/ui/BottomNav';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MockHomePageRepository } from '../../src/infrastructure/adapters/mock/homepage/MockHomePageRepository';
import { HomePageCard } from '../../src/application/ports/IHomePagePort';

// @ts-ignore
const dbMockData = require('../../../contracts/mocks/dbMockData.json');

const CATEGORY_IMAGES: Record<string, string> = {
  'Mamíferos': 'https://images.unsplash.com/photo-1550977186-b484af8a264a?w=800',
  'Aves': 'https://images.unsplash.com/photo-1552728089-57ce365c5fd6?w=800',
  'Anfibios': 'https://images.unsplash.com/photo-1579624584285-b1a7d65608c0?w=800',
  'Reptiles': 'https://images.unsplash.com/photo-1517006841457-3f829f04523d?w=800',
  'Insectos': 'https://images.unsplash.com/photo-1542171125-9d413346d3ea?w=800',
  'Plantas': 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=800',
  'Hongos': 'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?w=800',
};

export default function CategoriaScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const [isLoading, setIsLoading] = React.useState(true);
  const [cards, setCards] = React.useState<HomePageCard[]>([]);
  const { width } = useWindowDimensions();

  React.useEffect(() => {
    async function load() {
      const repo = new MockHomePageRepository();
      const allCards = await repo.getAvistamientos();
      
      setCards(allCards);
      setIsLoading(false);
    }
    load();
  }, [id]);

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
        const { MockPerfilRepository } = require('../../src/infrastructure/adapters/mock/perfil/MockPerfilRepository');
        const useCase = new RegistrarInteresUseCase(new MockPerfilRepository());
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
          <Text style={styles.headerTitle}>{id || 'Categoría'}</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

          <View style={styles.heroContainer}>
            <Image 
              source={{ uri: CATEGORY_IMAGES[id || ''] || 'https://images.unsplash.com/photo-1550977186-b484af8a264a?w=800' }} 
              style={styles.heroImage} 
            />
            <View style={styles.heroOverlay}>
              <Text style={styles.heroDescription}>
                Descubre los avistamientos más recientes de {id?.toLowerCase() || 'esta categoría'} en la región de Guayana.
              </Text>
            </View>
          </View>
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
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  headerTitleContainer: { flex: 1 },
  headerTitle: { fontSize: 22, fontWeight: '900', color: '#1f2937', flex: 1, textAlign: 'center', marginTop: 12 },
  heroContainer: {
    width: '100%',
    height: 200,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 20,
    backgroundColor: '#e5e7eb',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    padding: 16,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  heroDescription: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
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
