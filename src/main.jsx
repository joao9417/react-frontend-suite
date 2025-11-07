import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme/muithTheme';
import { AuthProvider } from './context/AuthContext.jsx'; 
import './index.css'; 

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <AuthProvider> {/* Envolvemos con el proveedor de autenticación */}
        <App />
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>,
);