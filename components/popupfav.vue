<template>
  <div class="fixed inset-0 z-50 bg-black/70 flex items-center justify-center px-3 sm:px-0">
    <div
      class="relative w-full max-w-[520px] bg-[#0f0f0f]
             rounded-2xl sm:rounded-3xl
             p-4 sm:p-6 text-white"
    >

      <!-- close -->
      <button
        @click="$emit('close')"
        class="absolute top-3 right-3 sm:top-4 sm:right-4
               text-lg sm:text-xl hover:text-red-400 cursor-pointer"
      >
        ✕
      </button>

      <!-- title -->
      <h2 class="text-xl sm:text-2xl font-bold text-center mb-4 sm:mb-6">
        🎰 สุ่มหนังจากรายการโปรด
      </h2>

      <!-- SLOT WINDOW -->
      <div
        class="relative overflow-hidden
               h-[150px] sm:h-[180px]
               border-4 rounded-xl sm:rounded-2xl
               transition-all duration-300"
        :class="{
          'border-[#90CB38] shadow-[0_0_25px_#9AFF00]': isWin,
          'border-[#444]': !isWin
        }"
      >
        <!-- overlay -->
        <div class="absolute top-0 left-0 right-0 h-6 sm:h-8 bg-gradient-to-b from-black z-10"></div>
        <div class="absolute bottom-0 left-0 right-0 h-6 sm:h-8 bg-gradient-to-t from-black z-10"></div>

        <!-- SLOT LIST -->
        <div
          class="transition-transform duration-[2000ms] ease-out"
          :style="{ transform: `translateY(-${translateY}px)` }"
        >
          <div
            v-for="(movie, index) in slotMovies"
            :key="index"
            class="h-[150px] sm:h-[180px]
                   flex items-center gap-3 sm:gap-4
                   px-3 sm:px-4"
          >
            <img
              :src="movie.poster_path
                ? 'https://image.tmdb.org/t/p/w500' + movie.poster_path
                : '/img/no-poster.png'"
              class="w-[80px] sm:w-[100px]
                     h-[120px] sm:h-[150px]
                     object-cover rounded-lg sm:rounded-xl"
            />
            <div>
              <h3 class="text-lg sm:text-2xl font-medium line-clamp-2">
                {{ movie.title }}
              </h3>
            </div>
          </div>
        </div>
      </div>

      <!-- SPIN BUTTON -->
      <div class="flex justify-center mt-6 sm:mt-8">
        <button
          @click="spin"
          :disabled="isSpinning || movies.length === 0"
          class="px-8 sm:px-12 py-2.5 sm:py-3
                 rounded-full font-bold text-black
                 bg-gradient-to-r from-[#9AFF00] to-[#4CAF50]
                 hover:scale-105 transition
                 disabled:opacity-50 cursor-pointer"
        >
          {{ isSpinning ? 'กำลังสุ่ม...' : 'สุ่ม 🎲' }}
        </button>
      </div>

    </div>
  </div>
</template>


<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue"
import { useFavorite } from "../composables/useFavorites"
const emit = defineEmits<{
  (e: "close"): void
  (e: "result", movie: any): void
}>()

/* ---------- FAVORITES ---------- */
const { favorites, loadFavorites } = useFavorite()

onMounted(loadFavorites)

const movies = computed(() => favorites.value)

/* ---------- SLOT STATE ---------- */
const slotMovies = ref<any[]>([])
const translateY = ref(0)
const isSpinning = ref(false)
const isWin = ref(false)

/* ---------- AUDIO ---------- */
const spinSound = new Audio("/sounds/spin_soft.wav")
const winSound = new Audio("/sounds/win_soft.wav")

/* clone favorites ให้ยาว */
watch(movies, (val) => {
  if (val.length) {
    slotMovies.value = [...val, ...val, ...val]
  }
})

/* ---------- SPIN ---------- */
const spin = () => {
  if (isSpinning.value || movies.value.length === 0) return

  isSpinning.value = true
  isWin.value = false

  spinSound.loop = true
  spinSound.currentTime = 0
  spinSound.play()

  const itemHeight = 180
  const resultIndex = Math.floor(Math.random() * movies.value.length)
  const stopIndex = movies.value.length * 2 + resultIndex

  translateY.value = stopIndex * itemHeight

  const selectedMovie = movies.value[resultIndex]

  setTimeout(() => {
    spinSound.pause()
    winSound.currentTime = 0
    winSound.play()

    isSpinning.value = false
    isWin.value = true

    emit("result", selectedMovie)
  }, 2000)
}
</script>
