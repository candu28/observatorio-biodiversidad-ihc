import React, { useEffect } from "react";
import { Stack } from "expo-router";
import { MediaPickerProvider } from "../src/infrastructure/adapters/hardware/ExpoCameraModal";
import { SincronizarNubeUseCase } from "../src/application/useCases/SincronizarNube";
import { ApiSyncAdapter } from "../src/infrastructure/adapters/api/ApiSyncAdapter";
import { supabase } from "../src/infrastructure/supabase/client";

const getSessionToken = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.access_token || null;
};

export default function Layout() {

  useEffect(() => {
    const syncData = async () => {
      try {
        const syncAdapter = new ApiSyncAdapter("https://observatorio-biodiversidad-ihc.onrender.com/api", getSessionToken);
        const syncUseCase = new SincronizarNubeUseCase(syncAdapter);
        await syncUseCase.execute();
      } catch (error) {
        console.error("Error en sincronización silenciosa:", error);
      }
    };
    
    void syncData();
  }, []);

  return (
    <MediaPickerProvider>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="perfil" options={{ headerShown: false }} />
        <Stack.Screen name="avistamiento" options={{ headerShown: false }} />
        <Stack.Screen name="detalle/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="observaciones/[especieId]" options={{ headerShown: false }} />
      </Stack>
    </MediaPickerProvider>
  );
}
