import { api } from './authService';

const API_ENDPOINT = 'equipos/';

const equiposService = {

    // Obtener equipos filtrados por cuarto frio
    getEquipoPorCuarto: async (coldRoomId) => {
        const response = await api.get(`${API_ENDPOINT}por_cuarto/`,{
            params: { cold_room_id: coldRoomId}
        });
        return response.data;
    },

    // Obtener configuracion dinamica (campos, opciones, unidades)
    getTiposConfig: async () => {
        const response = await api.get(`${API_ENDPOINT}tipos_disponibles/`);
        return response.data;
    },

    // Crear un nuevo equipo (polimorfico)
    createEquipo: async (data) => {
        const response = await api.post(`${API_ENDPOINT}`, data);
        return response.data;
    },

    // Eliminar equipo
    deleteEquipo: async (id) => {
        await api.delete(`${API_ENDPOINT}${id}/`);
    }
};

export default equiposService;