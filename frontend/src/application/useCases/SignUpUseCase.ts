import { AuthRepository } from '../ports/IAuthRepository';
// Reusing the exception class we built in the LoginUseCase
import { ValidationException } from './LoginUseCase';

export class SignUpUseCase {
  constructor(private authRepository: AuthRepository) {}

  async execute(email?: string, password?: string, confirmPassword?: string): Promise<boolean> {
    const errors: Record<string, string> = {};

    // 1. Email Validation
    if (!email || email.trim() === '') {
      errors.email = 'Email is required.';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        errors.email = 'Please enter a valid email address.';
      }
    }

    // 2. Password Validation
    if (!password || password.trim() === '') {
      errors.password = 'Password is required.';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters.';
    }

    // 3. Confirm Password Match
    if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match.';
    }

    // 4. Halt and throw if local validation fails
    if (Object.keys(errors).length > 0) {
      throw new ValidationException(errors);
    }

    // 5. Delegate to Infrastructure layer
    return await this.authRepository.signUp(email!.trim(), password!);
  }
}