'use client';

import { login } from "@/actions/auth/login";
import { registerUser } from "@/actions/auth/register";
import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

type FormInputs = {
    name: string;
    email: string;
    password: string;
}

export const RegisterForm = () => {
    const [errorMessage, seterrorMessage] = useState('')
    const { register, handleSubmit, formState: { errors } } = useForm<FormInputs>();

    const onSubmit: SubmitHandler<FormInputs> = async (data) => {
        seterrorMessage('');
        const { name, email, password } = data;
        const response = await registerUser(name, email, password);

        if (!response.ok) {
            seterrorMessage(response.message);
            return;
        }

        await login(email.toLowerCase(), password);
        window.location.replace('/');

    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">

            {
                errors.name?.type === 'required' && (
                    <span className="text-red-500">* El nombre es obligatorio</span>
                )
            }

            <label htmlFor="email">Nombre completo</label>
            <input
                className={
                    clsx(
                        "px-5 py-2 border bg-gray-200 rounded mb-5",
                        {
                            "border-red-500": errors.name
                        }
                    )
                }
                type="text"
                autoFocus
                {...register('name', { required: true })}
            />

            {
                errors.email?.type === 'required' && (
                    <span className="text-red-500">* El email es obligatorio</span>
                )
            }

            <label htmlFor="email">Correo electrónico</label>
            <input
                className={
                    clsx(
                        "px-5 py-2 border bg-gray-200 rounded mb-5",
                        {
                            "border-red-500": errors.email
                        }
                    )
                }
                type="email"
                {...register('email', { required: true, pattern: /^\S+@\S+$/i })}
            />

            {
                errors.password?.type === 'required' && (
                    <span className="text-red-500">* El password es obligatorio</span>
                )
            }

            {
                errors.password?.type === 'minLength' && (
                    <span className="text-red-500">* minimo 6 caracteres</span>
                )
            }

            <label htmlFor="password">Contraseña</label>
            <input
                className={
                    clsx(
                        "px-5 py-2 border bg-gray-200 rounded mb-5",
                        {
                            "border-red-500": errors.password
                        }
                    )
                }
                type="password"
                {...register('password', { required: true, minLength: 6 })}
            />


            <span className="text-red-500">{errorMessage}</span>

            <button
                className="btn-primary">
                crear cuenta
            </button>


            {/* divisor l ine */}
            <div className="flex items-center my-5">
                <div className="flex-1 border-t border-gray-500"></div>
                <div className="px-2 text-gray-800">O</div>
                <div className="flex-1 border-t border-gray-500"></div>
            </div>

            <Link
                href="/auth/login"
                className="btn-secondary text-center">
                Ingresar
            </Link>

        </form>
    )
}
