<template>
  <div
    class="w-32 flex-shrink-0 aspect-[2/3] bg-white flex flex-col items-center transition duration-300 hover:scale-110 cursor-pointer rounded-2xl"
  >
    <img :src="img" :alt="name" class="w-full h-full object-cover rounded-2xl" />

  </div>
</template>

<script setup>
defineProps({
  poster: String,
  name: String,
});
</script>