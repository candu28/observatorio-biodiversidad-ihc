import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ImageBackground, 
  KeyboardAvoidingView, 
  Platform,
  ActivityIndicator,
  ScrollView
} from 'react-native';
import { useLoginViewModel } from '../../../viewModels/auth/useLoginViewModel';
import { Leaf, Mail, Lock, Eye, EyeOff } from 'lucide-react-native';

interface LoginPageProps {
  onSkip: () => void;
  onNavigateToSignUp: () => void;
  onNavigateToForgotPassword: () => void;
}

export default function LoginPage({ 
  onSkip, 
  onNavigateToSignUp, 
  onNavigateToForgotPassword 
}: LoginPageProps) {
  // Component UI-only state
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const { 
    email, setEmail, 
    password, setPassword, 
    rememberMe, setRememberMe,
    isLoading, error, validationErrors,
    handleLogin, handleSkip 
  } = useLoginViewModel(onSkip);

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={styles.container}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        bounces={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Curved Header Banner */}
        <View style={styles.headerContainer}>
          <ImageBackground 
            source={require('../../../../../assets/login.png')} 
            style={styles.liquidHeader}
            resizeMode="cover"
          />
        </View>

        <View style={styles.formContent}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Sign in</Text>
            <View style={styles.titleUnderline} />
          </View>

          {/* Global Server Error Banner */}
          {error ? (
            <View style={styles.errorBanner}>
              <Text style={styles.errorBannerText}>{error}</Text>
            </View>
          ) : null}

          {/* Email Input Group */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <View style={[
              styles.inputWrapper, 
              validationErrors?.email ? styles.inputWrapperError : styles.inputWrapperFocused
            ]}>
              <Mail size={18} color="#999" style={styles.icon} />
              <TextInput 
                style={styles.input}
                placeholder="demo@email.com"
                placeholderTextColor="#bbb"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!isLoading}
                textContentType="emailAddress"
              />
            </View>
            {validationErrors?.email ? (
              <Text style={styles.errorText}>{validationErrors.email}</Text>
            ) : null}
          </View>

          {/* Password Input Group */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <View style={[
              styles.inputWrapper,
              validationErrors?.password ? styles.inputWrapperError : null
            ]}>
              <Lock size={18} color="#999" style={styles.icon} />
              <TextInput 
                style={styles.input}
                placeholder="enter your password"
                placeholderTextColor="#bbb"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!isPasswordVisible}
                editable={!isLoading}
                textContentType="password"
              />
              <TouchableOpacity 
                onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              >
                <Text style={styles.icon}>{isPasswordVisible ? (
                                  <Eye size={18} color="#999" style={styles.iconRight} />
                                ) : (
                                  <EyeOff size={18} color="#999" style={styles.iconRight} />
                                )}</Text>
              </TouchableOpacity>
            </View>
            {validationErrors?.password ? (
              <Text style={styles.errorText}>{validationErrors.password}</Text>
            ) : null}
          </View>

          {/* Options Row */}
          <View style={styles.optionsRow}>
            <TouchableOpacity 
              style={styles.rememberMe} 
              onPress={() => setRememberMe?.(!rememberMe)}
              disabled={isLoading}
              activeOpacity={0.7}
            >
               <View style={[styles.checkbox, rememberMe && styles.checkboxActive]}>
                 {rememberMe && <Text style={styles.checkmark}>✓</Text>}
               </View>
               <Text style={styles.optionsText}>Remember Me</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              onPress={onNavigateToForgotPassword}
              disabled={isLoading}
            >
              <Text style={styles.forgotPassword}>Forgot Password?</Text>
            </TouchableOpacity>
          </View>

          {/* Action Buttons */}
          <TouchableOpacity 
            style={[styles.btnLogin, isLoading && styles.btnLoginDisabled]} 
            onPress={handleLogin}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            {isLoading ? (
              <ActivityIndicator color="#ffffff" size="small" />
            ) : (
              <Text style={styles.btnLoginText}>Login</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.btnSkip} 
            onPress={handleSkip}
            disabled={isLoading}
          >
            <Text style={styles.btnSkipText}>Skip & Continue as Guest</Text>
          </TouchableOpacity>

          {/* Sign Up Link */}
          <Text style={styles.signupText}>
            Don't have an Account ?{' '}
            <Text 
              style={styles.signupLink} 
              onPress={onNavigateToSignUp}
            >
              Sign up
            </Text>
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fcfcfc',
  },
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#fcfcfc',
  },
  headerContainer: {
    height: 300,
    width: '100%',
    overflow: 'hidden',
  },
  liquidHeader: {
    width: '100%',
    height: '100%',
  },
  formContent: {
    flex: 1,
    paddingHorizontal: 40,
    paddingBottom: 30,
    marginTop: -20,
  },
  titleContainer: {
    marginBottom: 25,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#333',
  },
  titleUnderline: {
    width: 60,
    height: 4,
    backgroundColor: '#4d7c0f',
    marginTop: 5,
    borderRadius: 2,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#eee',
    paddingBottom: 5,
  },
  inputWrapperFocused: {
    borderBottomColor: '#4d7c0f',
  },
  inputWrapperError: {
    borderBottomColor: '#ef4444',
  },
  icon: {
    fontSize: 18,
    color: '#999',
    marginRight: 10,
  },
  iconRight: {
    marginLeft: 10,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    paddingVertical: 5,
  },
  errorText: {
    color: '#ef4444',
    fontSize: 12,
    marginTop: 4,
  },
  errorBanner: {
    backgroundColor: '#fee2e2',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  errorBannerText: {
    color: '#991b1b',
    fontSize: 13,
    fontWeight: '500',
    textAlign: 'center',
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 35,
  },
  rememberMe: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 18,
    height: 18,
    borderWidth: 1,
    borderColor: '#4d7c0f',
    borderRadius: 4,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxActive: {
    backgroundColor: '#4d7c0f',
  },
  checkmark: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },
  optionsText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
  },
  forgotPassword: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4d7c0f',
  },
  btnLogin: {
    backgroundColor: '#4d7c0f',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#4d7c0f',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  btnLoginDisabled: {
    backgroundColor: '#a3e635',
    opacity: 0.6,
  },
  btnLoginText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  btnSkip: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    marginBottom: 25,
  },
  btnSkipText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '600',
  },
  signupText: {
    textAlign: 'center',
    fontSize: 13,
    color: '#888',
  },
  signupLink: {
    color: '#4d7c0f',
    fontWeight: '600',
  },
});