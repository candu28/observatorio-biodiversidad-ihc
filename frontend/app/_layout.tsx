import { Stack } from "expo-router";
import { MediaPickerProvider } from "../src/infrastructure/adapters/hardware/ExpoCameraModal";

export default function Layout() {
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
