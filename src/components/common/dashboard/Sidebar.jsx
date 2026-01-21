import { useAuth } from '../../../context/AuthContext';
import { useState } from 'react';
import { Link, useNavigate, useLocation, useParams } from 'react-router-dom';
import styles from './Sidebar.module.css';

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);

    const { logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const { presupuestoId } = useParams();

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
                                        <span>Inicio</span> {/* Agregamos span */}
                                    </Link>
                                </li>

                                <li className={styles.sidebar_item}> 
                                    <Link to="/presupuestos/nuevo" className={`${styles.sidebar_link} ${isActiveLink('/presupuestos/nuevo')}`}>
                                        <span>Crear Presupuesto</span> {/* Agregamos span */}
                                    </Link>
                                </li>

                            </>
                        ) : (
                            // menu de modo ingenieria (dentro de un cuarto frio)
                            <>
                                <li className={styles.sidebar_item}>
                                    <Link to={`/presupuestos/${presupuestoId}`} className={styles.sidebar_link}>
                                        <span>Volver al Presupuesto</span> {/* Agregamos span */}
                                    </Link>
                                </li>

                                <li className={styles.sidebar_item}>
                                    <Link to="#" className={styles.sidebar_link}>
                                        <span>Evaporadores</span>
                                    </Link>
                                </li>

                                <li className={styles.sidebar_item}>
                                    <Link to="#" className={styles.sidebar_link}>
                                        <span>Compresores</span>
                                    </Link>                                    
                                </li>

                                <li className={styles.sidebar_item}>
                                    <Link to="#" className={styles.sidebar_link}>
                                        <span>Condensador</span>
                                    </Link>                                    
                                </li>

                                <li className={styles.sidebar_item}>
                                    <Link to="#" className={styles.sidebar_link}>
                                        <span>Deshumificador</span>
                                    </Link>                                    
                                </li>

                                <li className={styles.sidebar_item}>
                                    <Link to="#" className={styles.sidebar_link}>
                                        <span>Enfriador Glicol</span>
                                    </Link>                                    
                                </li>

                                <li className={styles.sidebar_item}>
                                    <Link to="#" className={styles.sidebar_link}>
                                        <span>Ventilador</span>
                                    </Link>                                    
                                </li>

                                <li className={styles.sidebar_item}>
                                    <Link to="#" className={styles.sidebar_link}>
                                        <span>Bomba Glicol</span>
                                    </Link>                                    
                                </li>

                                <li className={styles.sidebar_item}>
                                    <Link to="#" className={styles.sidebar_link}>
                                        <span>Motor</span>
                                    </Link>                                    
                                </li>

                                <li className={styles.sidebar_item}>
                                    <Link to="#" className={styles.sidebar_link}>
                                        <span>Resistencia</span>
                                    </Link>                                    
                                </li>
                            </>
                        )}
                        
                        
                        <li className={styles.sidebar_item}> 
                            <Link to="/dashboard/user-settings" className={`${styles.sidebar_link} ${isActiveLink('/dashboard/user-settings')}`}>
                                <span>Configuración</span>
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