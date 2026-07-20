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
  TextInput,
  ActivityIndicator,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Leaf, Search, Heart, CheckCircle2, X, ChevronLeft } from 'lucide-react-native';
import { LinearGradientSvg } from '../../ui/LinearGradientSvg';
import { BottomNav } from '../../ui/BottomNav';
import { ObtenerHomePageUseCase } from '../../../../application/useCases/ObtenerHomePageUseCase';
import { ObtenerProyectosUseCase } from '../../../../application/useCases/ObtenerProyectosUseCase';
import { WatermelonHomePageRepository } from '../../../../infrastructure/adapters/watermelon/homepage/WatermelonHomePageRepository';
import { WatermelonProyectoRepository } from '../../../../infrastructure/adapters/watermelon/proyecto/WatermelonProyectoRepository';
import { WatermelonPerfilRepository } from '../../../../infrastructure/adapters/watermelon/perfil/WatermelonPerfilRepository';
import { HomePageCard } from '../../../../application/ports/IHomePagePort';
import { IProyecto } from '../../../../../../contracts/types/IProyecto';
import { IEspecie } from '../../../../../../contracts/types/IEspecie';
import { ProjectCard } from '../projects/ProjectCard';

const TABS = ['Avistamientos', 'Especies', 'Biomas', 'Proyectos'] as const;
type HomeTab = (typeof TABS)[number];

const CATEGORY_FILTERS = [
  'Todo',
  'Mamíferos',
  'Aves',
  'Anfibios',
  'Reptiles',
  'Insectos',
  'Plantas',
  'Hongos',
];

const BIOMA_FILTERS = [
  'Selva tropical',
  'Sabana',
  'Tepuyes'
];

const CATEGORY_MAP: Record<string, string> = {
  'Anfibios': '11111111-1111-1111-1111-111111111111',
  'Plantas': '22222222-2222-2222-2222-222222222222',
  'Aves': '33333333-3333-3333-3333-333333333333',
  'Mamíferos': '44444444-4444-4444-4444-444444444444',
  'Reptiles': '55555555-5555-5555-5555-555555555555',
  'Insectos': '66666666-6666-6666-6666-666666666666',
  'Hongos': '77777777-7777-7777-7777-777777777777',
};

const CATEGORY_IMAGES: Record<string, string> = {
  'Mamíferos': 'https://images.unsplash.com/photo-1550977186-b484af8a264a?w=400',
  'Aves': 'https://images.unsplash.com/photo-1552728089-57ce365c5fd6?w=400',
  'Anfibios': 'https://images.unsplash.com/photo-1579624584285-b1a7d65608c0?w=400',
  'Reptiles': 'https://images.unsplash.com/photo-1517006841457-3f829f04523d?w=400',
  'Insectos': 'https://images.unsplash.com/photo-1542171125-9d413346d3ea?w=400',
  'Plantas': 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=400',
  'Hongos': 'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?w=400',
};

const BIOMA_IMAGES: Record<string, string> = {
  'Selva tropical': 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=400',
  'Sabana': 'https://images.unsplash.com/photo-1501469399884-bb66db132cb0?w=400',
  'Tepuyes': 'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?w=400',
};

export default function HomePage() {
  const { width } = useWindowDimensions();
  const [activeTab, setActiveTab] = useState<HomeTab>('Avistamientos');
  const [activeSpeciesFilter, setActiveSpeciesFilter] = useState('Todo');
  const [activeBiomaFilter, setActiveBiomaFilter] = useState('Selva tropical');
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const leafScale = useRef(new Animated.Value(1)).current;

  const [data, setData] = useState<HomePageCard[]>([]);
  const [proyectos, setProyectos] = useState<IProyecto[]>([]);
  const [especies, setEspecies] = useState<IEspecie[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const pagerRef = useRef<any>(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let subAvistamientos: any;
    let subEspecies: any;
    let subProyectos: any;

    const init = async () => {
      const homeRepo = new WatermelonHomePageRepository();
      const perfilRepo = new WatermelonPerfilRepository();
      const usuario = await perfilRepo.getUsuarioActual();
      
      subAvistamientos = homeRepo.observeAvistamientos(usuario?.id).subscribe(setData);
      subEspecies = homeRepo.observeEspecies().subscribe(e => {
        setEspecies(e);
        setIsLoading(false);
      });

      const proyectoRepo = new WatermelonProyectoRepository();
      subProyectos = proyectoRepo.observeProyectos().subscribe(setProyectos);
    };

    init();

    return () => {
      if (subAvistamientos) subAvistamientos.unsubscribe();
      if (subEspecies) subEspecies.unsubscribe();
      if (subProyectos) subProyectos.unsubscribe();
    };
  }, []);

  const numColumns = Math.max(2, Math.min(15, Math.floor(width / 300)));
  const pageWidth = width; // full-screen pages so adjacent tabs do not peek

  const filteredData = useMemo(() => {
    if (!searchQuery) return data;
    const lowerQ = searchQuery.toLowerCase();
    return data.filter(item => item.title?.toLowerCase().includes(lowerQ) || item.estado.toLowerCase().includes(lowerQ));
  }, [data, searchQuery]);

  const masonryColumns = useMemo(() => {
    const columns = Array.from({ length: numColumns }, () => ({
      height: 0,
      items: [] as HomePageCard[],
    }));

    filteredData.forEach((item) => {
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
  }, [filteredData, numColumns]);

  const displayedEspecies = useMemo(() => {
    let result = especies;
    if (activeSpeciesFilter !== 'Todo') {
      result = result.filter(e => e.categoriaId === CATEGORY_MAP[activeSpeciesFilter]);
    }
    if (searchQuery) {
      const lowerQ = searchQuery.toLowerCase();
      result = result.filter(e => 
        e.nombreComun?.toLowerCase().includes(lowerQ) || 
        e.nombreCientifico.toLowerCase().includes(lowerQ)
      );
    }
    return result;
  }, [especies, activeSpeciesFilter, searchQuery]);

  const displayedBiomaEspecies = useMemo(() => {
    let result = especies;
    if (activeBiomaFilter) {
      result = result.filter(e => e.bioma === activeBiomaFilter);
    }
    if (searchQuery) {
      const lowerQ = searchQuery.toLowerCase();
      result = result.filter(e => 
        e.nombreComun?.toLowerCase().includes(lowerQ) || 
        e.nombreCientifico.toLowerCase().includes(lowerQ)
      );
    }
    return result;
  }, [especies, activeBiomaFilter, searchQuery]);

  const displayedProyectos = useMemo(() => {
    if (!searchQuery) return proyectos;
    const lowerQ = searchQuery.toLowerCase();
    return proyectos.filter(p => p.titulo.toLowerCase().includes(lowerQ) || p.descripcion.toLowerCase().includes(lowerQ));
  }, [proyectos, searchQuery]);

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

  const LikeButton = ({ itemId }: { itemId: string }) => {
    const [liked, setLiked] = useState(false);
    
    const handleLike = async () => {
      setLiked(!liked);
      try {
        const { RegistrarInteresUseCase } = require('../../../../application/useCases/RegistrarInteresUseCase');
        const { WatermelonPerfilRepository } = require('../../../../infrastructure/adapters/watermelon/perfil/WatermelonPerfilRepository');
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
        <LikeButton itemId={item.id} />
      </View>
    </TouchableOpacity>
  );

  return (
    <LinearGradientSvg
      colors={['#f7f0df', '#f4ecd7', '#f7f0df']}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>

        {/* Header */}
        <View style={styles.header}>
          {isSearching ? (
            <View style={styles.searchBarContainer}>
              <Search size={18} color="#6b7280" />
              <TextInput
                style={styles.searchInput}
                placeholder="Buscar..."
                placeholderTextColor="#9ca3af"
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoFocus
              />
              <TouchableOpacity onPress={() => { setIsSearching(false); setSearchQuery(''); }}>
                <X size={20} color="#6b7280" />
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <Pressable
                style={styles.logoContainer}
                onPressIn={() => {
                  Animated.spring(leafScale, {
                    toValue: 0.8,
                    useNativeDriver: true,
                  }).start();
                }}
                onPressOut={() => {
                  Animated.spring(leafScale, {
                    toValue: 1,
                    friction: 3,
                    useNativeDriver: true,
                  }).start();
                }}
              >
                <Animated.View style={{ transform: [{ scale: leafScale }] }}>
                  <Leaf size={28} color="#4d7c0f" strokeWidth={2.5} />
                </Animated.View>
                <Text style={styles.logoText}>guaya</Text>
              </Pressable>
              <View style={styles.headerActions}>
                <TouchableOpacity style={styles.iconButton} onPress={() => setIsSearching(true)}>
                  <Search size={20} color="#4b5563" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.avatarContainer} onPress={() => router.push('/perfil')}>
                  <Image
                    source={{ uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150&auto=format&fit=crop' }}
                    style={styles.avatar}
                  />
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>

        {(activeTab === 'Avistamientos' || activeTab === 'Proyectos') && (
          <View style={styles.tabsContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsScroll}>
              {TABS.map((tab) => {
                const isActive = activeTab === tab;
                return (
                  <TouchableOpacity
                    key={tab}
                    style={[styles.tabPill, !isActive && styles.tabPillInactive]}
                    onPress={() => handleTabChange(tab)}
                    activeOpacity={0.8}
                  >
                    {isActive && (
                      <LinearGradientSvg
                        colors={['#4d7c0f', '#4d7c0f']}
                        style={StyleSheet.absoluteFillObject}
                      />
                    )}
                    <Text style={[styles.tabText, isActive ? styles.tabTextActive : styles.tabTextInactive]}>
                      {tab}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        )}

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
                <View style={styles.pageHeader}>
                  <TouchableOpacity onPress={() => handleTabChange('Avistamientos')} style={styles.pageBackButton}>
                    <ChevronLeft size={22} color="#1f2937" />
                  </TouchableOpacity>
                  <Text style={styles.pageTitle}>Especies de Guayana</Text>
                </View>
                <Text style={styles.pageDescription}>
                  Explora la increíble diversidad de flora y fauna que habita en nuestra región.
                </Text>
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.pageContent, styles.categoryCardsContainer]}>
                  {CATEGORY_FILTERS.filter(f => f !== 'Todo').map((category) => (
                    <TouchableOpacity
                      key={category}
                      style={styles.largeCategoryCard}
                      activeOpacity={0.8}
                      onPress={() => router.push(`/categoria/${category}`)}
                    >
                      <Image source={{ uri: CATEGORY_IMAGES[category] }} style={styles.largeCategoryCardImage} />
                      <View style={styles.largeCategoryCardOverlay}>
                        <Text style={styles.largeCategoryCardText}>{category}</Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              <View style={[styles.page, { width: pageWidth }]}>
                <View style={styles.pageHeader}>
                  <TouchableOpacity onPress={() => handleTabChange('Avistamientos')} style={styles.pageBackButton}>
                    <ChevronLeft size={22} color="#1f2937" />
                  </TouchableOpacity>
                  <Text style={styles.pageTitle}>Biomas de Guayana</Text>
                </View>
                <Text style={styles.pageDescription}>
                  Descubre todos los ecosistemas que son característicos de nuestra región. Incluyendo los más antiguos y biodiversos del planeta.
                </Text>
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.pageContent, styles.categoryCardsContainer]}>
                  {BIOMA_FILTERS.map((bioma) => (
                    <TouchableOpacity
                      key={bioma}
                      style={styles.largeCategoryCard}
                      activeOpacity={0.8}
                      onPress={() => router.push(`/bioma/${bioma}`)}
                    >
                      <Image source={{ uri: BIOMA_IMAGES[bioma] }} style={styles.largeCategoryCardImage} />
                      <View style={styles.largeCategoryCardOverlay}>
                        <Text style={styles.largeCategoryCardText}>{bioma}</Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              <View style={[styles.page, { width: pageWidth }]}>
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.pageContent}>
                  {displayedProyectos.map((proyecto) => (
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
    minHeight: 60,
  },
  searchBarContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 24,
    paddingHorizontal: 16,
    height: 44,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: '#1f2937',
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
    gap: 12,
  },
  tabPill: {
    paddingHorizontal: 22,
    paddingVertical: 10,
    borderRadius: 24,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabPillInactive: {
    backgroundColor: '#fff',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '700',
    position: 'relative',
    zIndex: 1,
  },
  tabTextActive: {
    color: '#fff',
  },
  tabTextInactive: {
    color: '#84623f',
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
  speciesFiltersWrapper: {
    marginBottom: 16,
  },
  speciesFiltersScroll: {
    gap: 8,
  },
  speciesFilterPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderWidth: 1,
    borderColor: 'rgba(132, 98, 63, 0.2)',
  },
  speciesFilterPillActive: {
    backgroundColor: '#84623f',
    borderColor: '#84623f',
  },
  speciesFilterText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#84623f',
  },
  speciesFilterTextActive: {
    color: '#ffffff',
  },
  pageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 8,
    gap: 12,
  },
  pageBackButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 4,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#064e3b',
  },
  pageDescription: {
    fontSize: 14,
    color: '#4b5563',
    paddingHorizontal: 20,
    marginBottom: 16,
    lineHeight: 20,
  },
  categoryCardsContainer: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 100,
    gap: 16,
  },
  largeCategoryCard: {
    width: '100%',
    height: 180,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    backgroundColor: '#e5e7eb',
  },
  largeCategoryCardImage: {
    width: '100%',
    height: '100%',
  },
  largeCategoryCardOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
    padding: 16,
  },
  largeCategoryCardText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
});