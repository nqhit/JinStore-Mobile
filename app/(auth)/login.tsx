import { styles } from '@/assets/styles/Screen/FormScreen.styles';
import ButtonLoginSocial from '@/components/Button/LoginSocial';
import FormInputGroup from '@/components/Form/FormInput';
import FText from '@/components/Text';
import { loginFormData } from '@/interfaces/auth.type';
import { useAuth } from '@/server/hooks/useAuth';
import { passwordRegex, validateEmail, validateUsername } from '@/utils/regex';
import { router, useFocusEffect, useNavigation } from 'expo-router';
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

  useEffect(() => {
    navigation.setOptions({
      gestureEnabled: false,
    });
  }, [navigation]);

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => true; // <- return true để chặn
      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => subscription.remove();
    }, []),
  );

  const handleNavigateToRegister = useCallback(() => {
    if (isNavigating) return;

    setIsNavigating(true);
    router.push('/register');

    setTimeout(() => {
      setIsNavigating(false);
    }, 1000);
  }, [isNavigating]);

  const handleLogin = useCallback(
    async (values: loginFormData) => {
      setIsLoading(true);
      try {
        await login(values);
      } catch (error) {
        console.error('Login error in component:', error);
      } finally {
        setIsLoading(false);
      }
    },
    [login],
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
                  />
                )}
              </Formik>

              <View style={styles.forgotPasswordContainer}>
                <TouchableOpacity>
                  <FText style={styles.forgotPasswordText}>Quên mật khẩu?</FText>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.footer}>
              <ButtonLoginSocial nameIcon="google" textBtn="Đăng nhập với Google" />
            </View>

            <View style={styles.registerContainer}>
              <FText>Chưa có tài khoản? </FText>
              <TouchableOpacity onPress={handleNavigateToRegister} disabled={isNavigating} activeOpacity={0.7}>
                <FText style={[styles.registerLink, isNavigating && { opacity: 0.5 }]}>Đăng ký ngay</FText>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;
