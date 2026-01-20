import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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
      <div className='mt-6 text-center'>
        <p className='text-sm text-gray-600 dark:text-gray-400'>
          ¿Ya tienes una cuenta?{' '}
          <Link
            to="/login"
            className='font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 transition-colors'
            >Iniciar sesión</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;