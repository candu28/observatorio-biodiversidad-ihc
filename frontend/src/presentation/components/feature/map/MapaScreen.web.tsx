// MapaScreen.web.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function MapaScreen() {
  return (
    <View style={styles.container}>
      <Text>Maps are not supported on the web version of this app.</Text>
      {/* Alternatively, implement a web map here using react-leaflet or google-map-react */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
});