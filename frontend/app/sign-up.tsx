import React from 'react';
import { Stack, useRouter } from 'expo-router';
import SignUpPage from '../src/presentation/components/feature/auth/SignUpPage';

export default function SignUpRoute() {
  const router = useRouter();

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SignUpPage 
        onNavigateToLogin={() => {
          if (router.canGoBack()) {
            router.back();
          } else {
            router.replace('/');
          }
        }} 
      />
    </>
  );
}