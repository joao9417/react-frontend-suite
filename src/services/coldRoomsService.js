import { api } from './authService';

const API_ENDPOINT = 'coldrooms/';

export const getColdRoomsByPresupuesto = async (presupuestoId) => {
    const response = await api.get(`${API_ENDPOINT}por_presupuesto/`, {
        params: { presupuesto_id: presupuestoId }
    });
    return response.data;
};

export const createColdRoom = async (data) => {
    const response = await api.post(API_ENDPOINT, data);
    return response.data;
};

export const getColdRoomResumen = async (id) => {
    const response = await api.get(`${API_ENDPOINT}${id}resumen/`);
    return response.data;
};

export const deleteColdRoom = async (id) => {
    const response = await api.delete(`${API_ENDPOINT}${id}/`);
    return response.data;
};

const coldRoomsService = {
    getColdRoomsByPresupuesto,
    createColdRoom,
    getColdRoomResumen,
    deleteColdRoom
};

export default coldRoomsService;