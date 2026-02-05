<template>
  <transition name="fade">
    <div
      v-if="show"
      class="fixed z-50 w-64 bg-black/90 text-white rounded-lg shadow-xl p-3 pointer-events-none"
      :style="style"
    >
      <SkeletonCatagorySkeletonMovieHover v-if="loading" />

      <template v-else>
        <p class="font-bold text-md line-clamp-2">
          {{ title.main }}
        </p>
        <p v-if="title.sub" class="text-sm text-gray-400">({{ title.sub }})</p>

        <div class="flex gap-2 text-xs mt-1 items-center opacity-80">
          <span
            v-if="ageRating"
            class="px-2 py-1 border rounded-md font-bold backdrop-blur-md"
            :class="ageClass"
          >
            {{ ageLabel }}
          </span>

          <p>⭐ {{ movie.vote_average.toFixed(1) }}</p>
          <p class="text-xs text-gray-400">
            ({{ movie.vote_count ?? 0 }} รีวิว)
          </p>

          <span v-if="year">{{ year }}</span>
        </div>

        <div class="flex flex-wrap gap-1 mt-2">
          <span
            v-for="gid in movie.genre_ids ?? []"
            :key="gid"
            class="px-2 py-1 bg-green-600/20 text-green-400 rounded-md text-xs"
          >
            # {{ genreMap[gid] }}
          </span>
        </div>

        <p class="text-xs mt-2 line-clamp-3 opacity-70">
          {{ movie.overview }}
        </p>
      </template>
    </div>
  </transition>
</template>

<script setup lang="ts">
defineProps<{
  show: boolean;
  movie: any;
  style: Record<string, string>;
  loading?: boolean;
  title: { main: string; sub?: string };
  year?: string;
  ageLabel?: string;
  ageClass?: string;
  genreMap: Record<number, string>;
}>();
</script>
