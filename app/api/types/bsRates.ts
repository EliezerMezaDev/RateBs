export enum RatesSource {
  Oficial = "oficial",
  Paralelo = "paralelo",
  Bitcoin = "bitcoin",
  Binance = "binance",
}

export interface BsRates {
  fuente: RatesSource;
  nombre: string;
  compra: number | null;
  venta: number | null;
  promedio: number;
  fechaActualizacion: string;
}

export interface ProcessedRate {
  source: RatesSource;
  rate: number;
  lastUpdate: string;
}
