import { createContext, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import API from "../api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("profile")));
  const navigate = useNavigate();

  const login = async (formData) => {
    try {
      const { data } = await API.post("/auth/login", formData);
      if (data.requiresTwoFactor) {
        navigate("/verify-2fa", { state: { userId: data.userId } });
        return;
      }
      localStorage.setItem("profile", JSON.stringify(data));
      setUser(data);
      toast.success("Logged in successfully!");
      navigate("/dashboard");
    } catch (error) {
      const msg = error.response?.data?.message || "Login failed";
      toast.error(msg);
      throw msg;
    }
  };

  const register = async (formData) => {
    try {
      const { data } = await API.post("/auth/register", formData);
      localStorage.setItem("profile", JSON.stringify(data));
      setUser(data);
      toast.success("Registration successful!");
      navigate("/dashboard");
    } catch (error) {
      const msg = error.response?.data?.message || "Registration failed";
      toast.error(msg);
      throw msg;
    }
  };

  const logout = () => {
    localStorage.removeItem("profile");
    setUser(null);
    toast.success("Logged out successfully!");
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
