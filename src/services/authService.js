import axios from "axios";


//URL base para la api versionada
const API_URL = 'http://127.0.0.1:8000/api/v1/';

// 1. Creamos la instancia base de axios
export const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// 2. INTERCEPTOR DE PETICION (Request)
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// 3. INTERCEPTOR DE RESPUESTA (Response)
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true; 

            try {
                const refresh = localStorage.getItem('refreshToken');
                const res = await axios.post(`${API_URL}token/refresh/`, { refresh });

                const newAccessToken = res.data.access;
                localStorage.setItem('accessToken', newAccessToken);

                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return api(originalRequest);
            } catch (err) {
                localStorage.clear();
                window.location.href = '/login';
                return Promise.reject(err);
            }
        }
        return Promise.reject(error);
    }
);

//funcion para registrar un nuevo usuario
//endpoint: /api/v1/register/
export const register = async (userData) => {
    try {
        const response = await api.post('register/', userData);
        return response.data;       
    } catch (error){
        throw error.response ? error.response.data : error;
    }
};

//funcion para iniciar sesion y obtener tokens
//endpoint: /api/v1/login/
export const login = async (credentials) => {
    try {
        const response = await api.post('login/', credentials);
        if (response.data.access) {
            localStorage.setItem('accessToken', response.data.access);
            localStorage.setItem('refreshToken', response.data.refresh);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
};

//funcion para cerrar sesion y limpiar tokens
//endpoint: /api/v1/logout/
export const logout = async () => {
    try {
        const refreshToken = localStorage.getItem('refreshToken');
        
        // Llamada al backend para invalidar el token en la Blacklist
        if (refreshToken) {
            await api.post('logout/', { refresh: refreshToken });
        }
    } catch (error) {
        // Logueamos el error pero continuamos con la limpieza del local
        console.error("Error comunicando logout al servidor:", error);
    } finally {
        // Limpieza física del almacenamiento SIEMPRE
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        localStorage.clear(); // Opcional: Limpieza total por seguridad
    }
};

//obtener lista de usuarios (para compartir)
export const getUsers = async () => {
    const response = await api.get('users/');
    return response.data;
};

const authService = {
    api,
    register,
    login,
    logout,
    getUsers, // Added to export
};

export default authService;

