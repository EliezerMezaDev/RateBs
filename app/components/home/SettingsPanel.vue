<script setup lang="ts">
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
});

const emit = defineEmits<{
  (e: "update:rates", rates: { bcv: number; street: number }): void;
}>();

const localBcvRate = ref(props.currentBcvRate?.rate);
const localStreetRate = ref(props.currentStreetRate?.rate);

watch(
  () => props.currentBcvRate,
  (newRate: { rate: any }) => {
    localBcvRate.value = newRate?.rate;
  }
);
watch(
  () => props.currentStreetRate,
  (newRate: { rate: any }) => {
    localStreetRate.value = newRate?.rate;
  }
);

function handleUpdate() {
  if (localBcvRate.value !== null && localStreetRate.value !== null) {
    emit("update:rates", {
      bcv: localBcvRate.value,
      street: localStreetRate.value,
    });
  }
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="input-card">
      <label for="custom-bcv" class="input-label"
        >Tasa Oficial (BCV)</label
      >
      <div class="input-wrapper">
        <span class="input-prefix">Bs</span>
        <input
          id="custom-bcv"
          type="number"
          class="input-field"
          step="any"
          v-model.number="localBcvRate"
          @input="handleUpdate"
        />
      </div>
    </div>
    <div class="input-card">
      <label for="custom-street" class="input-label"
        >Tasa Paralela</label
      >
      <div class="input-wrapper">
        <span class="input-prefix">Bs</span>
        <input
          id="custom-street"
          type="number"
          class="input-field"
          step="any"
          v-model.number="localStreetRate"
          @input="handleUpdate"
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
