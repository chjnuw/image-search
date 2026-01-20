<template>
  <div
    class="hover:scale-105 relative transition-transform duration-300 cursor-pointer overflow-hidden group hidden md:block"
    v-bind="$attrs"
    @mouseenter="onEnter"
    @mouseleave="onLeave"
    @mousemove="onMove"
  >
    <img
      :src="
        props.movie.poster_path
          ? 'https://image.tmdb.org/t/p/w500' + props.movie.poster_path
          : fallback
      "
      @error="onError"
      class="aspect-[2/3] object-cover w-full h-full rounded"
      @click="emit('open', props.movie.id)"
    />
    <span
      class="text-md absolute top-1 right-1 z-10 drop-shadow-xl/50 p-1 opacity-0 scale-90 transition-all duration-300 group-hover:opacity-100 group-hover:scale-100"
      @click.stop
    >
      <FontAwesomeIcon
        icon="fa-solid fa-heart"
        class="hover:text-pink-500"
        @click="Favorite"
    /></span>
  </div>

  <transition name="fade">
    <div
      v-if="isHover"
      class="fixed z-50 w-64 bg-black/90 text-white rounded-lg shadow-xl p-3 pointer-events-none"
      :style="popupStyle"
    >
      <SkeletonCatagorySkeletonMovieHover v-if="isLoadingDetail" />
      <template v-else>
        <p class="font-bold text-md line-clamp-2">
          {{ displayTitle.main }}
        </p>

        <p v-if="displayTitle.sub" class="text-sm text-gray-400">
          {{ displayTitle.sub }}
        </p>

        <div class="flex gap-2 text-xs mt-1 items-center opacity-80">
          <span
            v-if="ageRating"
            class="px-2 py-1 border rounded-md font-bold backdrop-blur-md"
            :class="normalizeAgeRating(ageRating).class"
          >
            {{ normalizeAgeRating(ageRating).label }}
          </span>

          <p>⭐ {{ props.movie.vote_average.toFixed(1) }}</p>

          <p class="text-xs text-gray-400">
            ({{ props.movie.vote_count ?? 0 }} รีวิว)
          </p>

          <span v-if="props.movie.release_date">
            {{ props.movie.release_date.slice(0, 4) }}
          </span>
        </div>

        <div class="flex flex-wrap gap-1 mt-2">
          <button
            v-for="gid in props.movie.genre_ids ?? []"
            :key="gid"
            class="px-2 py-1 bg-green-600/20 text-green-400 rounded-md transition text-xs"
          >
            # {{ genreMap[gid] }}
          </button>
        </div>

        <p class="text-xs mt-2 line-clamp-3 opacity-70">
          {{ props.movie.overview }}
        </p>
      </template>
    </div>
  </transition>
</template>

<script setup lang="ts">
import type { Movie } from "../Type/tmdb";
import { ref, computed, watch, onMounted } from "vue";
import { useTMDB } from "../composables/useTMDB";
import { normalizeAgeRating } from "../utils/ageRating";

const { getMovieAgeRating, getMovieDetailsEN } = useTMDB();
const ageRating = ref<string | null>(null);
let ageFetched = false;

const tags = ref<{ id: number; name: string }[]>([]);
let fetched = false;
const isHover = ref(false);
let hoverTimer: number | null = null;

const isLoadingDetail = ref(false);

const enTitle = ref<string | null>(null);
let enFetched = false;

const onEnter = () => {
  hoverTimer = window.setTimeout(async () => {
    isHover.value = true;

    if (!ageFetched || !enFetched) {
      isLoadingDetail.value = true;

      try {
        if (!ageFetched) {
          ageRating.value = await getMovieAgeRating(props.movie.id);
          ageFetched = true;
        }

        if (!enFetched) {
          const enDetail = await getMovieDetailsEN(props.movie.id);
          enTitle.value = enDetail?.title || props.movie.original_title || null;
          enFetched = true;
        }
      } catch (e) {
        enTitle.value = props.movie.original_title || null;
        ageRating.value = "NR";
      } finally {
        isLoadingDetail.value = false;
      }
    }
  }, 1200);
};

const onLeave = () => {
  if (hoverTimer) {
    clearTimeout(hoverTimer);
    hoverTimer = null;
  }
  isHover.value = false;
  isLoadingDetail.value = false;
};

const mouseX = ref(0);
const mouseY = ref(0);

const onMove = (e: MouseEvent) => {
  mouseX.value = e.clientX;
  mouseY.value = e.clientY;
};

const popupStyle = computed(() => {
  const width = 230;
  const padding = 16;

  const x =
    mouseX.value + width + padding > window.innerWidth
      ? mouseX.value - width - padding
      : mouseX.value + padding;

  return {
    top: mouseY.value + padding + "px",
    left: x + "px",
  };
});

const props = defineProps<{ movie: Movie }>();
const emit = defineEmits(["open"]);
function openPopup(id) {
  document.body.style.cursor = "wait";
  emit("open", id);
}

const fallback = "img/no-poster.png";

function onError(event) {
  event.target.src = fallback;
}
const Favorite = () => {
  alert("Added to Favorite!");
};

const displayTitle = computed(() => {
  const main = enTitle.value || null;

const thTitle = props.movie.title;

const sub =
    thTitle &&
    main &&
    thTitle !== main
      ? thTitle
      : null;

  return { main, sub };
});
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
</style>
