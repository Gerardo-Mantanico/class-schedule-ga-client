"use client";
import Checkbox from "@/components/form/input/Checkbox";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "@/icons";
import Link from "next/link";
import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { persistAuthSession, storeAuthUser, storeDemoUser, storePendingTwoFactorEmail } from "@/service/auth-storage";
import { User } from "@/hooks/useUser";

const DEMO_CREDENTIALS = {
  email: "admin@demo.com",
  password: "Admin1234",
};

const DEMO_USER: User = {
  id: 1,
  firstname: "Admin",
  lastname: "Demo",
  email: DEMO_CREDENTIALS.email,
  dpi: 1234567890101,
  phoneNumber: "50255551234",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  active: true,
  role: {
    id: 1,
    name: "ADMIN",
    description: "Administrador demo",
  },
  use2fa: false,
};

const resolveRedirectPath = (role: string, callbackUrl: string | null) => {
  if (callbackUrl?.startsWith("/")) {
    return callbackUrl;
  }

  return role === "ADMIN" ? "/admin" : "/home";
};

const extractToken = (response: Response, data: any) => {
  if (data?.access_token) {
    return data.access_token;
  }

  const authHeader = response.headers.get("Authorization");
  if (!authHeader) {
    return "";
  }

  return authHeader.startsWith("Bearer ")
    ? authHeader.substring(7)
    : authHeader;
};

const buildTwoFactorPath = (callbackUrl: string | null, rememberMe: boolean) => {
  const params = new URLSearchParams();

  if (callbackUrl?.startsWith("/")) {
    params.set("callbackUrl", callbackUrl);
  }

  if (rememberMe) {
    params.set("remember", "1");
  }

  const query = params.toString();
  return query ? `/twoverification?${query}` : "/twoverification";
};

const getRoleName = (user: any) => String(user?.role?.name || user?.role || "").toUpperCase();

export default function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setCurrentUser } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  // Estados del formulario
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Estados de API
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError(null);
    setSuccess(false);
    setIsLoading(true);

    const trimmedEmail = email.trim().toLowerCase();
    const callbackUrl = searchParams.get("callbackUrl");

    if (!trimmedEmail || !password) {
      setError("Ingresa tu correo y contraseña.");
      setIsLoading(false);
      return;
    }

    const loginData = { email: trimmedEmail, password };
    const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/auth/login`;

    if (
      trimmedEmail === DEMO_CREDENTIALS.email &&
      password === DEMO_CREDENTIALS.password
    ) {
      const demoToken = `demo-token-${Date.now()}`;
      persistAuthSession(demoToken, { rememberMe: isChecked });
      storeDemoUser(DEMO_USER, { rememberMe: isChecked });
      setCurrentUser(DEMO_USER);
      setSuccess(true);
      router.replace("/admin");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
        // credentials: "include", // 👈 Importante para cookies
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setError(data.message || "Credenciales incorrectas");
        return;
      }

      if (data.use2fa) {
        storePendingTwoFactorEmail(trimmedEmail);
        router.push(buildTwoFactorPath(callbackUrl, isChecked));
        return;
      }

      const token = extractToken(response, data);
      if (!token) {
        setError("No se recibió token de autenticación");
        return;
      }

      persistAuthSession(token, { rememberMe: isChecked });
      if (data.user) {
        storeAuthUser(data.user, { rememberMe: isChecked });
        setCurrentUser(data.user);
      }

      setSuccess(true);
      router.replace(resolveRedirectPath(getRoleName(data.user), callbackUrl));
    } catch {
      setError("No se pudo conectar con el servidor. Verifica tu conexión.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full">
      <div className="relative py-3 sm:py-5">
        <Link
          href="/home"
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

        <form onSubmit={(event) => void handleSubmit(event)}>
          <div className="space-y-6">
            <div>
              <Label>
                Email <span className="text-error-500">*</span>
              </Label>
              <Input
                placeholder="info@gmail.com"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <Label>
                Password <span className="text-error-500">*</span>
              </Label>
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

            {error && (
              <p className="text-sm text-center text-error-500">{error}</p>
            )}
            {!error && (
              <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                Demo: admin@demo.com / Admin1234
              </p>
            )}
            {success && (
              <p className="text-sm text-center text-success-500">
                ¡Inicio de sesión exitoso! Redirigiendo...
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
            Don't have an account?{" "}
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