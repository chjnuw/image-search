<template>
  <div
    class="hover:scale-105 relative transition-transform duration-300 cursor-pointer overflow-hidden group hidden md:block"
    v-bind="$attrs"
    @mouseenter="onEnter"
    @mouseleave="onLeave"
    @mousemove="onMove"
  >
    <img
      :src="posterSrc"
      @error="onError"
      loading="lazy"
      class="aspect-[2/3] object-cover w-full h-full rounded"
      @click="emit('open', props.movie.id)"
    />

    <!-- ปุ่ม favorite -->
    <span
      class="text-md absolute top-1 right-1 z-10 drop-shadow-xl/50 p-1 opacity-0 scale-90 transition-all duration-300 group-hover:opacity-100 group-hover:scale-100"
    >
      <FontAwesomeIcon
        icon="fa-solid fa-heart"
        :class="[
          'transition-colors',
          isFavorite ? 'text-pink-500' : 'text-white hover:text-pink-500',
        ]"
        @click.stop="toggleFavorite"
      />
    </span>
  </div>

  <!-- hover popup -->
  <MovieHover
    :show="isHover"
    :movie="movie"
    :style="popupStyle"
    :loading="isLoadingDetail"
    :title="displayTitle"
    :year="movie.release_date?.slice(0, 4)"
    :ageLabel="normalizeAgeRating(ageRating).label"
    :ageClass="normalizeAgeRating(ageRating).class"
    :genreMap="genreMap"
  />
</template>

<script setup lang="ts">
import type { Movie } from "../Type/tmdb";
import { ref, computed, onMounted } from "vue";
import { useTMDB } from "../composables/useTMDB";
import { normalizeAgeRating } from "../utils/ageRating";

const props = defineProps<{ movie: Movie }>();

const emit = defineEmits<{
  (e: "open", id: number): void;
  (e: "toggle-favorite", id: number): void;
  (e: "removed", id: number): void;
}>();

/* ---------------- poster ---------------- */
const fallback = "img/no-poster.png";

const posterSrc = computed(() =>
  props.movie.poster_path
    ? "https://image.tmdb.org/t/p/w500" + props.movie.poster_path
    : fallback,
);

function onError(e: Event) {
  (e.target as HTMLImageElement).src = fallback;
}

/* ---------------- favorite (จัดการเอง) ---------------- */
const isFavorite = ref(false);

const loadFavoriteState = async () => {
  try {
    const favs = await $fetch<{ movie_id: number }[]>("/api/favorite", {
      credentials: "include",
    });
    isFavorite.value = favs.some((f) => f.movie_id === props.movie.id);
  } catch {
    isFavorite.value = false;
  }
};

const toggleFavorite = async () => {
  try {
    if (isFavorite.value) {
      await $fetch("/api/favorite", {
        method: "DELETE",
        body: { movieId: props.movie.id },
        credentials: "include",
      });

      alert("ลบออกจากรายการโปรดแล้ว 💔");
      emit("removed", props.movie.id);
    } else {
      await $fetch("/api/favorite", {
        method: "POST",
        body: { movieId: props.movie.id },
        credentials: "include",
      });

      alert("เพิ่มเข้ารายการโปรดแล้ว ❤️");
    }
  } catch (err) {
    console.error(err);
    alert("กรุณาเข้าสู่ระบบ");
  }
};

/* ---------------- hover detail ---------------- */
const { getMovieAgeRating, getMovieDetailsEN } = useTMDB();

const ageRating = ref<string | null>(null);
const enTitle = ref<string | null>(null);

const isHover = ref(false);
const isLoadingDetail = ref(false);

let hoverTimer: number | null = null;
let ageFetched = false;
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
          const en = await getMovieDetailsEN(props.movie.id);
          enTitle.value = en?.title || props.movie.original_title || null;
          enFetched = true;
        }
      } catch {
        ageRating.value = "NR";
        enTitle.value = props.movie.original_title || null;
      } finally {
        isLoadingDetail.value = false;
      }
    }
  }, 1200);
};

const onLeave = () => {
  if (hoverTimer) clearTimeout(hoverTimer);
  isHover.value = false;
  isLoadingDetail.value = false;
};

/* ---------------- mouse ---------------- */
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

/* ---------------- title ---------------- */
const displayTitle = computed(() => {
  const main = enTitle.value;
  const th = props.movie.title;
  return {
    main,
    sub: th && main && th !== main ? th : null,
  };
});

onMounted(loadFavoriteState);
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition:
    opacity 0.15s ease,
    transform 0.15s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
</style>
