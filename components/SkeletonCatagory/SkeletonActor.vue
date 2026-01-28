<template>
  <div
    class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 px-4 pt-6 w-full max-w-[1400px] mx-auto"
  >
    <!-- Actor card skeleton -->
    <SkeletonCatagoryShimmer
      v-for="n in 15"
      :key="n"
      class="bg-[#111] rounded-xl overflow-hidden animate-pulse"
    />
    <!-- Image -->
    <div class="aspect-[2/3] bg-white/10"></div>

    <!-- Text -->
    <div class="p-3 space-y-2">
      <SkeletonCatagoryShimmer class="h-4 bg-white/20 rounded w-3/4" />
      <SkeletonCatagoryShimmer class="h-3 bg-white/10 rounded w-1/2" />
    </div>
  </div>
  <!-- Load more skeleton -->
  <div class="w-full flex justify-center mt-10">
    <SkeletonCatagoryShimmer class="h-10 w-32 bg-white/10 rounded-full" />
  </div>
</template>
