<script setup lang="ts">
import { computed } from "vue";
import type { PropType } from "vue";
import type { ProcessedRate } from "~/api/types/bsRates";

const props = defineProps({
  officialRate: {
    type: Object as PropType<ProcessedRate | null>,
    required: true,
  },
  parallelRate: {
    type: Object as PropType<ProcessedRate | null>,
    required: true,
  },
});

const isPositive = computed(() => {
  if (!props.officialRate || !props.parallelRate) return true;

  return props.parallelRate.rate >= props.officialRate.rate;
});

const percentageDifference = computed(() => {
  if (
    !props.officialRate ||
    !props.parallelRate ||
    props.officialRate.rate === 0
  )
    return null;

  const diff = props.parallelRate.rate - props.officialRate.rate;
  const percentage = Math.abs((diff / props.officialRate.rate) * 100).toFixed(
    2
  );

  return isPositive.value ? `+${percentage}%` : `-${percentage}%`;
});

const absoluteDifference = computed(() => {
  if (!props.officialRate || !props.parallelRate) return null;

  const diff = props.parallelRate.rate - props.officialRate.rate;

  const formattedDiff = formatCurrency(Math.abs(diff), "VES");

  return isPositive.value ? `+${formattedDiff}` : `-${formattedDiff}`;
});
</script>

<template>
  <div
    v-if="percentageDifference && absoluteDifference"
    class="flex flex-col justify-center h-full gap-2"
  >
    <div class="flex items-center gap-3">
      <Icon
        :name="isPositive ? 'ic:round-trending-up' : 'ic:round-trending-down'"
        class="text-3xl"
        :class="isPositive ? 'text-green-500' : 'text-red-500'"
      />
      <div>
        <h3 class="text-sm font-medium text-light/60">Relación Porcentual</h3>
        <p class="text-xl font-bold text-light">{{ percentageDifference }}</p>
      </div>
    </div>

    <div class="flex items-center gap-3">
      <Icon name="ic:round-difference" class="text-3xl text-primary/80" />
      <div>
        <h3 class="text-sm font-medium text-light/60">Diferencia Absoluta</h3>
        <p class="text-xl font-bold text-light">{{ absoluteDifference }}</p>
      </div>
    </div>
  </div>
</template>
