
import { Hc } from '@/interfaces/cita/hc';
import { useCrud } from '../useCrud';
import { hcApi } from '../../service/hc.service';

export const useHc = () => {

  const {
    items: hc,

  } = useCrud<Hc>(hcApi);

  return {
    hc,  
  };
};