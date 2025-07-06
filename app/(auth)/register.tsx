import { styles } from '@/assets/styles/Screen/FormScreen.styles';
import ButtonLoginSocial from '@/components/Button/LoginSocial';
import FormInputGroup from '@/components/Form/FormInput';
import FText from '@/components/Text';
import { useKeyboardPadding } from '@/hooks/useKeyboardPadding';
import { registerFormData } from '@/interfaces/auth.type';
import { useAuth } from '@/server/hooks/useAuth';
import { fullnameRegex, passwordRegex, usernameRegex } from '@/utils/regex';
import { Formik } from 'formik';
import React, { useCallback, useState } from 'react';
import { Image, KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as yup from 'yup';

const RegisterSchema = yup.object().shape({
  fullname: yup.string().trim().matches(fullnameRegex, 'Họ và tên không hợp lệ').required('Vui lòng nhập họ và tên'),

  username: yup.string().matches(usernameRegex, 'Tên đăng nhập không hợp lệ').required('Vui lòng nhập tên đăng nhập'),

  email: yup.string().email('Email không hợp lệ').required('Vui lòng nhập email'),

  password: yup
    .string()
    .min(8, 'Tối thiểu 8 ký tự')
    .matches(
      passwordRegex,
      'Mật khẩu phải bao gồm 8 ký tự, ít nhất 1 ký tự hoa, 1 ký tự thường, 1 ký tự số, 1 ký tự đặc biệt',
    )
    .required('Vui lòng nhập mật khẩu'),

  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Mật khẩu xác nhận không khớp')
    .required('Vui lòng nhập lại mật khẩu'),
});

const RegisterScreen = () => {
  const { register } = useAuth();
  const keyboardPadding = useKeyboardPadding(20);
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = useCallback(
    async (values: registerFormData) => {
      if (isLoading) return;

      setIsLoading(true);

      try {
        await register(values);
      } catch (error) {
        console.error('Registration error:', error);
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, register],
  );

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView
          contentContainerStyle={{ paddingBottom: keyboardPadding / 2 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
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
                initialValues={{ fullname: '', username: '', email: '', password: '', confirmPassword: '' }}
                validationSchema={RegisterSchema}
                validateOnMount
                onSubmit={(values) => handleRegister(values)}
              >
                {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isValid }) => (
                  <FormInputGroup
                    inputs={[
                      {
                        placeholder: 'Họ và tên',
                        value: values.fullname,
                        onChangeText: handleChange('fullname'),
                        onBlur: handleBlur('fullname'),
                        error: errors.fullname,
                        touched: touched.fullname,
                        autoCapitalize: 'words',
                        editable: !isLoading,
                      },
                      {
                        placeholder: 'Tên đăng nhập',
                        value: values.username,
                        onChangeText: handleChange('username'),
                        onBlur: handleBlur('username'),
                        error: errors.username,
                        touched: touched.username,
                        autoCapitalize: 'words',
                        editable: !isLoading,
                      },
                      {
                        placeholder: 'Email',
                        value: values.email,
                        onChangeText: handleChange('email'),
                        onBlur: handleBlur('email'),
                        error: errors.email,
                        touched: touched.email,
                        keyboardType: 'email-address',
                        editable: !isLoading,
                      },
                      {
                        placeholder: 'Mật khẩu',
                        value: values.password,
                        onChangeText: handleChange('password'),
                        onBlur: handleBlur('password'),
                        error: errors.password,
                        touched: touched.password,
                        secureTextEntry: true,
                        editable: !isLoading,
                      },
                      {
                        placeholder: 'Xác nhận mật khẩu',
                        value: values.confirmPassword,
                        onChangeText: handleChange('confirmPassword'),
                        onBlur: handleBlur('confirmPassword'),
                        error: errors.confirmPassword,
                        touched: touched.confirmPassword,
                        secureTextEntry: true,
                        editable: !isLoading,
                      },
                    ]}
                    button={{ isFormValid: isValid, isLoading, handleFunc: handleSubmit }}
                    text="Đăng ký"
                  />
                )}
              </Formik>
            </View>

            <View style={styles.footer}>
              <ButtonLoginSocial nameIcon="google" textBtn="Đăng ký với Google" />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default RegisterScreen;
