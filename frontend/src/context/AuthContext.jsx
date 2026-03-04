import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

const AuthContext = createContext();

//children is a special React prop that represents whatever is wrapped inside a component.
//This is a common pattern in React for creating reusable layout or wrapper components.

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("userInfo");
    return stored ? JSON.parse(stored) : null;
  });

  const [users, setUsers] = useState([]); // List of all users (for Reports/Admin)

  // Load user from storage on mount
  useEffect(() => {
    const stored = localStorage.getItem("userInfo");
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  // Fetch all users if logged in (needed for Reports page)
  useEffect(() => {
    if (user) {
      fetchUsers();
    }
  }, [user]);

  const fetchUsers = async () => {
    try {
      const { data } = await api.get("/users");
      // Map _id to id for frontend compatibility if needed, or handle in components
      const mappedUsers = data.map((u) => ({ ...u, id: u._id }));
      setUsers(mappedUsers);
    } catch (error) {
      console.error("Failed to fetch users", error);
    }
  };

  // Keep the audit log local for now (Visual only)
  const addAuditLog = ({ email, success }) => {
    const logs =
      JSON.parse(localStorage.getItem("nexus_audit_logs")) || [];
    logs.unshift({
      email,
      success,
      time: new Date().toLocaleString(),
    });
    localStorage.setItem(
      "nexus_audit_logs",
      JSON.stringify(logs.slice(0, 20))
    );
  };

  const login = async (email, password) => {
    try {
      const { data } = await api.post("/auth/login", { email, password });

      // Save entire user object + token
      localStorage.setItem("userInfo", JSON.stringify(data));
      setUser(data);

      addAuditLog({ email, success: true });
      return { success: true };
    } catch (error) {
      addAuditLog({ email, success: false });
      return {
        success: false,
        message: error.response?.data?.message || "Invalid credentials"
      };
    }
  };

  const register = async ({ name, email, password }) => {
    try {
      await api.post("/auth/register", { name, email, password });
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "User already exists"
      };
    }
  };

  const forgotPassword = async (email) => {
    try {
      await api.post("/auth/forgot-password", { email });
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Something went wrong"
      };
    }
  };

  const resetPassword = async (token, password) => {
    try {
      await api.put(`/auth/reset-password/${token}`, { password });
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Invalid or expired token"
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("userInfo");
    setUser(null);
    setUsers([]);
  };

  const deleteUser = async (id) => {
    try {
      // id might be _id from mongo, make sure to pass correct ID
      await api.delete(`/users/${id}`);
      // Optimistic update
      setUsers(users.filter((u) => u.id !== id && u._id !== id));
    } catch (error) {
      console.error("Failed to delete user", error);
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const { data } = await api.put("/auth/profile", profileData);
      localStorage.setItem("userInfo", JSON.stringify(data));
      setUser(data);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to update profile",
      };
    }
  };

  const loginWithToken = async (token) => {
    try {
      // We can either fetch the profile immediately or just trust the token if we store the user info in JWT (not recommended for full profile).
      // Here, let's fetch the profile to be safe and get full user data.
      const { data } = await api.get("/auth/profile", {
        headers: { Authorization: `Bearer ${token}` }
      });

      const userInfo = { ...data, token };
      localStorage.setItem("userInfo", JSON.stringify(userInfo));
      setUser(userInfo);
      return { success: true };
    } catch (error) {
      console.error("Token login failed", error);
      return { success: false, message: "Authentication failed" };
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, users, login, logout, register, deleteUser, forgotPassword, resetPassword, updateProfile, loginWithToken }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
