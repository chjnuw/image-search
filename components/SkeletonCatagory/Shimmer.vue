<template>
  <div
    class="relative overflow-hidden rounded-md bg-gray-700/40"
    :class="height"
  >
    <div class="absolute inset-0 shimmer"></div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  height?: string; // เช่น 'h-4', 'h-6'
}>();
</script>

<style scoped>
.shimmer {
  background: linear-gradient(
    110deg,
    transparent 25%,
    rgba(255, 255, 255, 0.15) 37%,
    transparent 63%
  );
  animation: shimmer 1.4s infinite;
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}
</style>