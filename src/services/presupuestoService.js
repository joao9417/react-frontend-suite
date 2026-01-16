import { api } from './authService';

const API_ENDPOINT = 'presupuestos/';

export const getPresupuestos = async () => {
    const response = await api.get(API_ENDPOINT);
    return response.data;
};

// Usamos el action personalizado que cree en Django @action(detail=False)
export const crearPresupuesto = async (data) => {
    const response = await api.post(`${API_ENDPOINT}crear_presupuesto/`, data);
    return response.data;
};

// Para el formulario necesitamos las especialidades
export const getEspecialidades = async () => {
    const response = await api.get('especialidades/');
    return response.data;
};

// consegir presupuesto por id (detalle)
export const getPresupuestoById = async (id) => {
    const response = await api.get(`${API_ENDPOINT}${id}/`);
    return response.data;
};

//actualizar presupuesto
export const updatePresupuesto = async (id, data) => {
    const response = await api.patch(`${API_ENDPOINT}${id}/`, data);
    return response.data;
};

//eliminar presupuesto
export const deletePresupuesto = async (id) => {
    const response = await api.delete(`${API_ENDPOINT}${id}/`);
    return response.data;
};


export default {
    getPresupuestos,
    crearPresupuesto,
    getEspecialidades,
    getPresupuestoById,
    updatePresupuesto,
    deletePresupuesto,
};