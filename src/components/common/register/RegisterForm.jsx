import React from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import authService from '../../../services/authService';

import Input from '../../UI/Input';
import Button from '../../UI/Button';


const RegisterForm = ({ loading: propLoading = false }) => {
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors, isSubmitting }, setError, watch } = useForm();
    
    // obtener el valor de password para la validacion de confirmacion
    const password = watch("password", "");

    const onSubmit = async (data) => {
        try {
            await authService.register(data); 

            toast.success('¡Registro exitoso! Por favor, inicia sesión.');
            navigate('/login'); 
        } catch (error) {
            console.error("Error de registro:", error);
            
            if (error && typeof error === 'object' && !Array.isArray(error)) {
                Object.keys(error).forEach(key => {
                    setError(key, { 
                        type: 'server', 
                        message: Array.isArray(error[key]) ? error[key][0] : "Error de validación."
                    });
                });
            } else {
                toast.error('Ocurrió un error general al registrar.');
            }
        }
    };

    return (
        <div className="max-w-md mx-auto my-8">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-6 p-8 border border-gray-200 rounded-xl bg-white dark:bg-gray-800 shadow-xl"
                noValidate
            >
                <div className="grid grid-cols-2 gap-4">
                    <Input
                        label="Usuario"
                        name="username"
                        type="text"
                        placeholder="Nombre de Usuario"
                        {...register("username", { required: "El usuario es obligatorio." })}
                        error={errors.username?.message}
                        required
                    />
                    
                    <Input
                        label="Cargo"
                        name="cargo"
                        type="text"
                        placeholder="Tu Cargo"
                        {...register("cargo", { required: "El cargo es obligatorio." })}
                        error={errors.cargo?.message}
                        required
                    />
                </div>

                <Input
                    label="Correo Electrónico"
                    name="email"
                    type="email"
                    placeholder="tu@email.com"
                    {...register("email", { 
                        required: "El email es obligatorio.", 
                        pattern: { value: /\S+@\S+\.\S+/, message: "El email no es válido" }
                    })}
                    error={errors.email?.message}
                    required
                />

                <Input
                    label="Contraseña"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    {...register("password", { 
                        required: "La contraseña es requerida",
                        minLength: { value: 6, message: "Mínimo 6 caracteres" }
                    })}
                    error={errors.password?.message}
                    required
                />

                <Input
                    label="Confirmar Contraseña"
                    name="password_confirm"
                    type="password"
                    placeholder="••••••••"
                    {...register("password_confirm", { 
                        required: "Confirma la contraseña",
                        validate: (value) => 
                            value === password || "Las contraseñas no coinciden" 
                    })}
                    error={errors.password_confirm?.message}
                    required
                />
                {/* NOTA: Debes agregar la lógica de 'register' al input 'acceptTerms' */}

                <Button
                    type="submit"
                    loading={isSubmitting || propLoading}
                    className="mt-4"
                >
                    {isSubmitting ? 'Registrando...' : 'Crear Cuenta'}
                </Button>
            </form>
        </div>
    );
};

export default RegisterForm;