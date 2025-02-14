// import axios from 'axios';

// const API_URL = 'http://localhost:8000/api'; // Replace with your Django backend URL

// export const register = async (username: string, email: string, password: string, phone_number: string) => {
//     const response = await axios.post(`${API_URL}/register/`, {
//         username,
//         email,
//         password,
//         phone_number,
//     });
//     console.log(response.data);
//     return response.data;
// };

// export const login = async (username: string, password: string) => {
//     localStorage.setItem('userid', username);

//     const response = await axios.post(`${API_URL}/login/`, {
//         username,
//         password,
//     });
//     if (response.data.access) {
//         localStorage.setItem('access_token', response.data.access);
//         localStorage.setItem('refresh_token', response.data.refresh);
//     }
//     console.log(response.data);
//     return response.data;
// };

// export const getUserDetails = async () => {
//     console.log(localStorage.getItem('userid'));
//     const token = localStorage.getItem('access_token');
//     const response = await axios.get(`${API_URL}/user/`, {
//         headers: { Authorization: `Bearer ${token}` },
//     });
//     return response.data;
// };

// api.ts

import axios from 'axios';

const API_URL = 'http://3.91.40.230:8000/api';

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

// Authentication functions
export const register = async (
  username: string, 
  email: string, 
  password: string, 
  phone_number: string
): Promise<RegisterResponse> => {
  try {
    const response = await axios.post(`${API_URL}/register/`, {
      username,
      email,
      password,
      phone_number,
    });
    return response.data;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Registration failed');
  }
};

export const login = async (
  username: string, 
  password: string
): Promise<LoginResponse> => {
  try {
    localStorage.setItem('userid', username);
    
    const response = await axios.post(`${API_URL}/login/`, {
      username,
      password,
    });
    
    if (response.data.access) {
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
    }
    return response.data;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Login failed');
  }
};

// User related functions
export const getUserDetails = async (): Promise<UserDetails> => {
  try {
    const token = localStorage.getItem('access_token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await axios.get(`${API_URL}/user/`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Failed to get user details');
  }
};

// Chatbot related functions
export const storeUserQuestion = async (question: UserQuestion): Promise<void> => {
  try {
    const token = localStorage.getItem('access_token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    await axios.post(
      `${API_URL}/user/gather/`,
      question,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Failed to store question');
  }
};

export const getChatbotResponse = async (question: UserQuestion): Promise<ChatResponse> => {
  try {
    const token = localStorage.getItem('access_token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await axios.post(
      `${API_URL}/chatbot/chat/`,
      question,
      {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Failed to get chatbot response');
  }
};