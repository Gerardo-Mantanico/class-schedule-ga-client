
    "use client";
    import Checkbox from "@/components/form/input/Checkbox";
    import Input from "@/components/form/input/InputField";
    import Label from "@/components/form/Label";
    import Button from "@/components/ui/button/Button";
    import { ChevronLeftIcon } from "@/icons";
    import Link from "next/link";
    import React, { useState } from "react";

    export default function TwoStepVerification() {
        const [code, setCode] = useState("");
        const [isLoading, setIsLoading] = useState(false);
        const [error, setError] = useState<string | null>(null);
        const [success, setSuccess] = useState(false);

        // Obtener el email guardado en localStorage
        let email = "";
        if (typeof window !== "undefined") {
            email = localStorage.getItem("2fa_user_email") || "";
        }

        const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            setError(null);
            setSuccess(false);
            setIsLoading(true);

            try {
                const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/auth/verify-code`;
                const response = await fetch(API_URL, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, code }),
                    credentials: "include", // igual que en login
                });
                const data = await response.json();
                if (response.ok) {
                    setSuccess(true);
                    // Guardar token igual que en login
                    let token = data.token;
                    if (!token) {
                        const authHeader = response.headers.get("Authorization");
                        if (authHeader) {
                            token = authHeader.startsWith("Bearer ")
                                ? authHeader.substring(7)
                                : authHeader;
                        }
                    }
                    if (token) {
                        const expires = new Date();
                        expires.setDate(expires.getDate() + 1);
                        document.cookie = `token=${token}; path=/; expires=${expires.toUTCString()}; SameSite=Strict`;
                        localStorage.setItem("token", token);
                    } else {
                        setError("No se recibió token de autenticación");
                        setIsLoading(false);
                        return;
                    }
                    setTimeout(() => {
                        const roleRaw = data.user?.role?.name || data.user?.role || "";
                        const role = String(roleRaw).toUpperCase();
                        switch (role) {
                            case "ADMIN":
                                window.location.href = "/admin";
                                break;
                            case "CLIENT":
                                window.location.href = "/paciente";
                                break;
                            case "PSM":
                                window.location.href = "/psm";
                                break;
                            case "ADMINISTRATIVO":
                                window.location.href = "/administrativo/inventario/medicamentos";
                                break;
                            default:
                                window.location.href = "/paciente";
                        }
                    }, 0);
                } else {
                    setError(data.message || "Invalid code");
                }
            } catch (err) {
                setError("Error verifying code. Try again.");
            } finally {
                setIsLoading(false);
            }
        };

        return (
{/* <div className="flex flex-col flex-1 lg:w-1/2 w-full">
  {/* Back */}
  <div className="relative py-3 sm:py-5">
    <Link
      href="/"
      className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
    >
      <ChevronLeftIcon className="w-5 h-5 mr-1" />
      Back to home
    </Link>
  </div>

  {/* Content */}
  <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
    {/* Header */}
    <div className="mb-5 sm:mb-8">
      <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
        Two Step Verification
      </h1>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Enter the verification code we sent to your email.
      </p>
    </div>

    {/* Form */}
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        <div>
          <Label>
            Verification Code <span className="text-error-500">*</span>
          </Label>
          <Input
            type="text"
            placeholder="Enter 6-digit code"
            maxLength={6}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
          />
        </div>

        {error && (
          <p className="text-sm text-center text-error-500">{error}</p>
        )}

        {success && (
          <p className="text-sm text-center text-success-500">
            Code verified! Redirecting...
          </p>
        )}

        <div>
          <Button
            className="w-full"
            size="sm"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Verifying..." : "Verify Account"}
          </Button>
        </div>
      </div>
    </form>

    {/* Footer */}
    <div className="mt-5">
      <p className="text-sm text-center text-gray-700 dark:text-gray-400">
        Remember your password?{" "}
        <Link
          href="/auth/signIn"
          className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
        >
          Sign in
        </Link>
      </p>
    </div>
  </div>
</div>
 */}
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









