<template>
  <div
    class="rounded-2xl w-[65%] h-[80%] overflow-hidden grid grid-cols-4
           bg-[#0B0A0A] animate-pulse"
  >
    <!-- Sidebar -->
    <div
      class="col-span-1 bg-black p-4 flex flex-col items-center gap-4"
    >
      <!-- Poster -->
      <div class="w-64 aspect-[2/3] rounded-xl bg-gray-800"></div>

      <!-- Titles -->
      <div class="w-full flex flex-col gap-2 mt-2">
        <div class="h-6 w-3/4 bg-gray-700 rounded"></div>
        <div class="h-4 w-1/2 bg-gray-800 rounded mx-auto"></div>
      </div>

      <!-- Meta -->
      <div class="flex gap-2 mt-3">
        <div class="h-6 w-10 bg-gray-700 rounded"></div>
        <div class="h-6 w-14 bg-gray-700 rounded"></div>
      </div>

      <!-- Tags -->
      <div class="flex flex-wrap gap-2 mt-4 justify-center">
        <div v-for="i in 5" :key="i" class="h-6 w-14 bg-gray-800 rounded"></div>
      </div>

      <!-- Info list -->
      <div class="w-full mt-4 space-y-3">
        <div v-for="i in 4" :key="i" class="h-4 w-full bg-gray-800 rounded"></div>
      </div>

      <!-- Director card -->
      <div class="w-40 aspect-[2/3] bg-gray-200 rounded-2xl mt-4"></div>
    </div>

    <!-- Main -->
    <div class="col-span-3 p-4 flex flex-col gap-4">
      <!-- Video / Image -->
      <div class="w-full aspect-video bg-gray-800 rounded-xl"></div>

      <!-- Thumbnails -->
      <div class="flex gap-2 mt-2">
        <div
          v-for="i in 6"
          :key="i"
          class="h-20 w-32 bg-gray-700 rounded"
        ></div>
      </div>

      <!-- Rating -->
      <div class="flex gap-3 mt-4 items-center">
        <div class="h-6 w-16 bg-gray-700 rounded"></div>
        <div class="h-4 w-20 bg-gray-800 rounded"></div>
      </div>

      <!-- Overview -->
      <div class="space-y-3 mt-4">
        <div class="h-5 w-32 bg-gray-700 rounded"></div>
        <div v-for="i in 4" :key="i" class="h-4 w-full bg-gray-800 rounded"></div>
      </div>

      <!-- Cast -->
      <div class="mt-4">
        <div class="h-5 w-24 bg-gray-700 rounded mb-3"></div>
        <div class="flex gap-3">
          <div
            v-for="i in 6"
            :key="i"
            class="w-24 h-40 bg-gray-800 rounded-xl"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>
