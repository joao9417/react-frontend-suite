import React from 'react';
import LoginForm from '../../components/common/auth/login/LoginForm';

const LoginPage = () => {
  const handleLoginSubmit = (formData) => {
    console.log('Datos de login recibidos en LoginPage:', formData);
    alert(`Intento de login con: ${formData.email}`);
  };

  return (
    <div style={styles.pageContainer}>
      <LoginForm onSubmit={handleLoginSubmit} />
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
  }
};

export default LoginPage;