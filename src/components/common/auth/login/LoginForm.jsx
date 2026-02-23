import React from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import authService from '../../../../services/authService';
import { useAuth } from '../../../../context/AuthContext';

import Input from '../../../UI/Input';
import Button from '../../../UI/Button';


const LoginForm = ({ loading: propLoading = false }) => {

    const { 
        register, 
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm();

    const { login } = useAuth();
    
    const onSubmit = async (data) => {
        try {
            await login(data);  
        } catch (error) {
            toast.error("Usuario o contraseña incorrectos.");
        }
    };

    return (
        <div className="max-w-sm mx-auto my-16">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-5 p-8 border border-gray-200 rounded-xl bg-white dark:bg-gray-800 shadow-xl"
                noValidate
            >
                <Input
                    label="Usuario / Correo Electrónico"
                    type="text"  
                    placeholder="Tu usuario o correo"
                    {...register("username", { required: "El usuario o correo es obligatorio." })}
                    error={errors.username?.message}
                    required
                />

                <Input
                    label="Contraseña"
                    type="password"
                    placeholder="••••••••"
                    {...register("password", { required: "La contraseña es obligatoria." })}
                    error={errors.password?.message}
                    required
                />

                <Button
                    type="submit"
                    loading={isSubmitting || propLoading}
                    className="mt-2"
                >
                    {isSubmitting ? 'Entrando...' : 'Entrar'}
                </Button>
                
            </form>
        </div>
    );
};

export default LoginForm;