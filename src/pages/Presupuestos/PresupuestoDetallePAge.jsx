import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import presupuestoService from '../../services/presupuestoService';
import coldRoomsService from '../../services/coldRoomsService';
import ColdRoomModal from '../../components/presupuestos/ColdRoomModal';

const PresupuestoDetallePage = () => {
    const { id } = useParams(); 
    const navigate = useNavigate();
    const [presupuesto, setPresupuesto] = useState(null);
    const [coldRooms, setColdRooms] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Función para cargar todos los datos
    const cargarTodo = async () => {
        try {
            setLoading(true);
            const [dataPresupuesto, dataCuartos] = await Promise.all([
                presupuestoService.getPresupuestoById(id),
                coldRoomsService.getColdRoomsByPresupuesto(id)
            ]);
            setPresupuesto(dataPresupuesto);
            setColdRooms(dataCuartos.cold_rooms || []);
        } catch (err) {
            console.error("Error al cargar datos:", err);
            setError("No se pudo cargar la información del proyecto.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) cargarTodo();
    }, [id]);

    // Función para manejar la creación desde el modal
    const handleAddColdRoom = async (formData) => {
        try {
            await coldRoomsService.createColdRoom(formData);
            setIsModalOpen(false); // Cerrar modal
            cargarTodo(); // Recargar lista para ver el nuevo cuarto
        } catch (err) {
            console.error("Error al crear cuarto frío:", err);
            alert("No se pudo crear el cuarto frío. Verifique los datos.");
        }
    };

    if (loading) return <div className="p-6">Cargando detalles del proyecto...</div>;
    if (error) return <div className="p-6 text-red-500">{error}</div>;

    return (
        <div className="p-6">
            {/* Cabecera */}
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
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8 border">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                    {presupuesto?.nombre_proyecto}
                </h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <p><strong>Ingeniero:</strong> {presupuesto?.nombre_ingeniero_responsable}</p>
                    <p><strong>Cliente:</strong> {presupuesto?.cliente || 'Pendiente'}</p>
                </div>
            </div>

            {/* SECCIÓN DE CUARTOS FRÍOS */}
            <div className="mt-10">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold">Cuartos Fríos / Áreas</h2>
                    <button 
                        className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                        onClick={() => setIsModalOpen(true)} // Abrir modal
                    >
                        + Agregar Cuarto / Área
                    </button>
                </div>

                {coldRooms.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {coldRooms.map((room) => (
                            <div key={room.id} className="bg-white border rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow">
                                <h3 className="font-bold text-lg text-blue-700 mb-2">{room.nombre_cuarto}</h3>
                                <div className="text-sm text-gray-600 space-y-1">
                                    <p>🌡️ <strong>Temp:</strong> {room.temperatura_requerida}ºC</p>
                                    <p>📏 <strong>Dim:</strong> {room.ancho}m x {room.largo}m x {room.alto}m</p>
                                    <p className="text-gray-900 font-semibold">📦 <strong>Volumen:</strong> {room.volumen}m³</p>
                                </div>
                                <button className="mt-4 w-full py-2 text-sm text-blue-600 font-medium border border-blue-100 rounded hover:bg-blue-50">
                                    Ver Detalles
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-10 text-center text-gray-500">
                        No hay cuartos fríos o áreas agregadas aún.
                    </div>
                )}
            </div>

            {/* Componente Modal */}
            <ColdRoomModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onSubmit={handleAddColdRoom}
                presupuestoId={id}
            />
        </div>
    );
};

export default PresupuestoDetallePage;