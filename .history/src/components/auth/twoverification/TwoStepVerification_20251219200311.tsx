
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
                });
                const data = await response.json();
                if (response.ok) {
                    setSuccess(true);
                    if (data.token) {
                        const expires = new Date();
                        expires.setDate(expires.getDate() + 1);
                        document.cookie = `token=${data.token}; path=/; expires=${expires.toUTCString()}; SameSite=Strict`;
                        localStorage.setItem("token", data.token);
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
                    }, 1000);
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
                    <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md"> Forgot Your Password? </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400"> Enter the email address linked to your account, and we’ll send you a link to reset your password. </p>
                </div>
                <div>
                    <form>
                        <div className="space-y-5 gap-5">
                            <div className="space-y-4">
                                <div>
                                    <Label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400"> Code<span className="text-error-500">*</span></Label>
                                    <Input type="number" id="code" name="code" placeholder="Enter your code" className="dark:bg-dark-900 font-noraml h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-left text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800" />
                                </div>
                            </div>
                            <div className="space-y-10">
                                <div>
                                    <Label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400"> Email<span className="text-error-500">*</span></Label>
                                    <Input type="email" id="email" name="email" placeholder="Enter your email" className="dark:bg-dark-900 font-noraml h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-left text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800" />
                                </div>
                            </div>
                            <div className="space-y-5">
                                <div>
                                    <Label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400"> New Passoword<span className="text-error-500">*</span></Label>
                                     <Input
                    placeholder="Enter your password"
                    name="password"
//type={showPassword ? "text" : "password"}
                    // value={formData.password}
//onChange={handleChange}
                  />
                                     </div>
                                <div>
                                    <button className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600"> Send Reset Link </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
            // <div className="flex flex-col flex-1 lg:w-1/2 w-full">
            //     <div className="relative py-3 sm:py-5">
            //         <Link
            //             href="/"
            //             className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
            //         >
            //             <ChevronLeftIcon className="w-5 h-5 mr-1" />
            //             Back to home
            //         </Link>
            //     </div>

            //     <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
            //         <div className="mb-5 sm:mb-8">
            //             <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
            //                 Two Step Verification
            //             </h1>
            //             <p className="text-sm text-gray-500 dark:text-gray-400">
            //                 Enter the code sent to your email to continue.
            //             </p>
            //         </div>

            //         <form onSubmit={handleSubmit}>
            //             <div className="space-y-6">
            //                 <div>
            //                     <Label>
            //                         Code <span className="text-error-500">*</span>
            //                     </Label>
            //                     <Input
            //                         placeholder="Enter your code"
            //                         type="text"
            //                         maxLength={6}
            //                         value={code}
            //                         onChange={(e) => setCode(e.target.value)}
            //                         required
            //                     />
            //                 </div>

            //                 {error && (
            //                     <p className="text-sm text-center text-error-500">{error}</p>
            //                 )}
            //                 {success && (
            //                     <p className="text-sm text-center text-success-500">
            //                         Code verified! Redirecting...
            //                     </p>
            //                 )}

            //                 <div>
            //                     <Button
            //                         className="w-full"
            //                         size="sm"
            //                         type="submit"
            //                         disabled={isLoading}
            //                     >
            //                         {isLoading ? "Verifying..." : "Verify My Account"}
            //                     </Button>
            //                 </div>
            //             </div>
            //         </form>

            //         <div className="mt-5">
            //             <p className="text-sm text-center text-gray-700 dark:text-gray-400">
            //                 Wait, I remember my password...{" "}
            //                 <Link
            //                     href="/auth/signIn"
            //                     className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
            //                 >
            //                     Click here
            //                 </Link>
            //             </p>
            //         </div>
            //     </div>
            // </div>
        );
    }









