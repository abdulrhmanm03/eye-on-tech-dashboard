// context/AuthContext.tsx
import React, { createContext, useContext, useState } from "react";

interface AuthContextType {
  token: string | null;
  username: string | null;
  role: string | null;
  id: number | null;
  login: (data: {
    token: string;
    username: string;
    role: string;
    id: number;
  }) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  token: null,
  username: null,
  role: null,
  id: null,
  login: () => {},
  logout: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token"),
  );
  const [username, setUsername] = useState<string | null>(
    localStorage.getItem("username"),
  );
  const [role, setRole] = useState<string | null>(localStorage.getItem("role"));
  const [id, setId] = useState<number | null>(
    localStorage.getItem("id") ? Number(localStorage.getItem("id")) : null,
  );

  const login = ({
    token,
    username,
    role,
    id,
  }: {
    token: string;
    username: string;
    role: string;
    id: number;
  }) => {
    setToken(token);
    setUsername(username);
    setRole(role);
    setId(id);

    localStorage.setItem("token", token);
    localStorage.setItem("username", username);
    localStorage.setItem("role", role);
    localStorage.setItem("id", id.toString());
  };

  const logout = () => {
    setToken(null);
    setUsername(null);
    setRole(null);
    setId(null);

    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    localStorage.removeItem("id");
  };

  return (
    <AuthContext.Provider value={{ token, username, role, id, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
