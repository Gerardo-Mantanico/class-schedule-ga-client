"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[+]?\d{8,15}$/;
const DPI_REGEX = /^\d{10,20}$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

export function useSignUp() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    dpi: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
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
      firstname: formData.firstname.trim(),
      lastname: formData.lastname.trim(),
      email: formData.email.trim().toLowerCase(),
      dpi: formData.dpi.trim(),
      phoneNumber: formData.phoneNumber.trim(),
      password: formData.password,
      confirmPassword: formData.confirmPassword,
    };

    if (
      !sanitizedData.firstname ||
      !sanitizedData.lastname ||
      !sanitizedData.email ||
      !sanitizedData.dpi ||
      !sanitizedData.phoneNumber ||
      !sanitizedData.password ||
      !sanitizedData.confirmPassword
    ) {
      setError("Completa todos los campos.");
      setLoading(false);
      return;
    }

    if (!EMAIL_REGEX.test(sanitizedData.email)) {
      setError("Ingresa un correo válido.");
      setLoading(false);
      return;
    }

    if (!PHONE_REGEX.test(sanitizedData.phoneNumber)) {
      setError("Ingresa un número de teléfono válido.");
      setLoading(false);
      return;
    }

    if (!DPI_REGEX.test(sanitizedData.dpi)) {
      setError("Ingresa un DPI válido.");
      setLoading(false);
      return;
    }

    if (!PASSWORD_REGEX.test(sanitizedData.password)) {
      setError("La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número.");
      setLoading(false);
      return;
    }

    if (sanitizedData.password !== sanitizedData.confirmPassword) {
      setError("Las contraseñas no coinciden.");
      setLoading(false);
      return;
    }

    const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/auth/signup`;

    const payload = {
      firstname: sanitizedData.firstname,
      lastname: sanitizedData.lastname,
      email: sanitizedData.email,
      dpi: sanitizedData.dpi,
      phoneNumber: sanitizedData.phoneNumber,
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
