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

    <div
      v-else
      class="w-full h-full grow grid grid-cols-4 grid-rows-5 gap-4 p-8"
    >
      <div class="card row-span-5 flex flex-col justify-between gap-4 p-4">
        <div class="flex flex-col gap-4">
          <HomeRateCard :rateData="data.bcvRate" />
          <HomeRateCard :rateData="data.streetRate" />
        </div>

        <div>
          <HomeRateRelationship
            :officialRate="data.bcvRate"
            :parallelRate="data.streetRate"
          />
        </div>
      </div>

      <div class="card col-span-3 row-span-5 p-4">
        <HomeInteractivePanel
          :bcvRate="data.bcvRate"
          :streetRate="data.streetRate"
        />
      </div>
    </div>
  </CommonSection>
</template>

<style>
.card {
  @apply font-bold text-white rounded-2xl h-full w-full;

  @apply bg-white/10;

  @apply backdrop-blur-md;

  @apply border border-white/20;

  @apply shadow-xl;
}
</style>
