<template>
  <div
    class="flex-shrink-0 bg-white/5 rounded-2xl w-32 "
  >
    <!-- รูป -->
    <SkeletonCatagoryShimmer class="w-full aspect-[2/3] rounded-2xl bg-white/10"></SkeletonCatagoryShimmer>

    <!-- ข้อความ -->
    <div class="p-2 space-y-2">
      <SkeletonCatagoryShimmer class="h-4 w-3/4 bg-white/10 rounded"></SkeletonCatagoryShimmer>
      <SkeletonCatagoryShimmer class="h-3 w-1/2 bg-white/10 rounded"></SkeletonCatagoryShimmer>
    </div>
  </div>
</template>