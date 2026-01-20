<template>
  <div class="relative w-full">
    <!-- Input -->
    <input
      ref="inputRef"
      v-model="query"
      type="text"
      placeholder="ค้นหาภาพยนตร์..."
      class="relative w-full pl-5 pr-12 py-4 rounded-xl bg-[#111] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#A0E13E]"
      @focus="open = true"
      @blur="setTimeout(() => (open = false), 150)"
    />
    <button
      class="absolute right-5 top-1/2 -translate-y-1/2 text-white/70 text-xl cursor-pointer z-50 hover:text-white transition duration-200"
      @mousedown.prevent
      @click="clearSearch"
    >
      ✕
    </button>

    <!-- Prediction -->
    <ul
      v-if="open && movies.length"
      class="absolute z-50 mt-2 w-full rounded-xl bg-[#0B0A0A] border border-white/10 max-h-[60vh] overflow-auto custom-scrollbar p-4"
    >
      <li
        v-for="movie in movies"
        :key="movie.id"
        class="flex gap-4 px-4 py-3 hover:bg-white/10 cursor-pointer"
        @click="select(movie)"
      >
        <img
          v-if="movie.poster_path"
          :src="`https://image.tmdb.org/t/p/w92${movie.poster_path}`"
          class="aspect-[2/3] rounded-md"
        />
        <div>
          <p class="font-semibold text-white">
            {{ movie.original_title }}
          </p>
          <p
            v-if="movie.original_title !== movie.title"
            class="text-xs text-gray-400"
          >
            {{ movie.title }}
          </p>
          <div class="flex gap-1 my-1">
            <p class="text-xs text-gray-400">
              ⭐ {{ movie.vote_average.toFixed(1) }}
            </p>
            <p class="text-xs text-gray-400">
              ( {{ movie.vote_count ?? 0 }} รีวิว )
            </p>
          </div>
          <p class="text-xs text-gray-400">
            {{ movie.release_date?.slice(0, 4) || "—" }}
          </p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from "vue";
import { useTMDB } from "../composables/useTMDB";
import type { Movie } from "../Type/tmdb";

const { searchMovies } = useTMDB();

const query = ref("");
const movies = ref<Movie[]>([]);
const open = ref(false);

let timer: any = null;

watch(query, (val) => {
  clearTimeout(timer);

  if (!val || val.length < 2) {
    movies.value = [];
    open.value = false;
    return;
  }

  open.value = true;

  timer = setTimeout(async () => {
    const res = await searchMovies(val);
    movies.value = res?.results?.slice(0, 6) ?? [];
  }, 400);
});

function select(movie: Movie) {
  emit("select", movie);
  open.value = false;
  query.value = "";
}

const inputRef = ref<HTMLInputElement | null>(null);

function clearSearch() {
  query.value = "";
  movies.value = [];
  open.value = false;
  inputRef.value?.focus();
}

const emit = defineEmits<{
  (e: "select", movie: Movie): void;
  (e: "close"): void;
}>();

const focusInput = async () => {
  await nextTick();
  inputRef.value?.focus();
};
defineExpose({ focusInput });
</script>
