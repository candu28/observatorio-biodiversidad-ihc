import React, { useState, useMemo, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  ScrollView,
  Image,
  TouchableOpacity,
  Platform,
  useWindowDimensions,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Leaf, Heart, CheckCircle2 } from 'lucide-react-native';
import { LinearGradientSvg } from '../../ui/LinearGradientSvg';
import { BottomNav } from '../../ui/BottomNav';
import { HomePageCard } from '../../../../application/ports/IHomePagePort';
import { ProjectCard } from '../projects/ProjectCard';

// Import the ViewModel which handles all Use Cases and Adapters
import { useHomePageViewModel } from '../../../viewModels/useHomePageViewModel';

const TABS = ['Explorar', 'Especies', 'Proyectos'] as const;
type HomeTab = (typeof TABS)[number];

const isVerifiedPost = (estado: string) => /verificado|verified/i.test(estado.trim());

export default function HomePage() {
  const { width } = useWindowDimensions();
  const [activeTab, setActiveTab] = useState<HomeTab>('Explorar');

  const pagerRef = useRef<any>(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  // Delegate all data state and business logic to the ViewModel
  const {
    data,
    proyectos,
    categorias,
    activeCategoryId,
    setActiveCategoryId,
    filteredSpecies,
    isLoading,
  } = useHomePageViewModel();

  const numColumns = Math.max(2, Math.min(15, Math.floor(width / 300)));
  const pageWidth = width;

  const masonryColumns = useMemo(() => {
    const columns = Array.from({ length: numColumns }, () => ({
      height: 0,
      items: [] as HomePageCard[],
    }));

    data.forEach((item) => {
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
  }, [data, numColumns]);

  const handleTabChange = (tab: HomeTab) => {
    setActiveTab(tab);
    const index = TABS.indexOf(tab);
    pagerRef.current?.scrollTo({ x: index * pageWidth, animated: true });
  };

  const handlePagerScrollEnd = (event: { nativeEvent: { contentOffset: { x: number } } }) => {
    const pageIndex = Math.round(event.nativeEvent.contentOffset.x / pageWidth);
    const nextTab = TABS[Math.min(Math.max(pageIndex, 0), TABS.length - 1)];

    if (nextTab !== activeTab) {
      setActiveTab(nextTab);
    }
  };

  const renderCard = (item: HomePageCard) => (
    <TouchableOpacity
      key={item.id}
      style={[styles.card, { height: item.height }]}
      onPress={() => router.push(`/detalle/${item.id}`)}
      activeOpacity={0.8}
    >
      <Image source={{ uri: item.fotoUrl }} style={styles.cardImage} />
      <View style={styles.cardOverlay}>
        {isVerifiedPost(item.estado) && (
          <View style={styles.statusPill}>
            <CheckCircle2 size={12} color="#15803d" />
            <Text style={styles.statusText}>{item.estado}</Text>
          </View>
        )}
        <View style={styles.overlayActions}>
          {/* <TouchableOpacity style={styles.heartButton}>
            <Heart size={16} color="#9ca3af" />
          </TouchableOpacity> */}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <LinearGradientSvg
      colors={['#fdf7e3', '#fdf3d1', '#e8f3d6', '#e0ecd1']}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Leaf size={28} color="#4d7c0f" strokeWidth={2.5} />
            <Text style={styles.logoText}>guaya</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.avatarContainer} onPress={() => router.push('/perfil')}>
              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150&auto=format&fit=crop' }}
                style={styles.avatar}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.tabsContainer}>
          <View style={styles.tabsRow}>
            {TABS.map((tab, index) => {
              const textColor = scrollX.interpolate({
                inputRange: [
                  (index - 1) * pageWidth, 
                  index * pageWidth, 
                  (index + 1) * pageWidth
                ],
                outputRange: ['#6b7280', '#4d7c0f', '#6b7280'],
                extrapolate: 'clamp',
              });

              const backgroundColor = scrollX.interpolate({
                inputRange: [
                  (index - 1) * pageWidth, 
                  index * pageWidth, 
                  (index + 1) * pageWidth
                ],
                outputRange: ['rgba(255, 255, 255, 0)', '#ffffff', 'rgba(255, 255, 255, 0)'],
                extrapolate: 'clamp',
              });

              return (
                <TouchableOpacity
                  key={tab}
                  style={styles.tabPillRow}
                  onPress={() => handleTabChange(tab)}
                  activeOpacity={0.8}
                >
                  <Animated.Text style={[styles.tabText, { color: textColor, backgroundColor }]}>
                    {tab}
                  </Animated.Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {isLoading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#4d7c0f" />
          </View>
        ) : (
          <View style={styles.pagerContainer}>
            <Animated.ScrollView
              ref={pagerRef}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onMomentumScrollEnd={handlePagerScrollEnd}
              onScroll={Animated.event(
                [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                { useNativeDriver: false } 
              )}
              scrollEventThrottle={16}
            >
              
              {/* TAB 1: Explorar */}
              <View style={[styles.page, { width: pageWidth }]}>
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.pageContent}>
                  <View style={styles.gridContainer}>
                    {masonryColumns.map((columnData, colIndex) => (
                      <View key={`col-${colIndex}`} style={styles.masonryColumn}>
                        {columnData.map(renderCard)}
                      </View>
                    ))}
                  </View>
                </ScrollView>
              </View>

              {/* TAB 2: Especies */}
              <View style={[styles.page, { width: pageWidth }]}>
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.pageContent}>
                  <View style={styles.filtersWrapper}>
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      contentContainerStyle={styles.filtersScroll}
                    >
                      {/* 'Todo' Default Pill */}
                      <TouchableOpacity
                        style={[styles.filterPill, activeCategoryId === null && styles.filterPillActive]}
                        onPress={() => setActiveCategoryId(null)}
                        activeOpacity={0.8}
                      >
                        <Text style={[styles.filterText, activeCategoryId === null && styles.filterTextActive]}>Todo</Text>
                      </TouchableOpacity>

                      {/* Dynamic Categories Mapped from Database */}
                      {categorias.map((cat) => {
                        const isActive = cat.id === activeCategoryId;
                        return (
                          <TouchableOpacity
                            key={cat.id}
                            style={[styles.filterPill, isActive && styles.filterPillActive]}
                            onPress={() => setActiveCategoryId(cat.id)}
                            activeOpacity={0.8}
                          >
                            <Text style={[styles.filterText, isActive && styles.filterTextActive]}>{cat.nombre}</Text>
                          </TouchableOpacity>
                        );
                      })}
                    </ScrollView>
                  </View>

                  {/* Filtered Species Content */}
                  {filteredSpecies.length === 0 ? (
                    <View style={styles.emptyState}> 
                      <Text style={styles.emptyStateText}>No hay especies para este filtro.</Text>
                    </View>
                  ) : (
                    filteredSpecies.map((species) => (
                      <View key={species.id} style={styles.speciesCard}>
                        <View style={styles.speciesBadge}>
                          <Leaf size={16} color="#4d7c0f" />
                        </View>
                        <View style={styles.speciesDetails}>
                          <Text style={styles.speciesName}>{species.nombreComun ?? species.nombreCientifico}</Text>
                          <Text style={styles.speciesScientificName}>{species.nombreCientifico}</Text>
                        </View>
                        <View style={styles.speciesCountWrap}>
                          <Text style={styles.speciesCount}>{species.totalObservaciones}</Text>
                        </View>
                      </View>
                    ))
                  )}
                </ScrollView>
              </View>

              {/* TAB 3: Proyectos */}
              <View style={[styles.page, { width: pageWidth }]}>
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.pageContent}>
                  {proyectos.map((proyecto) => (
                    <ProjectCard key={proyecto.id} proyecto={proyecto} />
                  ))}
                </ScrollView>
              </View>
            </Animated.ScrollView>
          </View>
        )}

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
    paddingTop: Platform.OS === 'android' ? 40 : 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoText: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1f2937',
    letterSpacing: -0.5,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  tabsContainer: {
    marginVertical: 14,
    paddingHorizontal: 20,
  },
  tabsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tabPillRow: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  tabText: {
    width: '100%',
    textAlign: 'center',
    paddingVertical: 8,
    fontSize: 14,
    fontWeight: '600',
    borderRadius: 20,
    overflow: 'hidden',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pagerContainer: {
    flex: 1,
  },
  page: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  pageContent: {
    paddingBottom: 100,
  },
  filtersWrapper: {
    paddingVertical: 10,
    marginBottom: 6,
  },
  filtersScroll: {
    paddingHorizontal: 4,
    gap: 8,
  },
  filterPill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderWidth: 1,
    borderColor: '#d9e8cc',
  },
  filterPillActive: {
    backgroundColor: '#4d7c0f',
    borderColor: '#4d7c0f',
  },
  filterText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4b5563',
  },
  filterTextActive: {
    color: '#ffffff',
  },
  gridContainer: {
    flexDirection: 'row',
    paddingHorizontal: 0,
  },
  masonryColumn: {
    flex: 1,
    paddingHorizontal: 5,
  },
  card: {
    width: '100%',
    borderRadius: 24,
    marginBottom: 10,
    overflow: 'hidden',
    backgroundColor: '#fff',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  cardImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  cardOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 12,
  },
  overlayActions: {
    marginLeft: 'auto',
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#15803d',
  },
  heartButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    paddingVertical: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
    borderRadius: 18,
  },
  emptyStateText: {
    color: '#6b7280',
    fontSize: 14,
    fontWeight: '600',
  },
  speciesCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderRadius: 18,
    padding: 14,
    marginBottom: 12,
  },
  speciesBadge: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#e7f4d8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  speciesDetails: {
    flex: 1,
  },
  speciesName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1f2937',
  },
  speciesScientificName: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  speciesCountWrap: {
    minWidth: 44,
    alignItems: 'flex-end',
  },
  speciesCount: {
    fontSize: 13,
    fontWeight: '700',
    color: '#4d7c0f',
  },
});