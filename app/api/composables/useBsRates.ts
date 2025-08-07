import { RatesSource, type ProcessedRate } from "../types/bsRates";
import { useApi } from "./useApi";

export const useBsRates = () => {
  const { getBsRate } = useApi();

  const { data, pending, error, refresh } = useAsyncData(
    "bsRates",
    async () => {
      const rateData = await getBsRate();

      if (!rateData.data.value) {
        console.error("No se pudo obtener la data de la API.");
        return {
          bcvRate: null,
          streetRate: null,
          relationship: null,
        };
      }

      const rawRates = rateData.data.value;

      const bcvRaw = rawRates.find(
        (rate) => rate.fuente === RatesSource.Oficial
      );
      const streetRaw = rawRates.find(
        (rate) => rate.fuente === RatesSource.Paralelo
      );

      if (!bcvRaw || !streetRaw) {
        console.error(
          "No se encontraron las tasas 'oficial' y 'paralelo' en la respuesta."
        );

        return {
          bcvRate: null,
          streetRate: null,
          relationship: null,
        };
      }

      const bcvRate: ProcessedRate = {
        rate: bcvRaw.promedio,
        lastUpdate: bcvRaw.fechaActualizacion,
        source: RatesSource.Oficial,
      };

      const streetRate: ProcessedRate = {
        rate: streetRaw.promedio,
        lastUpdate: streetRaw.fechaActualizacion,
        source: RatesSource.Paralelo,
      };

      const relationship = streetRate.rate / bcvRate.rate;

      return {
        bcvRate,
        streetRate,
        relationship,
      };
    }
  );

  return {
    data,
    pending,
    error,
    refresh,
  };
};
