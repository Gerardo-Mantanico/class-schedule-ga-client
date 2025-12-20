"use client";
import Checkbox from "@/components/form/input/Checkbox";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { ChevronLeftIcon,EyeCloseIcon, EyeIcon } from "@/icons";
import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/navigation"; // 👈 Para redireccionar



export default function SignInForm() {
  const router = useRouter(); // 👈 Usar navegación
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  // Estados del formulario
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Estados de API
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError(null);
    setSuccess(false);
    setIsLoading(true);

    const loginData = { email, password };
  const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/auth/login`;

    try {
      const response = await fetch(API_URL,{
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Inicio de sesión exitoso:", data);
        
        // Intentar obtener el token del cuerpo o de los headers
        let token = data.token;
        if (!token) {
            const authHeader = response.headers.get("Authorization");
            if (authHeader) {
                token = authHeader.startsWith("Bearer ") ? authHeader.substring(7) : authHeader;
            }
        }

        // Guardar token en localStorage y Cookies
        if (token) {
          localStorage.setItem("token", token);
          document.cookie = `token=${token}; path=/; max-age=86400; SameSite=Strict`;
        } else {
          console.warn("Advertencia: No se recibió token en la respuesta ni en los headers");
        }

        setSuccess(true);

        //Redirección según el rol
        setTimeout(() => {
          // Obtener el rol de forma segura, soportando objeto o string
          const roleRaw = data.user?.role?.name || data.user?.role || "";
          const role = String(roleRaw).toUpperCase();
          
          console.log("Rol detectado para redirección:", role);

          if (role === "ADMIN") {
            router.push("/admin");
          }

           else if (role === "CLIENT") {
            router.push("/paciente");
          } 
          
          else if (role === "PSM") {
            router.push("/psm");

          } 
          else if (role === "ADMINISTRATIVO") {
            router.push("/administrativo/inventario/medicamentos");
          } else {
            // Fallback si no coincide o es otro rol
            console.log("Redirigiendo por defecto a /paciente (Rol: " + role + ")");
          }
        }, 800);

      } else {
        console.error("Error al iniciar sesión:", data);
        setError(data.message || "Error desconocido al iniciar sesión.");
      }
    } catch (err) {
      console.error("Error de red:", err);
      setError("No se pudo conectar con el servidor.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full">
      <div className="relative py-3 sm:py-5">
        <Link
          href="/"
          className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
        >
          <ChevronLeftIcon className="w-5 h-5 mr-1" />
          Back to home
        </Link>
      </div>

      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div className="mb-5 sm:mb-8">
          <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
            Sign In
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Enter your email and password to sign in!
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div>
              <Label>Email <span className="text-error-500">*</span></Label>
              <Input
                placeholder="info@gmail.com"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <Label>Password <span className="text-error-500">*</span></Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                >
                  {showPassword ? (
                    <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                  ) : (
                    <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                  )}
                </button>
              </div>
            </div>

            {error && <p className="text-sm text-center text-error-500">{error}</p>}
            {success && (
              <p className="text-sm text-center text-success-500">
                ¡Inicio de sesión exitoso!
              </p>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Checkbox checked={isChecked} onChange={setIsChecked} />
                <span className="text-gray-700 text-theme-sm dark:text-gray-400">
                  Keep me logged in
                </span>
              </div>
              <Link
                href="/reset-password"
                className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
              >
                Forgot password?
              </Link>
            </div>

            <div>
              <Button
                className="w-full"
                size="sm"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>
            </div>
          </div>
        </form>

        <div className="mt-5">
          <p className="text-sm text-center text-gray-700 dark:text-gray-400">
            Don’t have an account?{" "}
            <Link
              href="/signup"
              className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
