import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Dimensions,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Globe, Wifi, WifiOff } from 'lucide-react-native';
import { BottomNav } from '../../ui/BottomNav';
import { ObtenerMapaUseCase } from '../../../../application/useCases/ObtenerMapaUseCase';
import { HybridMapRepository } from '../../../../infrastructure/adapters/api/HybridMapRepository';
import { IAvistamiento } from '../../../../../../contracts/types/IAvistamiento';

// Importación condicional nativa de react-native-maps para evitar errores de compilación en la Web
let MapView: any = null;
let Marker: any = null;
let Callout: any = null;

if (Platform.OS !== 'web') {
  try {
    const Maps = require('react-native-maps');
    MapView = Maps.default || Maps;
    Marker = Maps.Marker;
    Callout = Maps.Callout;
  } catch (error) {
    console.error('Error al cargar react-native-maps nativamente:', error);
  }
}

// Bounding box para la región Guayana
const MIN_LAT = 1.0;
const MAX_LAT = 10.0;
const MIN_LON = -68.0;
const MAX_LON = -60.0;

// Lista de filtros de categorías disponibles
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

// Mapeo de colores LED/Neón brillante por ID de categoría local
const getSightColors = (categoriaId: string) => {
  switch (categoriaId) {
    case '11111111-1111-1111-1111-111111111111': // Anfibios
      return { solid: '#fbbf24', glow: 'rgba(251, 191, 36, 0.4)' };
    case '22222222-2222-2222-2222-222222222222': // Plantas
      return { solid: '#22c55e', glow: 'rgba(34, 197, 94, 0.4)' };
    case '33333333-3333-3333-3333-333333333333': // Aves
      return { solid: '#f97316', glow: 'rgba(249, 115, 22, 0.4)' };
    case '44444444-4444-4444-4444-444444444444': // Mamíferos
      return { solid: '#06b6d4', glow: 'rgba(6, 182, 212, 0.4)' };
    case '55555555-5555-5555-5555-555555555555': // Reptiles
      return { solid: '#d946ef', glow: 'rgba(217, 70, 239, 0.4)' };
    case '66666666-6666-6666-6666-666666666666': // Insectos
      return { solid: '#ef4444', glow: 'rgba(239, 68, 68, 0.4)' };
    case '77777777-7777-7777-7777-777777777777': // Hongos
      return { solid: '#f59e0b', glow: 'rgba(245, 158, 11, 0.4)' };
    default:
      return { solid: '#f97316', glow: 'rgba(249, 115, 22, 0.4)' };
  }
};

// Estilo personalizado de Google Maps (Dark premium orgánico en tonos marrón-negro)
const DARK_MAP_STYLE = [
  { elementType: "geometry", stylers: [{ color: "#1d1510" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#8c7e75" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#1d1510" }] },
  { featureType: "administrative", elementType: "geometry.stroke", stylers: [{ color: "#3b2f27" }] },
  { featureType: "administrative.land_parcel", elementType: "labels.text.fill", stylers: [{ color: "#bda698" }] },
  { featureType: "landscape.natural", elementType: "geometry", stylers: [{ color: "#16100c" }] },
  { featureType: "poi", elementType: "geometry", stylers: [{ color: "#241a13" }] },
  { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#948275" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#2a1e16" }] },
  { featureType: "road.arterial", elementType: "geometry", stylers: [{ color: "#33251a" }] },
  { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#4a3526" }] },
  { featureType: "road.highway.controlled_access", elementType: "geometry", stylers: [{ color: "#5e422f" }] },
  { featureType: "road.local", elementType: "labels.text.fill", stylers: [{ color: "#806d61" }] },
  { featureType: "transit", elementType: "geometry", stylers: [{ color: "#2d2017" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#0d0a08" }] },
  { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#4e3b2e" }] },
];

export default function MapaScreen() {
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('Todo');
  const [isOnline, setIsOnline] = useState(false); // Por defecto Offline para desarrollo estable
  const [avistamientos, setAvistamientos] = useState<IAvistamiento[]>([]);

  const fetchMapData = async () => {
    setLoading(true);
    try {
      const repo = new HybridMapRepository();
      const useCase = new ObtenerMapaUseCase(repo);
      const data = await useCase.execute({ categoryName: activeFilter, online: isOnline });
      setAvistamientos(data);
    } catch (error) {
      console.error('Error cargando avistamientos en el mapa:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchMapData();
  }, [activeFilter, isOnline]);

  // Componente de Marcador LED brillante
  const LEDMarker = ({ color }: { color: string }) => {
    return (
      <View style={styles.ledContainer}>
        {/* Resplandor externo */}
        <View style={[styles.ledGlow, { backgroundColor: color, opacity: 0.25 }]} />
        {/* Anillo de enfoque neón */}
        <View style={[styles.ledRing, { borderColor: color, backgroundColor: color + '15' }]} />
        {/* Punto central sólido */}
        <View style={[styles.ledDot, { backgroundColor: color }]} />
      </View>
    );
  };

  // Renderizado del Mapa Web con Leaflet interactivo en tonos oscuros
  const renderWebMap = () => {
    const markersJson = JSON.stringify(
      avistamientos.map((a) => ({
        lat: a.latitud,
        lng: a.longitud,
        name: a.especieVerifNombre || a.especieVerifNombreCientifico || 'Avistamiento',
        color: getSightColors(a.categoriaId).solid,
        photo: a.fotoUrl,
        desc: a.descripcionExperiencia,
        id: a.id,
      }))
    );

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
        <style>
          body, html, #map { margin: 0; padding: 0; width: 100%; height: 100%; background: #0b0805; }
          .leaflet-container { background: #0b0805; }
          
          /* Estilo de Popup en el mapa oscuro */
          .leaflet-popup-content-wrapper {
            background: #1d150d !important;
            color: #f3ece0 !important;
            border-radius: 16px !important;
            border: 1px solid rgba(240, 227, 196, 0.25);
            font-family: system-ui, -apple-system, sans-serif;
            padding: 2px;
          }
          .leaflet-popup-tip {
            background: #1d150d !important;
            border: 1px solid rgba(240, 227, 196, 0.25);
          }
          .popup-container {
            width: 180px;
            display: flex;
            flex-direction: column;
            gap: 6px;
          }
          .popup-img {
            width: 100%;
            height: 90px;
            object-fit: cover;
            border-radius: 8px;
          }
          .popup-title {
            margin: 0;
            font-size: 13px;
            font-weight: 700;
            color: #f3ece0;
          }
          .popup-desc {
            margin: 0;
            font-size: 10px;
            color: #a39889;
            line-height: 1.3;
          }
          .popup-link {
            font-size: 10px;
            font-weight: 700;
            color: #fbbf24;
            text-decoration: none;
            text-align: right;
            margin-top: 4px;
          }
        </style>
      </head>
      <body>
        <div id="map"></div>
        <script>
          const map = L.map('map', { attributionControl: false }).setView([8.2970, -62.7120], 15);
          
          // Capa oscura de CartoDB Dark Matter
          L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            maxZoom: 19
          }).addTo(map);
          
          const markersData = ${markersJson};
          
          markersData.forEach(m => {
            // Marcador LED/Neón personalizado con divIcon
            const customIcon = L.divIcon({
              className: 'custom-led-icon',
              html: \`
                <div style="
                  width: 20px;
                  height: 20px;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  position: relative;
                ">
                  <div style="
                    position: absolute;
                    width: 20px;
                    height: 20px;
                    border-radius: 50%;
                    background: \${m.color};
                    opacity: 0.25;
                  "></div>
                  <div style="
                    position: absolute;
                    width: 12px;
                    height: 12px;
                    border-radius: 50%;
                    border: 1.5px solid \${m.color};
                    background: rgba(0,0,0,0.1);
                  "></div>
                  <div style="
                    width: 6px;
                    height: 6px;
                    border-radius: 50%;
                    background: \${m.color};
                    box-shadow: 0 0 6px \${m.color};
                  "></div>
                </div>
              \`,
              iconSize: [20, 20],
              iconAnchor: [10, 10]
            });
            
            const popupContent = \`
              <div class="popup-container">
                <img src="\${m.photo}" class="popup-img" />
                <h4 class="popup-title">\${m.name}</h4>
                <p class="popup-desc">\${m.desc.substring(0, 55)}...</p>
                <a href="/detalle/\${m.id}" target="_parent" class="popup-link">Ver Detalles ➔</a>
              </div>
            \`;
            
            L.marker([m.lat, m.lng], { icon: customIcon })
              .addTo(map)
              .bindPopup(popupContent);
          });
        </script>
      </body>
      </html>
    `;

    return (
      <View style={styles.webMapContainer}>
        {Platform.OS === 'web' ? (
          <iframe
            srcDoc={htmlContent}
            style={{ width: '100%', height: '100%', border: 'none' }}
            title="iNaturalist Observatorio Map"
          />
        ) : (
          <View style={styles.unsupportedContainer}>
            <Text style={{ color: '#fff' }}>Mapa interactivo web no compatible aquí</Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* 1. Header de Navegación */}
      <SafeAreaView style={styles.headerSafeArea}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Explorar</Text>
          <Text style={styles.headerSubtitle}>Biodiversidad Regional</Text>
        </View>
      </SafeAreaView>

      {/* 2. Filtros de Categoría Taxonómica */}
      <View style={styles.filtersWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersScroll}
        >
          {CATEGORY_FILTERS.map((filter) => {
            const isActive = activeFilter === filter;
            return (
              <TouchableOpacity
                key={filter}
                style={[styles.filterPill, isActive && styles.filterPillActive]}
                onPress={() => setActiveFilter(filter)}
                activeOpacity={0.7}
              >
                <Text style={[styles.filterText, isActive && styles.filterTextActive]}>
                  {filter}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* 3. Área Cartográfica Híbrida (Native vs Web) */}
      <View style={styles.mapContainer}>
        {loading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#fbbf24" />
            <Text style={styles.loaderText}>
              Cargando avistamientos {isOnline ? 'de iNaturalist...' : 'locales...'}
            </Text>
          </View>
        ) : Platform.OS === 'web' || !MapView ? (
          renderWebMap()
        ) : (
          <MapView
            style={StyleSheet.absoluteFillObject}
            initialRegion={{
              latitude: 8.2970, // UCAB Guayana
              longitude: -62.7120,
              latitudeDelta: 0.015,
              longitudeDelta: 0.015,
            }}
            customMapStyle={DARK_MAP_STYLE}
          >
            {avistamientos.map((a) => {
              const colors = getSightColors(a.categoriaId);
              return (
                <Marker
                  key={a.id}
                  coordinate={{ latitude: a.latitud, longitude: a.longitud }}
                  onCalloutPress={() => router.push(`/detalle/${a.id}`)}
                >
                  <LEDMarker color={colors.solid} />
                  <Callout tooltip>
                    <View style={styles.calloutContainer}>
                      {a.fotoUrl ? (
                        <Image source={{ uri: a.fotoUrl }} style={styles.calloutImage} />
                      ) : null}
                      <Text style={styles.calloutTitle} numberOfLines={1}>
                        {a.especieVerifNombre || a.especieVerifNombreCientifico || 'Especie'}
                      </Text>
                      <Text style={styles.calloutDesc} numberOfLines={2}>
                        {a.descripcionExperiencia}
                      </Text>
                      <Text style={styles.calloutButton}>Ver Detalles ➔</Text>
                    </View>
                  </Callout>
                </Marker>
              );
            })}
          </MapView>
        )}
      </View>

      {/* 4. Panel Flotante Inferior de Información y Toggle de Red */}
      <View style={styles.overlayWrapper}>
        <View style={styles.overlayCard}>
          <View style={styles.overlayDetails}>
            <Text style={styles.overlayTitle}>Avistamientos - Guayana</Text>
            <Text style={styles.overlayCount}>
              {avistamientos.length} registros encontrados
            </Text>
          </View>

          {/* Toggle de Modo Híbrido (Online/Offline) */}
          <TouchableOpacity
            style={[styles.networkToggle, isOnline ? styles.networkOnline : styles.networkOffline]}
            onPress={() => setIsOnline(!isOnline)}
            activeOpacity={0.8}
          >
            {isOnline ? (
              <>
                <Wifi size={14} color="#22c55e" />
                <Text style={[styles.networkText, { color: '#22c55e' }]}>iNat v2</Text>
              </>
            ) : (
              <>
                <WifiOff size={14} color="#f97316" />
                <Text style={[styles.networkText, { color: '#f97316' }]}>Offline</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* 5. Barra de navegación inferior */}
      <SafeAreaView style={styles.bottomNavSafeArea}>
        <BottomNav />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b0805',
  },
  headerSafeArea: {
    backgroundColor: '#0b0805',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 25 : 10,
    paddingBottom: 5,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#f3ece0',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#84623f',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: 2,
  },
  filtersWrapper: {
    paddingVertical: 10,
    backgroundColor: '#0b0805',
  },
  filtersScroll: {
    paddingHorizontal: 20,
    gap: 8,
  },
  filterPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#1d150d',
    borderWidth: 1,
    borderColor: '#2d2015',
  },
  filterPillActive: {
    backgroundColor: '#84623f',
    borderColor: '#a37c56',
  },
  filterText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#a39889',
  },
  filterTextActive: {
    color: '#ffffff',
  },
  mapContainer: {
    flex: 1,
    backgroundColor: '#0b0805',
  },
  webMapContainer: {
    width: '100%',
    height: '100%',
  },
  unsupportedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0b0805',
  },
  loaderContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(11, 8, 5, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    zIndex: 99,
  },
  loaderText: {
    color: '#a39889',
    fontSize: 12,
    fontWeight: '500',
  },
  // Marcadores LED
  ledContainer: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ledGlow: {
    position: 'absolute',
    width: 28,
    height: 28,
    borderRadius: 14,
  },
  ledRing: {
    position: 'absolute',
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1.5,
  },
  ledDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    shadowColor: '#ffffff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 2,
  },
  // Popup Callout nativo
  calloutContainer: {
    backgroundColor: '#1d150d',
    borderRadius: 16,
    padding: 10,
    width: 180,
    borderWidth: 1.2,
    borderColor: 'rgba(132, 98, 63, 0.35)',
  },
  calloutImage: {
    width: '100%',
    height: 85,
    borderRadius: 8,
    marginBottom: 6,
  },
  calloutTitle: {
    color: '#f3ece0',
    fontWeight: '800',
    fontSize: 13,
    marginBottom: 2,
  },
  calloutDesc: {
    color: '#a39889',
    fontSize: 10,
    lineHeight: 12,
    marginBottom: 6,
  },
  calloutButton: {
    color: '#fbbf24',
    fontSize: 10,
    fontWeight: '800',
    textAlign: 'right',
  },
  // Panel Flotante Inferior
  overlayWrapper: {
    position: 'absolute',
    bottom: 100, // Sobre el BottomNav
    left: 20,
    right: 20,
    alignItems: 'center',
    zIndex: 10,
  },
  overlayCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(29, 21, 13, 0.93)',
    borderRadius: 24,
    paddingVertical: 14,
    paddingHorizontal: 20,
    width: '100%',
    maxWidth: 420,
    borderWidth: 1.2,
    borderColor: 'rgba(132, 98, 63, 0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 8,
  },
  overlayDetails: {
    flex: 1,
  },
  overlayTitle: {
    color: '#f3ece0',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  overlayCount: {
    color: '#a39889',
    fontSize: 11,
    marginTop: 2,
    fontWeight: '500',
  },
  // Toggle de Red
  networkToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
  },
  networkOnline: {
    backgroundColor: 'rgba(34, 197, 148, 0.1)',
    borderColor: 'rgba(34, 197, 148, 0.3)',
  },
  networkOffline: {
    backgroundColor: 'rgba(249, 115, 22, 0.1)',
    borderColor: 'rgba(249, 115, 22, 0.3)',
  },
  networkText: {
    fontSize: 11,
    fontWeight: '800',
  },
  bottomNavSafeArea: {
    backgroundColor: 'transparent',
  },
});
