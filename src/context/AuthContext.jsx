import React, { createContext, useState, useContext, useEffect } from 'react';
import toast from 'react-hot-toast';
import authService from '../services/authService';
import { useNavigate } from 'react-router-dom';

//Creacion el Contexto
const AuthContext = createContext(null);

//Hook personalizado para usar el contexto fácilmente
export const useAuth = () => useContext(AuthContext);

//Componente Provider
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); // Almacena {id, username, email}
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();


    //Funcion auxiliar para obtener el usuario de los datos de respuesta
    const getUserFromResponse = (data) => {
        //El backend devuelve los datos del usuario bajo la clave 'user'
        return data.user || null;
    };

    //Logica de Inicializacion
    useEffect(() => {
        // Simular la carga inicial. En un proyecto más grande, verificarías el token aquí.
        const accessToken = localStorage.getItem('accessToken');
        const userData = localStorage.getItem('user'); 
        
        if (accessToken && userData) {
            try {
                setUser(JSON.parse(userData));
                setIsAuthenticated(true);
            } catch (error) {
                console.error("Error al parsear datos de usuario:", error);
                logout();
            }
        } else {
            setIsAuthenticated(false);
            setUser(null);  
        }
        setLoading(false);
    }, []);

    //Logica de Login
    const login = async (credentials) => {
        try {
            const data = await authService.login(credentials);
            
            //Guardar tokens en localStorage (ya se hizo en authService, pero lo verificamos)
            const accessToken = data.access;
            const refreshToken = data.refresh;
            const userData = getUserFromResponse(data);

            if (accessToken && userData) {
                localStorage.setItem('accessToken', accessToken);
                localStorage.setItem('refreshToken', refreshToken);
                localStorage.setItem('user', JSON.stringify(userData));
                
                //Actualizar estado global
                setUser(userData);
                setIsAuthenticated(true);
                toast.success(`Bienvenido, ${userData.username}!`);
                
                navigate('/home');
                return true;
            }
            return false;
        } catch (error) {
            const errorMessage = "Credenciales inválidas.";
            toast.error(errorMessage);
            throw error;
        }
    };

    //Logica de Logout
    const logout = async () => {
        try {
            // 1. Esperamos a que el servicio limpie el backend y el storage
            await authService.logout(); 
        } catch (error) {
            console.error("Error en logout:", error);
        } finally {
            // 2. IMPORTANTE: Limpiamos el estado de React SIEMPRE
            setUser(null);
            setIsAuthenticated(false);
            
            // 3. Forzamos la redirección
            navigate('/login', { replace: true });
        }
    };


    const contextValue = {
        user,
        isAuthenticated,
        loading,
        login,
        logout,
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {loading ? <div>Cargando sesión...</div> : children} 
        </AuthContext.Provider>
    );
};