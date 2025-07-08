import { validateEmail } from '@/utils/regex';
import { Formik } from 'formik';
import React from 'react';
import * as yup from 'yup';
import FormInputGroup from './FormInput';

interface EmailFormData {
  email: string;
}

interface FormEmailProps {
  isLoading: boolean;
  onSubmit: (values: EmailFormData) => void;
}

const EmailSchema = yup.object().shape({
  email: yup
    .string()
    .test('is-email', 'Vui lòng nhập email hợp lệ', (value) => {
      if (!value) return false;
      return validateEmail(value);
    })
    .required('Vui lòng nhập email'),
});

export const FormEmail: React.FC<FormEmailProps> = ({ isLoading, onSubmit }) => (
  <Formik initialValues={{ email: '' }} validationSchema={EmailSchema} validateOnMount onSubmit={onSubmit}>
    {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isValid }) => (
      <FormInputGroup
        inputs={[
          {
            placeholder: 'Email',
            keyboardType: 'email-address',
            value: values.email,
            onChangeText: handleChange('email'),
            onBlur: handleBlur('email'),
            error: errors.email,
            touched: touched.email,
          },
        ]}
        button={{ isFormValid: isValid, isLoading, handleFunc: handleSubmit }}
        text="Gửi mã OTP"
      />
    )}
  </Formik>
);
