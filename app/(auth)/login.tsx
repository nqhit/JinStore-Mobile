import { styles } from '@/assets/styles/Screen/FormScreen.styles';
import ButtonLoginSocial from '@/components/Button/LoginSocial';
import FormInputGroup from '@/components/Form/FormInput';
import FText from '@/components/Text';
import { COLORS } from '@/constants/Colors';
import { useSingledPush } from '@/hooks/useSignlePush';
import { loginFormData } from '@/interfaces/auth.type';
import { useAuth } from '@/server/hooks/useAuth';
import { passwordRegex, validateEmail, validateUsername } from '@/utils/regex';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from 'expo-router';
import { Formik } from 'formik';
import React, { useCallback, useEffect, useState } from 'react';
import { BackHandler, Image, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as yup from 'yup';

const LoginSchema = yup.object().shape({
  usernameOrEmail: yup
    .string()
    .test('is-username-or-email', 'Phải là email hoặc tên đăng nhập hợp lệ', (value) => {
      if (!value) return false;
      return validateEmail(value) || validateUsername(value);
    })
    .required('Vui lòng nhập email hoặc tên đăng nhập'),
  password: yup
    .string()
    .min(8, 'Tối thiểu 8 ký tự')
    .matches(
      passwordRegex,
      'Mật khẩu phải bao gồm 8 ký tự, ít nhất 1 ký tự hoa, 1 ký tự thường, 1 ký tự số, 1 ký tự đặc biệt',
    )
    .required('Vui lòng nhập mật khẩu'),
});

const LoginScreen = () => {
  const navigation = useNavigation();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const singlePush = useSingledPush();

  useEffect(() => {
    navigation.setOptions({
      gestureEnabled: false,
    });
  }, [navigation]);

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => true;
      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => subscription.remove();
    }, []),
  );

  const handleNavigateToRegister = useCallback(() => {
    singlePush('/register');
  }, [singlePush]);

  const handleNavigateToForgot = useCallback(() => {
    singlePush('/ActionsPassword', {
      showCurrentPassword: false,
    });
  }, [singlePush]);

  const handleLogin = useCallback(
    async (values: loginFormData) => {
      setIsLoading(true);
      try {
        await login({ ...values, rememberMe });
      } catch (error) {
        console.error('Login error in component:', error);
      } finally {
        setIsLoading(false);
      }
    },
    [login, rememberMe],
  );

  return (
    <SafeAreaView style={[styles.container, { marginTop: 10 }]} edges={['top', 'left', 'right', 'bottom']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            <View style={styles.body}>
              <View style={styles.headerLogo}>
                <Image source={require('@/assets/images/logo.png')} style={styles.logo} />
              </View>

              <View style={styles.headerWelcome}>
                <FText style={styles.titleWelcome}>Chào mừng đến với JinStore</FText>
                <FText style={styles.subtitle}>Trải nghiệm mua sắm tiện lợi, thông minh</FText>
              </View>

              <Formik
                initialValues={{ usernameOrEmail: '', password: '' }}
                validationSchema={LoginSchema}
                validateOnMount
                onSubmit={(values) => handleLogin(values)}
              >
                {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isValid }) => (
                  <FormInputGroup
                    inputs={[
                      {
                        placeholder: 'Email hoặc tên đăng nhập',
                        keyboardType: 'email-address',
                        value: values.usernameOrEmail,
                        onChangeText: handleChange('usernameOrEmail'),
                        onBlur: handleBlur('usernameOrEmail'),
                        error: errors.usernameOrEmail,
                        touched: touched.usernameOrEmail,
                      },
                      {
                        placeholder: 'Mật khẩu',
                        value: values.password,
                        onChangeText: handleChange('password'),
                        onBlur: handleBlur('password'),
                        error: errors.password,
                        touched: touched.password,
                        secureTextEntry: true,
                      },
                    ]}
                    button={{ isFormValid: isValid, isLoading, handleFunc: handleSubmit }}
                    text="Đăng nhập"
                  >
                    <View style={styles.bottomForm}>
                      <View style={styles.rememberMeContainer}>
                        <TouchableOpacity
                          onPress={() => setRememberMe((prev) => !prev)}
                          style={{ marginRight: 5 }}
                          accessibilityRole="checkbox"
                          accessibilityState={{ checked: rememberMe }}
                        >
                          <Ionicons
                            name={rememberMe ? 'checkbox-sharp' : 'square-outline'}
                            size={20}
                            color={rememberMe ? COLORS.primary : '#8E8E93'}
                          />
                        </TouchableOpacity>
                        <FText>Lưu đăng nhập</FText>
                      </View>
                      <View style={styles.forgotPasswordContainer}>
                        <TouchableOpacity onPress={handleNavigateToForgot}>
                          <FText style={styles.forgotPasswordText}>Quên mật khẩu?</FText>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </FormInputGroup>
                )}
              </Formik>
            </View>

            <View style={styles.footer}>
              <ButtonLoginSocial nameIcon="google" textBtn="Đăng nhập với Google" />
            </View>

            <View style={styles.registerContainer}>
              <FText>Chưa có tài khoản? </FText>
              <TouchableOpacity onPress={handleNavigateToRegister}>
                <FText style={styles.registerLink}>Đăng ký ngay</FText>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;
