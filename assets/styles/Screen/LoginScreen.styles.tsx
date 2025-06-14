import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  // Layout container
  contentContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    paddingTop: 56,
    justifyContent: 'flex-start',
  },
  footer: {
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerLink: {
    marginTop: 5,
    fontSize: 16,
    color: '#8B5CF6',
  },

  // Title text
  title: {
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 36,
  },

  // Input field
  input: {
    width: '100%',
    height: 50,
    paddingHorizontal: 15,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },

  // Login button
  loginButton: {
    width: '100%',
    height: 50,
    marginTop: 10,
    backgroundColor: '#8B5CF6',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  loginButtonDisabled: {
    backgroundColor: '#ccc',
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
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
    borderColor: '#8B5CF6',
  },
  socialIcon: {
    marginRight: 8,
  },
  socialLoginButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
});
