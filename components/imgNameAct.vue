<template>
  <div class="flex flex-col items-center w-24">
    <img
      :src="img"
      :alt="name"
      class="w-full aspect-[3/4] h-auto object-cover  rounded-xl border"
    />
    <p class="text-white text-sm mt-1.5">{{ name }}</p>
  </div>
</template>

<script setup>
defineProps({
  img: String,
  name: String,
});
</script>
