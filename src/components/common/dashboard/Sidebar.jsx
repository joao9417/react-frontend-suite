import { useAuth } from '../../../context/AuthContext';
import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation, useParams } from 'react-router-dom';
import styles from './Sidebar.module.css';
import presupuestoService from '../../../services/presupuestoService';

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [versiones, setVersiones] = useState([]);

    const { logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    
    // Get params to handle different routes
    const params = useParams(); 
    // Unify the specific ID: 'id' is used in /presupuestos/:id, 'presupuestoId' in engineering routes
    const presupuestoId = params.id || params.presupuestoId;
    
    const activePresupuestoId = presupuestoId;

    useEffect(() => {
        const fetchVersiones = async () => {
            if (activePresupuestoId) {
                try {
                    const data = await presupuestoService.getVersiones(activePresupuestoId);
                    setVersiones(data);
                } catch (error) {
                    console.error("Error fetching versions:", error);
                    setVersiones([]);
                }
            } else {
                setVersiones([]);
            }
        };

        fetchVersiones();
    }, [activePresupuestoId]);

    const esModoIngenieria = location.pathname.includes('/cuarto/');

    const toggleCollapse = () => setIsCollapsed(!isCollapsed);

    const handleLogout = async () => {
        try {    
            console.log('Cerrando sesión...');
            await logout();
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };

    const isActiveLink = (path) => {
        return location.pathname === path ? styles.sidebar_link_active : '';
    };


    return (
        <>
            <button 
                className={styles.hamburger} 
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? '✕' : '☰'}
            </button>

            {isOpen && (
                <div 
                    className={styles.overlay} 
                    onClick={() => setIsOpen(false)} 
                />
            )}

            <aside className={`
                ${styles.sidebar} 
                ${isOpen ? styles.sidebar_open : ''}
                ${isCollapsed ? styles.sidebar_collapse : ''} 
            `}>
                {/* Corregido: collapse_btn coincide con el CSS */}
                <button className={styles.collapse_btn} onClick={toggleCollapse}>
                    {isCollapsed ? '→' : '←'}
                </button>

                <div className={styles.sidebar_header}> 
                    <h2 className={styles.sidebar_title}>
                        {isCollapsed ? 'SP' : 'Suite Presupuestos'}
                    </h2> 
                </div>

                <nav className={styles.sidebar_nav}> 
                    <ul className={styles.sidebar_list}>

                        {!esModoIngenieria ? (
                            // menu normal
                            <>
                                <li className={styles.sidebar_item}> 
                                    <Link to="/" className={`${styles.sidebar_link} ${isActiveLink('/')}`}>
                                        🏠 <span>Inicio</span> {/* Agregamos span */}
                                    </Link>
                                </li>

                                <li className={styles.sidebar_item}> 
                                    <Link to="/presupuestos/nuevo" className={`${styles.sidebar_link} ${isActiveLink('/presupuestos/nuevo')}`}>
                                        📄 <span>Crear Presupuesto</span> {/* Agregamos span */}
                                    </Link>
                                </li>
                                <li className={styles.sidebar_item}> 
                                    <Link to="/presupuestos/papelera" className={`${styles.sidebar_link} ${isActiveLink('/presupuestos/papelera')}`}>
                                        🗑️ <span>Papelera</span>
                                    </Link>
                                </li>
                            </>
                        ) : (
                            // menu de modo ingenieria (dentro de un cuarto frio)
                            <>
                                <li className={styles.sidebar_item}>
                                    <Link to={`/presupuestos/${presupuestoId}`} className={styles.sidebar_link}>
                                        🔙 <span>Volver al Presupuesto</span> {/* Agregamos span */}
                                    </Link>
                                </li>

                                <li className={styles.sidebar_item}>
                                    <Link to="#" className={styles.sidebar_link}>
                                        ⚡ <span>Mod Electrico</span>
                                    </Link>
                                </li>

                                <li className={styles.sidebar_item}>
                                    <Link to="#" className={styles.sidebar_link}>
                                        🛠️ <span>Mod Mecanico</span>
                                    </Link>                                    
                                </li>
                            </>
                        )}
                        
                        

                        
                        {/* Seccion de Versiones (Solo visible dentro de un presupuesto) */}
                        {!isCollapsed && versiones.length > 0 && (
                             <li className={styles.sidebar_item}>
                                <div className={styles.sidebar_section_title}>Versiones</div>
                                <ul className={styles.sidebar_sublist}>
                                    {versiones.map(v => {
                                        const isOriginal = v.presupuesto_padre === null;
                                        const label = isOriginal ? 'Original' : (v.creado_por_username ? `Rev. ${v.creado_por_username}` : `Rev. ${v.id}`);
                                        const isActive = parseInt(activePresupuestoId) === v.id;
                                        
                                        // Formatear fecha: DD/MM HH:MM
                                        const fecha = new Date(v.fecha_ultima_modificacion);
                                        const fechaStr = fecha.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' });
                                        const horaStr = fecha.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
                                        const timestamp = `${fechaStr} ${horaStr}`;

                                        return (
                                            <li key={v.id}>
                                                <Link 
                                                    to={`/presupuestos/${v.id}`} 
                                                    className={`${styles.sidebar_link} ${isActive ? styles.sidebar_link_active : ''}`}
                                                    title={`${v.nombre_proyecto} - ${timestamp}`}
                                                >
                                                    <div className="flex flex-col">
                                                        <div>{isOriginal ? '★' : '↳'} <span>{label}</span></div>
                                                        {!isOriginal && (
                                                            <span style={{ fontSize: '0.7rem', marginLeft: '1.2rem', opacity: 0.7, display: 'block' }}>
                                                                {timestamp}
                                                            </span>
                                                        )}
                                                    </div>
                                                </Link>
                                            </li>
                                        );
                                    })}
                                </ul>
                             </li>
                        )}
                        
                        <li className={styles.sidebar_item}> 
                            <Link to="/dashboard/user-settings" className={`${styles.sidebar_link} ${isActiveLink('/dashboard/user-settings')}`}>
                                ⚙️ <span>Configuración</span>
                            </Link>
                        </li>
                    </ul>
                </nav>
                
                <div className={styles.sidebar_footer}>
                    <button onClick={handleLogout} className={styles.sidebar_logout}>
                        {isCollapsed ? 'Bye' : 'Logout'}
                    </button>
                </div>
            </aside>
        </>

    );
};

export default Sidebar;