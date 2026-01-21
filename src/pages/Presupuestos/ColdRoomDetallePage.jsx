import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import coldRoomsService from '../../services/coldRoomsService';

const ColdRoomDetallePage = () => {
    const { presupuestoId, cuartoId } = useParams();
    const [cuarto, setCuarto] = useState(null);

    useEffect(() => {
        // Aquí cargarías la info específica de este cuarto
        const cargarDetalleCuarto = async () => {
            const data = await coldRoomsService.getColdRoomById(cuartoId);
            setCuarto(data);
        };
        cargarDetalleCuarto();
    }, [cuartoId]);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold">Panel de Ingeniería: {cuarto?.nombre_cuarto}</h1>
            <p className="text-gray-500">Configuración de equipos</p>
            
            {/* Aquí irán las secciones de Equipos Seleccionados */}
        </div>
    );
};

export default ColdRoomDetallePage;