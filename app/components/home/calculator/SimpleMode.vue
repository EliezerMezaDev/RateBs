<script setup lang="ts">
import { ref, watch, computed } from "vue";
import type { PropType } from "vue";
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

const comparisonInfo = computed(() => {
  if (vesOfficialValue.value === null || vesStreetValue.value === null) {
    return {
      absoluteDiff: 0,
      percentageDiff: 0,
      isPositive: true,
    };
  }

  const officialAmount = vesOfficialValue.value;
  const streetAmount = vesStreetValue.value;

  const absoluteDiff = streetAmount - officialAmount;
  let percentageDiff = 0;

  if (lastEdited.value === "vesOfficial" && officialAmount !== 0) {
    percentageDiff = (streetAmount - officialAmount) / officialAmount;
  } else if (lastEdited.value === "vesStreet" && streetAmount !== 0) {
    percentageDiff = (officialAmount - streetAmount) / streetAmount;
  } else if (lastEdited.value === "usd" && officialAmount !== 0) {
    percentageDiff = (streetAmount - officialAmount) / officialAmount;
  }

  const isPositive = percentageDiff >= 0;

  return {
    absoluteDiff,
    percentageDiff,
    isPositive,
  };
});

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
  <div class="flex flex-col gap-4">
    <div class="flex flex-col md:flex-row gap-4">
      <div class="input-card highlight-card">
        <label for="usd-input" class="input-label">Precio en divisas</label>
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
        <label for="official-input" class="input-label"
          >Tasa oficial (BCV)</label
        >
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
        <label for="street-input" class="input-label">Tasa paralela</label>
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

    <div class="flex gap-4">
      <div class="info-item flex-1">
        <span class="info-label">Diferencia (absoluta)</span>
        <span class="info-value text-light">
          {{ formatCurrency(comparisonInfo.absoluteDiff, "VES") }}
        </span>
      </div>
      <div class="info-item flex-1">
        <span class="info-label">Diferencia (%)</span>
        <span
          class="info-value"
          :class="comparisonInfo.isPositive ? 'text-red-400' : 'text-green-400'"
        >
          {{
            (comparisonInfo.isPositive ? "+" : "") +
            (comparisonInfo.percentageDiff * 100).toFixed(2)
          }}%
        </span>
      </div>
    </div>
  </div>
</template>

<style>
.input-card {
  @apply rounded-lg p-2 flex flex-1 flex-col gap-2;
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
  @apply w-full bg-transparent text-light focus:text-white text-xl md:text-2xl font-semibold focus:outline-none;
}

.info-item {
  @apply bg-white/5 border border-transparent flex flex-col items-start justify-center p-4 rounded-md;
}
.info-label {
  @apply text-xs text-light/60;
}
.info-value {
  @apply text-lg font-bold;
}

.highlight-card {
  position: relative;
  overflow: hidden;
}

.highlight-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: -150%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgb(0, 168, 232, 0.15),
    transparent
  );
  transform: skewX(-25deg);

  animation: shimmer 10s infinite;
  animation-delay: 1s;
  transition: opacity 0.3s ease-in-out;
}

.highlight-card:focus-within::before {
  animation: none;
  opacity: 0;
}

@keyframes shimmer {
  100% {
    left: 150%;
  }
}
</style>
