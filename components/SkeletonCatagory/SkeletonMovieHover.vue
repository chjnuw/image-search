<template>
  <div class="space-y-2">
    <SkeletonCatagoryShimmer height="h-5 w-3/4" />
    <SkeletonCatagoryShimmer height="h-4 w-1/2" />

    <div class="flex gap-2 mt-1">
      <SkeletonCatagoryShimmer height="h-4 w-10" />
      <SkeletonCatagoryShimmer height="h-4 w-8" />
      <SkeletonCatagoryShimmer height="h-4 w-14" />
    </div>

    <div class="flex flex-wrap gap-1 mt-2">
      <SkeletonCatagoryShimmer v-for="i in 3" :key="i" height="h-5 w-14" />
    </div>

    <div class="space-y-1 mt-2">
      <SkeletonCatagoryShimmer height="h-3 w-full" />
      <SkeletonCatagoryShimmer height="h-3 w-5/6" />
      <SkeletonCatagoryShimmer height="h-3 w-2/3" />
    </div>
  </div>
</template>
<script setup lang="ts"></script>
