<script setup lang="ts">
import { ref, watch } from "vue";
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

const areValuesLocked = ref(true);
const usdValue = ref<number | null>(1);
const vesOfficialValue = ref<number | null>(null);
const vesStreetValue = ref<number | null>(null);
type LastEditedField = "usd" | "vesOfficial" | "vesStreet";
const lastEdited = ref<LastEditedField>("usd");

watch(
  usdValue,
  (newUsd) => {
    if (
      (!areValuesLocked.value && lastEdited.value !== "usd") ||
      !props.bcvRate ||
      !props.streetRate
    )
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

watch(vesOfficialValue, (newVes) => {
  if (
    areValuesLocked.value ||
    lastEdited.value !== "vesOfficial" ||
    !props.bcvRate
  )
    return;

  if (newVes !== null) {
    usdValue.value = roundValue(newVes / props.bcvRate.rate, 4);
  } else {
    usdValue.value = null;
  }
});

watch(vesStreetValue, (newVes) => {
  if (
    areValuesLocked.value ||
    lastEdited.value !== "vesStreet" ||
    !props.streetRate
  )
    return;

  if (newVes !== null) {
    usdValue.value = roundValue(newVes / props.streetRate.rate, 4);
  } else {
    usdValue.value = null;
  }
});
</script>

<template>
  <div v-if="bcvRate && streetRate" class="w-full h-full flex flex-col gap-4">
    <div class="flex gap-4">
      <div class="input-card">
        <label for="usd-input" class="input-label">Precio en Divisas</label>

        <div class="input-wrapper">
          <span class="input-prefix">$</span>
          <input
            id="usd-input"
            type="number"
            class="input-field placeholder:text-primary"
            placeholder="1.00"
            step="0.01"
            v-model.number="usdValue"
            @focus="lastEdited = 'usd'"
          />
        </div>
      </div>

      <div class="input-card">
        <label for="official-input" class="input-label"
          >Tasa Oficial (BCV)</label
        >
        <div class="input-wrapper" :class="{ 'is-locked': areValuesLocked }">
          <span class="input-prefix">Bs</span>
          <input
            v-if="!areValuesLocked"
            id="official-input"
            type="number"
            class="input-field"
            placeholder="0.00"
            step="0.01"
            v-model.number="vesOfficialValue"
            @focus="lastEdited = 'vesOfficial'"
          />
          <span v-else class="input-display">{{
            formatCurrency(vesOfficialValue, "VES")
          }}</span>
        </div>
      </div>

      <div class="input-card">
        <label for="street-input" class="input-label">Tasa Paralela</label>

        <div class="input-wrapper" :class="{ 'is-locked': areValuesLocked }">
          <span class="input-prefix">Bs</span>
          <input
            v-if="!areValuesLocked"
            id="street-input"
            type="number"
            class="input-field"
            placeholder="0.00"
            step="0.1"
            v-model.number="vesStreetValue"
            @focus="lastEdited = 'vesStreet'"
          />
          <span v-else class="input-display">{{
            formatCurrency(vesStreetValue, "VES")
          }}</span>
        </div>
      </div>
    </div>

    <label class="flex items-center gap-3 cursor-pointer text-sm self-start">
      <input
        type="checkbox"
        :checked="!areValuesLocked"
        @change="areValuesLocked = !areValuesLocked"
        class="form-checkbox h-5 w-5 rounded bg-white/20 text-green-400 border-none focus:ring-green-400"
      />
      <span class="font-medium">Habilitar cálculo multidireccional</span>
    </label>
  </div>
</template>

<style scoped>
.input-card {
  @apply rounded-lg flex flex-1 flex-col gap-2;
  @apply border border-transparent transition-all duration-200;
}

.input-label {
  @apply text-start font-medium text-light/50;
}

.input-wrapper {
  @apply flex items-center;
}

.input-wrapper.is-locked {
  @apply bg-transparent;
}

.input-prefix {
  @apply pr-2 text-light/50 font-mono text-xl;
}

.input-field,
.input-display {
  @apply w-full bg-transparent  text-light focus:text-primary text-2xl font-semibold focus:outline-none;
}

.input-display {
  @apply select-none p-0;
}
</style>
