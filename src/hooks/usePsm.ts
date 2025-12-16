import { useState } from 'react';
import { psmApi } from '../service/psm.service';

interface HorarioDto {
  diaSemana: string;
  horaInicio: string;
  horaFin: string;
}

interface ILEmpleadoReqDto {
  especialidadId: number;
  colegiado: string;
  areaId: number;
}

interface PSMData {
  ilempleadoResDto: {
    especialidad?: {
      id: number;
      nombre: string;
      descripcion?: string;
    };
    colegiado?: string;
    area?: {
      id: number;
      nombre: string;
      descripcion?: string;
    };
  };
  horarioReqDto?: HorarioDto[];
}

interface PSMFormData {
  ilempleadoReqDto: ILEmpleadoReqDto;
  horarioReqDto: HorarioDto[];
}

export const usePsm = () => {
  const [psmData, setPsmData] = useState<PSMData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

  const fetchPsmByUserId = async (userId: number) => {
    setLoading(true);
    setError(null);
    setNotFound(false);
    setPsmData(null);

    try {
      const data = await psmApi.getByUserId(userId);
      setPsmData(data);
      setNotFound(false);
      return data;
    } catch (err: any) {
      console.error('Error al buscar PSM:', err);
      
      // Verificar si es un error 404
      if (err.message?.includes('404') || err.data?.status === 404) {
        setNotFound(true);
        setPsmData(null);
      } else {
        setError(err.message || 'Error al buscar la información');
      }
      return null;
    } finally {
      setLoading(false);
    }
  };

  const createPsm = async (userId: number, data: PSMFormData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await psmApi.createForUser(userId, data);
      setPsmData(response);
      return response;
    } catch (err: any) {
      console.error('Error al crear PSM:', err);
      setError(err.message || 'Error al crear la información');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updatePsm = async (userId: number, data: PSMFormData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await psmApi.updateForUser(userId, data);
      setPsmData(response);
      return response;
    } catch (err: any) {
      console.error('Error al actualizar PSM:', err);
      setError(err.message || 'Error al actualizar la información');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deletePsm = async (userId: number) => {
    setLoading(true);
    setError(null);

    try {
      await psmApi.deleteForUser(userId);
      setPsmData(null);
      return true;
    } catch (err: any) {
      console.error('Error al eliminar PSM:', err);
      setError(err.message || 'Error al eliminar la información');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearPsmData = () => {
    setPsmData(null);
    setError(null);
    setNotFound(false);
  };

  return {
    psmData,
    loading,
    error,
    notFound,
    fetchPsmByUserId,
    createPsm,
    updatePsm,
    deletePsm,
    clearPsmData,
  };
};
