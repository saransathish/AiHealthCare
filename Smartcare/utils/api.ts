// // utils/api.ts
// import axios from 'axios';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// interface RegisterResponse {
//   // Define the expected properties of the response
//   id: string;
//   username: string;
//   email: string;
//   phone_number: string;
//   // Add other properties as needed
// }

// const API_URL = 'http://192.168.100.3:8000/api';

// export const login = async (username: string, password: string) => {
//   try {
//     await AsyncStorage.setItem('userid', username);
    
//     const response = await axios.post(`${API_URL}/login/`, {
//       username,
//       password,
//     });
    
//     if (response.data.access) {
//       await AsyncStorage.setItem('access_token', response.data.access);
//       await AsyncStorage.setItem('refresh_token', response.data.refresh);
//     }
//     return response.data;
//   } catch (error) {
//     throw new Error(error instanceof Error ? error.message : 'Login failed');
//   }
// };

// export const register = async (
//   username: string,
//   email: string,
//   password: string,
//   phone_number: string
// ): Promise<RegisterResponse> => {
//   try {
//     const response = await axios.post(`${API_URL}/register/`, {
//       username,
//       email,
//       password,
//       phone_number,
//     });
//     return response.data;
//   } catch (error) {
//     throw new Error(error instanceof Error ? error.message : 'Registration failed');
//   }
// };

// utils/api.ts

// import axios from 'axios';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// const API_URL = 'http://18.224.212.249:8000/api';

// // Add request interceptor to add token to all requests
// axios.interceptors.request.use(
//   async (config) => {
//     const token = await AsyncStorage.getItem('access_token');
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// // Add response interceptor to handle token refresh
// axios.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;
    
//     if (error.response.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;
      
//       try {
//         const refreshToken = await AsyncStorage.getItem('refresh_token');
//         const response = await axios.post(`${API_URL}/token/refresh/`, {
//           refresh: refreshToken
//         });
        
//         const { access } = response.data;
//         await AsyncStorage.setItem('access_token', access);
        
//         originalRequest.headers['Authorization'] = `Bearer ${access}`;
//         return axios(originalRequest);
//       } catch (refreshError) {
//         // If refresh fails, redirect to login
//         await AsyncStorage.multiRemove(['access_token', 'refresh_token', 'userid']);
//         // You'll need to implement navigation to login screen here
//         return Promise.reject(refreshError);
//       }
//     }
//     return Promise.reject(error);
//   }
// );

// export const login = async (username: string, password: string) => {
//   try {
//     const response = await axios.post(`${API_URL}/login/`, {
//       username,
//       password,
//     });
    
//     if (response.data.access) {
//       await AsyncStorage.multiSet([
//         ['access_token', response.data.access],
//         ['refresh_token', response.data.refresh],
//         ['userid', username]
//       ]);
//     }
//     return response.data;
//   } catch (error) {
//     if (axios.isAxiosError(error)) {
//       console.error('Login error:', error.response?.data || error.message);
//     } else {
//       console.error('Login error:', error);
//     }
//     if (axios.isAxiosError(error) && error.response) {
//       throw new Error(error.response.data?.detail || 'Login failed');
//     } else {
//       throw new Error('Login failed');
//     }
//   }
// };

// export const register = async (
//   username: string,
//   email: string,
//   password: string,
//   phone_number: string
// ) => {
//   try {
//     const response = await axios.post(`${API_URL}/register/`, {
//       username,
//       email,
//       password,
//       phone_number,
//     });
//     return response.data;
//   } catch (error) {
//     if (axios.isAxiosError(error)) {
//       console.error('Registration error:', error.response?.data || error.message);
//     } else {
//       console.error('Registration error:', error);
//     }
//     if (axios.isAxiosError(error) && error.response) {
//       throw new Error(error.response.data?.detail || 'Registration failed');
//     } else {
//       throw new Error('Registration failed');
//     }
//   }
// };

// export const logout = async () => {
//   try {
//     await AsyncStorage.multiRemove(['access_token', 'refresh_token', 'userid']);
//   } catch (error) {
//     console.error('Logout error:', error);
//     throw new Error('Logout failed');
//   }
// };

// api.ts

import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://192.168.100.3:8000/api';

// Interface definitions
export interface ChatResponse {
  success: boolean;
  response: string;
  disclaimer?: string;
  language?: string;
}

export interface UserQuestion {
  query: string;
  session_id: string;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  user?: {
    username: string;
    email: string;
    phone_number: string;
  };
}

export interface LoginResponse {
  access: string;
  refresh: string;
  user: {
    username: string;
    email: string;
  };
}

export interface UserDetails {
  username: string;
  email: string;
  phone_number: string;
}

// API configuration
const api = axios.create({
  baseURL: API_URL,
  timeout: 30000, // Increased timeout for mobile networks
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't tried to refresh token yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = await AsyncStorage.getItem('refresh_token');
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        const response = await axios.post(`${API_URL}/token/refresh/`, {
          refresh: refreshToken
        });

        if (response.data.access) {
          await AsyncStorage.setItem('access_token', response.data.access);
          api.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // If refresh fails, clear tokens and redirect to login
        await AsyncStorage.multiRemove(['access_token', 'refresh_token']);
        throw new Error('Session expired. Please login again.');
      }
    }

    return Promise.reject(error);
  }
);

// Authentication functions
export const register = async (
  username: string,
  email: string,
  password: string,
  phone_number: string
): Promise<RegisterResponse> => {
  try {
    const response = await api.post('/register/', {
      username,
      email,
      password,
      phone_number,
    });
    return response.data;
  } catch (error) {
    throw handleApiError(error, 'Registration failed');
  }
};

export const login = async (
  username: string,
  password: string
): Promise<LoginResponse> => {
  try {
    await AsyncStorage.setItem('userid', username);
    
    const response = await api.post('/login/', {
      username,
      password,
    });
    
    if (response.data.access) {
      await AsyncStorage.setItem('access_token', response.data.access);
      await AsyncStorage.setItem('refresh_token', response.data.refresh);
    }
    return response.data;
  } catch (error) {
    throw handleApiError(error, 'Login failed');
  }
};

export const logout = async (): Promise<void> => {
  try {
    await AsyncStorage.multiRemove([
      'access_token',
      'refresh_token',
      'userid',
      'medical_session_id',
      'medical_chat_history'
    ]);
  } catch (error) {
    throw handleApiError(error, 'Logout failed');
  }
};

// User related functions
export const getUserDetails = async (): Promise<UserDetails> => {
  try {
    const response = await api.get('/user/');
    return response.data;
  } catch (error) {
    throw handleApiError(error, 'Failed to get user details');
  }
};

// Chatbot related functions
export const storeUserQuestion = async (question: UserQuestion): Promise<void> => {
  try {
    await api.post('/user/gather/', question);
  } catch (error) {
    throw handleApiError(error, 'Failed to store question');
  }
};

export const getChatbotResponse = async (question: UserQuestion): Promise<ChatResponse> => {
  try {
    const response = await api.post('/chatbot/chat/', question);
    return response.data;
  } catch (error) {
    throw handleApiError(error, 'Failed to get chatbot response');
  }
};

// Error handling helper
const handleApiError = (error: any, defaultMessage: string): Error => {
  if (axios.isAxiosError(error)) {
    // Handle network errors
    if (!error.response) {
      return new Error('Network error. Please check your internet connection.');
    }
    
    // Handle API errors with response
    const errorMessage = error.response.data?.message 
      || error.response.data?.detail 
      || error.response.data?.error 
      || defaultMessage;
    
    return new Error(errorMessage);
  }
  
  // Handle other types of errors
  return new Error(error instanceof Error ? error.message : defaultMessage);
};

// Network status check
export const checkApiConnection = async (): Promise<boolean> => {
  try {
    await api.get('/health-check/');
    return true;
  } catch {
    return false;
  }
};

export default api;