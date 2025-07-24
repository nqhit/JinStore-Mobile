import { useTabBarVisibility } from '@/Context/TabBarVisibilityContext';
import { ProfileFormValues } from '@/interfaces/user.type';
import { useCurrentUser } from '@/server/hooks/useCurrentUser';
import { formatDateForDisplay } from '@/utils/FormatDate';
import { birthdayRegex, fullnameRegex, phoneNumberRegex } from '@/utils/regex';
import { Formik } from 'formik';
import moment from 'moment';
import { useCallback, useEffect, useMemo, useState } from 'react';
import * as yup from 'yup';
import { CustomDatePicker } from '../CustomDatePicker';
import { FormikBirthday } from '../Formik/FormBirthday';
import { FormikCheckbox } from '../Formik/FormCheckbox';
import FormInputGroup from './FormInput';

interface FormSetupProps {
  isLoading: boolean;
  onSubmit: (values: ProfileFormValues) => void;
}

const ProfileSchema = yup.object().shape({
  fullname: yup.string().trim().matches(fullnameRegex, 'Họ và tên không hợp lệ').required('Vui lòng nhập họ và tên'),
  phone: yup.string().matches(phoneNumberRegex, 'Số điện thoại không hợp lệ').required('Vui lòng nhập số điện thoại'),
  dateBirth: yup
    .string()
    .matches(birthdayRegex, 'Ngày sinh không đúng định dạng dd/mm/yyyy')
    .required('Vui lòng nhập ngày sinh'),
  gender: yup.string().oneOf(['male', 'female', 'other'], 'Giới tính không hợp lệ').required('Vui lòng chọn giới tính'),
});

export const FormProfile: React.FC<FormSetupProps> = ({ isLoading, onSubmit }) => {
  const user = useCurrentUser();
  const { setVisible } = useTabBarVisibility();
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const getFormattedDate = useMemo(() => {
    if (!user?.dateBirth) return new Date();

    try {
      const momentDate = moment(user.dateBirth, 'DD/MM/YYYY');
      return momentDate.isValid() ? momentDate.toDate() : new Date();
    } catch (error) {
      console.error('Lỗi khi chuyển đổi Date:', error);
      return new Date();
    }
  }, [user?.dateBirth]);

  const [date, setDate] = useState<Date>(getFormattedDate);

  useEffect(() => {
    setDate(getFormattedDate);
  }, [getFormattedDate]);

  useEffect(() => {
    setVisible(false);

    return () => setVisible(true);
  }, []);

  const showDatePicker = useCallback(() => {
    setDatePickerVisibility(true);
  }, []);

  const handleConfirmDate = useCallback((selectedDate: Date, setFieldValue: (field: string, value: any) => void) => {
    try {
      const formattedDate = moment(selectedDate).format('DD/MM/YYYY');
      setFieldValue('dateBirth', formattedDate);
      setDate(selectedDate);
      setDatePickerVisibility(false);
    } catch (error) {
      console.error('Error formatting date:', error);
      setDatePickerVisibility(false);
    }
  }, []);

  const handleCancelDatePicker = useCallback(() => {
    setDatePickerVisibility(false);
  }, []);

  const initialValues = useMemo(
    () => ({
      fullname: user?.fullname || '',
      phone: user?.phone || '',
      dateBirth: formatDateForDisplay(user?.dateBirth || ''),
      gender: user?.gender || '',
    }),
    [user],
  );

  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      validationSchema={ProfileSchema}
      validateOnMount
      onSubmit={onSubmit}
    >
      {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isValid, setFieldValue }) => (
        <>
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
                placeholder: 'Số điện thoại',
                value: values.phone,
                onChangeText: handleChange('phone'),
                onBlur: handleBlur('phone'),
                error: errors.phone,
                touched: touched.phone,
                keyboardType: 'number-pad',
                maxLength: 10,
                inputMode: 'numeric',
                editable: !isLoading,
              },
            ]}
            button={{ isFormValid: isValid, isLoading, handleFunc: handleSubmit }}
            text="Cập nhật"
          >
            <FormikBirthday
              values={values}
              showDatePicker={showDatePicker}
              isLoading={isLoading}
              errors={errors}
              touched={touched}
            />
            <FormikCheckbox
              values={values}
              setFieldValue={setFieldValue}
              isLoading={isLoading}
              errors={errors}
              touched={touched}
            />
          </FormInputGroup>
          {/*           <DatePicker
            modal
            open={isDatePickerVisible}
            date={date}
            mode="date"
            title="Chọn ngày sinh"
            confirmText="Xác nhận"
            cancelText="Hủy"
            maximumDate={new Date()}
            onConfirm={(selectedDate: Date) => handleConfirmDate(selectedDate, setFieldValue)}
            onCancel={handleCancelDatePicker}
            locale="vi-VN"
          /> */}
          {isDatePickerVisible && (
            <CustomDatePicker
              isVisible={isDatePickerVisible}
              date={date}
              onConfirm={(selectedDate: Date) => handleConfirmDate(selectedDate, setFieldValue)}
              onCancel={handleCancelDatePicker}
            />
          )}
        </>
      )}
    </Formik>
  );
};
