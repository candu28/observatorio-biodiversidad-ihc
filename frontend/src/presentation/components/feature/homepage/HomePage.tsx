import React, { useState, useEffect, useMemo } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Image, 
  TouchableOpacity, 
  Platform, 
  useWindowDimensions, 
  ActivityIndicator,
  Modal,
  Pressable,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Leaf, Search, MessageCircle, Heart, Home, Plus, Map, CheckCircle2, Camera, Image as ImageIcon, X } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradientSvg } from '../../ui/LinearGradientSvg';
import { ObtenerHomePageUseCase } from '../../../../application/useCases/ObtenerHomePageUseCase';
import { MockHomePageRepository } from '../../../../infrastructure/adapters/mock/homepage/MockHomePageRepository';
import { HomePageCard } from '../../../../application/ports/IHomePagePort';

export default function HomePage() {
  const { width } = useWindowDimensions();
  const [activeFilter, setActiveFilter] = useState('Todo');
  const [data, setData] = useState<HomePageCard[]>([]);
  const [filters, setFilters] = useState<string[]>(['Todo']);
  const [isLoading, setIsLoading] = useState(true);
  const [sheetVisible, setSheetVisible] = useState(false);

  const handleOpenCamera = async () => {
    setSheetVisible(false);
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso Denegado', 'Necesitamos acceso a tu cámara para registrar avistamientos.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.9,
      allowsEditing: false,
    });
    if (!result.canceled && result.assets.length > 0) {
      const uris = result.assets.map(a => a.uri);
      router.push({ pathname: '/avistamiento', params: { photos: JSON.stringify(uris) } });
    }
  };

  const handleOpenGallery = async () => {
    setSheetVisible(false);
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso Denegado', 'Necesitamos acceso a tu galería para registrar avistamientos.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.9,
      allowsMultipleSelection: true,
      selectionLimit: 10,
    });
    if (!result.canceled && result.assets.length > 0) {
      const uris = result.assets.map(a => a.uri);
      router.push({ pathname: '/avistamiento', params: { photos: JSON.stringify(uris) } });
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const useCase = new ObtenerHomePageUseCase(new MockHomePageRepository());
        const result = await useCase.execute();

        setData(result.avistamientos);
        setFilters(result.filters);
      } catch (error) {
        console.error('Failed to fetch data', error);
      } finally {
        setIsLoading(false);
      }
    };

    void loadData();
  }, []);

  const numColumns = Math.max(2, Math.min(15, Math.floor(width / 300)));

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

  const renderCard = (item: any) => (
    <View key={item.id} style={[styles.card, { height: item.height }]}>
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
    </View>
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

        {/* Filters */}
        <View style={styles.filtersContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtersScroll}>
            {filters.map((filter) => (
              <TouchableOpacity
                key={filter}
                style={[styles.filterPill, activeFilter === filter && styles.filterPillActive]}
                onPress={() => setActiveFilter(filter)}
              >
                <Text style={[styles.filterText, activeFilter === filter && styles.filterTextActive]}>
                  {filter}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Dynamic Masonry Grid */}
        {isLoading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#4d7c0f" />
          </View>
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.gridContainer}
          >
            {masonryColumns.map((columnData, colIndex) => (
              <View key={`col-${colIndex}`} style={styles.masonryColumn}>
                {columnData.map(renderCard)}
              </View>
            ))}
          </ScrollView>
        )}

        {/* Bottom Navigation */}
        <View style={styles.bottomNavWrapper}>
          <View style={styles.bottomNav}>
            <TouchableOpacity style={styles.navItem}>
              <Home size={24} color="#4b5563" />
              <Text style={styles.navText}>Inicio</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.navItem} onPress={() => setSheetVisible(true)}>
              <Plus size={24} color="#4b5563" />
              <Text style={styles.navText}>Avistamiento</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.navItem}>
              <Map size={24} color="#4b5563" />
              <Text style={styles.navText}>Mapa</Text>
            </TouchableOpacity>
          </View>
        </View>

      </SafeAreaView>

      {/* Bottom Sheet: Seleccionar fuente de foto */}
      <Modal visible={sheetVisible} transparent animationType="slide" onRequestClose={() => setSheetVisible(false)}>
        <Pressable style={styles.sheetBackdrop} onPress={() => setSheetVisible(false)}>
          <Pressable style={styles.sheetContent} onPress={e => e.stopPropagation()}>
            {/* Handle bar */}
            <View style={styles.sheetHandle} />

            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Nuevo Avistamiento</Text>
              <TouchableOpacity onPress={() => setSheetVisible(false)} style={styles.sheetClose}>
                <X size={18} color="#7a6e5b" />
              </TouchableOpacity>
            </View>
            <Text style={styles.sheetSubtitle}>Elige cómo agregar tu evidencia fotográfica</Text>

            <View style={styles.sheetOptions}>
              <TouchableOpacity style={styles.sheetOption} onPress={handleOpenCamera}>
                <View style={[styles.optionIcon, { backgroundColor: '#ecfdf5' }]}>
                  <Camera size={26} color="#4d7c0f" />
                </View>
                <View style={styles.optionText}>
                  <Text style={styles.optionTitle}>Tomar Fotografía</Text>
                  <Text style={styles.optionDesc}>Usa la cámara (incluye modo ráfaga)</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.sheetOption, { borderBottomWidth: 0 }]} onPress={handleOpenGallery}>
                <View style={[styles.optionIcon, { backgroundColor: '#eff6ff' }]}>
                  <ImageIcon size={26} color="#1d4ed8" />
                </View>
                <View style={styles.optionText}>
                  <Text style={styles.optionTitle}>Subir desde Galería</Text>
                  <Text style={styles.optionDesc}>Selecciona fotos guardadas en tu dispositivo</Text>
                </View>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

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
  filtersContainer: {
    marginVertical: 15,
  },
  filtersScroll: {
    paddingHorizontal: 20,
    gap: 10,
  },
  filterPill: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
  filterPillActive: {
    backgroundColor: '#4d7c0f',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4b5563',
  },
  filterTextActive: {
    color: '#ffffff',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gridContainer: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingBottom: 100, 
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
  bottomNavWrapper: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    alignItems: 'center',
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderRadius: 30,
    paddingHorizontal: 30,
    paddingVertical: 12,
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  navText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#4b5563',
  },
  // ─── Bottom Sheet ───────────────────────────────────────────────
  sheetBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  sheetContent: {
    backgroundColor: '#fffdf8',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 44 : 28,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: -4 },
    shadowRadius: 16,
    elevation: 12,
  },
  sheetHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#d4c9b0',
    alignSelf: 'center',
    marginBottom: 18,
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  sheetTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#2d2418',
  },
  sheetClose: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f2ead9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sheetSubtitle: {
    fontSize: 13,
    color: '#8a7a5d',
    marginBottom: 20,
  },
  sheetOptions: {
    backgroundColor: '#fff',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#f0e3c4',
    overflow: 'hidden',
  },
  sheetOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0e3c4',
  },
  optionIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  optionText: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#271f13',
    marginBottom: 3,
  },
  optionDesc: {
    fontSize: 12,
    color: '#8a7a5d',
  },
});