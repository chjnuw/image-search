<template>
  <div
    class="hover:scale-110 reletive transition-transform duration-300 cursor-pointer"
  >
    <img
      :src="
        props.movie.poster_path
          ? 'https://image.tmdb.org/t/p/w500' + props.movie.poster_path
          : fallback
      "
      @error="onError"
      class="aspect[2/3] object-contain max-w-full max-h-full rounded "
      @click="emit('open', props.movie.id)"
    />
    <span class="text-md absolute top-1 right-1 z-20 drop-shadow-xl/90 p-1">
      <FontAwesomeIcon icon="fa-solid fa-heart" class="hover:text-pink-500"
    /></span>
  </div>
</template>

<script setup lang="ts">
import type { Movie } from "../Type/tmdb";

const props = defineProps<{ movie: Movie }>();
const emit = defineEmits(["open"]);
function openPopup(id) {
  emit("open", id);
}

const fallback = "img/no-poster.png";

function onError(event) {
  event.target.src = fallback;
}
</script>

<style></style>
