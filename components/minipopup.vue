<template>
  <transition name="fade">
    <div
      v-if="isHover"
      class="absolute inset-x-0 bottom-0 bg-black/80 backdrop-blur p-3 text-sm text-white rounded-b-xl z-10"
    >
      <p class="font-bold line-clamp-1">
        {{ movie.title }}
      </p>

      <div class="flex items-center gap-2 text-xs opacity-80">
        <span>⭐ {{ movie.vote_average?.toFixed(1) }}</span>
        <span>•</span>
        <span>{{ movie.release_date?.slice(0, 4) }}</span>
      </div>
    </div>
  </transition>
</template>

<script>

</script>

<style>

</style>
