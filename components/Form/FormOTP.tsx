import { Formik } from 'formik';
import React from 'react';
import * as yup from 'yup';
import FormInputGroup from './FormInput';

interface OtpFormData {
  otp: string;
}

interface FormOtpProps {
  isLoading: boolean;
  onSubmit: (values: OtpFormData) => void;
}

const OtpSchema = yup.object().shape({
  otp: yup.string().length(6, 'Vui lòng nhập đủ 6 chữ số OTP').required('Vui lòng nhập mã OTP'),
});

export const FormOtp: React.FC<FormOtpProps> = ({ isLoading, onSubmit }) => (
  <Formik initialValues={{ otp: '' }} validationSchema={OtpSchema} validateOnMount onSubmit={onSubmit}>
    {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isValid }) => (
      <FormInputGroup
        inputs={[
          {
            placeholder: 'Nhập mã OTP (6 chữ số)',
            value: values.otp,
            onChangeText: handleChange('otp'),
            onBlur: handleBlur('otp'),
            error: errors.otp,
            touched: touched.otp,
          },
        ]}
        button={{ isFormValid: isValid, isLoading, handleFunc: handleSubmit }}
        text="Xác nhận OTP"
      />
    )}
  </Formik>
);
