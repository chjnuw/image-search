<template>
  <div class="px-2 sm:px-4 mx-auto">
    <div
      class="flex py-4 px-2 overflow-y-hidden overflow-x-auto custom-scrollbar"
    >
      <div class="flex gap-2">
        <CardM
          v-for="movie in movies"
          :key="movie.id"
          :movie="movie"
          class="aspect-[2/3] w-34 sm:w-40 object-cover rounded hover:scale-105 overflow-hidden flex-shrink-0"
        />
      </div>
      <div class="flex justify-center items-center ml-4 w-32 flex-shrink-0">
        <button @click="goTocategoryPopular"
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

const goTocategoryPopular = () => {
  window.location.href = "/catagory";
};
</script>

<style></style>
