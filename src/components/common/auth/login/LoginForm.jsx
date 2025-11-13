import React, { useState } from "react";
import Input from '../../../UI/Input';
import Button from '../../../UI/Button'; 

const LoginForm = ({ onSubmit, loading = false }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const { email, password } = formData;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Limpiar error cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "El email es requerido";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "El email no es válido";
    }

    if (!formData.password) {
      newErrors.password = "La contraseña es requerida";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm() && onSubmit) {
      onSubmit(formData);
    }
    console.log("Formulario de Login enviado (simulado):", formData);
  };

  return (
    <div className="max-w-sm mx-auto my-16">
      <h2 className="text-3xl font-extrabold text-center mb-6 text-gray-900 dark:text-white">
        Iniciar Sesión
      </h2>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-5 p-8 border border-gray-200 rounded-xl bg-white dark:bg-gray-800 shadow-xl"
        noValidate
      >
        <Input
          label="Correo Electrónico"
          type="email"
          placeholder="correo@ejemplo.com"
          name="email"
          value={email}
          onChange={handleChange}
          error={errors.email}
          required
        />

        <Input
          label="Contraseña"
          type="password"
          placeholder="••••••••"
          name="password"
          value={password}
          onChange={handleChange}
          error={errors.password}
          required
        />

        <Button
          type="submit"
          loading={loading}
          className="mt-2"
        >
          Entrar
        </Button>

        <p className="text-center text-sm mt-3 text-gray-500 dark:text-gray-400">
          ¿No tienes cuenta?{" "}
          <a
            href="/register"
            className="text-blue-600 hover:text-blue-700 hover:underline font-medium dark:text-blue-400"
          >
            Regístrate aquí
          </a>
        </p>
        <p className="text-center text-sm text-gray-500 dark:text-gray-400">
          <a
            href="/forgot-password"
            className="text-blue-600 hover:text-blue-700 hover:underline font-medium dark:text-blue-400"
          >
            ¿Olvidaste tu contraseña?
          </a>
        </p>
      </form>
    </div>
  );
};

export default LoginForm;