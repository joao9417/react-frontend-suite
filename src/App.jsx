import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/Auth/LoginPage'; 
import RegisterPage from './pages/Auth/RegisterPage';
import DashboardPage from './pages/Home/DashboardPage';
import PresupuestoPage from './pages/Presupuestos/PresupuestoPage';
import PresupuestoDetallePage from './pages/Presupuestos/PresupuestoDetallePAge';
import ProtectedRoute from './routes/ProtectedRoute'; 
import DashboardLayout from './components/common/dashboard/DashboardLayout';

function App() {
  return (
    <Routes>
      {/* Rutas Públicas */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      
      {/* Rutas Protegidas */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/home" element={<DashboardPage />} />
          <Route path="/presupuestos/nuevo" element={<PresupuestoPage />} />

          <Route path="/presupuestos/:id" element={<PresupuestoDetallePage />} />
        </Route>
      </Route>

      {/* Redirección inicial */}
      <Route path="/" element={<Navigate to="/home" replace />} />
    </Routes>
  );
}

export default App;
