<template>
  <div class="flex flex-wrap justify-center">
    <div class="w-full text-start rounded-md">
      <p class="font-bold text-xl mb-2 w-full text-start text-white">แท็กหนัง</p>
      <!-- <button
        v-for="genre in genres"
        :key="genre.id"
        @click="toggleGenre(genre.id)"
        class="px-4 py-2 my-1 mx-1 cursor-pointer transition-colors duration-300 rounded-md "
        :class="
          props.selectedGenres.includes(genre.id)
            ? 'bg-[#A0E13E] text-black'
            : 'hover:bg-[#222] cursor-pointer'
        "
      >
         {{ genre.name }}
      </button> -->
      <div
        v-for="genre in genres"
        :key="genre.id"
        @click="toggleGenre(genre.id)"
        class="px-4 py-2 my-1 cursor-pointer transition-colors duration-300 rounded-md"
        :class="
          props.selectedGenres.includes(genre.id)
            ? 'bg-[#A0E13E] text-black font-bold'
            : 'hover:bg-[#222] cursor-pointer'
        "
      >
        {{ genre.name }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits } from "vue";
import type { Genre } from "../Type/tmdb";

const props = defineProps<{
  genres: Genre[];
  selectedGenres: number[];
}>();

const emit = defineEmits<{
  (e: "update:selectedGenres", value: number[]): void;
}>();

const open = ref(false);

const toggleGenre = (genreId: number) => {
  const newSelection = [...props.selectedGenres];
  const index = newSelection.indexOf(genreId);

  if (index > -1) newSelection.splice(index, 1);
  else newSelection.push(genreId);

  emit("update:selectedGenres", newSelection);
};
</script>

<style>
.animate-fade {
  animation: fade 0.15s ease-in-out;
}
@keyframes fade {
  from {
    opacity: 0;
    transform: translateY(-5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
