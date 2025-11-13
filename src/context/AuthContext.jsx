import React, { createContext, useContext } from "react";

// Creación del contexto
export const AuthContext = createContext();

// Hook para usar el contexto fácilmente
// Nota: Este hook se mantendrá, pero useAuth() no funcionará
// correctamente si no tienes un <AuthProvider> que lo envuelva.
export const useAuth = () => useContext(AuthContext);

// Proveedor del contexto (completamente vacío)
// Se mantiene la estructura para que puedas rellenarla más tarde.
export const AuthProvider = ({ children }) => {
  // Los valores iniciales para un contexto vacío
  const contextValue = {
    isAuthenticated: false,
    user: null,
    loading: false,
    login: () => console.log("Login no implementado"),
    register: () => console.log("Register no implementado"),
    logout: () => console.log("Logout no implementado"),
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Se eliminó:
// - importaciones de useState, useEffect.
// - importaciones de axiosInstance.
// - Toda la lógica interna de login, register, logout, y useEffect.
// - El estado (isAuthenticated, UserActivation, loading).