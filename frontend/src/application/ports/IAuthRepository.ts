export interface AuthRepository {
  /**
   * Authenticates a user using their email and password.
   * Replaces the prototype's magic link SMTP test.
   * 
   * @param email - The user's validated email address.
   * @param password - The user's plain-text password.
   * @returns A promise that resolves to true if login is successful.
   * @throws Error if the credentials are invalid or a network issue occurs.
   */
  loginWithPassword(email: string, password: string): Promise<boolean>;

  /**
   * Registers a new user account.
   * 
   * @param email - The new user's email address.
   * @param password - The new user's chosen password.
   * @returns A promise that resolves to true if registration is successful.
   */
  signUp(email: string, password: string): Promise<boolean>;

  /**
   * Triggers a password reset email for users who forgot their credentials.
   * 
   * @param email - The email address associated with the account.
   * @returns A promise that resolves to true if the request was sent successfully.
   */
  resetPassword(email: string): Promise<boolean>;
}