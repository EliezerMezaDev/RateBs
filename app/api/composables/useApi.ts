import type { BsRates } from "../types/bsRates";
import type { BinanceRate } from "../types/binance";

export const useApi = () => {
  const {
    public: { apiUrl },
  } = useRuntimeConfig();

  const getBsRate = () => {
    return $fetch<BsRates[]>(`${apiUrl}dolares`);
  };

  const getBinanceRate = () => {
    return $fetch<BinanceRate>("/api/binance");
  };

  return {
    getBsRate,
    getBinanceRate,
  };
};
