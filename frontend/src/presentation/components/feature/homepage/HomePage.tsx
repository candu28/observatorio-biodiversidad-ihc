import React, { useState, useEffect, useMemo, useRef } from 'react';
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
import { Leaf, Search, MessageCircle, Heart, CheckCircle2 } from 'lucide-react-native';
import { LinearGradientSvg } from '../../ui/LinearGradientSvg';
import { BottomNav } from '../../ui/BottomNav';
import { ObtenerHomePageUseCase } from '../../../../application/useCases/ObtenerHomePageUseCase';
import { ObtenerProyectosUseCase } from '../../../../application/useCases/ObtenerProyectosUseCase';
import { MockHomePageRepository } from '../../../../infrastructure/adapters/mock/homepage/MockHomePageRepository';
import { MockProyectoRepository } from '../../../../infrastructure/adapters/mock/proyecto/MockProyectoRepository';
import { HomePageCard } from '../../../../application/ports/IHomePagePort';
import { IProyecto } from '../../../../../../contracts/types/IProyecto';
import { IEspecie } from '../../../../../../contracts/types/IEspecie';
import { ProjectCard } from '../projects/ProjectCard';

const TABS = ['Explorar', 'Especies', 'Proyectos'] as const;
type HomeTab = (typeof TABS)[number];

export default function HomePage() {
  const { width } = useWindowDimensions();
  const [activeTab, setActiveTab] = useState<HomeTab>('Explorar');

  const [data, setData] = useState<HomePageCard[]>([]);
  const [proyectos, setProyectos] = useState<IProyecto[]>([]);
  const [especies, setEspecies] = useState<IEspecie[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const pagerRef = useRef<any>(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const useCase = new ObtenerHomePageUseCase(new MockHomePageRepository());
        const result = await useCase.execute();

        setData(result.avistamientos);
        setEspecies(result.especies);

        const proyectosUseCase = new ObtenerProyectosUseCase(new MockProyectoRepository());
        const projectsData = await proyectosUseCase.execute();
        setProyectos(projectsData);
      } catch (error) {
        console.error('Failed to fetch data', error);
      } finally {
        setIsLoading(false);
      }
    };

    void loadData();
  }, []);

  const numColumns = Math.max(2, Math.min(15, Math.floor(width / 300)));
  const pageWidth = width; // full-screen pages so adjacent tabs do not peek

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
        <View style={styles.statusPill}>
          <CheckCircle2 size={12} color="#15803d" />
          <Text style={styles.statusText}>{item.estado}</Text>
        </View>
        <TouchableOpacity style={styles.heartButton}>
          <Heart size={16} color="#9ca3af" />
        </TouchableOpacity>
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
            <TouchableOpacity style={styles.iconButton}>
              <Search size={20} color="#4b5563" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <MessageCircle size={20} color="#4b5563" />
            </TouchableOpacity>
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
              // Interpolate the color based on the scroll position matching this tab's index
              const textColor = scrollX.interpolate({
                inputRange: [
                  (index - 1) * pageWidth, 
                  index * pageWidth, 
                  (index + 1) * pageWidth
                ],
                outputRange: ['#ffffff', '#4d7c0f', '#fff'], // [Inactive, Active, Inactive]
                extrapolate: 'clamp',
              });

              return (
                <TouchableOpacity
                  key={tab}
                  style={styles.tabPillRow}
                  onPress={() => handleTabChange(tab)}
                  activeOpacity={0.8}
                >
                  <Animated.Text style={[styles.tabText, { color: textColor }]}>
                    {tab}
                  </Animated.Text>
                </TouchableOpacity>
              );
            })}
          </View>
          {
            (() => {
              const tabWidth = width / TABS.length;
              const indicatorWidth = tabWidth * 0.6;
              const indicatorOffset = (tabWidth - indicatorWidth) / 2;

              const translateX = scrollX.interpolate({
                inputRange: TABS.map((_, i) => i * pageWidth),
                outputRange: TABS.map((_, i) => i * tabWidth + indicatorOffset),
                extrapolate: 'clamp',
              });

              return (
                <Animated.View style={[styles.indicator, { width: indicatorWidth, transform: [{ translateX }] }]} />
              );
            })()
          }
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

              <View style={[styles.page, { width: pageWidth }]}>
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.pageContent}>
                  {especies.map((species) => (
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
                  ))}
                </ScrollView>
              </View>

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
    marginVertical: 12,
  },
  tabsScroll: {
    paddingHorizontal: 20,
    gap: 10,
  },
  tabText: {
    paddingHorizontal: 20,
    paddingVertical: 5,
    fontSize: 14,
    fontWeight: '600',
    backgroundColor: '#4d7c0f',
    borderRadius: 15
  },
  tabTextActive: {
    color: '#4d7c0f',
  },
  tabsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tabPillRow: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  indicator: {
    height: 3,
    backgroundColor: 'transparent',
    borderRadius: 2,
    position: 'absolute',
    bottom: 0,
    left: 0,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pagerContainer: {
    flex: 1,
  },
  pagerContent: {
    alignItems: 'flex-start',
  },
  page: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  pageContent: {
    paddingBottom: 100,
  },
  gridContainer: {
    flexDirection: 'row',
    paddingHorizontal: 0,
  },
  masonryColumn: {
    flex: 1,
    paddingHorizontal: 5,
  },
  projectsList: {
    width: '100%',
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
    padding: 12,
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