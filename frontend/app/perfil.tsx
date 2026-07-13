import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import ProfileScreen from '../src/presentation/components/feature/profile/ProfileScreen';
import { ObtenerPerfilUseCase } from '../src/application/useCases/ObtenerPerfilUseCase';
import { MockPerfilRepository } from '../src/infrastructure/adapters/mock/perfil/MockPerfilRepository';

export default function PerfilScreen() {
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const obtenerPerfil = async () => {
      const useCase = new ObtenerPerfilUseCase(new MockPerfilRepository());

      const resultado = await useCase.execute();
      setProfile(resultado);
    };

    void obtenerPerfil();
  }, []);

  if (!profile) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6b5425" />
      </View>
    );
  }

  return <ProfileScreen profile={profile} />;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f7f0df',
  },
});
