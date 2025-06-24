import { styles } from '@/assets/styles/Screen/LoginScreen.styles';
import { AntDesign } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface RegisterFormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

// Validation utilities
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

const validatePassword = (password: string): boolean => {
  return password.trim().length >= 6;
};

const validateFullName = (name: string): boolean => {
  return name.trim().length >= 2;
};

const RegisterScreen = () => {
  const [fullName, setFullName] = useState<RegisterFormData['fullName']>('');
  const [email, setEmail] = useState<RegisterFormData['email']>('');
  const [password, setPassword] = useState<RegisterFormData['password']>('');
  const [confirmPassword, setConfirmPassword] = useState<RegisterFormData['confirmPassword']>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);

  // Memoized validation
  const isFormValid = useMemo(() => {
    return (
      validateFullName(fullName) && validateEmail(email) && validatePassword(password) && password === confirmPassword
    );
  }, [fullName, email, password, confirmPassword]);

  const handleRegister = async () => {
    if (isLoading) return;

    if (password !== confirmPassword) {
      Alert.alert('Lỗi', 'Mật khẩu xác nhận không khớp!');
      return;
    }

    setIsLoading(true);

    try {
      // TODO: Implement actual registration logic
      Alert.alert('Thành công', 'Đăng ký thành công!');
    } catch (error) {
      Alert.alert('Lỗi', 'Đăng ký thất bại. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  // Debounced navigation to prevent multiple calls
  const handleNavigateToLogin = useCallback(() => {
    if (isNavigating) return;

    setIsNavigating(true);
    router.replace('/login');

    // Reset navigation state after a delay
    setTimeout(() => {
      setIsNavigating(false);
    }, 1000);
  }, [isNavigating]);

  return (
    <>
      <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
        >
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: 'center',
            }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.container}>
              {/* Main Content */}
              <View style={styles.contentContainer}>
                <Text style={styles.title}>Đăng ký</Text>

                {/* Full Name Input */}
                <TextInput
                  style={styles.input}
                  placeholder="Họ và tên"
                  placeholderTextColor="#999"
                  value={fullName}
                  onChangeText={setFullName}
                  autoCapitalize="words"
                  autoCorrect={false}
                  editable={!isLoading}
                />

                {/* Email Input */}
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  placeholderTextColor="#999"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!isLoading}
                />

                {/* Password Input */}
                <TextInput
                  style={styles.input}
                  placeholder="Mật khẩu"
                  placeholderTextColor="#999"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={true}
                  autoCapitalize="none"
                  editable={!isLoading}
                />

                {/* Confirm Password Input */}
                <TextInput
                  style={styles.input}
                  placeholder="Xác nhận mật khẩu"
                  placeholderTextColor="#999"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={true}
                  autoCapitalize="none"
                  editable={!isLoading}
                />

                {/* Register Button */}
                <TouchableOpacity
                  style={[styles.loginButton, (!isFormValid || isLoading) && styles.loginButtonDisabled]}
                  onPress={handleRegister}
                  disabled={!isFormValid || isLoading}
                  activeOpacity={0.8}
                >
                  {isLoading ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <Text style={styles.loginButtonText}>Đăng ký</Text>
                  )}
                </TouchableOpacity>
              </View>

              {/* Footer */}
              <View style={styles.footer}>
                <TouchableOpacity style={styles.socialLoginButton}>
                  <AntDesign name="google" size={20} color="#EA4335" style={styles.socialIcon} />
                  <Text style={styles.socialLoginButtonText}>Register with Google</Text>
                </TouchableOpacity>

                <View style={styles.registerContainer}>
                  <Text>Đã có tài khoản? </Text>
                  <TouchableOpacity onPress={handleNavigateToLogin} disabled={isNavigating} activeOpacity={0.7}>
                    <Text style={[styles.registerLink, isNavigating && { opacity: 0.5 }]}>Đăng nhập ngay</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
};

export default RegisterScreen;
