<template>
  <transition
    name="popup-fade"
    appear
    enter-active-class="duration-300 ease-out"
    leave-active-class="duration-200 ease-in"
  >
    <div
      v-if="selectedId && selectedItem"
      class="fixed inset-0 flex items-center justify-center z-50 min-h-screen bg-black/50 backdrop-blur-sm"
    >
      <div
        class="rounded-2xl w-[65%] h-[80%] overflow-y-auto grid grid-cols-4 custom-scrollbar"
      >
        <div
          class="col-span-1 bg-[#000000] p-4 text-white flex flex-col items-center"
        >
          <img
            :src="selectedItem.poster"
            loading="lazy"
            class="rounded-xl aspect-[2/3] w-64 border-2 object-contain"
          />

          <h1 class="p-2 w-full text-2xl font-bold text-center">
            {{ selectedItem.title }}
          </h1>

          <p class="p-2 text-sm flex items-center justify-center gap-2">
            <span
              class="px-2 py-1 border border-white/40 bg-white/10 rounded-md text-xs font-bold"
            >
              {{ selectedItem.ageRating }}
            </span>
            <span>·</span>
            <span class="text-xs">{{ selectedItem.time }}</span>
          </p>

          <p class="flex flex-wrap gap-2 p-2 text-xs justify-center">
            <button
              v-for="tag in selectedItem.tags"
              :key="tag.id"
              class="p-2 bg-gray-800 rounded-full hover:bg-gray-600 transition"
            >
              # {{ tag.name }}
            </button>
          </p>

          <div
            class="w-40 aspect-[2/3] bg-white rounded-2xl flex flex-col mt-3"
          >
            <img
              :src="
                director?.profile_path
                  ? 'https://image.tmdb.org/t/p/w300' + director.profile_path
                  : 'img/no-profile.png'
              "
              loading="lazy"
              class="w-full h-full object-contain rounded-2xl"
            />
            <div class="text-center text-black p-2">
              <h2 class="font-bold text-md">Director</h2>
              <p class="text-sm">{{ director?.name || "-" }}</p>
            </div>
          </div>
        </div>

        <div
          class="bg-[#0B0A0A] text-white col-span-3 flex flex-col items-center"
        >
          <div class="relative w-full aspect-video">
            <iframe
              v-if="isTrailerActive && trailer"
              :src="trailer"
              class="w-full h-full rounded-xl"
              allow="autoplay; encrypted-media"
              allowfullscreen
            />
            <img
              v-else
              :src="currentImage"
              class="w-full h-full object-contain"
            />
            <button
              class="fixed top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full cursor-pointer"
              @click="$emit('close')"
            >
              <FontAwesomeIcon icon="fa-solid fa-xmark" />
            </button>
          </div>

          <div class="relative group/thumb">
            <div
              ref="thumbContainer"
              class="w-full overflow-x-auto custom-scrollbar p-3 flex gap-2"
              style="overflow-anchor: none"
            >
              <div
                v-if="trailerThumb"
                ref="trailerThumbRef"
                class="flex-shrink-0 h-20 w-36 cursor-pointer relative"
                :class="
                  isTrailerActive ? 'border-green-500' : 'border-transparent'
                "
                @click="
                  isTrailerActive = true;
                  stopAutoTemporarily();
                "
                currentIndex="0;"
              >
                <img :src="trailerThumb" class="w-full h-full object-cover" />
                <div
                  class="absolute inset-0 flex items-center justify-center bg-black/30"
                >
                  <FontAwesomeIcon
                    icon="fa-solid fa-play"
                    class="text-white text-2xl"
                  />
                </div>
              </div>
              <div
                v-for="img in filteredImages"
                :key="img"
                loading="lazy"
                class="flex-shrink-0 h-20 cursor-pointer"
                :class="{
                  'border-4 border-green-500':
                    currentImage === img && !isTrailerActive,
                }"
                @click="
                  isTrailerActive = false;
                  currentImage = img;
                  currentIndex = carouselItems.indexOf(img);
                  stopAutoTemporarily();
                "
                :ref="(el) => (thumbRefs[img] = el)"
              >
                <img :src="img" class="h-full object-contain" loading="lazy" />
              </div>
            </div>
            <div
              class="flex absolute top-1/2 -translate-y-1/2 left-0 w-auto px-2"
            >
              <button
                class="text-white text-lg p-2 bg-black/30 hover:bg-gray-700 rounded-full group-hover/thumb:cursor-pointer opacity-0 -translate-x-6 transition-all duration-500 group-hover/thumb:translate-x-0 group-hover/thumb:opacity-100"
                @click="prevSlide"
              >
                <FontAwesomeIcon icon="fa-solid fa-arrow-left" />
              </button>
            </div>
            <div
              class="flex absolute top-1/2 -translate-y-1/2 right-0 w-auto px-2"
            >
              <button
                class="text-white text-lg p-2 bg-black/30 hover:bg-gray-700 rounded-full group-hover/thumb:cursor-pointer opacity-0 translate-x-6 transition-all duration-500 group-hover/thumb:translate-x-0 group-hover/thumb:opacity-100"
                @click="nextSlide"
              >
                <FontAwesomeIcon icon="fa-solid fa-arrow-right" />
              </button>
            </div>
          </div>
          <div class="w-[95%]">
            <p class="my-2 text-2xl font-bold">Overview</p>
            <p class="p-2 indent-8">
              {{ selectedItem.description }}
            </p>

            <div class="">
              <h2 class="font-bold text-2xl my-2">Actor</h2>
              <div class="flex gap-3 overflow-x-auto custom-scrollbar p-4">
                <ImgNameAct
                  v-for="a in filteredActors"
                  :key="a.id"
                  :img="a.profile"
                  :name="a.name"
                  :character="a.character"
                  loading="lazy"
                />
                <div
                  class="flex justify-center items-center ml-4 w-32 flex-shrink-0"
                >
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

            <div class="">
              <h2 class="font-bold text-2xl my-2">Crew</h2>
              <div class="flex gap-3 overflow-x-auto custom-scrollbar p-4">
                <ImgNameCrew
                  v-for="c in filteredCrew"
                  :key="c.id"
                  :img="c.profile"
                  :name="c.name"
                  :job="c.job"
                  loading="lazy"
                />
                <div
                  class="flex justify-center items-center ml-4 w-32 flex-shrink-0"
                >
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
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, watch, computed, onUnmounted, reactive, nextTick } from "vue";
import { useTMDB } from "../composables/useTMDB";
import type { Movie, CreditsResponse, MovieImagesResponse } from "../Type/tmdb";

const { getMovieDetails, getMovieCredits, getMovieImages, getMovieVideos } =
  useTMDB();

const props = defineProps<{ selectedId: number | string }>();
const emit = defineEmits(["close"]);

// STATE
const selectedItem = ref<any>(null);
const images = ref<string[]>([]);
const currentImage = ref("");
const currentIndex = ref(0);
const crew = ref<any[]>([]);
const actors = ref<any[]>([]);
const director = ref<any | null>(null);
const showAllImages = ref(false);
const showAllActors = ref(false);
const showAllCrew = ref(false);
const thumbRefs = reactive({});
const thumbContainer = ref(null);
const isTrailerActive = ref(false);
const trailer = ref<string | null>(null);
const trailerThumb = ref<string | null>(null);
const trailerThumbRef = ref<HTMLElement | null>(null);
const trailerPlayedOnce = ref(false);
const userInteracted = ref(false);
// computed
const filteredImages = computed(() => {
  return showAllImages.value ? images.value : images.value.slice(0, 10);
});
const filteredActors = computed(() => {
  return showAllActors.value ? actors.value : actors.value.slice(0, 10);
});

const filteredCrew = computed(() => {
  return showAllCrew.value ? crew.value : crew.value.slice(0, 10);
});

function formatRuntime(mins: number) {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${h}h ${m}m`;
}
async function loadData(id: number) {
  await loadTrailer(id);
  const movie = await getMovieDetails(id);
  if (!movie) return;

  selectedItem.value = {
    id: movie.id,
    title: movie.title,
    poster: movie.poster_path
      ? "https://image.tmdb.org/t/p/w500" + movie.poster_path
      : "img/no-poster.png",
    backdrop: movie.backdrop_path
      ? "https://image.tmdb.org/t/p/original" + movie.backdrop_path
      : "img/no-poster.png",
    ageRating: movie.adult ? "18+" : "PG-13",
    time: formatRuntime(movie.runtime),
    description: movie.overview || "No overview available.",
    tags: movie.genres || [],
  };

  // Images
  const imgs = await getMovieImages(id);
  images.value =
    imgs?.backdrops?.map(
      (b) => "https://image.tmdb.org/t/p/original" + b.file_path
    ) || [];

  currentImage.value = images.value[0] || "img/no-poster.png";

  // Credits
  const credit = await getMovieCredits(id);

  actors.value =
    credit?.cast?.map((c) => ({
      id: c.id,
      name: c.name,
      character: c.character,
      profile: c.profile_path
        ? "https://image.tmdb.org/t/p/w500" + c.profile_path
        : "img/no-profile.png",
    })) || [];

  crew.value =
    credit?.crew?.map((c) => ({
      id: c.id,
      name: c.name,
      job: c.job || c.department || "-",
      profile: c.profile_path
        ? "https://image.tmdb.org/t/p/w500" + c.profile_path
        : "img/no-profile.png",
    })) || [];
  director.value = credit?.crew?.find((c) => c.job === "Director") || null;

  if (director.value && !director.value.profile_path) {
    director.value.profile_path = "img/no-profile.png";
  }
}

// WATCH selectedId
watch(
  () => props.selectedId,
  (id) => {
    if (id) loadData(Number(id));
  },
  { immediate: true }
);
// AUTO SWITCH IMAGE
let interval: any = null;
const carouselItems = computed(() => {
  const items: string[] = [];

  if (trailer.value) items.push("TRAILER");
  items.push(...filteredImages.value);

  return items;
});
function startAutoSwitch() {
  clearInterval(interval);
  if (isTrailerActive.value) return;
  if (carouselItems.value.length <= 1) return;

  interval = setInterval(() => {
    if (isTrailerActive.value) {
      clearInterval(interval);
      return;
    }

    currentIndex.value = (currentIndex.value + 1) % carouselItems.value.length;

    const current = carouselItems.value[currentIndex.value];

    if (current === "TRAILER") {
      if (trailerPlayedOnce.value) return;

      isTrailerActive.value = true;
      clearInterval(interval);
      return;
    } else {
      isTrailerActive.value = false;
      currentImage.value = current;
    }
    applySlide();
  }, 8000);
}

watch(images, () => {
  startAutoSwitch();
});
watch(isTrailerActive, (active) => {
  if (active) {
    clearInterval(interval);
  }
});

onUnmounted(() => clearInterval(interval));

function scrollToCurrentThumb() {
  nextTick(() => {
    const box = thumbContainer.value;
    if (!box) return;

    let el: HTMLElement | null = null;

    // trailer
    if (trailerThumb.value && currentIndex.value === 0) {
      el = trailerThumbRef.value;
    }
    // images
    else {
      const imgIndex = trailerThumb.value
        ? currentIndex.value - 1
        : currentIndex.value;

      const img = filteredImages.value[imgIndex];
      el = thumbRefs[img];
    }

    if (!el) return;

    box.scrollTo({
      left: el.offsetLeft - 2,
      behavior: "smooth",
    });
  });
}
async function loadTrailer(id: number) {
  const videos = await getMovieVideos(id);

  const officialTrailer = videos?.results?.find(
    (v) => v.site === "YouTube" && v.type === "Trailer" && v.official
  );

  // fallback ถ้าไม่มี official
  const fallback = videos?.results?.find(
    (v) => v.site === "YouTube" && v.type === "Trailer"
  );

  const video = officialTrailer || fallback;

  if (video) {
    trailer.value = `https://www.youtube.com/embed/${video.key}?autoplay=1&mute=1`;
    trailerThumb.value = `https://img.youtube.com/vi/${video.key}/hqdefault.jpg`;
    isTrailerActive.value = false;
    trailerPlayedOnce.value = false;
  } else {
    trailer.value = null;
    trailerThumb.value = null;
    isTrailerActive.value = false;
  }
}
watch(isTrailerActive, (active) => {
  if (!active && !trailerPlayedOnce.value) {
    startAutoSwitch();
  }
});

watch(
  () => props.selectedId,
  () => {
    isTrailerActive.value = false;
  }
);

watch(currentIndex, () => {
  scrollToCurrentThumb();
});

function stopAuto() {
  userInteracted.value = true;
  clearInterval(interval);
}

let resumeTimeout: any = null;

function stopAutoTemporarily() {
  stopAuto();
  clearTimeout(resumeTimeout);

  resumeTimeout = setTimeout(() => {
    userInteracted.value = false;
    startAutoSwitch();
  }, 15000);
}

const applySlide = () => {
  // Trailer
  if (trailerThumb.value && currentIndex.value === 0) {
    isTrailerActive.value = true;
    scrollToCurrentThumb();
    return;
  }

  // Images
  isTrailerActive.value = false;

  const imgIndex = trailerThumb ? currentIndex.value - 1 : currentIndex.value;

  currentImage.value = filteredImages.value[imgIndex];
  scrollToCurrentThumb();
};

const totalItems = computed(() => {
  return (trailerThumb ? 1 : 0) + filteredImages.value.length;
});

const nextSlide = () => {
  currentIndex.value = (currentIndex.value + 1) % totalItems.value;
  applySlide();
  trailerPlayedOnce.value = false;
};

const prevSlide = () => {
  currentIndex.value =
    (currentIndex.value - 1 + totalItems.value) % totalItems.value;
  applySlide();
  stopAutoTemporarily();
};
</script>

<style scoped>
.popup-fade-enter-from {
  opacity: 0;
}
.popup-fade-enter-to {
  opacity: 1;
}
.popup-fade-leave-from {
  opacity: 1;
}
.popup-fade-leave-to {
  opacity: 0;
}
img {
  transition: opacity 0.3s ease;
}
</style>
