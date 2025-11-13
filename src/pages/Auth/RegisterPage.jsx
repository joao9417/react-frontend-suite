import React, { useState } from 'react';
import RegisterForm from '../../components/common/register/RegisterForm';

const RegisterPage = () => {
  const [loading, setLoading] = useState(false);

  const handleRegister = async (formData) => {
    setLoading(true);
    
    try {
      // Simular llamada a API
      console.log('Datos de registro:', formData);
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Aquí iría la lógica real de registro
      console.log('Registro exitoso');
      
    } catch (error) {
      console.error('Error en registro:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <RegisterForm 
        onSubmit={handleRegister}
        loading={loading}
      />
    </div>
  );
};

export default RegisterPage;