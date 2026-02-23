import React, { useState, useEffect } from 'react';

const ColdRoomModal = ({ isOpen, onClose, onSubmit, presupuestoId }) => {
    const [formData, setFormData] = useState({
        nombre_cuarto: '',
        temperatura_requerida: 0,
        ancho: '',
        largo: '',
        alto: '',
        presupuesto: presupuestoId
    });


    //logica para detectar la tecla esc y cerrar el modal
    useEffect(() => {
        const handleEsc = (event) =>{
            if (event.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            window.addEventListener('keydown', handleEsc);
        }
        //limpieza del evento cuando se desmonta el componente
        return () => {
            window.removeEventListener('keydown', handleEsc);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Convertimos a números antes de enviar
        const dataToSend = {
            ...formData,
            temperatura_requerida: parseFloat(formData.temperatura_requerida),
            ancho: parseFloat(formData.ancho),
            largo: parseFloat(formData.largo),
            alto: parseFloat(formData.alto),
        };
        onSubmit(dataToSend);
    };

    return (
        <div 
            className="fixed inset-0 z-50 flex justify-center items-center p-4 bg-slate-900/40 backdrop-blur-sm"
            onClick={onClose}
        >
            <div 
                className="bg-white rounded-lg shadow-2xl w-full max-w-md p-6 relative z-10"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-xl font-bold mb-4 text-gray-800">Nuevo Cuarto Frío / Área</h2>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Nombre del Área</label>
                        <input name="nombre_cuarto" required className="w-full border rounded-md p-2 mt-1" placeholder="Ej: Cámara de Congelados" onChange={handleChange} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Temp. Deseada (°C)</label>
                            <input type="number" name="temperatura_requerida" required className="w-full border rounded-md p-2 mt-1" onChange={handleChange} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Ancho (m)</label>
                            <input type="number" step="0.01" name="ancho" required className="w-full border rounded-md p-2 mt-1" onChange={handleChange} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Largo (m)</label>
                            <input type="number" step="0.01" name="largo" required className="w-full border rounded-md p-2 mt-1" onChange={handleChange} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Alto (m)</label>
                            <input type="number" step="0.01" name="alto" required className="w-full border rounded-md p-2 mt-1" onChange={handleChange} />
                        </div>
                    </div>

                    <div className="flex justify-end space-x-3 mt-6">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md">Cancelar</button>
                        <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">Guardar Área</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ColdRoomModal;