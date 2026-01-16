const PresupuestoList = ({ presupuestos }) => {
    return (
        <div>
            <h3>Lista de Presupuestos</h3>
            <ul>
                {presupuestos.map(p => (
                    <li key={p.id}>{p.nombre}</li>
                ))}
            </ul>
        </div>
    );
};

export default PresupuestoList;