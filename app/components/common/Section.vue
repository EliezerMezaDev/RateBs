<template>
  <section :class="sectionClasses" :style="sectionStyle">
    <slot />
  </section>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  minHeight: {
    type: String,
    default: "100dvh",
  },

  customClass: {
    type: String,
    default: "",
  },
});

const svgBg = `url("data:image/svg+xml,<svg id='patternId' width='100%' height='100%' xmlns='http://www.w3.org/2000/svg'><defs><pattern id='a' patternUnits='userSpaceOnUse' width='29' height='50.115' patternTransform='scale(2) rotate(10)'><rect x='0' y='0' width='100%' height='100%' fill='%23002d4bff'/><path d='M14.498 16.858L0 8.488.002-8.257l14.5-8.374L29-8.26l-.002 16.745zm0 50.06L0 58.548l.002-16.745 14.5-8.373L29 41.8l-.002 16.744zM28.996 41.8l-14.498-8.37.002-16.744L29 8.312l14.498 8.37-.002 16.745zm-29 0l-14.498-8.37.002-16.744L0 8.312l14.498 8.37-.002 16.745z'  stroke-width='2' stroke='%23003459ff' fill='none'/></pattern></defs><rect width='800%' height='800%' transform='translate(-4,-32)' fill='url(%23a)'/></svg>")`;

const sectionClasses = computed(() => {
  const baseClasses =
    "relative text-dark w-full flex flex-col items-center justify-center overflow-hidden";

  const layoutClasses = props.customClass ? props.customClass : " ";

  return `${baseClasses} ${layoutClasses}`;
});

const sectionStyle = computed(() => {
  return {
    minHeight: props.minHeight,
    backgroundImage: svgBg,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundAttachment: "fixed",
  };
});
</script>
