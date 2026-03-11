"use client";

import { useCallback, useState } from "react";
import recargaApi from "@/service/recarga.service";
import type { Recarga, RecargaPayload } from "@/interfaces/Recarga";

export const useRecarga = () => {
  const [recargas, setRecargas] = useState<Recarga[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRecargasByCuentaId = useCallback(async (cuentaId: number) => {
    setLoading(true);
    setError(null);

    try {
      const response = await recargaApi.getRecargasByCuentaId(cuentaId);
      if (Array.isArray(response)) {
        setRecargas(response as Recarga[]);
      } else {
        setRecargas([]);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "No se pudo cargar el historial de recargas");
      } else {
        setError("No se pudo cargar el historial de recargas");
      }
      setRecargas([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const createRecarga = async (payload: RecargaPayload): Promise<Recarga> => {
    setSaving(true);
    setError(null);

    try {
      console.log("[Recarga] Enviando payload:", payload);
      const response = await recargaApi.createRecarga(payload);
      console.log("[Recarga] Respuesta servidor:", response);
      return response as Recarga;
    } catch (err: unknown) {
      console.error("[Recarga] Error al crear recarga:", err);
      const errorMessage = err instanceof Error ? err.message || "No se pudo registrar la recarga" : "No se pudo registrar la recarga";

      setError(errorMessage);

      if (err instanceof Error) {
        throw err;
      }

      throw new Error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  return {
    recargas,
    loading,
    saving,
    error,
    fetchRecargasByCuentaId,
    createRecarga,
  };
};
