import { useState } from "react";
import authService from "../../service/auth.service";

export function useVerifyCode() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const verifyCode = async (email: string, code: string) => {
    setLoading(true);
    setError(null);
    try {
      await authService.verifyCode(email, code);
      return true;
    } catch (e: any) {
      setError(e?.response?.data?.message || "Código incorrecto");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { verifyCode, loading, error };
}