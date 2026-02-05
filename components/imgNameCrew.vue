<template>
  <div
    class="flex-shrink-0 bg-white transition duration-300 hover:scale-110 cursor-pointer rounded-2xl w-32"
  >
    <div class="w-full aspect-[2/3] overflow-hidden rounded-2xl gap-3">
      <img :src="currentSrc" loading="lazy" :alt="name" class="w-full h-full object-contain" @error="onError"/>
    </div>

    <div class="w-full h-auto text-black p-2 rounded-b-2xl text-left ">
      <h2 class="text-sm font-bold">{{ name }}</h2>
      <p class="text-xs">{{ job }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";

const props = defineProps<{
  img: String,
  name: String,
  job: String,
  fallback: String,
}>();


const currentSrc = ref(props.img || props.fallback || "/img/no-profile.png");


watch(
  () => props.img,
  (v) => {
    currentSrc.value = v || props.fallback || "/img/no-profile.png";
  },
);

const onError = () => {
  currentSrc.value = props.fallback || "/img/no-profile.png";
};
</script>
