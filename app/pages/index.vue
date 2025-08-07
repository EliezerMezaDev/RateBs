<template>
  <CommonSection customClass="pt-[10dvh] items-stretch">
    <div
      class="w-full grow grid grid-cols-5 grid-rows-5 gap-8 p-[0rem_2rem_2rem_2rem]"
    >
      <div class="card col-span-2 row-span-5">1</div>
      <div class="card col-span-3 row-span-5 col-start-3">2</div>
    </div>
  </CommonSection>
</template>

<script setup lang="ts">
useHead({
  title: "RateBs - Inicio",
  meta: [
    {
      name: "description",
      content: "página principal",
    },
  ],
});
</script>

<style>
.card {
  /* --- Base (Layout y Texto) --- */
  @apply flex items-center justify-center font-bold text-white rounded-2xl h-full w-full;

  /* --- Efecto de Glasmorfismo --- */
  
  /* 1. Fondo semitransparente. Usa /10 para 10% de opacidad.
        Puedes usar bg-black/10 para un look oscuro. */
  @apply bg-white/10;
  
  /* 2. El desenfoque del fondo. Esta es la magia del efecto.
        Prueba con backdrop-blur-sm, backdrop-blur-lg, etc. */
  @apply backdrop-blur-sm;

  /* 3. Un borde sutil para definir los límites del "vidrio". */
  @apply border border-white/20;

  /* 4. (Opcional pero recomendado) Una sombra suave para dar profundidad. */
  @apply shadow-xl;
}
</style>
