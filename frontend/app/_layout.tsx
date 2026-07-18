import React, { useEffect } from "react";
import { Stack } from "expo-router";
import { MediaPickerProvider } from "../src/infrastructure/adapters/hardware/ExpoCameraModal";
// Imports de sincronización comentados temporalmente para usar Expo Go
// import { SincronizarNubeUseCase } from "../src/application/useCases/SincronizarNube";
// import { ApiSyncAdapter } from "../src/infrastructure/adapters/api/ApiSyncAdapter";

// IMPORTANTE: Idealmente el Token vendrá de tu AuthContext o Supabase Auth.
// Por ahora simularemos una función getToken.
const getSessionToken = async () => {
  // Aquí debes retornar el JWT real del usuario logueado en la app
  return "TU_JWT_AQUI"; 
};

export default function Layout() {
  // TODO: Sincronización con WatermelonDB temporalmente deshabilitada
  // para permitir depuración de UI en Expo Go.
  // Se reactivará cuando se compile el cliente de desarrollo nativo.
  
  useEffect(() => {
    // Aquí iba la inicialización de SincronizarNubeUseCase
  }, []);

  return (
    <MediaPickerProvider>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="perfil" options={{ headerShown: false }} />
        <Stack.Screen name="avistamiento" options={{ headerShown: false }} />
        <Stack.Screen name="detalle/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="crear-proyecto" options={{ headerShown: false }} />
        <Stack.Screen name="proyecto/[id]" options={{ headerShown: false }} />
      </Stack>
    </MediaPickerProvider>
  );
}
