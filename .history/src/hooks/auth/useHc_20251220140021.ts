
import { Hc } from '@/interfaces/cita/hc';
import { useCrud } from './useCrud';
import { HcApi } from '../../service/hc.service';

export const useHc = () => {


  const {
    items: hc,
    loading,
    error,

  } = useCrud<Hc>(HcApi);



  return {
    hc,
    loading,
    error
  
  };
};