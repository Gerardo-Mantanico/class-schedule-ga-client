"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

export function useSignUp() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    const sanitizedData = {
      email: formData.email.trim().toLowerCase(),
      password: formData.password,
    };

    if (
      !sanitizedData.email ||
      !sanitizedData.password
    ) {
      setError("Correo y contraseña son obligatorios.");
      setLoading(false);
      return;
    }

    if (!EMAIL_REGEX.test(sanitizedData.email)) {
      setError("Ingresa un correo válido.");
      setLoading(false);
      return;
    }

    if (!PASSWORD_REGEX.test(sanitizedData.password)) {
      setError("La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número.");
      setLoading(false);
      return;
    }

    const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/auth/register`;

    const payload = {
      email: sanitizedData.email,
      password: sanitizedData.password,
    };

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Error al registrar.");
      }

      setSuccess("Registro exitoso!");
      setTimeout(() => router.push("/signin"), 1800);
    } catch (err: any) {
      setError(err.message || "Error inesperado");
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    handleChange,
    handleSubmit,
    loading,
    showPassword,
    setShowPassword,
    error,
    success,
  };
}
