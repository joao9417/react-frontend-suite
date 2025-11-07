import axios from "axios";

//definir la URL base del backend de django
const BASE_URL = "http://127.0.0.1:8000/api/";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

//******** INTERCEPTOR DE RESPUESTAS ********
//captura de respuestas para manejar expiracion de tokens
axiosInstance.interceptors.response.use((response) => {
  const originalRequest = error.config;

  //si el error es 401 (no autorizado) y no es un intento de refresh de token
  if (
    error.response &&
    error.response.status === 401 &&
    !originalRequest._retry
  ) {
    //agregar logica de refrescar el token si usa refresh tokens
    //se forzara el logout (temporalmente) si el token es invalido o expira

    //marca la peticion como reintentada
    originalRequest._retry = true;

    //borrar el token (forzando logout)
    localStorage.removeItem("authToken");

    //Redirigil al login (necesitaras acceder al router o forzar un estado)
    //para forzar la redireccion desde aqui, se suele usar una libreria o
    //simplemente dejar que el AuthContext se encarge de chequear LocalStorage.

    window.location.href = "/login"; //solucion temporal para forzar navegacion

    return Promise.reject(error);
  }

  return Promise.reject(error);
});


//******** INTERCEPTOR DE PETICIONES ********
//se debe adjuntar el token al header de autorizacion antes de cada peticion
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;