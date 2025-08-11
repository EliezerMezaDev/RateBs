<script setup lang="ts">
import { ref, watch } from "vue";
import type { PropType } from "vue";
import type { ProcessedRate } from "~/api/types/bsRates";

const props = defineProps({
  currentBcvRate: {
    type: Object as PropType<ProcessedRate | null>,
    required: true,
  },
  currentStreetRate: {
    type: Object as PropType<ProcessedRate | null>,
    required: true,
  },
  currentBinanceRate: {
    type: Object as PropType<ProcessedRate | null>,
    required: false,
  },
});

const emit = defineEmits<{
  (e: "update:rates", rates: { bcv: number; street: number; binance: number }): void;
}>();

const localBcvRate = ref(props.currentBcvRate?.rate);
const localStreetRate = ref(props.currentStreetRate?.rate);
const localBinanceRate = ref(props.currentBinanceRate?.rate);

watch(() => props.currentBcvRate, (newRate) => { localBcvRate.value = newRate?.rate; });
watch(() => props.currentStreetRate, (newRate) => { localStreetRate.value = newRate?.rate; });
watch(() => props.currentBinanceRate, (newRate) => { localBinanceRate.value = newRate?.rate; });

function handleUpdate() {
  if (localBcvRate.value !== null && localStreetRate.value !== null && localBinanceRate.value !== null) {
    emit("update:rates", {
      bcv: localBcvRate.value,
      street: localStreetRate.value,
      binance: localBinanceRate.value,
    });
  }
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="input-card">
      <label for="custom-bcv" class="input-label">Tasa Oficial (BCV)</label>
      <div class="input-wrapper">
        <span class="input-prefix">Bs</span>
        <input id="custom-bcv" type="number" class="input-field" step="any" v-model.number="localBcvRate" @input="handleUpdate" />
      </div>
    </div>
    <div class="input-card">
      <label for="custom-street" class="input-label">Tasa Paralela</label>
      <div class="input-wrapper">
        <span class="input-prefix">Bs</span>
        <input id="custom-street" type="number" class="input-field" step="any" v-model.number="localStreetRate" @input="handleUpdate" />
      </div>
    </div>
    <div class="input-card">
      <label for="custom-binance" class="input-label">Tasa Binance P2P</label>
      <div class="input-wrapper">
        <span class="input-prefix">Bs</span>
        <input id="custom-binance" type="number" class="input-field" step="any" v-model.number="localBinanceRate" @input="handleUpdate" />
      </div>
    </div>
  </div>
</template>

<style>
.input-card { @apply rounded-lg flex flex-1 flex-col gap-2; @apply border border-transparent transition-all duration-200; }
.input-label { @apply text-start font-medium text-xs text-light/50; }
.input-wrapper { @apply flex items-center; }
.input-prefix { @apply pr-2 text-light/50 font-mono text-lg md:text-xl; }
.input-field { @apply w-full bg-transparent text-light focus:text-white text-xl md:text-2xl font-semibold focus:outline-none; }
</style>