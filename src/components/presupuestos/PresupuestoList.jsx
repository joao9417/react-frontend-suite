const PresupuestoList = ({ presupuestos, onUpdate }) => {
    return (
        <div className="space-y-4">
            {presupuestos.map((p) => (
                <div key={p.id} className="border p-4 rounded-lg shadow-sm bg-white">
                    <div className="flex justify-between items-start">
                        <div>
                            {/* NOTA: Usamos nombre_proyecto (con guion bajo) */}
                            <h3 className="font-bold text-lg text-blue-700">
                                {p.nombre_proyecto} 
                            </h3>
                            <p className="text-sm text-gray-500">
                                Cliente: {p.cliente} | Ubicación: {p.ubicacion_geografica}
                            </p>
                        </div>
                        <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">
                            ID: {p.id}
                        </span>
                    </div>
                    
                    <div className="mt-4 flex gap-2">
                        {p.especialidades_info?.map(esp => (
                            <span key={esp.id} className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded">
                                {esp.nombre}
                            </span>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default PresupuestoList;