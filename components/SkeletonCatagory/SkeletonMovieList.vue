<template>
  <div
    class="grid gap-4 px-4 py-6 animate-pulse"
    style="grid-template-columns: repeat(auto-fit, minmax(180px, 1fr))"
  >
    <SkeletonCatagorySkeletonCard v-for="i in count" :key="i" />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  count?: number;
}>();
</script>
