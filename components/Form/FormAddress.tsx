import { COLORS } from '@/constants/Colors';
import { AddressFormValues } from '@/interfaces/address.type';
import { Ionicons } from '@expo/vector-icons';
import { Formik } from 'formik';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as yup from 'yup';
import AddressSelector from '../address/AddressSelector';
import FormInputGroup from './FormInput';

interface FormAddressProps {
  valuesDefault?: AddressFormValues;
  isLoading: boolean;
  onSubmit: (values: AddressFormValues) => void;
}

const initialValues = {
  detailed: '',
  district: '', // Phường/Xã
  city: '', // Thành phố/Quận
  province: '', // Tỉnh/Thành phố
  isDefault: false,
};

const AddressSchema = yup.object().shape({
  detailed: yup.string().required('Vui lòng nhập địa chỉ chi tiết'),
  district: yup.string().required('Vui lòng nhập Phường/Xã'),
  city: yup.string().required('Vui lòng nhập Thành phố/Quận'),
  province: yup.string().required('Vui lòng nhập Tỉnh/Thành phố'),
  isDefault: yup.boolean(),
});

export const FormAddress: React.FC<FormAddressProps> = ({ valuesDefault = initialValues, isLoading, onSubmit }) => {
  return (
    <Formik initialValues={valuesDefault} validationSchema={AddressSchema} validateOnMount onSubmit={onSubmit}>
      {({ handleChange, handleBlur, handleSubmit, setFieldValue, values, errors, touched, isValid }) => {
        return (
          <FormInputGroup
            inputs={[
              {
                placeholder: 'Địa chỉ chi tiết',
                value: values.detailed,
                onChangeText: handleChange('detailed'),
                onBlur: handleBlur('detailed'),
                error: errors.detailed,
                touched: touched.detailed,
              },
            ]}
            button={{ isFormValid: isValid, isLoading, handleFunc: handleSubmit }}
            text="Xác nhận"
          >
            <AddressSelector
              valuesDefault={{
                province: values.province,
                city: values.city,
                district: values.district,
              }}
              onProvinceChange={(value) => setFieldValue('province', value)}
              onCityChange={(value) => setFieldValue('city', value)}
              onDistrictChange={(value) => setFieldValue('district', value)}
              errors={{
                province: errors.province,
                city: errors.city,
                district: errors.district,
              }}
              touched={{
                province: touched.province,
                city: touched.city,
                district: touched.district,
              }}
            />
            <View style={styles.checkboxDefault}>
              <TouchableOpacity onPress={() => setFieldValue('isDefault', !values.isDefault)}>
                <Ionicons
                  name={values.isDefault ? 'checkbox-sharp' : 'square-outline'}
                  size={20}
                  color={values.isDefault ? COLORS.primary : '#8E8E93'}
                />
              </TouchableOpacity>
              <Text>Đặt làm địa chỉ mặc định</Text>
            </View>
          </FormInputGroup>
        );
      }}
    </Formik>
  );
};

const styles = StyleSheet.create({
  checkboxDefault: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: 22.3,
    gap: 5,
  },
});
