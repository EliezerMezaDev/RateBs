<script setup lang="ts">
import type { ProcessedRate } from "~/api/types/bsRates";

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

const isSimpleModeActive = ref(true);

const tabs = [
  { id: "calculator", label: "Calculadora", icon: "ic:round-calculate" },
  { id: "settings", label: "Configuración", icon: "ic:round-settings" },
];
const activeTab = ref(tabs[0]!.id);

const managedBcvRate = ref<ProcessedRate | null>(null);
const managedStreetRate = ref<ProcessedRate | null>(null);

watch(
  [() => props.bcvRate, () => props.streetRate],
  ([newBcv, newStreet]: any) => {
    if (newBcv) managedBcvRate.value = { ...newBcv };
    if (newStreet) managedStreetRate.value = { ...newStreet };
  },
  { immediate: true, deep: true }
);

function handleRatesUpdate(newRates: { bcv: number; street: number }) {
  if (managedBcvRate.value) {
    managedBcvRate.value = { ...managedBcvRate.value, rate: newRates.bcv };
  }
  if (managedStreetRate.value) {
    managedStreetRate.value = { ...managedStreetRate.value, rate: newRates.street };
  }
}
</script>

<template>
  <div class="flex flex-col overflow-hidden h-full">
    <ul class=" text-center text-lg lg:text-xl font-medium text-light flex">
      <li v-for="tab in tabs" :key="tab.id" class="w-full">
        <a
          href="#"
          @click.prevent="activeTab = tab.id"
          class="w-full p-3 lg:p-4 transition-colors duration-200 flex items-center justify-center gap-2"
          :class="{
            'bg-base2 rounded-t-lg': activeTab === tab.id,
            'text-light/80 hover:bg-base/5 hover:text-light': activeTab !== tab.id,
          }"
        >
          <Icon :name="tab.icon" class="text-xl lg:text-2xl" />
          <span class="max-[375px]:hidden">{{ tab.label }}</span>
        </a>
      </li>
    </ul>

    <div class="p-2 sm:p-4 bg-base2 rounded-b-lg grow">
      <div v-show="activeTab === 'calculator'" class="flex flex-col h-full justify-between">
        <div>
          <HomeCalculatorSimpleMode
            v-if="isSimpleModeActive && managedBcvRate && managedStreetRate"
            :bcvRate="managedBcvRate"
            :streetRate="managedStreetRate"
          />
          <div v-else class="flex items-center justify-center h-full text-light/50">
            <p>Modo Extendido será implementado aquí.</p>
          </div>
        </div>

        <!-- <label
          class="flex items-center gap-3 cursor-pointer text-sm self-start mt-4"
        >
          <input
            type="checkbox"
            v-model="isSimpleModeActive"
            class="form-checkbox h-5 w-5 rounded bg-light/20 text-green-400 border-none focus:ring-green-400"
          />
          <span class="font-medium">Modo simple</span>
        </label> -->
      </div>

      <div v-show="activeTab === 'settings'">
        <HomeSettingsPanel
          :currentBcvRate="managedBcvRate"
          :currentStreetRate="managedStreetRate"
          @update:rates="handleRatesUpdate"
        />
      </div>
    </div>
  </div>
</template>