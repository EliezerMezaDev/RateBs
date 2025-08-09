/**
 * Formatea un número como una cadena de moneda (USD o VES).
 * @param value - El número a formatear.
 * @param currency - El código de la moneda ('USD' o 'VES').
 * @returns La cadena de moneda formateada, o '...' si el valor es nulo.
 */
export const formatCurrency = (
  value: number | null,
  currency: "USD" | "VES"
): string => {
  if (value === null || value === undefined) return "...";

  return value.toLocaleString(undefined, {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

/**
 * Formatea una cadena de fecha a un formato de hora local legible.
 * @param dateString - La cadena de fecha (ej. de una API).
 * @returns La cadena de hora formateada, o '...' si la fecha es inválida.
 */
export const formatDate = (dateString: string | null): string => {
  if (!dateString) return "...";

  return new Date(dateString).toLocaleDateString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });
};

/**
 * Redondea un número a un número específico de decimales para evitar errores de punto flotante.
 * @param value - El número a redondear.
 * @param decimals - El número de decimales a mantener (por defecto 2).
 * @returns El número redondeado.
 */
export const roundValue = (value: number, decimals: number = 2): number => {
  if (typeof value !== "number" || isNaN(value)) return 0;

  const multiplier = Math.pow(10, decimals);
  return Math.round(value * multiplier) / multiplier;
};
