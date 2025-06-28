import { styles } from '@/assets/styles/Screen/FormScreen.styles';
import ButtonLoginSocial from '@/components/Button/LoginSocial';
import FormInputGroup from '@/components/Form/FormInput';
import React, { useMemo, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
interface RegisterFormData {
  fullName: string;
  username: string;
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
  const [username, setUsername] = useState<RegisterFormData['username']>('');
  const [email, setEmail] = useState<RegisterFormData['email']>('');
  const [password, setPassword] = useState<RegisterFormData['password']>('');
  const [confirmPassword, setConfirmPassword] = useState<RegisterFormData['confirmPassword']>('');
  const [isLoading, setIsLoading] = useState(false);

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
      console.error('Registration error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
        <KeyboardAvoidingView style={{ flex: 1 }} keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}>
          <ScrollView
            contentContainerStyle={{
              flex: 1,
              justifyContent: 'center',
            }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/*             <View style={styles.header}>
              <TouchableOpacity onPress={() => router.back()}>
                <Ionicons name="chevron-back" size={26} color="black" />
              </TouchableOpacity>
              <FText style={styles.title}>Đăng ký</FText>
            </View> */}
            <View style={styles.container}>
              {/* Main Content */}
              <View style={styles.contentContainer}>
                <FormInputGroup
                  inputs={[
                    {
                      placeholder: 'Họ và tên',
                      value: fullName,
                      onChangeText: setFullName,
                      autoCapitalize: 'words',
                      editable: !isLoading,
                    },
                    {
                      placeholder: 'Tên đăng nhập',
                      value: username,
                      onChangeText: setUsername,
                      autoCapitalize: 'words',
                      editable: !isLoading,
                    },
                    {
                      placeholder: 'Email',
                      value: email,
                      onChangeText: setEmail,
                      keyboardType: 'email-address',
                      editable: !isLoading,
                    },
                    {
                      placeholder: 'Mật khẩu',
                      value: password,
                      onChangeText: setPassword,
                      secureTextEntry: true,
                      editable: !isLoading,
                    },
                    {
                      placeholder: 'Xác nhận mật khẩu',
                      value: confirmPassword,
                      onChangeText: setConfirmPassword,
                      secureTextEntry: true,
                      editable: !isLoading,
                    },
                  ]}
                  button={{ isFormValid, isLoading, handleFunc: handleRegister }}
                  text="Đăng ký"
                />
              </View>

              {/* Footer */}
              <View style={styles.footer}>
                <ButtonLoginSocial nameIcon="google" textBtn="Đăng ký với Google" />
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
};

export default RegisterScreen;
