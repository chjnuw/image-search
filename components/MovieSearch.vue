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
      @blur="onBlur"
    />
    <Transition name="fade-scale">
      <button
        v-if="query.length > 0"
        class="absolute right-5 top-1/2 -translate-y-1/2 text-white/70 text-xl cursor-pointer z-50 hover:text-white transition duration-200"
        @mousedown.prevent
        @click="clearSearch"
      >
        <Icon
          icon="bitcoin-icons:cross-filled"
          class="text-2xl text-white/80 hover:text-white"
        />
      </button>
    </Transition>

    <input
      ref="imageInput"
      type="file"
      accept="image/*"
      class="hidden"
      @change="onImageSearch"
    />

    <Transition name="fade-scale">
      <button
        v-if="!query"
        class="absolute right-5 top-1/2 -translate-y-1/2 text-white/70 hover:text-white z-50 cursor-pointer transition duration-200"
        @click="imageInput?.click()"
        title="ค้นหาด้วยรูป"
      >
        <Icon
          icon="mdi:camera"
          class="text-2xl text-white/80 hover:text-white"
        />
      </button>
    </Transition>

    <!-- Prediction -->
    <ul
      v-if="open && movies.length"
      class="absolute z-50 mt-2 w-full rounded-xl bg-[#0B0A0A] border border-white/10 max-h-[58vh] overflow-auto custom-scrollbar p-4"
    >
      <li
        v-for="movie in movies"
        :key="movie.id"
        class="flex gap-4 px-4 py-3 hover:bg-white/10 cursor-pointer"
        @click="select(movie)"
        @mousedown.prevent="select(movie)"
      >
        <img
          v-if="movie.poster_path"
          :src="`https://image.tmdb.org/t/p/w92${movie.poster_path}`"
          class="aspect-[2/3] rounded-md"
        />
        <div>
          <p class="font-bold text-md line-clamp-2 text-white">
            {{ displayTitle(movie).main }}
          </p>

          <p v-if="displayTitle(movie).sub" class="text-sm text-gray-400">
            {{ displayTitle(movie).sub }}
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
      <NuxtLink
        v-if="query.length >= 2 || isImageSearch"
        :to="isImageSearch ? `/seemore?image=1` : `/seemore?q=${query}`"
        @mousedown.prevent
        @click="closeSearchpopup"
        class="block text-center text-sm text-[#A0E13E] py-2"
      >
        ดูผลลัพธ์ทั้งหมด →
      </NuxtLink>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, computed } from "vue";
import { useTMDB } from "../composables/useTMDB";
import type { Movie } from "../Type/tmdb";
import { useGlobalLoading } from "../composables/useGlobalLoading";
import { useSearchState } from "../composables/useSearchState";
import { useRouter } from "vue-router";

const { imageResults, isImageSearch, imagePreview } = useSearchState();
const { searchMovies, getMovieDetailsEN, getMovieDetails, searchMovieByImage } =
  useTMDB();
const router = useRouter();

const query = ref("");
const movies = ref<Movie[]>([]);
const open = ref(false);

let timer: any = null;

const onBlur = () => {
  setTimeout(() => {
    open.value = false;
  }, 150);
};

watch(query, (val) => {
  clearTimeout(timer);

  isImageSearch.value = false;
  if (!val || val.length < 2) {
    movies.value = [];
    open.value = false;
    return;
  }

  open.value = true;

  timer = setTimeout(async () => {
    const res = await searchMovies(val);
    movies.value = res?.results?.slice(0, 10) ?? [];
    preloadEnTitles(movies.value);
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

function closeSearchpopup() {
  emit("close");
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

const enTitleMap = ref<Record<number, string>>({});

const preloadEnTitles = (movies: Movie[]) => {
  movies.forEach((m) => {
    if (enTitleMap.value[m.id]) return;

    getMovieDetailsEN(m.id)
      .then((en) => {
        enTitleMap.value[m.id] = en?.title || m.original_title || m.title;
      })
      .catch(() => {
        enTitleMap.value[m.id] = m.original_title || m.title;
      });
  });
};

const displayTitle = (movie: Movie) => {
  const en = enTitleMap.value[movie.id] || null;
  const th = movie.title;

  return {
    main: en || th || null,
    sub: th && en && th !== en ? th : null,
  };
};

const imageInput = ref<HTMLInputElement | null>(null);
const { start, stop } = useGlobalLoading();

async function onImageSearch(e: Event) {
  const input = e.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;

  start();

  try {
    console.log("IMAGE FILE:", file); // 🔴 debug

    // preview รูป
    imagePreview.value = URL.createObjectURL(file);
    console.log("PREVIEW:", imagePreview.value);

    const data = await searchMovieByImage(file);
    console.log("IMAGE SEARCH API:", data);

    const results: Movie[] = [];
    for (const id of data.movie_ids || []) {
      const m = await getMovieDetailsEN(id);
      if (m) results.push(m);
    }

    console.log("IMAGE RESULTS:", results);

    // ✅ เก็บลง global
    imageResults.value = results;
    isImageSearch.value = true;

    // 🔴 สำคัญ: ปิด text search
    query.value = "";
    movies.value = [];
    open.value = false;

    // ไปหน้า seemore
    await router.push("/seemore?image=1");
  } catch (err) {
    console.error("IMAGE SEARCH ERROR:", err);
  } finally {
    stop();
    input.value = "";
  }
}

</script>
<style scoped>
.fade-scale-enter-active,
.fade-scale-leave-active {
  transition: all 0.18s ease;
}

.fade-scale-enter-from,
.fade-scale-leave-to {
  opacity: 0;
  transform: scale(0.85);
}
</style>
