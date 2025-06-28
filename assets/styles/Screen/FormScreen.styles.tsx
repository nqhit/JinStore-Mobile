import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 10,
    marginBottom: 50,
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    paddingHorizontal: 15,
  },

  welcomeContainer: {
    flexDirection: 'column',
  },

  headerLogo: {
    top: 0,
    alignItems: 'center',
    marginTop: 30,
  },

  logo: {
    top: 0,
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },

  // Layout container
  contentContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    paddingHorizontal: 15,
    flex: 1,
    justifyContent: 'flex-start',
  },
  footer: {
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Register section
  registerContainer: {
    width: '100%',
    marginTop: 10,
    paddingTop: 20,
    borderTopWidth: 1,
    borderColor: '#ddd',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5,
  },
  registerLink: {
    fontSize: 16,
    color: '#8B5CF6',
  },

  // Title text
  title: {
    flex: 1,
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 36,
    alignItems: 'center',
  },

  titleWelcome: {
    flex: 1,
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 28,
    alignItems: 'center',
  },

  subtitle: {
    flex: 1,
    fontSize: 18,
    alignItems: 'center',
    textAlign: 'center',
    lineHeight: 24,
    paddingTop: 5,
    marginBottom: 15,
    color: '#8B5CF6',
  },

  // Forgot password link
  forgotPasswordContainer: {
    width: '100%',
    marginTop: 20,
    alignItems: 'flex-start',
  },
  forgotPasswordText: {
    fontSize: 14,
    color: '#8B5CF6',
  },
});
