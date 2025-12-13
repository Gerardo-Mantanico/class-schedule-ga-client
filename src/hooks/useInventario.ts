import { useState, useCallback } from 'react';
import { inventarioApi } from '@/service/inventario.service';

export function useInventario() {
  const [medicamentos, setMedicamentos] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Catalog states
  const [categorias, setCategorias] = useState<any[]>([]);
  const [unidades, setUnidades] = useState<any[]>([]);
  const [formas, setFormas] = useState<any[]>([]);
  const [principios, setPrincipios] = useState<any[]>([]);
  const [proveedores, setProveedores] = useState<any[]>([]);
  const [ubicaciones, setUbicaciones] = useState<any[]>([]);

  const fetchMedicamentos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await inventarioApi.getMedicamentosDetalle();
      setMedicamentos(res || []);
    } catch (e: any) {
      setError(e?.message || String(e));
    } finally {
      setLoading(false);
    }
  }, []);

  const getMedicamento = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const res = await inventarioApi.getMedicamentoDetalle(id);
      return res;
    } catch (e: any) {
      setError(e?.message || String(e));
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  const createMedicamento = useCallback(async (payload: any) => {
    setLoading(true);
    setError(null);
    try {
      const res = await inventarioApi.createMedicamento(payload);
      return res;
    } catch (e: any) {
      setError(e?.message || String(e));
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateMedicamento = useCallback(async (id: number, payload: any) => {
    setLoading(true);
    setError(null);
    try {
      const res = await inventarioApi.updateMedicamento(id, payload);
      return res;
    } catch (e: any) {
      setError(e?.message || String(e));
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteMedicamento = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await inventarioApi.deleteMedicamento(id);
    } catch (e: any) {
      setError(e?.message || String(e));
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  // Catalog helpers
  const fetchCategorias = useCallback(async () => {
    setLoading(true);
    try {
      const res = await inventarioApi.getCategorias();
      setCategorias(res || []);
    } catch (e: any) {
      setError(e?.message || String(e));
    } finally {
      setLoading(false);
    }
  }, []);

  const createCategoria = useCallback(async (payload: any) => {
    setLoading(true);
    try {
      const res = await inventarioApi.createCategoria(payload);
      // refresh list
      await fetchCategorias();
      return res;
    } catch (e: any) {
      setError(e?.message || String(e));
      throw e;
    } finally {
      setLoading(false);
    }
  }, [fetchCategorias]);

  const updateCategoria = useCallback(async (id: number, payload: any) => {
    setLoading(true);
    try {
      const res = await inventarioApi.updateCategoria(id, payload);
      await fetchCategorias();
      return res;
    } catch (e: any) {
      setError(e?.message || String(e));
      throw e;
    } finally {
      setLoading(false);
    }
  }, [fetchCategorias]);

  const deleteCategoria = useCallback(async (id: number) => {
    setLoading(true);
    try {
      await inventarioApi.deleteCategoria(id);
      await fetchCategorias();
    } catch (e: any) {
      setError(e?.message || String(e));
      throw e;
    } finally {
      setLoading(false);
    }
  }, [fetchCategorias]);

  const fetchUnidades = useCallback(async () => {
    setLoading(true);
    try {
      const res = await inventarioApi.getUnidades();
      setUnidades(res || []);
    } catch (e: any) {
      setError(e?.message || String(e));
    } finally {
      setLoading(false);
    }
  }, []);

  const createUnidad = useCallback(async (payload: any) => {
    setLoading(true);
    try {
      const res = await inventarioApi.createUnidad(payload);
      await fetchUnidades();
      return res;
    } catch (e: any) {
      setError(e?.message || String(e));
      throw e;
    } finally {
      setLoading(false);
    }
  }, [fetchUnidades]);

  const updateUnidad = useCallback(async (id: number, payload: any) => {
    setLoading(true);
    try {
      const res = await inventarioApi.updateUnidad(id, payload);
      await fetchUnidades();
      return res;
    } catch (e: any) {
      setError(e?.message || String(e));
      throw e;
    } finally {
      setLoading(false);
    }
  }, [fetchUnidades]);

  const deleteUnidad = useCallback(async (id: number) => {
    setLoading(true);
    try {
      await inventarioApi.deleteUnidad(id);
      await fetchUnidades();
    } catch (e: any) {
      setError(e?.message || String(e));
      throw e;
    } finally {
      setLoading(false);
    }
  }, [fetchUnidades]);

  const fetchFormas = useCallback(async () => {
    setLoading(true);
    try {
      const res = await inventarioApi.getFormas();
      setFormas(res || []);
    } catch (e: any) {
      setError(e?.message || String(e));
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPrincipios = useCallback(async () => {
    setLoading(true);
    try {
      const res = await inventarioApi.getPrincipios();
      setPrincipios(res || []);
    } catch (e: any) {
      setError(e?.message || String(e));
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchProveedores = useCallback(async () => {
    setLoading(true);
    try {
      const res = await inventarioApi.getProveedores();
      setProveedores(res || []);
    } catch (e: any) {
      setError(e?.message || String(e));
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchUbicaciones = useCallback(async () => {
    setLoading(true);
    try {
      const res = await inventarioApi.getUbicaciones();
      setUbicaciones(res || []);
    } catch (e: any) {
      setError(e?.message || String(e));
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    medicamentos,
    loading,
    error,
    fetchMedicamentos,
    getMedicamento,
    createMedicamento,
    updateMedicamento,
    deleteMedicamento,
    // catalogs
    categorias,
    fetchCategorias,
    createCategoria,
    updateCategoria,
    deleteCategoria,
    unidades,
    fetchUnidades,
    createUnidad,
    updateUnidad,
    deleteUnidad,
    formas,
    fetchFormas,
    principios,
    fetchPrincipios,
    proveedores,
    fetchProveedores,
    ubicaciones,
    fetchUbicaciones,
  };
}

export default useInventario;
