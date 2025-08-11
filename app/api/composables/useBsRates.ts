import {
  RatesSource,
  type ProcessedRate,
  type BsRates,
} from "../types/bsRates";
import { useApi } from "./useApi";

export const useBsRates = () => {
  const { getBsRate } = useApi();

  const { data, pending, error, refresh } = useAsyncData(
    "bsRatesCombinedUnified",
    async () => {
      const [dolarApiResult, binanceResult] = await Promise.allSettled([
        getBsRate(),
        $fetch<ProcessedRate>("/api/binance"),
      ]);

      const allRates: ProcessedRate[] = [];

      if (dolarApiResult.status === "fulfilled") {
        dolarApiResult.value.forEach((rate: BsRates) => {
          allRates.push({
            source: rate.fuente,
            rate: rate.promedio,
            lastUpdate: rate.fechaActualizacion,
          });
        });
      }

      if (binanceResult.status === "fulfilled") {
        allRates.push(binanceResult.value);
      }

      const bcvRate =
        allRates.find((rate) => rate.source === RatesSource.Oficial) || null;
      const streetRate =
        allRates.find((rate) => rate.source === RatesSource.Paralelo) || null;
      const binanceRate =
        allRates.find((rate) => rate.source === RatesSource.Binance) || null;

      const finalDataObject = { bcvRate, streetRate, binanceRate };

      return finalDataObject;
    }
  );

  return { data, pending, error, refresh };
};
