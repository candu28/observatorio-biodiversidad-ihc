import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import Svg, {
  Defs,
  RadialGradient,
  Stop,
  Circle,
  Line,
  Rect,
} from 'react-native-svg';
import { BottomNav } from '../../ui/BottomNav';
import { ObtenerMapaUseCase } from '../../../../application/useCases/ObtenerMapaUseCase';
import { MockMapRepository } from '../../../../infrastructure/adapters/mock/map/MockMapRepository';
import { IAvistamiento } from '../../../../../../contracts/types/IAvistamiento';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Bounding box para Venezuela/Guayana
const MIN_LAT = 3.0;
const MAX_LAT = 12.0;
const MIN_LON = -73.0;
const MAX_LON = -59.0;

export default function MapaScreen() {
  const [loading, setLoading] = useState(true);
  const [avistamientos, setAvistamientos] = useState<IAvistamiento[]>([]);

  useEffect(() => {
    const fetchMapData = async () => {
      try {
        const repo = new MockMapRepository();
        const useCase = new ObtenerMapaUseCase(repo);
        const data = await useCase.execute();
        setAvistamientos(data);
      } catch (error) {
        console.error('Error fetching map data:', error);
      } finally {
        setLoading(false);
      }
    };

    void fetchMapData();
  }, []);

  // Función para proyectar coordenadas geográficas a píxeles
  const getXY = (lat: number, lon: number, mapWidth: number, mapHeight: number) => {
    // Escalar longitud a X (Eje horizontal: Izquierda a Derecha)
    const x = ((lon - MIN_LON) / (MAX_LON - MIN_LON)) * mapWidth;
    // Escalar latitud a Y (Eje vertical: Arriba es más al norte, abajo más al sur)
    const y = mapHeight - ((lat - MIN_LAT) / (MAX_LAT - MIN_LAT)) * mapHeight;
    return { x, y };
  };

  // Determinar color y gradiente según la categoría o el estado del avistamiento
  const getSightColors = (avistamiento: IAvistamiento) => {
    // Si la categoría de taxonomía representa Plantas (ID de Plantas del JSON es "22222222-2222-2222-2222-222222222222")
    if (avistamiento.categoriaId === '22222222-2222-2222-2222-222222222222') {
      return {
        solid: '#22c55e', // Verde para plantas
        glowId: 'greenGlow',
      };
    }
    // Si es Anfibio (ID "11111111-1111-1111-1111-111111111111")
    if (avistamiento.categoriaId === '11111111-1111-1111-1111-111111111111') {
      return {
        solid: '#fbbf24', // Amarillo para anfibios
        glowId: 'yellowGlow',
      };
    }
    // Por defecto es Aves (ID "33333333-3333-3333-3333-333333333333") u otras categorías
    return {
      solid: '#f97316', // Naranja/rojo para aves y otros
      glowId: 'orangeGlow',
    };
  };

  // Generar algunos puntos extra aleatorios o decorativos para densificar el Heatmap en las zonas de avistamientos
  const getHeatmapPoints = () => {
    const points: Array<{ x: number; y: number; glowId: string; solid: string; isDecoration?: boolean }> = [];
    
    avistamientos.forEach((a) => {
      const { x, y } = getXY(a.latitud, a.longitud, SCREEN_WIDTH, SCREEN_HEIGHT - 100);
      const colors = getSightColors(a);
      
      // Añadir punto original
      points.push({ x, y, ...colors });

      // Añadir pequeños puntos de dispersión alrededor para simular mapa de calor / densidad
      // Solo si son coordenadas reales y válidas
      if (a.latitud !== 0 && a.longitud !== 0) {
        // Puntos de calor dispersos
        const offsets = [
          { dx: -25, dy: 15, op: 0.7 },
          { dx: 30, dy: -25, op: 0.5 },
          { dx: -10, dy: -35, op: 0.6 },
          { dx: 45, dy: 35, op: 0.4 },
        ];
        offsets.forEach((offset) => {
          points.push({
            x: x + offset.dx,
            y: y + offset.dy,
            glowId: colors.glowId,
            solid: colors.solid,
            isDecoration: true,
          });
        });
      }
    });

    return points;
  };

  const heatmapPoints = getHeatmapPoints();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Fondo de mapa oscuro premium */}
      <View style={StyleSheet.absoluteFill}>
        <Svg width="100%" height="100%">
          <Defs>
            {/* Gradiente de fondo */}
            <RadialGradient id="bgGrad" cx="50%" cy="40%" rx="80%" ry="80%">
              <Stop offset="0%" stopColor="#1e1610" />
              <Stop offset="100%" stopColor="#0b0805" />
            </RadialGradient>

            {/* Gradientes radiales para mapa de calor (Heatmap) */}
            <RadialGradient id="orangeGlow" cx="50%" cy="50%" rx="50%" ry="50%">
              <Stop offset="0%" stopColor="#f97316" stopOpacity="0.35" />
              <Stop offset="30%" stopColor="#f97316" stopOpacity="0.15" />
              <Stop offset="70%" stopColor="#f97316" stopOpacity="0.04" />
              <Stop offset="100%" stopColor="#f97316" stopOpacity="0" />
            </RadialGradient>

            <RadialGradient id="greenGlow" cx="50%" cy="50%" rx="50%" ry="50%">
              <Stop offset="0%" stopColor="#22c55e" stopOpacity="0.35" />
              <Stop offset="30%" stopColor="#22c55e" stopOpacity="0.15" />
              <Stop offset="70%" stopColor="#22c55e" stopOpacity="0.04" />
              <Stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
            </RadialGradient>

            <RadialGradient id="yellowGlow" cx="50%" cy="50%" rx="50%" ry="50%">
              <Stop offset="0%" stopColor="#fbbf24" stopOpacity="0.35" />
              <Stop offset="30%" stopColor="#fbbf24" stopOpacity="0.15" />
              <Stop offset="70%" stopColor="#fbbf24" stopOpacity="0.04" />
              <Stop offset="100%" stopColor="#fbbf24" stopOpacity="0" />
            </RadialGradient>
          </Defs>

          {/* Rellenar fondo */}
          <Rect width="100%" height="100%" fill="url(#bgGrad)" />

          {/* Líneas de cuadrícula del mapa (estilo de coordenadas geográficas premium) */}
          {[1, 2, 3, 4].map((i) => {
            const yPos = (SCREEN_HEIGHT / 5) * i;
            return (
              <Line
                key={`grid-h-${i}`}
                x1="0"
                y1={yPos}
                x2={SCREEN_WIDTH}
                y2={yPos}
                stroke="rgba(255,255,255,0.02)"
                strokeWidth="1"
                strokeDasharray="4, 4"
              />
            );
          })}
          {[1, 2, 3, 4].map((i) => {
            const xPos = (SCREEN_WIDTH / 5) * i;
            return (
              <Line
                key={`grid-v-${i}`}
                x1={xPos}
                y1="0"
                x2={xPos}
                y2={SCREEN_HEIGHT}
                stroke="rgba(255,255,255,0.02)"
                strokeWidth="1"
                strokeDasharray="4, 4"
              />
            );
          })}

          {/* Renderizado de las zonas de mapa de calor (Heatmap) */}
          {heatmapPoints.map((point, index) => (
            <React.Fragment key={`heatmap-${index}`}>
              {/* Círculo de calor exterior grande */}
              <Circle
                cx={point.x}
                cy={point.y}
                r={point.isDecoration ? 65 : 95}
                fill={`url(#${point.glowId})`}
              />
              
              {/* Núcleo de calor medio */}
              <Circle
                cx={point.x}
                cy={point.y}
                r={point.isDecoration ? 25 : 35}
                fill={`url(#${point.glowId})`}
                opacity={0.8}
              />

              {/* Punto de marcador central sólido (solo para avistamientos reales, no decoraciones) */}
              {!point.isDecoration && (
                <>
                  {/* Pequeño anillo brillante alrededor del punto */}
                  <Circle
                    cx={point.x}
                    cy={point.y}
                    r={9}
                    stroke={point.solid}
                    strokeWidth="1"
                    fill="transparent"
                    opacity={0.6}
                  />
                  {/* Punto central */}
                  <Circle
                    cx={point.x}
                    cy={point.y}
                    r={4}
                    fill={point.solid}
                  />
                </>
              )}
            </React.Fragment>
          ))}
        </Svg>
      </View>

      <SafeAreaView style={styles.safeArea}>
        {loading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#f97316" />
          </View>
        ) : (
          <View style={styles.contentContainer}>
            {/* Panel de Avistamientos flotante estilo translúcido */}
            <View style={styles.overlayCard}>
              <Text style={styles.overlayTitle}>Avistamientos - Guayana</Text>
              <View style={styles.dotsContainer}>
                <View style={[styles.dot, { backgroundColor: '#fbbf24' }]} />
                <View style={[styles.dot, { backgroundColor: '#22c55e' }]} />
                <View style={[styles.dot, { backgroundColor: '#f97316' }]} />
              </View>
            </View>
          </View>
        )}

        {/* Barra de navegación inferior */}
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
  safeArea: {
    flex: 1,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 110, // Dejar espacio para BottomNav
  },
  overlayCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(29, 21, 13, 0.88)',
    borderRadius: 24,
    paddingVertical: 18,
    paddingHorizontal: 24,
    marginHorizontal: 20,
    borderWidth: 1.5,
    borderColor: 'rgba(77, 58, 36, 0.4)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 8,
  },
  overlayTitle: {
    color: '#f3ece0',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
