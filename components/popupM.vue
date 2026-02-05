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
      <transition name="popup-swap" mode="out-in">
        <SkeletonpopSkeletonpopupM v-if="isLoading" />
        <div
          v-else
          ref="popupScroll"
          class="rounded-2xl w-[65%] h-[80%] overflow-y-auto overflow-x-hidden grid grid-cols-4 custom-scrollbar"
        >
          <!-- =========================================================================================================== -->
          <!-- sidebar -->
          <!-- ==========================================================================================================  -->
          <div
            class="col-span-1 bg-[#000000] p-4 text-white flex flex-col items-center"
          >
            <img
              :src="selectedItem.poster"
              loading="lazy"
              class="rounded-xl aspect-[2/3] w-64 border-2 object-cover"
            />
            <div class="text-center mt-4 mb-2">
              <p class="w-full text-2xl font-bold text-center">
                {{ selectedItem.titleEN }}
              </p>
              <p
                v-if="selectedItem.titleEN !== selectedItem.title"
                class="text-sm text-gray-400 mt-2"
              >
                {{ selectedItem.title }}
              </p>
            </div>
            <div class="p-2 items-center justify-center mb-3">
              <div class="flex items-center justify-center gap-2 text-sm">
                <span
                  v-if="selectedItem?.ageRating"
                  class="px-2 py-1 border rounded-md font-bold backdrop-blur-md text-xs"
                  :class="normalizeAgeRating(selectedItem.ageRating).class"
                >
                  {{ normalizeAgeRating(selectedItem.ageRating).label }}
                </span>
                <span>·</span>
                <p class="">{{ selectedItem.time }}</p>
              </div>
              <div class="flex items-center justify-center gap-2 my-3 text-sm">
                <p class="">{{ selectedItem.release }}</p>
              </div>

              <div class="flex flex-wrap gap-1 my-4 p-2">
                <button
                  v-for="tag in selectedItem.tags"
                  :key="tag.id"
                  class="p-2 bg-gray-700 rounded-md hover:bg-gray-800 transition cursor-pointer text-xs"
                >
                  # {{ tag.name }}
                </button>
              </div>

              <div class="grid grid-cols gap-1 text-md mt-4 mb-2">
                <div>
                  <p class="text-gray-400">ชื่อดั้งเดิม</p>
                  <p class="p-2">{{ selectedItem.originalTitle }}</p>
                </div>

                <div>
                  <p class="text-gray-400">สถานะ</p>
                  <p class="p-2">{{ selectedItem.status }}</p>
                </div>

                <div>
                  <p class="text-gray-400">ภาษาดั้งเดิม</p>
                  <p class="p-2">
                    {{ selectedItem.originalLanguage.toUpperCase() }}
                  </p>
                </div>

                <div>
                  <p class="text-gray-400">ต้นทุน</p>
                  <p class="p-2">
                    {{
                      selectedItem.budget && selectedItem.budget > 0
                        ? `$ ${selectedItem.budget.toLocaleString()}`
                        : "-"
                    }}
                  </p>
                </div>

                <div>
                  <p class="text-gray-400">รายรับ</p>
                  <p class="p-2">
                    {{
                      selectedItem.revenue && selectedItem.revenue > 0
                        ? `$ ${selectedItem.revenue.toLocaleString()}`
                        : "-"
                    }}
                  </p>
                </div>
              </div>

              <div class="mb-3">
                <p class="text-gray-400 text-md">คำค้นหา</p>
                <div
                  v-if="selectedItem.keywords?.length"
                  class="flex flex-wrap gap-1 p-2"
                >
                  <button
                    v-for="k in selectedItem.keywords"
                    :key="k.id"
                    class="p-2 bg-gray-700 rounded-md text-xs hover:bg-gray-800 transition cursor-pointer"
                  >
                    # {{ k.name }}
                  </button>
                </div>
                <p v-else class="text-white/50 italic text-sm p-2">
                  ยังไม่มีคำค้นหาถูกเพิ่ม
                </p>
              </div>
            </div>
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

          <!-- =========================================================================================================== -->
          <!-- main -->
          <!-- ==========================================================================================================  -->
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
              <div
                class="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-black/100 to-transparent pointer-events-none"
              ></div>
              <div
                class="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.6)_100%)] pointer-events-none"
              ></div>
              <button
                class="fixed top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full cursor-pointer text-white/70 hover:text-white transition duration-200"
                @click="$emit('close')"
              >
                <FontAwesomeIcon icon="fa-solid fa-xmark" />
              </button>
            </div>

            <div class="relative group/thumb mb-4 w-full">
              <div
                ref="thumbContainer"
                class="w-full overflow-x-auto custom-scrollbar p-3 flex gap-2"
                style="overflow-anchor: none"
              >
                <div
                  v-if="hasTrailer"
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
                  <p
                    v-if="!hasTrailer"
                    class="absolute bottom-2 right-2 text-xs text-white/60 bg-black/40 px-2 py-1 rounded"
                  >
                    ไม่มีตัวอย่างหนัง
                  </p>
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
                  <img
                    :src="img"
                    class="h-full object-contain"
                    loading="lazy"
                  />
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

            <div class="w-[95%] mb-6">
              <div class="flex mb-6 justify-between">
                <div class="flex gap-2 opacity-80 justify-center items-center">
                  <p class="text-2xl">
                    ⭐ {{ selectedItem.vote_average.toFixed(1) ?? "N/A" }}
                  </p>
                  <p class="text-gray-400 text-sm">
                    ({{ selectedItem.vote_count ?? 0 }} รีวิว)
                  </p>
                  <!-- btn fav -->

                  <FontAwesomeIcon
                    icon="fa-solid fa-heart"
                    :class="[
                      'text-2xl cursor-pointer p-2 transition-colors',
                      isFavorite
                        ? 'text-pink-500'
                        : 'text-white hover:text-pink-500',
                    ]"
                    @click="handleToggleFavorite"
                  />
                </div>
                <div
                  v-if="providers.length"
                  class="flex gap-3 items-center flex-wrap"
                >
                  <a
                    :href="providerDirectLink"
                    target="_blank"
                    class="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-full text-white transition flex items-center gap-2"
                  >
                    รับชมได้ที่
                    <img
                      v-if="providers[0].logo_path"
                      :src="`https://image.tmdb.org/t/p/w45${providers[0].logo_path}`"
                      class="w-5 h-5 rounded"
                    />{{ providers[0].provider_name }}
                  </a>
                </div>

                <div v-else class="text-white/40 text-sm">
                  ยังไม่มีข้อมูลแพลตฟอร์มรับชม
                </div>
              </div>

              <p class="my-2 text-2xl font-bold">เรื่องย่อ</p>
              <p class="p-2 indent-8">
                {{ selectedItem.description }}
              </p>

              <div class="justify-between flex items-center mt-4 mb-2 p-2">
                <h2 class="font-bold text-2xl">นักแสดง</h2>
                <NuxtLink
                  :to="`/movie/${selectedItem.id}/FullCastAndCrew`"
                  class="text-[#A0E13E] hover:underline"
                >
                  ดูนักแสดงและทีมงานทั้งหมด →
                </NuxtLink>
              </div>

              <div
                v-if="actors.length"
                class="flex gap-3 overflow-x-auto custom-scrollbar p-4"
              >
                <ImgNameAct
                  v-for="a in filteredActors"
                  :key="a.id"
                  :img="a.profile"
                  :name="a.name"
                  :character="a.character"
                  loading="lazy"
                  class="border"
                   @click="openActorPopup(a.id)"
                />
              </div>
              <p v-else class="text-white/50 italic text-sm p-2">
                ไม่มีข้อมูลนักแสดง
              </p>

              <h2 class="font-bold text-2xl mt-4 mb-2 p-2">ทีมงาน</h2>
              <div
                v-if="crew.length"
                class="flex gap-3 overflow-x-auto custom-scrollbar p-4"
              >
                <ImgNameCrew
                  v-for="c in filteredCrew"
                  :key="c.id"
                  :img="c.profile"
                  :name="c.name"
                  :job="c.job"
                  loading="lazy"
                  class="border"
                   @click="openActorPopup(c.id)"
                />
              </div>
              <p v-else class="text-white/50 italic text-sm p-2">
                ไม่มีข้อมูลทีมงาน
              </p>

              <div v-if="similarMovies.length" class="w-full mt-6">
                <h2 class="text-2xl font-bold mt-4 mb-2">หนังที่คล้ายกัน</h2>
                <div
                  class="flex gap-2 overflow-x-auto overflow-y-hidden custom-scrollbar py-4 mx-4 px-2"
                >
                  <CardM
                    v-for="m in similarMovies"
                    :key="m.id"
                    :movie="m"
                    loading="lazy"
                    class="w-28 flex-shrink-0"
                    @click="loadData(m.id)"
                  />
                </div>
              </div>
              <div v-if="recommendedMovies.length" class="w-full mt-6">
                <h2 class="text-2xl font-bold mt-4 mb-2 text-green-400">
                  แนะนำสำหรับคุณ
                </h2>

                <div class="flex gap-2 overflow-hidden">
                  <Recomment
                    size="xs"
                    loading="lazy"
                    class="flex overflow-x-auto custom-scrollbar"
                    @click="loadData(id)"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </transition>
  <PopupA
    v-if="showActorPopup && selectedActorId"
    :actor-id="selectedActorId"
    @close="closeActorPopup"
  />
</template>

<script setup lang="ts">
import {
  ref,
  watch,
  computed,
  onUnmounted,
  onMounted,
  reactive,
  nextTick,
} from "vue";
import { useTMDB } from "../composables/useTMDB";
import type { Movie, CreditsResponse, MovieImagesResponse } from "../Type/tmdb";
import { useGlobalLoading } from "../composables/useGlobalLoading";
import { normalizeAgeRating } from "../utils/ageRating";

const {
  getMovieDetails,
  getMovieDetailsEN,
  getMovieCreditsTH,
  getMovieImages,
  getMovieVideos,
  getSimilarMovies,
  getRecommendedMovies,
  discoverMoviesByGenres,
  getMovieKeywords,
  getMovieCreditsEN,
  getMovieReleaseDates,
  getMovieAgeRating,
  getMovieProviders,
} = useTMDB();

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
const similarMovies = ref<Movie[]>([]);
const recommendedMovies = ref<Movie[]>([]);
const currentMovieId = ref<number | null>(null);
const isChanging = ref(false);
const popupScroll = ref<HTMLElement | null>(null);
const { start, stop } = useGlobalLoading();
const isFavorite = ref(false);
const watchProviders = ref<any>(null);

const handleToggleFavorite = async () => {
  if (!selectedItem.value) return;

  try {
    if (isFavorite.value) {
      await $fetch("/api/favorite", {
        method: "DELETE",
        body: { movieId: selectedItem.value.id },
        credentials: "include",
      });

      isFavorite.value = false;
      alert("ลบออกจากรายการโปรดแล้ว 💔");
    } else {
      await $fetch("/api/favorite", {
        method: "POST",
        body: { movieId: selectedItem.value.id },
        credentials: "include",
      });

      isFavorite.value = true;
      alert("เพิ่มเข้ารายการโปรดแล้ว ❤️");
    }
  } catch (err) {
    console.error(err);
    alert("กรุณาเข้าสู่ระบบ");
  }
};
// alias ป้องกัน Vue warn
const onToggleFavorite = handleToggleFavorite;

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

const checkFavorite = async (movieId: number) => {
  try {
    const favs = await $fetch<{ movie_id: number }[]>("/api/favorite", {
      credentials: "include",
    });
    isFavorite.value = favs.some((f) => f.movie_id === movieId);
  } catch {
    isFavorite.value = false;
  }
};

async function checkIsFavorite(id: number) {
  try {
    const res = await $fetch("/api/favorite/check", {
      method: "POST",
      body: { movieId: id },
      credentials: "include",
    });
    return res?.isFavorite === true;
  } catch {
    return false;
  }
}

function formatRuntime(mins: number) {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${h}h ${m}m`;
}
async function loadData(id: number) {
  if (currentMovieId.value === id) return;
  start();

  // รอ fade-out นิดนึง
  await new Promise((r) => setTimeout(r, 200));

  // 🔥 โหลดทุกอย่าง
  await loadTrailer(id);
  const [_, movieTH, movieEN, keywords, ageRating] = await Promise.all([
    loadTrailer(id),
    getMovieDetails(id),
    getMovieDetailsEN(id),
    getMovieKeywords(id),
    getMovieAgeRating(id),
  ]);
  if (!movieTH) return;

  selectedItem.value = {
    id: movieTH.id,
    poster: movieTH.poster_path
      ? "https://image.tmdb.org/t/p/w500" + movieTH.poster_path
      : "img/no-poster.png",
    backdrop: movieTH.backdrop_path
      ? "https://image.tmdb.org/t/p/w780" + movieTH.backdrop_path
      : "img/no-poster.png",
    ageRating,
    vote_average: movieTH.vote_average,
    vote_count: movieTH.vote_count,
    time: formatRuntime(movieTH.runtime),
    release: movieTH.release_date,
    title: movieTH.title,
    titleEN: movieEN.title,
    description: movieTH.overview || "No overview available.",
    tags: movieEN?.genres || [],
    originalTitle: movieTH.original_title,
    status: movieTH.status,
    originalLanguage: movieTH.original_language || "Unknown",
    budget: movieTH.budget,
    revenue: movieTH.revenue,
    keywords: keywords?.keywords ?? [],
  };
  await checkFavorite(id);

  // images / credits / recommend
  const [imgs, creditTH, creditEN, similar, recommend, providersRes] =
    await Promise.all([
      getMovieImages(id),
      getMovieCreditsTH(id),
      getMovieCreditsEN(id),
      getSimilarMovies(id),
      getRecommendedMovies(id),
      getMovieProviders(id),
    ]);

  watchProviders.value = providersRes;

  images.value =
    imgs?.backdrops?.map(
      (b) => "https://image.tmdb.org/t/p/w780" + b.file_path,
    ) || [];

  currentImage.value = images.value[0] || "img/no-poster.png";

  actors.value =
    creditEN?.cast?.map((c) => ({
      id: c.id,
      name: c.name,
      character: c.character,
      profile: c.profile_path
        ? "https://image.tmdb.org/t/p/w500" + c.profile_path
        : "img/no-profile.png",
    })) || [];

  crew.value =
    creditEN?.crew?.map((c) => ({
      id: c.id,
      name: c.name,
      job: c.job || c.department || "-",
      profile: c.profile_path
        ? "https://image.tmdb.org/t/p/w500" + c.profile_path
        : "img/no-profile.png",
    })) || [];

  director.value = creditEN?.crew?.find((c) => c.job === "Director") || null;

  similarMovies.value = similar?.results?.slice(0, 10) || [];
  recommendedMovies.value = recommend?.results?.slice(0, 10) || [];

  // 🔝 ค่อย scroll ขึ้นบน ตอนข้อมูลพร้อมแล้ว
  nextTick(() => {
    requestAnimationFrame(() => {
      popupScroll.value?.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  });

  currentMovieId.value = id;
  isChanging.value = false;
  stop();
}
const hasTrailer = computed(() => {
  return !!trailer.value;
});

// WATCH selectedId
watch(
  () => props.selectedId,
  (id) => {
    if (id) loadData(Number(id));
  },
  { immediate: true },
);
// AUTO SWITCH IMAGE
let interval: any = null;
const carouselItems = computed(() => {
  return hasTrailer.value
    ? ["TRAILER", ...filteredImages.value]
    : [...filteredImages.value];
});

function startAutoSwitch() {
  clearInterval(interval);
  if (carouselItems.value.length <= 1) return;

  interval = setInterval(() => {
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

    // 🎬 trailer
    if (hasTrailer.value && currentIndex.value === 0) {
      el = trailerThumbRef.value;
    }
    // 🖼 images
    else {
      const imgIndex = hasTrailer.value
        ? currentIndex.value - 1
        : currentIndex.value;

      const img = filteredImages.value[imgIndex];
      if (!img) return;

      el = thumbRefs[img] as HTMLElement | null;
    }

    if (!el) return;

    box.scrollTo({
      left: el.offsetLeft - 2,
      behavior: "smooth",
    });
  });
}
async function loadTrailer(id: number) {
  try {
    let videos = await getMovieVideos(id);

    if (!videos?.results?.length) {
      console.warn("No videos in th-TH, fallback to en-US");
      videos = await getMovieVideos(id);
    }

    const officialTrailer = videos?.results?.find(
      (v) => v.site === "YouTube" && v.type === "Trailer" && v.official,
    );

    const fallback = videos?.results?.find(
      (v) => v.site === "YouTube" && v.type === "Trailer",
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
      currentIndex.value = 0;
    }
  } catch (err) {
    console.error("Failed to fetch trailer:", err);
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
  },
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
  if (hasTrailer.value && currentIndex.value === 0) {
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
  return (hasTrailer.value ? 1 : 0) + filteredImages.value.length;
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

const providers = computed(() => {
  const th = watchProviders.value?.results?.TH;
  if (!th) return [];

  return th.flatrate || th.rent || th.buy || [];
});

const providerDirectLink = computed(() => {
  if (!providers.value.length || !selectedItem.value) return "#";

  const p = providers.value[0];

  return (
    getProviderDeepLink(p.provider_name, selectedItem.value.titleEN) || "#"
  );
});

function getProviderDeepLink(providerName: string, movieTitle: string) {
  const q = encodeURIComponent(movieTitle);

  switch (providerName.toLowerCase()) {
    case "netflix":
      return `https://www.netflix.com/search?q=${q}`;
    case "prime video":
      return `https://www.primevideo.com/search/ref=atv_nb_sr?phrase=${q}`;
    case "disney+":
      return `https://www.disneyplus.com/search/${q}`;
    case "hbo max":
      return `https://www.hbomax.com/search?q=${q}`;
    case "apple tv+":
      return `https://tv.apple.com/th/search?term=${q}`;
    case "mubi":
      return `https://mubi.com/search?query=${q}`;
    case "curiosity stream":
      return `https://curiositystream.com/search?q=${q}`;
    case "zee5":
      return `https://www.zee5.com/global/search?q=${q}`;
    default:
      return null;
  }
}

const selectedActorId = ref<number | null>(null);
const showActorPopup = ref(false);

const openActorPopup = (id: number) => {
  selectedActorId.value = id;
  showActorPopup.value = true;
};

const closeActorPopup = () => {
  showActorPopup.value = false;
  selectedActorId.value = null;
};

import {
  lockBodyScroll,
  unlockBodyScroll,
} from "../composables/useBodyScrollLock";

onMounted(() => {
  lockBodyScroll();
});

onUnmounted(() => {
  unlockBodyScroll();
});
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

.popup-swap-enter-active,
.popup-swap-leave-active {
  transition: all 0.35s ease;
}

.popup-swap-enter-from {
  opacity: 0;
  transform: translateX(16px);
}

.popup-swap-leave-to {
  opacity: 0;
  transform: translateX(-16px);
}
</style>
