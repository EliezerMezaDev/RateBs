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

const svgBg = `url("data:image/svg+xml,<svg id='patternId' width='100%' height='100%' xmlns='http://www.w3.org/2000/svg'><defs><pattern id='a' patternUnits='userSpaceOnUse' width='40' height='40' patternTransform='scale(1) rotate(60)'><rect x='0' y='0' width='100%' height='100%' fill='%23002d4bff'/><path d='M15.986 4.186 4.1 16.072v.58L16.566 4.186Zm7.62 0 12.38 12.38v-.58l-11.8-11.8Zm12.38 19.248L23.52 35.9h.58l11.886-11.886ZM4.1 23.52v.58l11.8 11.8h.58z'  stroke-linejoin='round' stroke-linecap='round' stroke-width='0.5' stroke='%2300a8e8ff' fill='none'/></pattern></defs><rect width='800%' height='800%' transform='translate(0,0)' fill='url(%23a)'/></svg>")`;





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
