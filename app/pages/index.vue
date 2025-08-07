<script setup lang="ts">
import { useBsRates } from "~/api/composables/useBsRates";

const { data, pending, error } = useBsRates();

useHead({
  title: "RateBs - Comparativa de Tasas",
  meta: [
    {
      name: "description",
      content:
        "Comparativa de la tasa del dólar oficial (BCV) y paralelo en Venezuela.",
    },
  ],
});
</script>

<template>
  <CommonSection customClass="items-stretch">
    <div v-if="pending" class="flex justify-center items-center h-full">
      <CommonLoader label="Calculando tasas..." />
    </div>

    <div
      v-else-if="error || !data || !data.bcvRate"
      class="w-full text-red-400 font-bold text-2xl flex flex-col justify-center items-center"
    >
      <Icon name="ic:round-bug-report" class="text-9xl" />
      Ocurrió un error al procesar las tasas.
    </div>

    <div
      v-else-if="error || !data || !data.bcvRate"
      class="text-red-400 text-2xl"
    >
      Ocurrió un error al procesar las tasas.
    </div>

    <div v-else class="w-full grow grid grid-cols-5 grid-rows-5 gap-8 p-8">
      <div
        class="card col-span-2 row-span-5 flex flex-col items-center justify-start gap-2"
      >
        <HomeRateCard :rateData="data.bcvRate" />
        <HomeRateCard :rateData="data.streetRate" />
      </div>

      <div class="card col-span-3 row-span-5 col-start-3">2</div>
    </div>
  </CommonSection>
</template>

<style>
.card {
  @apply flex font-bold text-white rounded-2xl p-6 text-center;
  @apply bg-white/10 backdrop-blur-lg border border-white/20 shadow-xl;
}
</style>
