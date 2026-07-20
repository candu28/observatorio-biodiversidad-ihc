import React from 'react';
import { Stack } from 'expo-router';
import MapaScreen from '../src/presentation/components/feature/map/MapaScreen';

export default function MapaRoute() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <MapaScreen />
    </>
  );
}
