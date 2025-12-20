
"use client";
import Link from "next/link";

import { useState } from "react";
import { useRouter } from "next/navigation";

const TwoStepVerification = () => {
    const [code, setCode] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const router = useRouter();

    // Obtener el email guardado en localStorage
    let email = "";
    if (typeof window !== "undefined") {
        email = localStorage.getItem("2fa_user_email") || "";
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess(false);
        try {
            const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/auth/verify-2fa`;
            const response = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, code }),
            });
            const data = await response.json();
            if (response.ok) {
                setSuccess(true);
                // Guardar token si viene en la respuesta
                if (data.token) {
                    const expires = new Date();
                    expires.setDate(expires.getDate() + 1);
                    document.cookie = `token=${data.token}; path=/; expires=${expires.toUTCString()}; SameSite=Strict`;
                    localStorage.setItem("token", data.token);
                }
                // Redirigir según el rol
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
                }, 1000);
            } else {
                setError(data.message || "Invalid code");
            }
        } catch (err) {
            setError("Error verifying code. Try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col flex-1 lg:w-1/2 w-full overflow-y-auto no-scrollbar">
            {/* Back to home */}
            <div className="relative py-3 sm:py-5">
                <Link
                    href="/"
                    className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
                >
                    <ChevronLeftIcon className="w-5 h-5 mr-1" />
                    Back to home
                </Link>
            </div>
            {/* Contenido centrado */}
            <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
                <div className="mb-5 sm:mb-8">
                    <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md"> Two Step Verification </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400"> A verification code has been sent to your email. Please enter it below. </p>
                </div>
                <div>
                    <form onSubmit={handleSubmit}>
                        <div className="space-y-5">
                            <div>
                                <Label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400"> Type your 6 digits security code </Label>
                                <Input
                                    type="text"
                                    maxLength={6}
                                    value={code}
                                    onChange={e => setCode(e.target.value)}
                                    className="dark:bg-dark-900 otp-input h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-center text-xl font-semibold text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                                    required
                                />
                            </div>
                            {error && <div className="text-red-500 text-center">{error}</div>}
                            {success && <div className="text-green-500 text-center">Code verified! Redirecting...</div>}
                            <div>
                                <button
                                    className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600"
                                    type="submit"
                                    disabled={loading}
                                >
                                    {loading ? "Verifying..." : "Verify My Account"}
                                </button>
                            </div>
                        </div>
                    </form>
                    <div className="mt-5">
                        <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start"> Didn’t get the code? <a href="#" className="text-brand-500 hover:text-brand-600 dark:text-brand-400">Resend</a></p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TwoStepVerification;









