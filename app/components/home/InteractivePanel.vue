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
    <div class="sm:hidden mb-4">
      <label for="tabs-mobile" class="sr-only">Seleccionar Pestaña</label>
      <select
        id="tabs-mobile"
        v-model="activeTab"
        class="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-light focus:ring-primary focus:border-primary"
      >
        <option v-for="tab in tabs" :key="tab.id" :value="tab.id">
          {{ tab.label }}
        </option>
      </select>
    </div>

    <ul
      class="hidden text-center text-lg lg:text-xl font-medium text-light sm:flex"
    >
      <li v-for="tab in tabs" :key="tab.id" class="w-full">
        <a
          href="#"
          @click.prevent="activeTab = tab.id"
          class="w-full p-3 lg:p-4 transition-colors duration-200 flex items-center justify-center gap-2"
          :class="{
            'bg-light/5 rounded-t-lg': activeTab === tab.id,
            'text-light/70 hover:text-light':
              activeTab !== tab.id,
          }"
        >
          <Icon :name="tab.icon" class="text-xl lg:text-2xl" />
          <span>{{ tab.label }}</span>
        </a>
      </li>
    </ul>

    <div class="pt-2 px-4 bg-light/5 rounded-b-lg grow">
      <div v-show="activeTab === 'calculator'">
        <HomeRateCalculator :bcvRate="bcvRate" :streetRate="streetRate" />
      </div>

      <div
        v-show="activeTab === 'settings'"
        class="flex flex-col items-center justify-center h-full"
      >
        <Icon
          name="ic:round-construction"
          class="text-5xl sm:text-6xl text-light/30"
        />
        <p class="text-light/50 mt-2">
          Sección de Configuración en construcción.
        </p>
      </div>
    </div>
  </div>
</template>
