import { COLORS } from '@/constants/Colors';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    height: '100%',
  },
  content: {
    flex: 1,
    gap: 10,
    height: '100%',
  },
  body: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: 10,
  },

  headerLogo: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },

  logo: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
  },
  headerWelcome: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  titleWelcome: {
    flex: 1,
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 28,
  },

  subtitle: {
    flex: 1,
    fontSize: 18,
    textAlign: 'center',
    lineHeight: 24,
    color: COLORS.primary,
  },

  forgotPasswordContainer: {
    width: '100%',
    alignItems: 'flex-start',
  },
  forgotPasswordText: {
    fontSize: 14,
    color: COLORS.primary,
  },

  registerContainer: {
    flex: 1,
    width: '100%',
    marginTop: 10,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: COLORS.gray200,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5,
  },

  registerLink: {
    fontSize: 16,
    color: COLORS.primary,
  },

  footer: {
    flex: 1,
    marginTop: 10,
  },
});
