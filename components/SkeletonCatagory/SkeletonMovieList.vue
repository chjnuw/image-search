<template>
  <div
    class="grid gap-4 px-4 py-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
  >
    <SkeletonCatagorySkeletonCard v-for="i in count" :key="i" />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  count?: number;
}>();
</script>

