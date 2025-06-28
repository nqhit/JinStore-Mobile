import { COLORS } from '@/constants/Colors';
import { AntDesign } from '@expo/vector-icons';
import { JSX } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import FText from '../Text';

interface SocialType {
  nameIcon: string;
  textBtn: string;
}

const ButtonLoginSocial = ({ nameIcon, textBtn }: SocialType): JSX.Element => {
  return (
    <TouchableOpacity style={styles.socialLoginButton}>
      <AntDesign name="google" size={20} color="#EA4335" style={styles.socialIcon} />
      <FText style={styles.socialLoginButtonText}>Login with Google</FText>
    </TouchableOpacity>
  );
};

export default ButtonLoginSocial;

const styles = StyleSheet.create({
  // Social login
  socialLoginButton: {
    width: '100%',
    height: 50,
    margin: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  socialIcon: {
    marginRight: 8,
  },
  socialLoginButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
