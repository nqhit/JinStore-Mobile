import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const API_URL = 'http://localhost:1000/api';

const refreshToken = async () => {
  try {
    const res = await axios.post(`${API_URL}/mobile/refresh`, {}, { withCredentials: true });
    return res.data;
  } catch (err) {
    console.error('Refresh token error:', err);
    localStorage.removeItem('persist:root');
    throw new Error('Phiên đăng nhập đã hết hạn');
  }
};

export const createAxios = (user, dispatch, stateSuccess) => {
  const newInstance = axios.create();

  newInstance.interceptors.request.use(
    async (config) => {
      let accessToken = user?.accessToken;

      if (accessToken) {
        try {
          const decodedToken = jwtDecode(accessToken);
          const currentTime = Date.now() / 1000;

          if (decodedToken.exp < currentTime) {
            const data = await refreshToken();
            accessToken = data.accessToken;
            dispatch(stateSuccess({ ...user, accessToken }));
          }
        } catch (err) {
          console.error('Token decode or refresh error:', err);
        }

        config.headers['Authorization'] = 'Bearer ' + accessToken;
      }

      return config;
    },
    (err) => Promise.reject(err),
  );

  return newInstance;
};
