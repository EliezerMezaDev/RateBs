<script setup lang="ts">
import { computed } from "vue";
import { useClipboard } from "@vueuse/core";
import { RatesSource, type ProcessedRate } from "~/api/types/bsRates";

const props = defineProps({
  rateData: {
    type: Object as PropType<ProcessedRate | null>,
    required: true,
  },
});

const cardTitle = computed(() => {
  if (!props.rateData?.source) {
    return "Tasa no disponible";
  }

  switch (props.rateData.source) {
    case RatesSource.Oficial:
      return "Tasa Oficial (BCV)";
    case RatesSource.Paralelo:
      return "Tasa Paralela";
    case RatesSource.Binance:
      return "Tasa Binance P2P";
    default:
      return props.rateData.source;
  }
});

const { copy, copied } = useClipboard({
  source: () => props.rateData?.rate.toString() || "",
  legacy: true,
});
</script>

<template>
  <div class="w-full text-center">
    <h2 class="text-start text-sm sm:text-md font-medium text-light/50">
      {{ cardTitle }}
    </h2>

    <div v-if="rateData" class="flex justify-start items-center gap-2">
      <p class="mb-2 text-xl md:text-2xl font-extrabold text-light">
        {{ formatCurrency(rateData.rate, "VES") }}
      </p>

      <button
        @click="copy()"
        class="rounded-full transition-all duration-200"
        :aria-label="copied ? 'Copiado' : 'Copiar tasa'"
      >
        <Icon
          :name="!copied ? 'ic:round-content-copy' : 'ic:round-check'"
          class="text-xl md:text-2xl"
          :class="!copied ? 'text-primary/90' : 'text-green-400'"
        />
      </button>
    </div>

    <p
      v-if="rateData"
      class="text-end lg:text-start text-xs sm:text-sm font-light text-light/50"
    >
      Actualizado:
      <b class="text-light font-bold">{{ formatDate(rateData.lastUpdate) }}</b>
    </p>
  </div>
</template>
