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

const tabs = [
  { id: "calculator", label: "Calculadora", icon: "ic:round-calculate" },
  { id: "settings", label: "Configuración", icon: "ic:round-settings" },
];

const activeTab = ref(tabs[0]!.id);
</script>

<template>
  <div class="flex flex-col h-full">
    <div class="sm:hidden">
      <label for="tabs" class="sr-only">Seleccionar Pestaña</label>
      <select id="tabs" v-model="activeTab">
        <option v-for="tab in tabs" :key="tab.id" :value="tab.id">
          {{ tab.label }}
        </option>
      </select>
    </div>

    <ul
      class="hidden text-center text-xl font-bold text-light rounded-lg shadow-sm sm:flex"
    >
      <li v-for="tab in tabs" :key="tab.id" class="w-full">
        <a
          href="#"
          @click.prevent="activeTab = tab.id"
          class="w-full p-4 transition-colors duration-200 flex items-center justify-center gap-2"
          :class="{
            'bg-white/10 text-white rounded-t-lg': activeTab === tab.id,
            'hover:bg-white/5': activeTab !== tab.id,
          }"
        >
          <Icon :name="tab.icon" class="text-2xl" />
          {{ tab.label }}
        </a>
      </li>
    </ul>

    <div class="p-4 rounded-b-lg grow">
      <div v-show="activeTab === 'calculator'">
        <HomeRateCalculator :bcvRate="bcvRate" :streetRate="streetRate" />
      </div>

      <div
        v-show="activeTab === 'settings'"
        class="flex flex-col items-center justify-center h-full"
      >
        <Icon name="ic:round-construction" class="text-6xl text-light/30" />
        <p class="text-light/50 mt-2">
          Sección de Configuración en construcción.
        </p>
      </div>
    </div>
  </div>
</template>
