<script setup lang="ts">
import { ref, watch, computed } from "vue";
import type { PropType } from "vue";
import type { ProcessedRate } from "~/api/types/bsRates";
import { formatCurrency, roundValue } from "~/utils/formatters";

const props = defineProps({
  bcvRate: { type: Object as PropType<ProcessedRate | null>, required: true },
  streetRate: {
    type: Object as PropType<ProcessedRate | null>,
    required: true,
  },
  binanceRate: {
    type: Object as PropType<ProcessedRate | null>,
    required: false,
  },
});

const usdValue = ref<number | null>(1);
const vesOfficialValue = ref<number | null>(null);
const vesStreetValue = ref<number | null>(null);
const vesBinanceValue = ref<number | null>(null);
type LastEditedField = "usd" | "vesOfficial" | "vesStreet" | "vesBinance";
const lastEdited = ref<LastEditedField>("usd");

const comparisonInfo = computed(() => {
  if (vesOfficialValue.value === null) {
    return [];
  }

  const baseAmount = vesOfficialValue.value;
  const comparisons = [];

  const ratesToCompare = [
    { label: "BCV vs Paralelo", amount: vesStreetValue.value },
    { label: "BCV vs Binance P2P", amount: vesBinanceValue.value },
  ];

  for (const item of ratesToCompare) {
    if (item.amount !== null) {
      const absoluteDiff = item.amount - baseAmount;
      const percentageDiff =
        baseAmount !== 0 ? (absoluteDiff / baseAmount) * 100 : 0;
      const isPositive = absoluteDiff >= 0;

      comparisons.push({
        label: item.label,
        absoluteDiff: formatCurrency(absoluteDiff, "VES"),
        percentageDiff: `${isPositive ? "+" : ""}${percentageDiff.toFixed(2)}%`,
        isPositive,
      });
    }
  }

  return comparisons;
});

watch(
  [() => props.bcvRate, () => props.streetRate, () => props.binanceRate],
  () => {
    if (usdValue.value !== null && props.bcvRate && props.streetRate) {
      vesOfficialValue.value = roundValue(usdValue.value * props.bcvRate.rate);
      vesStreetValue.value = roundValue(usdValue.value * props.streetRate.rate);
      if (props.binanceRate)
        vesBinanceValue.value = roundValue(
          usdValue.value * props.binanceRate.rate
        );
    }
  },
  { deep: true }
);

watch(
  usdValue,
  (newUsd) => {
    if (lastEdited.value !== "usd" || !props.bcvRate || !props.streetRate)
      return;
    if (newUsd !== null) {
      vesOfficialValue.value = roundValue(newUsd * props.bcvRate.rate);
      vesStreetValue.value = roundValue(newUsd * props.streetRate.rate);
      if (props.binanceRate)
        vesBinanceValue.value = roundValue(newUsd * props.binanceRate.rate);
    } else {
      vesOfficialValue.value = null;
      vesStreetValue.value = null;
      vesBinanceValue.value = null;
    }
  },
  { immediate: true }
);

watch(vesOfficialValue, (newVes) => {
  if (lastEdited.value !== "vesOfficial" || !props.bcvRate || !props.streetRate)
    return;
  if (newVes !== null) {
    const newUsd = roundValue(newVes / props.bcvRate.rate, 4);
    usdValue.value = newUsd;
    vesStreetValue.value = roundValue(newUsd * props.streetRate.rate);
    if (props.binanceRate)
      vesBinanceValue.value = roundValue(newUsd * props.binanceRate.rate);
  } else {
    usdValue.value = null;
    vesStreetValue.value = null;
    vesBinanceValue.value = null;
  }
});

watch(vesStreetValue, (newVes) => {
  if (lastEdited.value !== "vesStreet" || !props.bcvRate || !props.streetRate)
    return;

  if (newVes !== null) {
    const newUsd = roundValue(newVes / props.streetRate.rate, 4);
    usdValue.value = newUsd;
    vesOfficialValue.value = roundValue(newUsd * props.bcvRate.rate);
    
    if (props.binanceRate)
      vesBinanceValue.value = roundValue(newUsd * props.binanceRate.rate);
  } else {
    usdValue.value = null;
    vesOfficialValue.value = null;
    vesBinanceValue.value = null;
  }
});

watch(vesBinanceValue, (newVes) => {
  if (
    lastEdited.value !== "vesBinance" ||
    !props.bcvRate ||
    !props.streetRate ||
    !props.binanceRate
  )
    return;
  if (newVes !== null) {
    const newUsd = roundValue(newVes / props.binanceRate.rate, 4);
    usdValue.value = newUsd;
    vesOfficialValue.value = roundValue(newUsd * props.bcvRate.rate);
    vesStreetValue.value = roundValue(newUsd * props.streetRate.rate);
  } else {
    usdValue.value = null;
    vesOfficialValue.value = null;
    vesStreetValue.value = null;
  }
});
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex flex-col md:flex-row gap-4">
      <div class="input-card highlight-card">
        <label for="usd-input" class="input-label">Monto en divisas</label>
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
      <div class="input-card highlight-card">
        <label for="official-input" class="input-label"
          >Monto en bolívares (BCV)</label
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
      <div class="input-card highlight-card">
        <label for="street-input" class="input-label"
          >Monto en bolívares (Paralelo)</label
        >
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
      <div v-if="binanceRate" class="input-card highlight-card">
        <label for="binance-input" class="input-label"
          >Monto en bolívares (Binance)</label
        >
        <div class="input-wrapper">
          <span class="input-prefix">Bs</span>
          <input
            id="binance-input"
            type="number"
            class="input-field"
            placeholder="0.00"
            step="any"
            v-model.number="vesBinanceValue"
            @focus="lastEdited = 'vesBinance'"
          />
        </div>
      </div>
    </div>

    <div class="flex gap-4">
      <div
        v-for="comp in comparisonInfo"
        :key="comp.label"
        class="info-item flex-1"
      >
        <span class="info-label">{{ comp.label }}</span>
        <div class="flex items-baseline gap-2 mt-1">
          <span class="info-value text-light">{{ comp.absoluteDiff }}</span>
          <span
            class="text-xs font-medium"
            :class="comp.isPositive ? 'text-red-400/80' : 'text-green-400/80'"
          >
            ({{ comp.percentageDiff }})
          </span>
        </div>
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
