<template>
  <transition name="popup-fade" appear>
    <div
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
    >
      <div
        class="w-[65%] h-[80%] bg-[#0B0A0A] rounded-2xl grid grid-cols-4 overflow-hidden animate-pulse"
      >
        <!-- ================= Sidebar ================= -->
        <div class="col-span-1 bg-black p-4 flex flex-col items-center">
          <!-- Profile -->
          <div class="w-48 aspect-[2/3] rounded-xl bg-white/10" />

          <!-- Name -->
          <div class="h-5 w-32 bg-white/10 rounded mt-4" />

          <!-- Social icons -->
          <div class="flex gap-3 mt-3">
            <div v-for="i in 4" :key="i" class="w-6 h-6 bg-white/10 rounded-full" />
          </div>

          <!-- Info blocks -->
          <div class="mt-6 w-full space-y-4">
            <div v-for="i in 4" :key="i">
              <div class="h-4 w-24 bg-white/20 rounded mb-2" />
              <div class="h-4 w-full bg-white/10 rounded" />
            </div>
          </div>
        </div>

        <!-- ================= Main ================= -->
        <div class="col-span-3 p-6 space-y-6">
          <!-- Biography title -->
          <div class="h-6 w-40 bg-white/20 rounded" />

          <!-- Biography text -->
          <div class="space-y-3">
            <div v-for="i in 4" :key="i" class="h-4 w-full bg-white/10 rounded" />
          </div>

          <!-- Known for -->
          <div class="mt-6">
            <div class="h-6 w-48 bg-white/20 rounded mb-4" />
            <div class="flex gap-3 overflow-hidden">
              <div
                v-for="i in 6"
                :key="i"
                class="w-28 aspect-[2/3] bg-white/10 rounded-lg"
              />
            </div>
          </div>

          <!-- Career -->
          <div class="mt-8 space-y-4">
            <div class="h-6 w-40 bg-white/20 rounded" />

            <div v-for="i in 3" :key="i" class="rounded-xl overflow-hidden">
              <div class="h-10 bg-white/15" />
              <div
                v-for="j in 2"
                :key="j"
                class="h-14 bg-white/10 border-t border-white/5"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>
