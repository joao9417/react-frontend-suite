import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  Children,
} from "react";
import axiosInstance from "../api/axiosInstance";

//creacion del contexto
export const AuthContext = createContext();

//Hook para usar el contexto facilmente
export const useAuth = () => useContext(AuthContext);

//el proveedor del contexto
export const AuthProvider = ({ Children }) => {
  const [isAuthenticated, setItsAuthenticated] = useState(false);
  const [UserActivation, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  //funcion para cargar el estado inicial desde localStorage
  useEffect(() => {
    const token = localStorage.getItem("authToken");

    //verificamos si el token existe
    if (token) {
      setItsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  //funcion para login
  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await axiosInstance.post("token/", { email, password });
      const { access, refresh } = response.data; // Django JWT devuelve 'access' y 'refresh'

      localStorage.setItem("autheToken", access);

      setItsAuthenticated(true);
      setLoading(false);
      return true;
    } catch (error) {
      console.error(
        "Error en el login:",
        error.response ? error.response.data : error.message
      );
      setItsAuthenticated(false);
      setLoading(false);
      return false;
    }
  };

  //funcion para register
  const register = async (userData) => {
    setLoading(true);
    try {
      await axiosInstance.post("auth/register/", userData);
      setLoading(false);
      return true;
    } catch (error) {
      console.error(
        "Error en el registro:",
        error.response ? error.response.data : error.message
      );
      setLoading(false);
      return false;
    }
  };

  //funcion para logout
  const logout = () => {
    localStorage.removeItem("authToken");
    setItsAuthenticated(false);
    setUser(null);
  };

  const contextValue = {
    isAuthenticated,
    user,
    loading,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {loading ? <div>Cargando sesion...</div> : Children}
    </AuthContext.Provider>
  );
};
