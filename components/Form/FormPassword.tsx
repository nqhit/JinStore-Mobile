import { passwordRegex } from '@/utils/regex';
import { Formik } from 'formik';
import React from 'react';
import * as yup from 'yup';
import FormInputGroup from './FormInput';
interface ResetPasswordFormData {
  password: string;
  confirmPassword: string;
}

interface FormPasswordProps {
  isLoading: boolean;
  onSubmit: (values: ResetPasswordFormData) => void;
}

const ResetPasswordSchema = yup.object().shape({
  password: yup
    .string()
    .matches(
      passwordRegex,
      'Mật khẩu phải có ít nhất 8 ký tự, ít nhất 1 ký tự hoa, 1 ký tự thường, 1 ký tự số, 1 ký tự đặc biệt',
    )
    .min(8, 'Mật khẩu phải có ít nhất 8 ký tự')
    .required('Vui lòng nhập mật khẩu'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Mật khẩu xác nhận không trùng khớp')
    .required('Vui lòng nhập xác nhận mật khẩu'),
});

export const FormPassword: React.FC<FormPasswordProps> = ({ isLoading, onSubmit }) => (
  <Formik
    initialValues={{ password: '', confirmPassword: '' }}
    validationSchema={ResetPasswordSchema}
    validateOnMount
    onSubmit={onSubmit}
  >
    {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isValid }) => (
      <FormInputGroup
        inputs={[
          {
            placeholder: 'Mật khẩu mới',
            value: values.password,
            onChangeText: handleChange('password'),
            onBlur: handleBlur('password'),
            error: errors.password,
            touched: touched.password,
            secureTextEntry: true,
          },
          {
            placeholder: 'Xác nhận mật khẩu',
            value: values.confirmPassword,
            onChangeText: handleChange('confirmPassword'),
            onBlur: handleBlur('confirmPassword'),
            error: errors.confirmPassword,
            touched: touched.confirmPassword,
            secureTextEntry: true,
          },
        ]}
        button={{ isFormValid: isValid, isLoading, handleFunc: handleSubmit }}
        text="Đặt lại mật khẩu"
      />
    )}
  </Formik>
);
