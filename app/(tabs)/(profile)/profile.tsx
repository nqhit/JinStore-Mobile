import FormInputGroup from '@/components/Form/FormInput';
import { FormikBirthday } from '@/components/Formik/FormBirthday';
import { FormikCheckbox } from '@/components/Formik/FormCheckbox';
import { COLORS } from '@/constants/Colors';
import { useKeyboardPadding } from '@/hooks/useKeyboardPadding';
import { ProfileFormValues } from '@/interfaces/user.type';
import { useCurrentUser } from '@/server/hooks/useCurrentUser';
import { useUser } from '@/server/hooks/useUser';
import { formatDateForDisplay } from '@/utils/FormatDate';
import { birthdayRegex, fullnameRegex, phoneNumberRegex } from '@/utils/regex';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Formik } from 'formik';
import moment from 'moment';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Image, KeyboardAvoidingView, Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import DatePicker from 'react-native-date-picker';
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as yup from 'yup';

const ProfileSchema = yup.object().shape({
  fullname: yup.string().trim().matches(fullnameRegex, 'Họ và tên không hợp lệ').required('Vui lòng nhập họ và tên'),
  phone: yup.string().matches(phoneNumberRegex, 'Số điện thoại không hợp lệ').required('Vui lòng nhập số điện thoại'),
  dateBirth: yup
    .string()
    .matches(birthdayRegex, 'Ngày sinh không đúng định dạng dd/mm/yyyy')
    .required('Vui lòng nhập ngày sinh'),
  gender: yup.string().oneOf(['male', 'female', 'other'], 'Giới tính không hợp lệ').required('Vui lòng chọn giới tính'),
});

export default function ProfileScreen() {
  const keyboardPadding = useKeyboardPadding(20);
  const user = useCurrentUser();
  const { updateInfoUser } = useUser();
  const [isLoading, setIsLoading] = useState(false);
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

  const handleUpdateProfile = useCallback(
    async (values: ProfileFormValues) => {
      if (isLoading) return;

      setIsLoading(true);

      try {
        await updateInfoUser(values);
        router.back();
      } catch (error) {
        console.error('Update profile error:', error);
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, updateInfoUser],
  );

  // Memoize initial values để tránh re-render không cần thiết
  const initialValues = useMemo(
    () => ({
      fullname: user?.fullname || '',
      phone: user?.phone || '',
      dateBirth: formatDateForDisplay(user?.dateBirth) || '',
      gender: user?.gender || '',
    }),
    [user],
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
            <View style={styles.avatarWrapper}>
              <Image
                style={styles.avatar}
                source={{
                  uri: user?.avatar?.url || 'https://ui-avatars.com/api/?name=User',
                }}
              />
              <TouchableOpacity style={styles.editIcon} onPress={() => {}}>
                <MaterialCommunityIcons name="pencil" size={24} color="white" />
              </TouchableOpacity>
            </View>
            <View style={styles.body}>
              <Formik<ProfileFormValues>
                enableReinitialize
                initialValues={initialValues}
                validationSchema={ProfileSchema}
                validateOnMount
                onSubmit={handleUpdateProfile}
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
                      <DatePicker
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
                      />
                    </FormInputGroup>
                  </>
                )}
              </Formik>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 15,
  },

  content: {
    flex: 1,
    gap: 10,
    height: '100%',
    position: 'relative',
  },
  body: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: 10,
  },
  avatarWrapper: {
    position: 'relative',
    alignSelf: 'flex-start',
    marginVertical: 10,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: COLORS.gray200,
    backgroundColor: COLORS.gray200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editIcon: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    padding: 4,
    borderWidth: 2,
    borderColor: COLORS.white,
  },
});
