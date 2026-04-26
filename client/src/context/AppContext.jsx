import { createContext, useContext, useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-hot-toast';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;
const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const navigate = useNavigate();

  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
  const [blogs, setBlogs] = useState([]);
  const [input, setInput] = useState("");

  const fetchBlogs = useCallback(async () => {
    try {
      const res = await axios.get("/api/blogs");
      setBlogs(res.data.blogs);
    } catch (error) {
      // Only toast if it's not a 401 (unauthorized) to avoid spamming guests
      if (error.response?.status !== 401) {
        toast.error(error.response?.data?.message || "Failed to fetch blogs");
      }
    }
  }, []);

  // Sync axios headers whenever token changes
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchBlogs();
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token, fetchBlogs]);

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
    toast.success("Logged out successfully");
  };

  const value = {
    axios,
    navigate,
    token,
    setToken,
    user,
    setUser,
    logout,
    blogs,
    setBlogs,
    input,
    setInput,
    fetchBlogs,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);
