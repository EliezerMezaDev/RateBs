<script setup lang="ts">
import type { ProcessedRate } from "~/api/types/bsRates";
import { formatCurrency, roundValue } from "~/utils/formatters";

const props = defineProps({
  bcvRate: {
    type: Object as PropType<ProcessedRate | null>,
    required: true,
  },
  streetRate: {
    type: Object as PropType<ProcessedRate | null>,
    required: true,
  },
});

const usdValue = ref<number | null>(1);
const vesOfficialValue = ref<number | null>(null);
const vesStreetValue = ref<number | null>(null);
type LastEditedField = "usd" | "vesOfficial" | "vesStreet";
const lastEdited = ref<LastEditedField>("usd");

watch(
  [() => props.bcvRate, () => props.streetRate],
  () => {
    if (usdValue.value !== null && props.bcvRate && props.streetRate) {
      vesOfficialValue.value = roundValue(usdValue.value * props.bcvRate.rate);
      vesStreetValue.value = roundValue(usdValue.value * props.streetRate.rate);
    }
  },
  { deep: true }
);

watch(
  usdValue,
  (newUsd: number | null) => {
    if (lastEdited.value !== "usd" || !props.bcvRate || !props.streetRate)
      return;
    if (newUsd !== null) {
      vesOfficialValue.value = roundValue(newUsd * props.bcvRate.rate);
      vesStreetValue.value = roundValue(newUsd * props.streetRate.rate);
    } else {
      vesOfficialValue.value = null;
      vesStreetValue.value = null;
    }
  },
  { immediate: true }
);

watch(vesOfficialValue, (newVes: number | null) => {
  if (lastEdited.value !== "vesOfficial" || !props.bcvRate || !props.streetRate)
    return;
  if (newVes !== null) {
    const newUsd = roundValue(newVes / props.bcvRate.rate, 4);
    usdValue.value = newUsd;
    vesStreetValue.value = roundValue(newUsd * props.streetRate.rate);
  } else {
    usdValue.value = null;
    vesStreetValue.value = null;
  }
});

watch(vesStreetValue, (newVes: number | null) => {
  if (lastEdited.value !== "vesStreet" || !props.bcvRate || !props.streetRate)
    return;
  if (newVes !== null) {
    const newUsd = roundValue(newVes / props.streetRate.rate, 4);
    usdValue.value = newUsd;
    vesOfficialValue.value = roundValue(newUsd * props.bcvRate.rate);
  } else {
    usdValue.value = null;
    vesOfficialValue.value = null;
  }
});
</script>

<template>
  <div class="flex flex-col md:flex-row gap-4">
    <div class="input-card">
      <label for="usd-input" class="input-label">Precio en Divisas</label>
      <div class="input-wrapper">
        <span class="input-prefix">$</span>
        <input
          id="usd-input"
          type="number"
          class="input-field placeholder:text-primary"
          placeholder="1.00"
          step="any"
          v-model.number="usdValue"
          @focus="lastEdited = 'usd'"
        />
      </div>
    </div>
    <div class="input-card">
      <label for="official-input" class="input-label">Tasa Oficial (BCV)</label>
      <div class="input-wrapper">
        <span class="input-prefix">Bs</span>
        <input
          id="official-input"
          type="number"
          class="input-field"
          placeholder="0.00"
          step="any"
          v-model.number="vesOfficialValue"
          @focus="lastEdited = 'vesOfficial'"
        />
      </div>
    </div>
    <div class="input-card">
      <label for="street-input" class="input-label">Tasa Paralela</label>
      <div class="input-wrapper">
        <span class="input-prefix">Bs</span>
        <input
          id="street-input"
          type="number"
          class="input-field"
          placeholder="0.00"
          step="any"
          v-model.number="vesStreetValue"
          @focus="lastEdited = 'vesStreet'"
        />
      </div>
    </div>
  </div>
</template>

<style>
.input-card {
  @apply rounded-lg flex flex-1 flex-col gap-2;
  @apply border border-transparent transition-all duration-200;
}
.input-label {
  @apply text-start font-medium text-xs text-light/50;
}
.input-wrapper {
  @apply flex items-center;
}
.input-prefix {
  @apply pr-2 text-light/50 font-mono text-lg md:text-xl;
}
.input-field {
  @apply w-full bg-transparent text-light focus:text-green-400 text-xl md:text-2xl font-semibold focus:outline-none;
}
</style>
