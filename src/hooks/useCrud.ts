import { useState, useEffect, useCallback } from 'react';

interface ApiService {
  getAll: () => Promise<unknown>;
  create: (data: unknown) => Promise<unknown>;
  update: (id: number | string, data: unknown) => Promise<unknown>;
  delete: (id: number | string) => Promise<unknown>;
}

export const useCrud = <T extends { id: number | string }>(
  apiService: ApiService,
  transformPayload?: (data: unknown) => unknown
) => {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Obtener elementos
  const fetchItems = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.getAll();
      // Manejar paginación (Spring Boot usa 'content') o array directo
      const data = Array.isArray(response)
        ? response
        : ((response as { content?: T[] })?.content || (response as { data?: T[] })?.data || []);

      if (Array.isArray(data)) {
        setItems(data);
      } else {
        console.error('Formato de respuesta inesperado:', response);
        setItems([]);
        setError('Formato de datos inválido');
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'Error al cargar datos');
      } else {
        setError('Error desconocido al cargar datos');
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [apiService]);

  // Crear elemento
  const createItem = async (data: Partial<T>) => {
    setLoading(true);
    try {
      const payload = transformPayload ? transformPayload(data) : data;
      await apiService.create(payload);
      await fetchItems(); // Recargar lista
      return true;
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'Error al crear elemento');
      } else {
        setError('Error desconocido al crear elemento');
      }
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Actualizar elemento
  const updateItem = async (id: number | string, data: Partial<T>) => {
    setLoading(true);
    try {
      const payload = transformPayload ? transformPayload({ ...data, id }) : { ...data, id };
      console.log(`Actualizando elemento ${id} con payload:`, payload);
      
      await apiService.update(id, payload);
      await fetchItems(); // Recargar lista
      return true;
    } catch (err: unknown) {
      console.error("Error en updateItem:", err);
      if (err instanceof Error) {
        setError(err.message || 'Error al actualizar elemento');
      } else {
        setError('Error desconocido al actualizar elemento');
      }
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Eliminar elemento
  const deleteItem = async (id: number | string) => {
    setLoading(true);
    try {
      await apiService.delete(id);
      await fetchItems(); // Recargar lista
      return true;
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'Error al eliminar elemento');
      } else {
        setError('Error desconocido al eliminar elemento');
      }
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Cargar al montar
  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  return {
    items,
    loading,
    error,
    fetchItems,
    createItem,
    updateItem,
    deleteItem,
  };
};
