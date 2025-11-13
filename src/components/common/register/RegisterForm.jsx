import React, { useState } from "react";
import Input from '../../UI/Input';
import Button from '../../UI/Button';

const RegisterForm = ({ onSubmit, loading = false }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "El nombre es requerido";
    }

    if (!formData.email.trim()) {
      newErrors.email = "El email es requerido";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "El email no es válido";
    }

    if (!formData.password) {
      newErrors.password = "La contraseña es requerida";
    } else if (formData.password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden";
    }

    if (!formData.acceptTerms) {
      newErrors.acceptTerms = "Debes aceptar los términos y condiciones";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm() && onSubmit) {
      onSubmit(formData);
    }
  };

  return (
    <div className="max-w-md mx-auto my-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
          Crear Cuenta
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Únete a nuestra plataforma
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-6 p-8 border border-gray-200 rounded-xl bg-white dark:bg-gray-800 shadow-xl"
        noValidate
      >
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Nombre"
            name="firstName"
            type="text"
            placeholder="Tu nombre"
            value={formData.firstName}
            onChange={handleChange}
            error={errors.firstName}
            required
          />

          <Input
            label="Apellido"
            name="lastName"
            type="text"
            placeholder="Tu apellido"
            value={formData.lastName}
            onChange={handleChange}
          />
        </div>

        <Input
          label="Correo Electrónico"
          name="email"
          type="email"
          placeholder="tu@email.com"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          required
        />

        <Input
          label="Contraseña"
          name="password"
          type="password"
          placeholder="••••••••"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          required
        />

        <Input
          label="Confirmar Contraseña"
          name="confirmPassword"
          type="password"
          placeholder="••••••••"
          value={formData.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
          required
        />

        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            name="acceptTerms"
            id="acceptTerms"
            checked={formData.acceptTerms}
            onChange={handleChange}
            className="mt-1 w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
          />
          <label htmlFor="acceptTerms" className="text-sm text-gray-600 dark:text-gray-300">
            Acepto los{' '}
            <a href="/terms" className="text-primary-600 hover:underline dark:text-primary-400">
              términos y condiciones
            </a>{' '}
            y la{' '}
            <a href="/privacy" className="text-primary-600 hover:underline dark:text-primary-400">
              política de privacidad
            </a>
          </label>
        </div>
        {errors.acceptTerms && (
          <p className="text-red-500 text-sm -mt-4">{errors.acceptTerms}</p>
        )}

        <Button
          type="submit"
          loading={loading}
          className="mt-4"
        >
          Crear Cuenta
        </Button>

        <div className="text-center text-sm text-gray-600 dark:text-gray-400">
          ¿Ya tienes cuenta?{' '}
          <a
            href="/login"
            className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 hover:underline"
          >
            Inicia sesión aquí
          </a>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;