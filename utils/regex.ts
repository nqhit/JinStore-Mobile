// utils/regex.ts
export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[^a-zA-Z0-9]).{8,}$/;
export const usernameRegex = /^[a-zA-Z0-9_]{3,}$/;
export const phoneNumberRegex = /^0[0-9]{9}$/;
export const fullnameRegex = /^([\p{L}]{2,})(?:\s+[\p{L}]{2,})+$/u;

export const validateEmail = (email: string): boolean => {
  return emailRegex.test(email.trim());
};

export const validatePassword = (password: string): boolean => {
  return passwordRegex.test(password.trim());
};

export const validateUsername = (username: string): boolean => {
  return usernameRegex.test(username.trim());
};

export const validatePhoneNumber = (phoneNumber: string): boolean => {
  return phoneNumberRegex.test(phoneNumber.trim());
};

export const validateFullName = (name: string): boolean => {
  return fullnameRegex.test(name.trim());
};
