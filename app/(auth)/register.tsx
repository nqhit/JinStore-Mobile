import { styles } from '@/assets/styles/Screen/FormScreen.styles';
import ButtonLoginSocial from '@/components/Button/LoginSocial';
import FormInputGroup from '@/components/Form/FormInput';
import { register } from '@/server/auth.server';
import { fullnameRegex, passwordRegex, usernameRegex } from '@/utils/regex';
import { Formik } from 'formik';
import React, { useCallback, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';
import * as yup from 'yup';

interface RegisterFormData {
  fullname: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

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
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = useCallback(
    async (values: RegisterFormData) => {
      if (isLoading) return;

      setIsLoading(true);

      try {
        await register(values, dispatch);
      } catch (error) {
        Alert.alert('Lỗi', 'Đăng ký thất bại. Vui lòng thử lại.');
        console.error('Registration error:', error);
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, dispatch],
  );

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
              flex: 1,
              justifyContent: 'center',
            }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.container}>
              <View style={styles.contentContainer}>
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
