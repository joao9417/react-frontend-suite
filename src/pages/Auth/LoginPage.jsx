import React from 'react';
import { Link } from 'react-router-dom';
import LoginForm from '../../components/common/auth/login/LoginForm';

const LoginPage = () => {
  const handleLoginSubmit = (formData) => {
    console.log('Datos de login recibidos en LoginPage:', formData);
    alert(`Intento de login con: ${formData.email}`);
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.contentWrapper}>
        <LoginForm onSubmit={handleLoginSubmit} />

        <div style={styles.linkContainer}>
          <p style={styles.linkText}>
            ¿No tienes una cuenta?{' '}
            <Link to="/register" style={styles.link}>
              Regístrate aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  pageContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh', 
    backgroundColor: '#eef2f5',
  },
  contentWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    wiidth: '100%',
},
  linkContainer: {
    marginTop: '20px',
  },
  text: {
    fontSize: '14px',
    color: '#64748b',
    fontFamily: 'sans-serif',
  },
  link: {
    color: '#2563eb',
    fontWeight: '600',
    textDecoration: 'none', 
  }
};

export default LoginPage;