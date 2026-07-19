import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  KeyboardAvoidingView, 
  Platform,
  ActivityIndicator,
  ScrollView,
  ImageBackground
} from 'react-native';
import { useSignUpViewModel } from '../../../viewModels/auth/useSignUpViewModel';
import { Leaf, Mail, Lock, Eye, EyeOff } from 'lucide-react-native';

interface SignUpPageProps {
  onNavigateToLogin: () => void;
}

export default function SignUpPage({ onNavigateToLogin }: SignUpPageProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const { 
    email, setEmail, 
    password, setPassword, 
    confirmPassword, setConfirmPassword,
    isLoading, error, successMessage, validationErrors,
    handleSignUp 
  } = useSignUpViewModel(onNavigateToLogin);

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
        
        {/* <View style={styles.header}>
            <View style={styles.logoContainer}>
            <Leaf size={28} color="#4d7c0f" strokeWidth={2.5} />
            <Text style={styles.logoText}>guaya</Text>
          </View>
        </View> */}
        <View style={styles.headerContainer}>
                  <ImageBackground 
                    source={require('../../../../../assets/login.png')} 
                    style={styles.liquidHeader}
                    resizeMode="cover"
                  />
                </View>
        <View style={styles.formContent}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Sign up</Text>
            <View style={styles.titleUnderline} />
          </View>

          {error ? (
            <View style={styles.errorBanner}>
              <Text style={styles.errorBannerText}>{error}</Text>
            </View>
          ) : null}

          {successMessage ? (
            <View style={styles.successBanner}>
              <Text style={styles.successBannerText}>{successMessage}</Text>
            </View>
          ) : null}

          {/* Email */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <View style={[styles.inputWrapper, validationErrors?.email ? styles.inputWrapperError : styles.inputWrapperFocused]}>
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
              />
            </View>
            {validationErrors?.email && <Text style={styles.errorText}>{validationErrors.email}</Text>}
          </View>

          {/* Password */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <View style={[styles.inputWrapper, validationErrors?.password ? styles.inputWrapperError : null]}>
              <Lock size={18} color="#999" style={styles.icon} />
              <TextInput 
                style={styles.input}
                placeholder="Enter password"
                placeholderTextColor="#bbb"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!isPasswordVisible}
                editable={!isLoading}
              />
              <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
                {isPasswordVisible ? (
                  <Eye size={18} color="#999" style={styles.iconRight} />
                ) : (
                  <EyeOff size={18} color="#999" style={styles.iconRight} />
                )}
              </TouchableOpacity>
            </View>
            {validationErrors?.password && <Text style={styles.errorText}>{validationErrors.password}</Text>}
          </View>

          {/* Confirm Password */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Confirm Password</Text>
            <View style={[styles.inputWrapper, validationErrors?.confirmPassword ? styles.inputWrapperError : null]}>
              <Lock size={18} color="#999" style={styles.icon} />
              <TextInput 
                style={styles.input}
                placeholder="Repeat password"
                placeholderTextColor="#bbb"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!isPasswordVisible}
                editable={!isLoading}
              />
            </View>
            {validationErrors?.confirmPassword && <Text style={styles.errorText}>{validationErrors.confirmPassword}</Text>}
          </View>

          {/* Action Buttons */}
          <TouchableOpacity 
            style={[styles.btnLogin, isLoading && styles.btnLoginDisabled]} 
            onPress={handleSignUp}
            disabled={isLoading}
          >
            {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnLoginText}>Sign Up</Text>}
          </TouchableOpacity>

          <Text style={styles.signupText}>
            Already have an Account? <Text style={styles.signupLink} onPress={onNavigateToLogin}>Sign in</Text>
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
  header: {
    alignItems: 'center',
    marginLeft: -35,
    paddingHorizontal: 20,
    paddingVertical: 50,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoText: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1f2937',
    letterSpacing: -0.5,
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
  successBanner: { 
    backgroundColor: '#e0fcdc', 
    padding: 12, 
    borderRadius: 8, 
    marginBottom: 20,
},
  successBannerText: { color: '#166534', fontSize: 13, fontWeight: '500', textAlign: 'center' },
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