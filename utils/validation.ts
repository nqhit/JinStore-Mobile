import { loginFormData, registerFormData } from '@/interfaces/auth.type';

export class ValidationUtils {
  static validateRegisterForm(data: registerFormData): string | null {
    if (!data.fullname.trim()) return 'Họ tên không được để trống';
    if (!data.username.trim()) return 'Tên người dùng không được để trống';
    if (!data.email.trim()) return 'Email không được để trống';
    if (!data.password) return 'Mật khẩu không được để trống';
    if (data.password !== data.confirmPassword) return 'Mật khẩu xác nhận không khớp';
    if (data.password.length < 6) return 'Mật khẩu phải có ít nhất 6 ký tự';

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) return 'Email không hợp lệ';

    return null;
  }

  static validateLoginForm(data: loginFormData): string | null {
    if (!data.usernameOrEmail.trim()) return 'Tên đăng nhập hoặc email không được để trống';
    if (!data.password) return 'Mật khẩu không được để trống';
    return null;
  }
}
