import FormInputGroup from '@/components/Form/FormInput';
import { FormikBirthday } from '@/components/Formik/FormBirthday';
import { FormikCheckbox } from '@/components/Formik/FormCheckbox';
import { COLORS } from '@/constants/Colors';
import { useKeyboardPadding } from '@/hooks/useKeyboardPadding';
import { useCurrentUser } from '@/server/hooks/useCurrentUser';
import { birthdayRegex, fullnameRegex, phoneNumberRegex, usernameRegex } from '@/utils/regex';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Formik } from 'formik';
import moment from 'moment';
import { useCallback, useState } from 'react';
import { Image, KeyboardAvoidingView, Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as yup from 'yup';

type ProfileFormValues = {
  fullname: string;
  username: string;
  email: string;
  phoneNumber: string;
  birthday: string;
  gender: string;
};

const ProfileSchema = yup.object().shape({
  fullname: yup.string().trim().matches(fullnameRegex, 'Họ và tên không hợp lệ').required('Vui lòng nhập họ và tên'),
  username: yup.string().matches(usernameRegex, 'Tên đăng nhập không hợp lệ').required('Vui lòng nhập tên đăng nhập'),
  email: yup.string().email('Email không hợp lệ').required('Vui lòng nhập email'),
  phoneNumber: yup
    .string()
    .matches(phoneNumberRegex, 'Số điện thoại không hợp lệ')
    .required('Vui lòng nhập số điện thoại'),
  birthday: yup
    .string()
    .matches(birthdayRegex, 'Ngày sinh không đúng định dạng dd/mm/yyyy')
    .required('Vui lòng nhập ngày sinh'),
  gender: yup.string().oneOf(['male', 'female', 'other'], 'Giới tính không hợp lệ').required('Vui lòng chọn giới tính'),
});

export default function ProfileScreen() {
  const keyboardPadding = useKeyboardPadding(20);
  const user = useCurrentUser();
  const [isLoading, setIsLoading] = useState(false);

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const showDatePicker = () => setDatePickerVisibility(true);
  const hideDatePicker = () => setDatePickerVisibility(false);

  const handleConfirmDate = (date: Date, setFieldValue: (field: string, value: any) => void) => {
    const formattedDate = moment(date).format('DD/MM/YYYY');
    setFieldValue('birthday', formattedDate);
    hideDatePicker();
  };

  const handleUpdateProfile = useCallback(async () => {
    if (isLoading) return;

    setIsLoading(true);

    try {
    } catch (error) {
      console.error('Registration error:', error);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]);
  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right', 'bottom']}>
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
                initialValues={{
                  fullname: user?.fullname || '',
                  username: user?.username || '',
                  email: user?.email || '',
                  phoneNumber: user?.phoneNumber || '',
                  birthday: user?.birthday || '',
                  gender: user?.gender || '',
                }}
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
                          placeholder: 'Tên đăng nhập',
                          value: values.username,
                          onChangeText: handleChange('username'),
                          onBlur: handleBlur('username'),
                          error: errors.username,
                          touched: touched.username,
                          autoCapitalize: 'words',
                          editable: false,
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
                          placeholder: 'Số điện thoại',
                          value: values.phoneNumber,
                          onChangeText: handleChange('phoneNumber'),
                          onBlur: handleBlur('phoneNumber'),
                          error: errors.phoneNumber,
                          touched: touched.phoneNumber,
                          keyboardType: 'number-pad',
                          maxLength: 10,
                          inputMode: 'numeric',
                          editable: !isLoading,
                        },
                      ]}
                      button={{ isFormValid: isValid, isLoading, handleFunc: handleSubmit }}
                      text="Câp nhật"
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
                    <DateTimePickerModal
                      isVisible={isDatePickerVisible}
                      mode="date"
                      onConfirm={(date) => handleConfirmDate(date, setFieldValue)}
                      onCancel={hideDatePicker}
                      maximumDate={new Date()}
                    />
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
