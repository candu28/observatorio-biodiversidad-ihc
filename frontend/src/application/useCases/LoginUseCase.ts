import { AuthRepository } from '../../application/ports/IAuthRepository';

// Define a structured error class to pass validation details back to the ViewModel
export class ValidationException extends Error {
  public validationErrors: Record<string, string>;

  constructor(errors: Record<string, string>) {
    super('Validation failed');
    this.name = 'ValidationException';
    this.validationErrors = errors;
  }
}

export class LoginUseCase {
  constructor(private authRepository: AuthRepository) {}

  async execute(email?: string, password?: string): Promise<boolean> {
    const errors: Record<string, string> = {};

    // 1. Email Validation
    if (!email || email.trim() === '') {
      errors.email = 'Email is required.';
    } else {
      // Standard RFC 5322 regex for email validation
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

    // 3. Halt and throw if local validation fails
    if (Object.keys(errors).length > 0) {
      throw new ValidationException(errors);
    }

    // 4. Delegate to the Infrastructure layer via the Port
    // Note: We are switching from the prototype's loginWithEmail to loginWithPassword
    return await this.authRepository.loginWithPassword(email!.trim(), password!);
  }
}