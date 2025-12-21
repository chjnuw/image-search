<template>
  <div class="bg-black mt-22 flex flex-col">
    <div class="z-50 mx-[10%]">
      <Breadcrumb />
    </div>
    <!-- <section
      class="relative h-[80vh] w-full flex items-center justify-center overflow-hidden"
    >
      <img
        src="/public/img/fri.png"
        alt=""
        class="object-cover object-top w-full h-full mask-b-from-30% mask-b-to-85% mask-x-from-60% mask-x-to-90%"
      />
      <div class="absolute w-[60%] aspect[3/2] bg-black top-40  z-50">1</div>
    </section> รูปภาพข้างบน กำลังคิดรูปแบบ-->
    <section class="flex gap-4 p-4 mb-[10rem] max-w-[80%] mx-auto items-start">
      <div
        class="bg-[#0B0A0A] text-white w-1/4 flex flex-wrap items-start justify-center rounded-xl"
      >
        <div class="w-full p-4 justify-start">
          <h2 class="font-bold text-2xl mb-2 w-full text-start"></h2>

          <div class="relative inline-block text-left w-full p-2">
            <button
              class="px-4 py-2 bg-[#A0E13E] font-bold text-white text-shadow-lg/20 rounded-md hover:bg-[#90CB38] transition flex justify-between items-center w-full cursor-pointer"
              @click="openFillterDrop = !openFillterDrop"
            >
              {{
                categories.find((c) => c.key === currentCategory)?.label ||
                "Filter"
              }}
              <Icon
                icon="weui:arrow-outlined"
                class="ml-1 w-4 h-4 text-white transition-transform duration-200"
                :class="{ 'rotate-90': openFillterDrop }"
              />
            </button>
            <div
              v-if="openFillterDrop"
              class="p-2 mt-2 bg-[#0B0A0A] shadow-lg rounded-md z-50 flex flex-wrap animate-fade"
            >
              <p class="font-bold text-xl mb-2 w-full text-start text-white">
                Type
              </p>
              <button
                v-for="category in categories"
                :key="category.key"
                class="px-4 py-2 my-1 w-full text-left rounded-md transition-colors"
                :class="
                  currentCategory === category.key
                    ? 'bg-[#A0E13E] text-black font-bold'
                    : 'hover:bg-[#222] cursor-pointer'
                "
                @click="
                  currentCategory !== category.key &&
                    selectCategory(category.key)
                "
              >
                {{ category.label }}
              </button>
            </div>
          </div>
          <div class="relative inline-block text-left w-full p-2">
            <button
              class="px-4 py-2 bg-[#A0E13E] font-bold text-white text-shadow-lg/20 rounded-md hover:bg-[#90CB38] transition flex justify-between items-center w-full cursor-pointer"
              @click="openStreamimgDrop = !openStreamimgDrop"
            >
              {{ "Fillter" }}
              <Icon
                icon="weui:arrow-outlined"
                class="ml-1 w-4 h-4 text-white transition-transform duration-200"
                :class="{ 'rotate-90': openStreamimgDrop }"
              />
            </button>
            <div
              v-if="openStreamimgDrop"
              class="p-2 mt-2 bg-[#0B0A0A] shadow-lg rounded-md z-50 flex flex-wrap animate-fade"
            >
              <Tages
                :genres="movieGenres"
                :selectedGenres="selectedGenres"
                @update:selectedGenres="onGenreChange"
                class="w-full"
              />
            </div>
            <Streaming class="w-full my-4" />
          </div>
        </div>
      </div>

      <div class="bg-[#0B0A0A] text-white w-3/4 flex rounded-xl h-full">
        <section class="w-full p-4">
          <h2 class="font-bold text-4xl mb-2 w-full text-start">movies</h2>
          <div
            class="grid grid-cols-5 gap-4 px-4 py-6 items-center justify-center"
          >
            <CardM
              v-for="movie in movies"
              :key="movie.id"
              :movie="movie"
              class=""
              @open="openPopup"
            />
          </div>
          <PopupM
            v-if="showPopup"
            :selectedId="selectedId"
            @close="showPopup = false"
          />
        </section>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, onUnmounted } from "vue";
import type { Movie, Genre } from "../Type/tmdb";
import { useTMDB } from "../composables/useTMDB";

const {
  getPopularMovies,
  getTopRatedMovies,
  getUpcomingMovies,
  getNowPlaying,
  getGenres,
  getMoviesByGenres,
  getWatchProviders,
} = useTMDB();
const movies = ref<Array<Movie>>([]);
const movieGenres = ref<Genre[]>([]);

const currentCategory = ref("popular");

const categories = [
  { key: "popular", label: "Popular" },
  { key: "top_rated", label: "Top Rated" },
  { key: "upcoming", label: "Upcoming" },
  { key: "now_playing", label: "Now Playing" },
];

const selectCategory = async (key: string) => {
  currentCategory.value = key;
  let res = null;

  switch (key) {
    case "popular":
      res = await getPopularMovies();
      break;
    case "top_rated":
      res = await getTopRatedMovies();
      break;
    case "upcoming":
      res = await getUpcomingMovies();
      break;
    case "now_playing":
      res = await getNowPlaying();
      break;
  }

  movies.value = res?.results ?? [];
};
// โหลด default category
onMounted(() => selectCategory(currentCategory.value));
onMounted(async () => {
  const res = await getGenres();
  if (res) {
    movieGenres.value = res.genres;
    console.log("Genres loaded:", movieGenres.value);
  }
});
const selectedGenres = ref<number[]>([]);

const onGenreChange = async (newGenres: number[]) => {
  selectedGenres.value = newGenres;

  if (selectedGenres.value.length === 0) {
    await selectCategory(currentCategory.value); // โหลด category ปกติ
  } else {
    const genreQuery = selectedGenres.value.join(",");
    const res = await getMoviesByGenres(genreQuery, currentCategory.value);
    movies.value = res?.results ?? [];
  }
};

const openFillterDrop = ref(true);
const openStreamimgDrop = ref(false);

const showPopup = ref(false);
const selectedId = ref(null);
function openPopup(id) {
  selectedId.value = id;
  showPopup.value = true;
}

watch(showPopup, (val) => {
  document.body.style.overflow = val ? "hidden" : "";
});

const handleEsc = (e) => {
  if (e.key === "Escape") showPopup.value = false;
};
onMounted(() => {
  document.addEventListener("keydown", handleEsc);
});

onUnmounted(() => {
  document.removeEventListener("keydown", handleEsc);
});
</script>

<style>
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
.animate-fade {
  animation: fade 0.15s ease-in-out;
}
</style>
