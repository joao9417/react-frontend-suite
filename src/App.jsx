import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/Auth/LoginPage'; 
import RegisterPage from './pages/Auth/RegisterPage';
import DashboardPage from './pages/Home/DashboardPage'; 
import ProtectedRoute from './routes/ProtectedRoute'; 

function App() {
  return (
    <Routes>
      {/* Rutas Públicas */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      
      {/* Rutas Protegidas */}
      <Route element={<ProtectedRoute />}>
        <Route path="/home" element={<DashboardPage />} />
      </Route>

      {/* Redirección inicial */}
      <Route path="/" element={<Navigate to="/home" />} />
    </Routes>
  );
}

export default App;
