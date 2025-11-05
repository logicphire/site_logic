import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

interface User {
  id: number;
  email: string;
  nome: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar se há um usuário logado
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('userData');
    
    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error('Erro ao carregar dados do usuário:', error);
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    console.log('🔐 Tentando fazer login com:', email);
    try {
      const response = await api.post('/auth/login', { email, password });
      console.log('✅ Resposta do servidor:', response.data);
      const { token, user: userData } = response.data;
      
      localStorage.setItem('authToken', token);
      localStorage.setItem('userData', JSON.stringify(userData));
      setUser(userData);
      console.log('✅ Login bem-sucedido!');
    } catch (error: any) {
      console.error('❌ Erro no login:', error.response?.data || error.message);
      throw error;
    }
  };

  const logout = async () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
