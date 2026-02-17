import { api } from './authService';

const API_ENDPOINT = 'presupuestos/';

// Listar todos los presupuestos
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
//se usa patch para actualizar parcialmente y no enviar todos los campos
export const updatePresupuesto = async (id, data) => {
    const response = await api.patch(`${API_ENDPOINT}${id}/`, data);
    return response.data;
};

//eliminar presupuesto
export const deletePresupuesto = async (id) => {
    const response = await api.delete(`${API_ENDPOINT}${id}/`);
    return response.data;
};

// Obtener presupuestos eliminados (papelera)
export const getPresupuestosEliminados = async () => {
    // Asumimos que el backend filtra por ?activo=False
    const response = await api.get(`${API_ENDPOINT}?activo=False`);
    return response.data;
};

// Restaurar presupuesto (activo=True)
export const restorePresupuesto = async (id) => {
    const response = await api.patch(`${API_ENDPOINT}${id}/restaurar/`, {});
    return response.data;
};

// Compartir presupuesto (Clonar y asignar)
export const compartirPresupuesto = async (id, userId) => {
    const response = await api.post(`${API_ENDPOINT}${id}/transferir_copia/`, { usuario_id: userId });
    return response.data;
};

// Devolver versión (Clonar de vuelta al dueño)
export const devolverPresupuesto = async (id) => {
    const response = await api.post(`${API_ENDPOINT}${id}/devolver_version/`, {});
    return response.data;
};

// Obtener versiones de un presupuesto
export const getVersiones = async (id) => {
    const response = await api.get(`${API_ENDPOINT}${id}/versiones/`);
    return response.data;
};

// Empaquetamos todos los servicios en un objeto para exportarlos juntos
const presupuestoService = {
    getPresupuestos,
    crearPresupuesto,
    getEspecialidades,
    getPresupuestoById,
    updatePresupuesto,
    deletePresupuesto,
    getPresupuestosEliminados,
    restorePresupuesto,
    compartirPresupuesto,
    devolverPresupuesto,
    getVersiones,
};

// Exportamos el objeto con todos los servicios
export default presupuestoService;