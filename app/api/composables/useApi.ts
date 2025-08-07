import type { BsRates } from "../types/bsRates";

export const useApi = () => {
  const {
    public: { apiUrl: URL },
  } = useRuntimeConfig();

  /**
   * Obtiene la lista de cotizaciones del dólar desde la API.
   * @returns Un objeto de useFetch con { data, pending, error, refresh, ... }
   */
  const getBsRate = async () => {
    return useFetch<BsRates[]>(`${URL}dolares`);
  };

  return {
    getBsRate,
  };
};
