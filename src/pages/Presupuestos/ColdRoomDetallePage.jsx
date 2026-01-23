import React, { useEffect, useState } from 'react';

import { useParams } from 'react-router-dom';

import equiposService from '../../services/equiposService';
import coldRoomsService from '../../services/coldRoomsService';

import ModalAgregarEquipo from '../../components/presupuestos/ModalAgregarEquipo';

import { Plus, Wind, Activity, Trash2, Zap, Settings } from 'lucide-react';


const ColdRoomDetallePage = () => {
    const { presupuestoId, cuartoId } = useParams();
    
    // Estados
    const [cuarto, setCuarto] = useState(null); //info general
    const [equipos, setEquipos] = useState([]); //lista de equipos
    const [resumen, setResumen] = useState(null); // total Kw, Amp
    const [loading, setLoading] = useState(true);

    const [showModal, setShowModal] = useState(false);

    const cargarDatos = async () => {
        try {
            setLoading(true);

            const infoCuarto = await coldRoomsService.getColdRoomById(cuartoId);
            setCuarto(infoCuarto);

            const dataEquipos = await equiposService.getEquipoPorCuarto(cuartoId);
            setEquipos(dataEquipos.equipos);
            setResumen(dataEquipos.resumen_electrico);
        } catch (error) {
            console.error("Error al cargar la ingenieria", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarDatos();
    }, [cuartoId]);

    if (loading) return <div className='p-10 text-center'>Cargando panel de Ingenieria</div>;

    return (
        <div className="p-8 w-full bg-gray-50 min-h-screen">
            {/* ENCABEZADO: Info del Cuarto y Resumen Eléctrico */}
            <div className="flex justify-between items-start mb-8 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div>
                    <span className="text-blue-600 font-bold text-xs uppercase tracking-widest">Ingeniería Aplicada</span>
                    <h1 className="text-3xl font-black text-gray-800">{cuarto?.nombre_cuarto}</h1>
                    <div className="flex gap-4 mt-2 text-sm text-gray-500">
                        <span>Temp: <strong className="text-gray-700">{cuarto?.temperatura_requerida}°C</strong></span>
                        <span>Volumen: <strong className="text-gray-700">{cuarto?.volumen} m³</strong></span>
                    </div>
                </div>
                
                <div className="flex gap-4">
                    <div className="text-right px-4 border-r">
                        <p className="text-xs text-gray-400 font-bold uppercase">Potencia Instalada</p>
                        <p className="text-2xl font-black text-blue-600">{resumen?.potencia_total_kw.toFixed(2)} <span className="text-sm">kW</span></p>
                    </div>
                    <div className="text-right px-4">
                        <p className="text-xs text-gray-400 font-bold uppercase">Consumo Estimado</p>
                        <p className="text-2xl font-black text-orange-500">{resumen?.consumo_total_a.toFixed(2)} <span className="text-sm">A</span></p>
                    </div>
                </div>
            </div>

            {/* BARRA DE ACCIONES */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-700 flex items-center gap-2">
                    <Activity className="text-blue-500" /> Equipos del Sistema
                </h2>
                <button
                    onClick={() => setShowModal(true)} 
                    className="bg-gray-900 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-600 transition-all shadow-lg hover:shadow-blue-200"
                >
                    <Plus size={20} /> Agregar Equipo
                </button>
            </div>

            {/* LISTADO DE EQUIPOS (Basado en tu Serializer de Django) */}
            <div className="grid grid-cols-1 gap-4">
                {equipos.length === 0 ? (
                    <div className="bg-white border-2 border-dashed border-gray-200 rounded-2xl p-20 text-center">
                        <Wind className="mx-auto text-gray-300 mb-4" size={50} />
                        <h3 className="text-gray-500 font-bold text-lg">No hay equipos configurados</h3>
                        <p className="text-gray-400">Haz clic en "Agregar Equipo" para comenzar.</p>
                    </div>
                ) : (
                    equipos.map((eq) => (
                        <div key={eq.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:border-blue-300 transition-colors flex justify-between items-center group">
                            <div className="flex items-center gap-5">
                                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                                    <Zap size={24} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-800 text-lg">{eq.nombre}</h4>
                                    <p className="text-sm text-gray-500 font-medium">
                                        {eq.marca} · {eq.modelo} | <span className="capitalize text-blue-500">{eq.tipo_equipo}</span>
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-8">
                                <div className="text-right">
                                    <p className="text-[10px] text-gray-400 uppercase font-bold tracking-tighter">Potencia Eq.</p>
                                    <p className="font-bold text-gray-700">{eq.resumen_electrico?.potencia_watts} W</p>
                                </div>
                                <button className="opacity-0 group-hover:opacity-100 p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
            <ModalAgregarEquipo
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                cuartoId={cuartoId}
                onSuccess={cargarDatos}
            />
        </div>
    );
};

export default ColdRoomDetallePage;