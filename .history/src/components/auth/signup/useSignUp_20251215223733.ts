"use client";

import { useRouter } from "next/navigation";
import { useState, FormEvent } from "react";

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
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (
      !formData.firstname ||
      !formData.lastname ||
      !formData.email ||
      !formData.phoneNumber ||
      !formData.password
    ) {
      setError("Completa todos los campos.");
      setLoading(false);
      return;
    }

    const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/auth/signup`;

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
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
