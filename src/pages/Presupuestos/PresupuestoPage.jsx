import { useState, useEffect } from 'react';
import PresupuestoForm from '../../components/presupuestos/PresupuestoForm';
import PresupuestoList from '../../components/presupuestos/PresupuestoList';
import { usePresupuestos } from '../../hooks/usePresupuestos';
import { toast } from 'react-hot-toast';

const PresupuestosPage = () => {
    const { 
        presupuestos, 
        cargarPresupuestos, 
        loading 
    } = usePresupuestos();
    
    const [ingenieros, setIngenieros] = useState([]);

    // Cargar presupuestos al montar la página
    useEffect(() => {
        cargarPresupuestos();
    }, []);

    // Función para cargar ingenieros (necesitarás crear este endpoint en Django)
    useEffect(() => {
        const fetchIngenieros = async () => {
            try {
                // Esto es un ejemplo - necesitas crear este endpoint
                // const response = await api.get('usuarios/ingenieros/');
                // setIngenieros(response.data);
                
                // Temporal: lista hardcodeada o cargar desde localStorage
                const user = JSON.parse(localStorage.getItem('user'));
                setIngenieros([{ id: user?.id, username: user?.username, email: user?.email }]);
            } catch (error) {
                toast.error('Error al cargar ingenieros');
            }
        };
        
        fetchIngenieros();
    }, []);

    const handlePresupuestoCreado = (nuevoPresupuesto) => {
        toast.success(`Presupuesto ${nuevoPresupuesto.consecutivo} creado!`);
        cargarPresupuestos(); // Recargar lista
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Gestión de Presupuestos
            </h1>
            <p className="text-gray-600 mb-8">
                Crea y gestiona tus presupuestos de proyectos
            </p>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Panel izquierdo: Formulario */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-6 pb-4 border-b">
                        Nuevo Presupuesto
                    </h2>
                    <PresupuestoForm 
                        onSuccess={handlePresupuestoCreado}
                        ingenieros={ingenieros}
                    />
                </div>

                {/* Panel derecho: Lista */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex justify-between items-center mb-6 pb-4 border-b">
                        <h2 className="text-xl font-semibold text-gray-800">
                            Mis Presupuestos
                        </h2>
                        <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">
                            {presupuestos.length} total
                        </span>
                    </div>
                    
                    {loading ? (
                        <div className="flex justify-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                        </div>
                    ) : presupuestos.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="text-gray-400 mb-4">
                                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium text-gray-700 mb-2">
                                No hay presupuestos
                            </h3>
                            <p className="text-gray-500">
                                Crea tu primer presupuesto usando el formulario
                            </p>
                        </div>
                    ) : (
                        <PresupuestoList 
                            presupuestos={presupuestos} 
                            onUpdate={cargarPresupuestos}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default PresupuestosPage;