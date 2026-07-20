import { useState } from 'react';
import { SignUpUseCase } from '../../../../src/application/useCases/SignUpUseCase';
import { ValidationException } from '../../../../src/application/useCases/LoginUseCase';
import { SupabaseAuthAdapter } from '../../../infrastructure/auth/SupabaseAuthAdapter';

const authAdapter = new SupabaseAuthAdapter();
const signUpUseCase = new SignUpUseCase(authAdapter);

export const useSignUpViewModel = (onNavigateToLogin: () => void) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string> | null>(null);

  const handleSignUp = async () => {
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);
    setValidationErrors(null);

    try {
      const success = await signUpUseCase.execute(email, password, confirmPassword);
      
      if (success) {
        // Supabase requires email verification by default.
        setSuccessMessage('Account created! Please check your email to verify your account.');
        // Optionally clear the form
        setEmail('');
        setPassword('');
        setConfirmPassword('');
      }
    } catch (err: any) {
      if (err instanceof ValidationException || err.name === 'ValidationException') {
        setValidationErrors(err.validationErrors);
      } else {
        setError(err.message || 'An unexpected error occurred during sign up.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    email, setEmail,
    password, setPassword,
    confirmPassword, setConfirmPassword,
    isLoading,
    error,
    successMessage,
    validationErrors,
    handleSignUp,
    onNavigateToLogin
  };
};