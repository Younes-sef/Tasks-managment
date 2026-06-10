import axios from "axios";

const API_URL = 'http://localhost:3001/auth';

// Register
export const register = async (userData: {
  name: string,
  email: string,
  password: string,
  role: 'admin' | 'user'
}) => {
  try {
    const response = await axios.post(`${API_URL}/register`, userData);

    const { user, token } = response.data;

    // Save to localStorage
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", token);

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data.message || 'Registration failed');
    }
    throw error;
  }
};

// Login
export const login = async (userData: { email: string, password: string }) => {
  try {
    const response = await axios.post(`${API_URL}/login`, userData);

    const { user, token } = response.data;

    // Save to localStorage
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", token);

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data.message || 'Login failed');
    }
    throw error;
  }
};
