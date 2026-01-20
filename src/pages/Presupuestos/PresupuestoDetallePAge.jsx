import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import presupuestoService from '../../services/presupuestoService';

const PresupuestoDetallePage = () => {
    const { id } = useParams(); 
    const navigate = useNavigate();
    const [presupuesto, setPresupuesto] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const cargarDatos = async () => {
            try {
                setLoading(true);
                const data = await presupuestoService.getPresupuestoById(id);
                setPresupuesto(data);
            } catch (err) {
                console.error("Error al cargar el presupuesto:", err);
                setError("No se pudo cargar la información del presupuesto.");
            } finally {
                setLoading(false);
            }
        };

        if (id) cargarDatos();
    }, [id]);

    if (loading) return <div className="p-6">Cargando detalles del proyecto...</div>;
    if (error) return <div className="p-6 text-red-500">{error}</div>;

    return (
        <div className="p-6">
            {/* Cabecera con botón de volver */}
            <div className="flex items-center justify-between mb-6">
                <button 
                    onClick={() => navigate('/home')}
                    className="text-blue-600 hover:underline"
                >
                    ← Volver al Dashboard
                </button>
                <span className="text-gray-500 text-sm">Consecutivo: #{presupuesto?.consecutivo}</span>
            </div>

            {/* Información del Proyecto */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                    {presupuesto?.nombre_proyecto}
                </h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <p><strong>Ingeniero:</strong> {presupuesto?.nombre_ingeniero_responsable}</p>
                    <p><strong>Cliente:</strong> {presupuesto?.cliente || 'Pendiente'}</p>
                </div>
            </div>

            {/* SECCIÓN DE CUARTOS FRÍOS (Lo que vamos a desarrollar ahora) */}
            <div className="mt-10">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Cuartos Fríos / Áreas</h2>
                    <button 
                        className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                        onClick={() => console.log("Abrir modal de nuevo cuarto frío")}
                    >
                        + Agregar Cuarto / Área
                    </button>
                </div>

                {/* Placeholder para la lista de cuartos fríos */}
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-10 text-center text-gray-500">
                    Aún no hay cuartos fríos registrados en este presupuesto.
                    Empieza agregando uno para calcular los equipos.
                </div>
            </div>
        </div>
    );
};

export default PresupuestoDetallePage;