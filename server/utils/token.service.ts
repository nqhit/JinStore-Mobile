import { DecodedToken } from '@/interfaces/auth.type';
import { jwtDecode } from 'jwt-decode';
import { TOKEN_REFRESH_THRESHOLD } from '../constants/auth.constants';

export const TokenService = {
  decodeToken(token: string): DecodedToken | null {
    try {
      const decoded = jwtDecode<DecodedToken>(token);
      if (!decoded || typeof decoded.exp !== 'number') {
        throw new Error('Invalid token format');
      }
      return decoded;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  },

  isTokenExpired(token: string): boolean {
    const decoded = this.decodeToken(token);
    if (!decoded) return true;

    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  },

  shouldRefreshToken(token: string): boolean {
    const decoded = this.decodeToken(token);
    if (!decoded) return true;

    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime + TOKEN_REFRESH_THRESHOLD;
  },
};
