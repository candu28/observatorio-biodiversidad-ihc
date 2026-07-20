import { useState } from 'react';
import { LoginUseCase, ValidationException } from '../../../../src/application/useCases/LoginUseCase';
import { SupabaseAuthAdapter } from '../../../infrastructure/auth/SupabaseAuthAdapter';

// Wiring the layers together
const authAdapter = new SupabaseAuthAdapter();
const loginUseCase = new LoginUseCase(authAdapter);

export const useLoginViewModel = (onSkip: () => void) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // UI state for the checkbox (Supabase handles the actual session cache)
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string> | null>(null);

  const handleLogin = async () => {
    // Reset previous errors and start loading
    setIsLoading(true);
    setError(null);
    setValidationErrors(null);

    try {
      // Execute the UseCase with both email and password
      const success = await loginUseCase.execute(email, password);
      
      if (success) {
        // App routing is automatically handled by the onAuthStateChange 
        // listener in index.tsx once Supabase caches the new session.
      }
    } catch (err: any) {
      // Differentiate between local validation errors and backend/server errors
      if (err instanceof ValidationException || err.name === 'ValidationException') {
        setValidationErrors(err.validationErrors);
      } else {
        setError(err.message || 'An unexpected error occurred during login.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    rememberMe,
    setRememberMe,
    isLoading,
    error,
    validationErrors,
    handleLogin,
    handleSkip: onSkip,
  };
};