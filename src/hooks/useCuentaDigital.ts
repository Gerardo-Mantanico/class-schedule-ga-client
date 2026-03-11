"use client";

import { useCallback, useEffect, useState } from "react";
import cuentaDigitalApi from "@/service/cuentaDigital.service";
import type { CuentaDigital } from "@/interfaces/CuentaDigital";

export const useCuentaDigital = () => {
  const [cuentaDigital, setCuentaDigital] = useState<CuentaDigital | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCuentaDigital = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await cuentaDigitalApi.getMiCuentaDigital();
      setCuentaDigital(response as CuentaDigital);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "No se pudo cargar la cuenta digital");
      } else {
        setError("No se pudo cargar la cuenta digital");
      }
      setCuentaDigital(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCuentaDigital();
  }, [fetchCuentaDigital]);

  return {
    cuentaDigital,
    loading,
    error,
    fetchCuentaDigital,
  };
};
