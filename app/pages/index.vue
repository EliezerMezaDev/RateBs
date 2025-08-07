<template>
  <CommonSection customClass="pt-[10dvh] items-stretch">
    <!-- Muestra un mensaje de carga -->
    <div v-if="pending" class="text-white text-2xl">Calculando tasas...</div>

    <!-- Muestra un mensaje de error -->
    <div
      v-else-if="error || !data || !data.bcvRate"
      class="text-red-400 text-2xl"
    >
      Ocurrió un error al procesar las tasas.
    </div>

    <!-- Muestra los datos procesados -->
    <div
      v-else
      class="w-full grow grid grid-cols-5 grid-rows-5 gap-8 p-[0_2rem_2rem_2rem]"
    >
      <!-- Card para la Tasa BCV -->
      <div class="card col-span-2 row-span-5">
        <div class="text-center">
          <h2 class="text-3xl font-bold">Tasa Oficial (BCV)</h2>
          <p class="text-6xl font-light mt-4">
            {{ formatCurrency(data.bcvRate.rate) }}
          </p>
          <p class="text-sm opacity-70 mt-2">
            Actualizado: {{ formatDate(data.bcvRate.lastUpdate) }}
          </p>
        </div>
      </div>

      <!-- Card para la Tasa Paralela -->
      <div class="card col-span-3 row-span-5 col-start-3">
        <div class="text-center">
          <h2 class="text-3xl font-bold">Tasa Paralela</h2>
          <p class="text-6xl font-light mt-4">
            {{ formatCurrency(data.streetRate.rate) }}
          </p>
          <p class="mt-4 text-lg">
            Es
            <span class="font-bold text-green-300">{{
              data.relationship.toFixed(2)
            }}</span>
            veces la tasa oficial.
          </p>
          <p class="text-sm opacity-70 mt-2">
            Actualizado: {{ formatDate(data.streetRate.lastUpdate) }}
          </p>
        </div>
      </div>
    </div>
  </CommonSection>
</template>

<script setup lang="ts">
import { useBsRates } from "~/api/composables/useBsRates";

// 1. Ahora solo necesitas llamar a tu nuevo composable
const { data, pending, error } = useBsRates();

// Tus funciones de ayuda siguen siendo útiles
const formatCurrency = (value: number) => {
  return value.toLocaleString("es-VE", { style: "currency", currency: "VES" });
};
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("es-VE", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

useHead({
  title: "RateBs - Comparativa de Tasas",
  // ...
});
</script>

<style>
/* Tu estilo .card no necesita cambios */
.card {
  @apply flex items-center justify-center font-bold text-white rounded-2xl p-6 text-center;
  @apply bg-white/10 backdrop-blur-lg border border-white/20 shadow-xl;
}
</style>
