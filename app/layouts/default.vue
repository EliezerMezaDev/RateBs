<template>
  <div class="realtive w-full min-h-screen h-auto flex flex-col">
    <main class="w-full flex flex-col items-center justify-start">
      <slot />
    </main>

    <CommonFooter />
  </div>
</template>

<style>
body {
  @apply bg-dark text-light;
  font-family: "Roboto", sans-serif;
}
</style>
