import { Link, useNavigate, useLocation } from 'react-router-dom';
import styles from './Sidebar.module.css';

const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        console.log('Cerrando sesión...');
        navigate('/login');
    };

    const isActiveLink = (path) => {
        return location.pathname === path ? styles.sidebar_link_active : '';
    };

    return (
        <aside className={styles.sidebar}> 
            <div className={styles.sidebar_header}> 
                <h2 className={styles.sidebar_title}>Mi App</h2> 
            </div>

            <nav className={styles.sidebar_nav}> 
                <ul className={styles.sidebar_list}> 
                    <li className={styles.sidebar_item}> 
                        <Link 
                            to="/dashboard/user-settings" 
                            className={`${styles.sidebar_link} ${isActiveLink('/dashboard/user-settings')}`}
                        >
                            Configuración usuario 
                        </Link>
                    </li>
                    <li className={styles.sidebar_item}> 
                        <Link 
                            to="/presupuestos/nuevo" 
                            className={`${styles.sidebar_link} ${isActiveLink('/presupuestos/nuevo')}`}
                        >
                            Crear Presupuesto
                        </Link>
                    </li>
                </ul>
            </nav>
            
            <div className={styles.sidebar_footer}>
                <button
                    onClick={handleLogout}
                    className={styles.sidebar_logout}
                >
                    Logout
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;