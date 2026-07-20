import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '../src/infrastructure/supabase/client';
import LoginPage from '../src/presentation/components/feature/auth/LoginPage';
import HomePage from '../src/presentation/components/feature/homepage/HomePage';

let globalIsGuest = false;

export default function IndexRoute() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(globalIsGuest);
  
  // Initialize Expo Router to handle our new navigational pathways
  const router = useRouter();

  useEffect(() => {
    // Check active session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Listen for auth changes (Login, Logout, Token Refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4d7c0f" />
      </View>
    );
  }

  // If user is authenticated or chose to skip as guest
  if (session || isGuest) {
    return <HomePage />;
  }

  // If not authenticated, show Login and pass the new routing functions
  return (
    <LoginPage 
      onSkip={() => {
        globalIsGuest = true;
        setIsGuest(true);
      }} 
      onNavigateToSignUp={() => router.push('/sign-up')} 
      onNavigateToForgotPassword={() => router.push('/forgot-password')} 
    />
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fdf7e3', // Matches your LoginPage background
  },
});