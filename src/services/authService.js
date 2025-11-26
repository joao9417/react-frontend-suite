import axios from "axios";

//URL base para la api versionada
const API_URL = 'http://127.0.0.1:8000/api/v1/';
//instancia de axios
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

//funcion para registrar un nuevo usuario
//endpoint: /api/v1/register/
const register = async (userData) => {
    try {
        const response = await api.post('register/', userData);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
};

//funcion para iniciar sesion y obtener tokens
//endpoint: /api/v1/login/
const login = async (credentials) => {
    try {
        const response = await api.post('login/', credentials);
        
        //el backend devuelve tokens y datos de usuario, se guardan en localStorage
        if (response.data.access) {
            localStorage.setItem('accessToken', response.data.access);
            localStorage.setItem('refreshToken', response.data.refresh);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }

        return response.data;
    } catch (error){
        throw error.response ? error.response.data : error;
    }
};

const authService = {
    register,
    login,
};

export default authService;
