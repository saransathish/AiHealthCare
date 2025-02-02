// utils/api.ts
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://localhost:8000/api';

export const login = async (username: string, password: string) => {
  try {
    await AsyncStorage.setItem('userid', username);
    
    const response = await axios.post(`${API_URL}/login/`, {
      username,
      password,
    });
    
    if (response.data.access) {
      await AsyncStorage.setItem('access_token', response.data.access);
      await AsyncStorage.setItem('refresh_token', response.data.refresh);
    }
    return response.data;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Login failed');
  }
};