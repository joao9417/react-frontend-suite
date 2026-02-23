import React, { useState, useEffect } from "react";
import { X, Plus, Trash2, Zap, Settings } from "lucide-react";
import equiposService from "../../services/equiposService";
import authService from "../../services/authService";

const ModalAgregarEquipo = ({ isOpen, onClose, cuartoId, onSuccess }) => {
    const [config, setConfig] = useState(null);
    const [tipoSeleccionado, setTipoSeleccionado] = useState('evaporador');
    const [cargandoConfig, setCargandoConfig] = useState(true);

    // Estado del formulario
    const [formData, setFormData] = useState({
        tipo_equipo: 'bomba_glicol',
        nombre: '',
        marca: '',
        modelo: '',
        tipo_bomba: 'centrifuga',
        caudal_nominal: '',
        presion_trabajo: '',
        altura_elevacion: '',
        temperatura_maxima: '',
        cantidad: 1,
        motores: [],
        resistencias: []
    });

    // Cargar la configuracion dinamica desde el viewset (tipos_disponibles)
    useEffect(() => {
        const cargarConfig = async () => {
            try {
                setCargandoConfig(true);
                const data = await equiposService.getTiposConfig();
                setConfig(data);
            } catch (error) {
                console.error("Error cargando configuracion", error);
            } finally {
                setCargandoConfig(false);
            }
        };
        if (isOpen) cargarConfig();
    }, [isOpen]);

    // manejar cambios en campos dinamicos
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // reseteamos los campos especificos para evitar basura de otros equipos
    const handleTipoChange = (e) => {
        const nuevoTipo = e.target.value;
        setTipoSeleccionado(nuevoTipo);
    };

    // logica para motores dinamicos
    const agregarMotor = () => {
        setFormData(prev => ({
            ...prev,
            motores: [...prev.motores, { nombre: '', tension: 220, potencia_watts: 0, fases: 'monofasico', consumo_amperios: 0 }]
        }));
    };

    const actualizarMotor = (index, campo, valor) => {
        const nuevosMotores = [...formData.motores];
        nuevosMotores[index][campo] = valor;
        setFormData(prev => ({ ...prev, motores: nuevosMotores}));
    };

    const eliminarMotor = (index) => {
        setFormData(prev => ({
            ...prev,
            motores: prev.motores.filter((_, i) => i !== index)
        }));
    };

    // envio al backend
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Campos base que todos tienen
            const payload = {
                tipo_equipo: tipoSeleccionado,
                cold_room: cuartoId,
                nombre: formData.nombre,
                marca: formData.marca,
                modelo: formData.modelo,
                cantidad: parseInt(formData.cantidad) || 1,
                motores: formData.motores.map(m => ({
                    ...m,
                    potencia_watts: parseFloat(m.potencia_watts) || 0,
                    consumo_amperios: parseFloat(m.consumo_amperios) || 0
                })),
                resistencias: formData.resistencias
            };

            if (tipoActual && tipoActual.campos_especificos) {
                tipoActual.campos_especificos.forEach(campo => {
                    const valor = formData[campo.nombre];

                    // validacion logica
                    //si el campo es de tipo 'choice', lo enviamos como texto
                    //si el campo es 'decimal' lo convertimos a numero
                    if (campo.tipo === 'choice'){
                        payload[campo.nombre] = valor || null;
                    } else if (campo.tipo === 'decimal' || campo.tipo === 'number'){
                        payload[campo.nombre] = (valor === '' || valor === undefined) ? null : parseFloat(valor);
                    } else {
                        payload[campo.nombre] = valor;
                    }
                });
            }

            console.log("Enviando este playload limpio:", payload);
            await equiposService.createEquipo(payload);

            onSuccess();
            onClose();
        } catch (error) {
            const erroresBackend = error.response?.data;
            console.error("Errores del servidor", erroresBackend);
            alert(`Error: ${JSON.stringify(erroresBackend)}`);
        }
    };

    if (!isOpen) return null;

    const tipoActual = config?.tipos?.find(t => t.valor === tipoSeleccionado);

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200">
                {/* Header */}
                <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white z-20">
                    <div>
                        <h2 className="text-2xl font-black text-gray-800 flex items-center gap-2">
                            <Settings className="text-blue-600" /> Configurar Equipo
                        </h2>
                        <p className="text-sm text-gray-500 font-medium">Define las especificaciones técnicas y eléctricas</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-red-50 hover:text-red-500 rounded-full transition-all">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-10">
                    {/* SECCIÓN 1: IDENTIFICACIÓN */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="md:col-span-1">
                            <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Categoría</label>
                            <select 
                                value={tipoSeleccionado}
                                onChange={(e) => setTipoSeleccionado(e.target.value)}
                                className="w-full p-3 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-blue-500 focus:bg-white transition-all outline-none font-bold text-gray-700"
                            >
                                {config?.tipos.map(t => (
                                    <option key={t.valor} value={t.valor}>{t.display}</option>
                                ))}
                            </select>
                        </div>
                        <div className="md:col-span-3">
                            <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Nombre del Equipo</label>
                            <input 
                                name="nombre" type="text" required placeholder="Ej: Evaporador Principal Tunel 1"
                                className="w-full p-3 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-blue-500 focus:bg-white transition-all outline-none"
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>

                    {/* SECCIÓN 2: CAMPOS DINÁMICOS (Vienen de Django) */}
                    <div className="bg-blue-50/30 p-6 rounded-2xl border border-blue-100">
                        <h3 className="text-blue-700 font-black text-sm uppercase tracking-widest mb-6 flex items-center gap-2">
                            <Zap size={16} /> Especificaciones de {tipoSeleccionado}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Campos comunes */}
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">MARCA</label>
                                <input name="marca" onChange={handleInputChange} className="w-full p-2 border-b-2 border-gray-200 bg-transparent focus:border-blue-500 outline-none" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">MODELO</label>
                                <input name="modelo" onChange={handleInputChange} className="w-full p-2 border-b-2 border-gray-200 bg-transparent focus:border-blue-500 outline-none" />
                            </div>
                            
                            {/* Logica para campos dinamicos */}
                            {tipoActual?.campos_especificos.map(campo => (
                                <div key={campo.nombre}>
                                    <label className="block text-xs font-bold text-gray-500 mb-1">
                                        {campo.nombre.replace('_', ' ').toUpperCase()} {campo.unidad && `(${campo.unidad})`}
                                    </label>

                                    {/* si el campo tiene opciones choices, renderiza un select */}
                                    {campo.choices ? (
                                        <select
                                            name={campo.nombre}
                                            value={formData[campo.nombre] || ""}
                                            required={campo.requerido}
                                            onChange={handleInputChange}
                                            className="w-full p-2 border-b-2 border-blue-200 bg-transparent focus:border-blue-500 outline-none font-bold text-gray-700"
                                        >
                                            <option value="">Seleccionar...</option>
                                            {campo.choices.map(opt => (
                                                <option key={opt.valor} value={opt.valor}>{opt.display}</option>
                                            ))}
                                        </select>
                                    ) : (
                                        /* si no tiene opciones, renderiza un input normal */
                                        <input 
                                            name={campo.nombre}
                                            value={formData[campo.nombre] || ""}
                                            type={campo.tipo === 'number' ? 'number' : 'text'}
                                            step="0.01" 
                                            required={campo.requerido}
                                            className="w-full p-2 border-b-2 border-blue-200 bg-transparent focus:border-blue-500 outline-none font-bold"
                                            onChange={handleInputChange}
                                        />  
                                    )} 
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* SECCIÓN 3: MOTORES (Sub-formulario) */}
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-black text-gray-700 uppercase text-sm tracking-widest">Componentes Eléctricos (Motores)</h3>
                            <button 
                                type="button" onClick={agregarMotor}
                                className="flex items-center gap-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-xl font-bold transition-all"
                            >
                                <Plus size={16} /> Añadir Motor
                            </button>
                        </div>
                        
                        <div className="space-y-3">
                            {formData.motores.map((motor, index) => (
                                <div key={index} className="flex gap-4 items-end bg-gray-50 p-4 rounded-xl border border-gray-100 group">
                                    <div className="flex-1 grid grid-cols-4 gap-4">
                                        <input 
                                            placeholder="Nombre Motor" className="bg-white p-2 border rounded-lg text-sm"
                                            onChange={(e) => actualizarMotor(index, 'nombre', e.target.value)}
                                        />
                                        <input 
                                            type="number" placeholder="Watts" className="bg-white p-2 border rounded-lg text-sm"
                                            onChange={(e) => actualizarMotor(index, 'potencia_watts', e.target.value)}
                                        />
                                        <input 
                                            type="number" placeholder="Amperios" className="bg-white p-2 border rounded-lg text-sm"
                                            onChange={(e) => actualizarMotor(index, 'consumo_amperios', e.target.value)}
                                        />
                                        <select 
                                            className="bg-white p-2 border rounded-lg text-sm font-medium"
                                            onChange={(e) => actualizarMotor(index, 'fases', e.target.value)}
                                        >
                                            <option value="monofasico">1 Fase</option>
                                            <option value="trifasico">3 Fases</option>
                                        </select>
                                    </div>
                                    <button 
                                        type="button" onClick={() => eliminarMotor(index)}
                                        className="text-gray-300 hover:text-red-500 transition-colors p-2"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Botones de acción */}
                    <div className="flex justify-end gap-4 pt-6 border-t">
                        <button 
                            type="button" onClick={onClose}
                            className="px-6 py-3 text-gray-500 font-bold hover:bg-gray-100 rounded-xl transition-all"
                        >
                            Cancelar
                        </button>
                        <button 
                            type="submit"
                            className="px-10 py-3 bg-blue-600 text-white font-black rounded-xl shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all transform hover:-translate-y-1"
                        >
                            Guardar Equipo en Sistema
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ModalAgregarEquipo;