<template>
  <div
    class="flex-shrink-0 bg-white transition duration-300 hover:scale-110 cursor-pointer rounded-2xl"
  >
    <div class="w-full aspect-[2/3] overflow-hidden rounded-2xl ">
      <img :src="img" loading="lazy" :alt="name" class="w-full h-full object-contain" />
    </div>

    <div class="w-full h-auto text-black p-2 rounded-b-2xl text-left ">
      <p class="text-lg font-bold">{{ name }}</p>
      <p class="text-sm opacity-80">{{ gender }}</p>
      <p class="text-sm text-gray-600">{{ department }}</p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  img: String,
  name: String,
  gender: String,
  department: String,
});
</script>
