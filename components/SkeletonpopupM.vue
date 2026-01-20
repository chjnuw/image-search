<template>
  <div
    class="rounded-2xl w-[65%] h-[80%] overflow-y-auto grid grid-cols-4 bg-[#0B0A0A]"
  >
    <!-- LEFT -->
    <div class="col-span-1 bg-black p-4 flex flex-col items-center gap-4">
      <!-- poster -->
      <div
        class="w-64 aspect-[2/3] rounded-xl bg-zinc-800 animate-pulse"
      ></div>

      <!-- title -->
      <div class="h-6 w-3/4 bg-zinc-700 rounded animate-pulse"></div>

      <!-- rating + time -->
      <div class="flex gap-2">
        <div class="h-5 w-10 bg-zinc-700 rounded animate-pulse"></div>
        <div class="h-5 w-16 bg-zinc-700 rounded animate-pulse"></div>
      </div>

      <!-- release -->
      <div class="h-4 w-24 bg-zinc-700 rounded animate-pulse"></div>

      <!-- tags -->
      <div class="flex flex-wrap gap-2 justify-center">
        <div
          v-for="i in 4"
          :key="i"
          class="h-6 w-16 bg-zinc-700 rounded-full animate-pulse"
        ></div>
      </div>

      <!-- director -->
      <div class="w-40 aspect-[2/3] bg-zinc-700 rounded-2xl animate-pulse"></div>
    </div>

    <!-- RIGHT -->
    <div class="col-span-3 p-4 flex flex-col gap-6">
      <!-- video -->
      <div class="w-full aspect-video bg-zinc-800 rounded-xl animate-pulse"></div>

      <!-- thumbs -->
      <div class="flex gap-2">
        <div
          v-for="i in 6"
          :key="i"
          class="h-20 w-36 bg-zinc-800 rounded animate-pulse"
        ></div>
      </div>

      <!-- overview -->
      <div class="space-y-3">
        <div class="h-6 w-40 bg-zinc-700 rounded animate-pulse"></div>
        <div class="h-4 w-full bg-zinc-700 rounded animate-pulse"></div>
        <div class="h-4 w-5/6 bg-zinc-700 rounded animate-pulse"></div>
        <div class="h-4 w-4/6 bg-zinc-700 rounded animate-pulse"></div>
      </div>

      <!-- actors -->
      <div>
        <div class="h-6 w-32 bg-zinc-700 rounded animate-pulse mb-3"></div>
        <div class="flex gap-3">
          <div
            v-for="i in 6"
            :key="i"
            class="w-24 h-40 bg-zinc-800 rounded-xl animate-pulse"
          ></div>
        </div>
      </div>

      <!-- crew -->
      <div>
        <div class="h-6 w-32 bg-zinc-700 rounded animate-pulse mb-3"></div>
        <div class="flex gap-3">
          <div
            v-for="i in 6"
            :key="i"
            class="w-24 h-40 bg-zinc-800 rounded-xl animate-pulse"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>
