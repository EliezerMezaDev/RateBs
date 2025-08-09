<script setup lang="ts">
import type { ProcessedRate } from "~/api/types/bsRates";

defineProps({
  bcvRate: {
    type: Object as PropType<ProcessedRate | null>,
    required: true,
  },
  streetRate: {
    type: Object as PropType<ProcessedRate | null>,
    required: true,
  },
});

const isSimpleModeActive = ref(true);
</script>

<template>
  <div
    v-if="bcvRate && streetRate"
    class="w-full h-full flex flex-col justify-between"
  >
  
    <label
      class="flex items-center gap-3 cursor-pointer text-sm self-start mb-4"
    >
      <input
        type="checkbox"
        v-model="isSimpleModeActive"
        class="form-checkbox h-5 w-5 rounded bg-light/20 text-green-400 border-none focus:ring-green-400"
      />
      <span class="font-medium">Modo simple</span>
    </label>

    <div class="grow">
      <div v-if="isSimpleModeActive">
        <HomeCalculatorSimpleMode :bcvRate="bcvRate" :streetRate="streetRate" />
      </div>
      <div v-else>
        <div class="flex items-center justify-center h-full text-light/50">
          <p>Modo Extendido será implementado aquí.</p>
        </div>
      </div>
    </div>

  </div>
</template>
