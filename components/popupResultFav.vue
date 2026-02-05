<template>
  <div class="fixed inset-0 z-50 bg-black/80 flex items-center justify-center px-4">
    <!-- กล่องหลัก -->
    <div class="relative w-full max-w-[380px] text-white">

      <!-- Poster -->
      <div class="flex justify-center">
        <img
          :src="posterSrc"
          class="
            aspect-[2/3] object-cover rounded-3xl shadow-xl
            w-[240px]
            sm:w-[260px]
            md:w-[300px]
          "
        />
      </div>

      <!-- Info -->
      <div class="text-center mt-4 px-2">
        <h2 class="text-base sm:text-lg font-bold leading-snug line-clamp-2">
          {{ movie.title }}
        </h2>

        <p class="text-xs sm:text-sm text-gray-400 mt-1">
          {{ releaseYear }} &nbsp; | &nbsp;
          ⭐ {{ movie.vote_average?.toFixed(1) }}
        </p>

        <!-- Genres -->
        <div
          class="flex justify-center gap-2 mt-2 text-[10px] sm:text-xs text-gray-300 flex-wrap"
        >
          <span
            v-for="gid in movie.genre_ids || []"
            :key="gid"
            class="opacity-80"
          >
            #{{ genreMap[gid] }}
          </span>
        </div>

        <!-- Rating -->
        <div class="flex justify-center gap-1 mt-3">
          <span
            v-for="i in 5"
            :key="i"
            :class="i <= starCount ? 'text-green-400' : 'text-gray-600'"
          >
            ★
          </span>
          <span class="text-[10px] sm:text-xs text-gray-400 ml-2">
            ({{ movie.vote_count ?? 0 }})
          </span>
        </div>
      </div>

      <!-- Buttons -->
      <div class="flex gap-3 mt-6 px-2">
        <!-- RANDOM AGAIN -->
        <button
          @click="onRetry"
          class="
            flex-1 py-2.5 sm:py-3
            rounded-full bg-white text-red-600 font-bold
            hover:bg-[#c9c9c9] cursor-pointer
            text-sm sm:text-base
          "
        >
          สุ่มใหม่
        </button>

        <!-- VIEW DETAIL -->
        <button
          @click="onView"
          class="
            flex-1 py-2.5 sm:py-3
            rounded-full bg-[#90CB38] hover:bg-[#72a02c]
            text-white font-bold cursor-pointer
            text-sm sm:text-base
          "
        >
          ดูรายละเอียด
        </button>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue"
import type { Movie } from "@/Type/tmdb"
import { genreMap } from "../composables/genreMap"

const emit = defineEmits<{
  (e: "retry"): void
  (e: "view", id: number): void
}>()

const props = defineProps<{
  movie: Movie
}>()

const posterSrc = computed(() =>
  props.movie.poster_path
    ? "https://image.tmdb.org/t/p/w500" + props.movie.poster_path
    : "/img/no-poster.png"
)

const releaseYear = computed(() =>
  props.movie.release_date
    ? props.movie.release_date.slice(0, 4)
    : "N/A"
)

const starCount = computed(() =>
  Math.round((props.movie.vote_average || 0) / 2)
)

const onRetry = () => {
  emit("retry")
}

const onView = () => {
  emit("view", props.movie.id)
}
</script>

