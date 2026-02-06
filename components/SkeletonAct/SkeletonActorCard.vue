<template>
  <div class="bg-[#111] rounded-xl overflow-hidden">
    <!-- รูป -->
    <SkeletonCatagoryShimmer class="aspect-[2/3] bg-white/10"></SkeletonCatagoryShimmer>

    <!-- ข้อความ -->
    <div class="p-3 space-y-2">
      <SkeletonCatagoryShimmer class="h-4 w-3/4 bg-white/20 rounded "></SkeletonCatagoryShimmer>
      <SkeletonCatagoryShimmer class="h-3 w-1/2 bg-white/10 rounded "></SkeletonCatagoryShimmer>
    </div>
  </div>
</template>