<template>
  <div class="px-2 sm:px-4 mx-auto max-w-[80%]">
    <div class="p-4 flex items-center gap-3">
      <h2 class="font-bold text-2xl whitespace-nowrap">POPULAR MOVIES</h2>
      <div class="flex-1 border-b-2"></div>
    </div>
    <div
      class="gap-4 py-6 px-4 flex overflow-x-auto custom-scrollbar"
    >
      <div
        v-for="movie in movies"
        :key="movie.id"
        :movie="movie"
        class="hover:scale-110 transition-transform duration-300 cursor-pointer overflow-hidden flex-shrink-0"   >
        <img
          :src="'https://image.tmdb.org/t/p/w500' + movie.poster_path"
          :alt="movie.title"
          class="aspect-[2/3] w-40 object-contain rounded"
        />
      </div>
      <div class="flex justify-center items-center ml-4 w-32 flex-shrink-0">
        <button
          class="hover:bg-gray-600 p-4 rounded-full flex flex-col items-center text-green-500 cursor-pointer"
        >
          <h1 class="text-center text-sm sm:text-base">
            Sell All<br /><span
              ><FontAwesomeIcon icon="fa-solid fa-arrow-right"
            /></span>
          </h1>
        </button>
      </div>
    </div>
  </div>
</template>


<script setup lang="ts">
import { ref, onMounted } from "vue";
import type { Movie } from "../Type/tmdb";
import { useTMDB } from "../composables/useTMDB";

const { getPopularMovies } = useTMDB();
const movies = ref<Array<Movie>>([]);

onMounted(async () => {
  const res = await getPopularMovies();
  movies.value = res?.results ?? [];
});
</script>

<style></style>
