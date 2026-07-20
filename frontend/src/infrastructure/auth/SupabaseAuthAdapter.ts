import { AuthRepository } from '../../application/ports/IAuthRepository';
import { supabase } from '../supabase/client';

export class SupabaseAuthAdapter implements AuthRepository {
  
  async loginWithPassword(email: string, password: string): Promise<boolean> {
    const { error } = await supabase.auth.signInWithPassword({ 
      email,
      password
    });
    
    if (error) {
      // Throwing the error directly allows the ViewModel to catch it 
      // and display Supabase's native message (e.g., "Invalid login credentials")
      throw new Error(error.message);
    }
    
    return true;
  }

  async signUp(email: string, password: string): Promise<boolean> {
    const { error } = await supabase.auth.signUp({
      email,
      password
    });

    if (error) {
      throw new Error(error.message);
    }

    return true;
  }

  async resetPassword(email: string): Promise<boolean> {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      // Replaces the placeholder scheme; update 'myapp' to match your app.json scheme
      // This allows Expo deep linking to intercept the user when they click the email link
      redirectTo: 'myapp://reset-password', 
    });

    if (error) {
      throw new Error(error.message);
    }

    return true;
  }
}
