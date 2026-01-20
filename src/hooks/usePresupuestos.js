import { useState } from 'react';
import presupuestoService from '../services/presupuestoService';
import { toast } from 'react-hot-toast';

export const usePresupuestos = () => {
    const [loading, setLoading] = useState(false);
    const [presupuestos, setPresupuestos] = useState([]);
    const [especialidades, setEspecialidades] = useState([]);

    // Función para crear presupuesto
    const handleCrear = async (data) => {
        try {

            setLoading(true);
            const response = await presupuestoService.crearPresupuesto(data);
            toast.success(response.message || 'Presupuesto creado exitosamente');
            return { success: true, data: response };

        } catch (error) {
            // Escribir en consola el error completo para depuración
            console.log("Respuesta completa del error de Django:", error.response?.data);
            console.error('Error creando presupuesto:', error);
            
            const errorMessage = error.response?.data?.error || 
                                error.response?.data?.message || 
                                'Error al crear presupuesto';
            
            toast.error(errorMessage);
            return {
                success: false,
                error: errorMessage
            };
        } finally {
            setLoading(false);
        }
    };

    // Función para cargar presupuestos
    const cargarPresupuestos = async () => {
        try {
            setLoading(true);
            const data = await presupuestoService.getPresupuestos();
            console.log('Presupuestos cargados:', data);
            setPresupuestos(data);
            return data;
        } catch (error) {
            toast.error('Error al cargar presupuestos');
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // Función para cargar especialidades
    const cargarEspecialidades = async () => {
        try {
            console.log('Cargando especialidades...');
            const data = await presupuestoService.getEspecialidades();
            console.log('Especialidades cargadas:', data);
            setEspecialidades(data);
            return data;
        } catch (error) {
            toast.error('Error al cargar especialidades');
            throw error;
        }
    };

    // Función para eliminar presupuesto
    const eliminarPresupuesto = async (id) => {
        try {
            setLoading(true);
            await presupuestoService.deletePresupuesto(id);
            toast.success('Presupuesto eliminado');
            
            // Actualizar lista local
            setPresupuestos(prev => prev.filter(p => p.id !== id));
            
            return { success: true };
        } catch (error) {
            toast.error('Error al eliminar presupuesto');
            return { success: false, error };
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        presupuestos,
        especialidades,
        handleCrear,
        cargarPresupuestos,
        cargarEspecialidades,
        eliminarPresupuesto,
        setPresupuestos,
    };
};