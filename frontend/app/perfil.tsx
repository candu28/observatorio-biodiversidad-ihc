import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import ProfileScreen from '../src/presentation/components/feature/profile/ProfileScreen';
import { ObtenerPerfilUseCase, PerfilViewModel } from '../src/application/useCases/ObtenerPerfilUseCase';
import { MockPerfilUsuarioRepository } from '../src/infrastructure/adapters/mock/perfil/MockPerfilUsuarioRepository';
import { MockPerfilAvistamientosRepository } from '../src/infrastructure/adapters/mock/perfil/MockPerfilAvistamientosRepository';
import { MockPerfilProyectosRepository } from '../src/infrastructure/adapters/mock/perfil/MockPerfilProyectosRepository';

export default function PerfilScreen() {
  const [profile, setProfile] = useState<PerfilViewModel | null>(null);

  useEffect(() => {
    const obtenerPerfil = async () => {
      const useCase = new ObtenerPerfilUseCase(
        new MockPerfilUsuarioRepository(),
        new MockPerfilAvistamientosRepository(),
        new MockPerfilProyectosRepository(),
      );

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
