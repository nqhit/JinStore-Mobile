import { styles } from '@/assets/styles/Screen/FormScreen.styles';
import { FormEmail } from '@/components/Form/FormEmail';
import { FormOtp } from '@/components/Form/FormOTP';
import { FormPassword } from '@/components/Form/FormPassword';
import FText from '@/components/Text';
import { useAuth } from '@/server/hooks/useAuth';
import { useUser } from '@/server/hooks/useUser';
import { router, useFocusEffect, useNavigation } from 'expo-router';
import { useLocalSearchParams } from 'expo-router/build/hooks';
import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  BackHandler,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Interfaces
interface EmailFormData {
  email: string;
}

interface OtpFormData {
  otp: string;
}

interface ResetPasswordFormData {
  currentPassword?: string;
  password: string;
  confirmPassword: string;
}

const ActionsPasswordScreen = () => {
  const navigation = useNavigation();
  const { sendOtp, verifyOtp, resetPassword } = useAuth();
  const { changePassword } = useUser();
  const params = useLocalSearchParams();
  const showCurrentPassword = params.showCurrentPassword === 'true';

  // Form states
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
  const [countdown, setCountdown] = useState(0);
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      gestureEnabled: false,
      title: showCurrentPassword ? 'Đổi mật khẩu' : 'Quên mật khẩu',
    });
  }, [navigation, showCurrentPassword]);

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => true;
      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => subscription.remove();
    }, []),
  );

  // Countdown effect
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleSendOtp = useCallback(
    async (values: EmailFormData) => {
      setIsLoading(true);
      try {
        await sendOtp(values.email);
        setEmail(values.email);
        setStep(2);
        setCountdown(60);
        Alert.alert('Thành công', 'Mã OTP đã được gửi đến email của bạn');
      } catch (error: any) {
        Alert.alert('Lỗi', error.message || 'Không thể gửi OTP. Vui lòng thử lại sau.');
      } finally {
        setIsLoading(false);
      }
    },
    [sendOtp],
  );

  const handleVerifyOtp = useCallback(
    async (values: OtpFormData) => {
      setIsLoading(true);
      try {
        await verifyOtp(email, values.otp);
        setStep(3);
        Alert.alert('Thành công', 'Xác thực OTP thành công');
      } catch (error: any) {
        Alert.alert('Lỗi', error.message || 'Mã OTP không đúng hoặc đã hết hạn');
      } finally {
        setIsLoading(false);
      }
    },
    [verifyOtp, email],
  );

  const handleResetPassword = useCallback(
    async (values: ResetPasswordFormData) => {
      setIsLoading(true);
      try {
        if (values.currentPassword) {
          const formData = {
            currentPassword: values.currentPassword,
            newPassword: values.password,
            confirmPassword: values.confirmPassword,
          };
          await changePassword(formData);
        } else {
          await resetPassword(email, values.password, values.confirmPassword);
        }
        Alert.alert('Thành công', 'Đổi mật khẩu thành công', [
          {
            text: 'OK',
            onPress: () => router.push('/login'),
          },
        ]);
      } catch (error: any) {
        Alert.alert('Lỗi', error.message || 'Không thể đổi mật khẩu. Vui lòng thử lại.');
      } finally {
        setIsLoading(false);
      }
    },
    [resetPassword, email, changePassword],
  );

  const handleResendOtp = useCallback(() => {
    if (countdown > 0) return;

    handleSendOtp({ email });
  }, [countdown, email, handleSendOtp]);

  const handleNavigateToLogin = useCallback(() => {
    if (isNavigating) return;

    setIsNavigating(true);
    router.push('/login');

    setTimeout(() => {
      setIsNavigating(false);
    }, 1000);
  }, [isNavigating]);

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return <FormEmail isLoading={isLoading} onSubmit={handleSendOtp} />;
      case 2:
        return (
          <>
            <FormOtp isLoading={isLoading} onSubmit={handleVerifyOtp} />

            <View style={styles.forgotPasswordContainer}>
              <TouchableOpacity onPress={handleResendOtp} disabled={countdown > 0}>
                <FText style={[styles.forgotPasswordText, countdown > 0 && { opacity: 0.5 }]}>
                  {countdown > 0 ? `Gửi lại mã sau ${countdown} giây` : 'Gửi lại mã OTP'}
                </FText>
              </TouchableOpacity>
            </View>
          </>
        );

      case 3:
        return (
          <FormPassword
            isLoading={isLoading}
            onSubmit={handleResetPassword}
            showCurrentPassword={showCurrentPassword}
          />
        );

      default:
        return null;
    }
  };

  const getStepTitle = () => {
    switch (step) {
      case 1:
        return 'Quên mật khẩu';
      case 2:
        return 'Xác thực OTP';
      case 3:
        return 'Đặt lại mật khẩu';
      default:
        return 'Quên mật khẩu';
    }
  };

  const getStepSubtitle = () => {
    switch (step) {
      case 1:
        return 'Nhập email để nhận mã OTP';
      case 2:
        return 'Nhập mã OTP đã được gửi đến email';
      case 3:
        return 'Tạo mật khẩu mới cho tài khoản';
      default:
        return 'Nhập email để nhận mã OTP';
    }
  };

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
                <FText style={styles.titleWelcome}>{getStepTitle()}</FText>
                <FText style={styles.subtitle}>{getStepSubtitle()}</FText>
              </View>

              {renderStepContent()}
            </View>

            {!showCurrentPassword && (
              <View style={styles.registerContainer}>
                <FText>Đã nhớ mật khẩu? </FText>
                <TouchableOpacity onPress={handleNavigateToLogin} disabled={isNavigating} activeOpacity={0.7}>
                  <FText style={[styles.registerLink, isNavigating && { opacity: 0.5 }]}>Đăng nhập ngay</FText>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ActionsPasswordScreen;
