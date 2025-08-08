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

    <div v-else class="w-full grow p-4 sm:p-6 md:p-8">
      <div class="flex flex-col lg:grid lg:grid-cols-3 gap-6 h-full">
        <div
          class="card flex max-[425px]:flex-col lg:flex-col max-[425px]:items-center items-start justify-between gap-20 p-4"
        >
          <div class="flex flex-col gap-4">
            <HomeCalculatorRateCard :rateData="data.bcvRate" />
            <HomeCalculatorRateCard :rateData="data.streetRate" />
          </div>
          <div>
            <HomeCalculatorRateRelationship
              :officialRate="data.bcvRate"
              :parallelRate="data.streetRate"
            />
          </div>
        </div>

        <div class="card lg:col-span-2">
          <HomeInteractivePanel
            :bcvRate="data.bcvRate"
            :streetRate="data.streetRate"
          />
        </div>
      </div>
    </div>
  </CommonSection>
</template>

<style>
.card {
  @apply font-bold text-white rounded-2xl w-full;
  @apply bg-white/10 backdrop-blur-md border border-white/20 shadow-xl;
}
</style>
