<script setup lang="ts">
import { computed } from "vue";
import type { PropType } from "vue";
import type { ProcessedRate } from "~/api/types/bsRates";
import { formatCurrency } from "~/utils/formatters";

const props = defineProps({
  officialRate: {
    type: Object as PropType<ProcessedRate | null>,
    required: true,
  },
  parallelRate: {
    type: Object as PropType<ProcessedRate | null>,
    required: false,
  },
  binanceRate: {
    type: Object as PropType<ProcessedRate | null>,
    required: false,
  },
});

const comparisons = computed(() => {
  if (!props.officialRate) return [];

  const baseRate = props.officialRate.rate;
  const results = [];

  const ratesToCompare = [
    { name: "vs Paralelo", data: props.parallelRate },
    { name: "vs Binance P2P", data: props.binanceRate },
  ];

  for (const item of ratesToCompare) {
    if (item.data) {
      const diff = item.data.rate - baseRate;
      const isPositive = diff >= 0;
      const percentage = baseRate !== 0 ? (diff / baseRate) * 100 : 0;

      results.push({
        name: item.name,
        absoluteDiff:
          (isPositive ? "+" : "-") + formatCurrency(Math.abs(diff), "VES"),
        percentageDiff: (isPositive ? "+" : "") + percentage.toFixed(2) + "%",
        isPositive,
      });
    }
  }
  return results;
});
</script>

<template>
  <div class="flex flex-col justify-center h-full gap-4 w-full">
    <div v-for="comp in comparisons" :key="comp.name">
      <h3 class="text-sm font-medium text-light/80 mb-2">{{ comp.name }}</h3>
      <div class="flex flex-col gap-2">
        <div class="flex items-center gap-3">
          <Icon
            :name="
              comp.isPositive
                ? 'ic:round-trending-up'
                : 'ic:round-trending-down'
            "
            class="text-2xl"
            :class="comp.isPositive ? 'text-green-500' : 'text-red-500'"
          />
          <p class="text-lg font-bold text-light">{{ comp.percentageDiff }}</p>
        </div>
        <div class="flex items-center gap-3">
          <Icon name="ic:round-difference" class="text-2xl text-primary/80" />
          <p class="text-lg font-bold text-light">{{ comp.absoluteDiff }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
