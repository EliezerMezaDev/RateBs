export enum RatesSource {
  Oficial = "oficial",
  Paralelo = "paralelo",
  Bitcoin = "bitcoin",
}

export interface BsRates {
  fuente: RatesSource;
  nombre: string;
  compra: number | null;
  venta: number | null;
  promedio: number;
  fechaActualizacion: string;
}
