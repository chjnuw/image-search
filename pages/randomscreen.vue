<template>
  <!-- ⏳ กำลังเช็ค login -->
  <div
    v-if="pending"
    class="w-full min-h-screen bg-black flex items-center justify-center"
  >
    <h1 class="text-white text-xl">Loading...</h1>
  </div>

  <!-- ❌ ยังไม่ล็อกอิน -->
   <div
    v-else-if="!isLoggedIn"
    class="w-full min-h-screen bg-[#0B0A0A] flex items-center justify-center"
  >
    <div class="flex flex-col items-center gap-6 text-center">
      <h1 class="text-white text-2xl">
        คุณยังไม่ได้ล็อกอินบัญชีผู้ใช้
      </h1>

      <button
        @click="goToLogin"
        class="px-8 py-3 bg-[#90CB38] text-white text-shadow-4xl rounded-xl font-medium cursor-pointer hover:bg-[#6da11f]"
      >
        เข้าสู่ระบบ
      </button>
    </div>
  </div>
  <!-- ✅ ล็อกอินแล้ว -->
  <div
    v-else
    class="mt-20 min-h-screen bg-black text-white flex flex-col lg:flex-row gap-8 p-6"
  >
    <!-- LEFT -->
    <div class="lg:w-1/4 w-full bg-[#0f0f0f] rounded-2xl p-6 border border-[#1f1f1f]">
      <h2 class="text-xl font-bold mb-4 text-[#90CB38]">
        เลือกแท็กหนัง (ได้สูงสุด 3)
      </h2>

      <div class="flex flex-wrap gap-3">
        <button
          v-for="genre in genres"
          :key="genre.id"
          @click="toggleGenre(genre.id)"
          :disabled="isDisabled(genre.id)"
          class="px-4 py-2 rounded-full text-sm transition border
          disabled:opacity-40 disabled:cursor-not-allowed"
          :class="selectedGenres.includes(genre.id)
            ? 'bg-[#90CB38] text-black border-[#90CB38]'
            : 'border-[#444] text-gray-300 hover:border-[#90CB38]'"
        >
          {{ genre.name }}
        </button>
      </div>

      <button
        @click="spin"
        :disabled="selectedGenres.length === 0 || isSpinning"
        class="w-full mt-6 py-3 rounded-xl font-bold text-black
        bg-[#90CB38] hover:scale-105 transition
        disabled:opacity-40 disabled:cursor-not-allowed"
      >
        สุ่มหนัง
      </button>
    </div>

    <!-- RIGHT -->
    <div class="flex-1 flex items-center justify-center">
      <div class="relative w-full max-w-[520px] bg-[#0f0f0f] rounded-3xl p-6 border border-[#1f1f1f]">
        <h2 class="text-2xl font-bold text-center mb-4">
          🎰 สุ่มหนังที่คุณชอบเลย
        </h2>

        <div class="relative overflow-hidden h-[180px] border-4 rounded-2xl border-[#90CB38]">
          <div
            class="transition-transform duration-[2000ms] ease-out"
            :style="{ transform: `translateY(-${translateY}px)` }"
          >
            <div
              v-for="(movie, i) in slotMovies"
              :key="i"
              class="h-[180px] flex items-center gap-4 px-4"
            >
              <img
                :src="movie.poster_path
                  ? 'https://image.tmdb.org/t/p/w500' + movie.poster_path
                  : '/img/no-poster.png'"
                class="w-[100px] h-[150px] object-cover rounded-xl"
              />
              <h3 class="text-xl font-medium line-clamp-2">
                {{ movie.title }}
              </h3>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- RESULT POPUP -->
    <PopupResultFav
      v-if="showResult && resultMovie"
      :movie="resultMovie"
      @close="showResult = false"
      @retry="retrySpin"
      @view="openMovieDetail"
    />

    <!-- DETAIL POPUP -->
    <popupM
      v-if="showPopup && selectedId"
      :selectedId="selectedId"
      @close="closeDetail"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue"
import { useRouter } from "vue-router"
import PopupResultFav from "~/components/popupResultFav.vue"
import popupM from "~/components/popupM.vue"

const router = useRouter()
const config = useRuntimeConfig()

/* ---------------- login check (เหมือน favoritescreen) ---------------- */
const { data, pending, error } = await useFetch("/api/profile", {
  credentials: "include",
  throw: false
})

const isLoggedIn = computed(() => {
  if (pending.value) return false
  if (error.value) return false
  return true
})

const goToLogin = () => {
  router.push("/logInscreen")
}

/* ---------------- GENRES ---------------- */
const genres = ref<any[]>([])
const selectedGenres = ref<number[]>([])

onMounted(async () => {
  const res = await fetch(
    "https://api.themoviedb.org/3/genre/movie/list?language=en-US",
    {
      headers: {
        Authorization: `Bearer ${config.public.TMDB_READ_TOKEN}`,
      },
    }
  )
  const data = await res.json()
  genres.value = data.genres
})

const toggleGenre = (id: number) => {
  const idx = selectedGenres.value.indexOf(id)
  if (idx !== -1) selectedGenres.value.splice(idx, 1)
  else if (selectedGenres.value.length < 3) selectedGenres.value.push(id)
}

const isDisabled = (id: number) =>
  selectedGenres.value.length === 3 &&
  !selectedGenres.value.includes(id)

/* ---------------- SLOT ---------------- */
const isSpinning = ref(false)
const translateY = ref(0)
const slotMovies = ref<any[]>([])

/* ---------------- RESULT ---------------- */
const showResult = ref(false)
const resultMovie = ref<any>(null)

/* ---------------- DETAIL POPUP ---------------- */
const selectedId = ref<number | null>(null)
const showPopup = ref(false)

const spin = async () => {
  if (isSpinning.value) return

  isSpinning.value = true
  showResult.value = false

  const res = await fetch(
    `https://api.themoviedb.org/3/discover/movie?with_genres=${selectedGenres.value.join(",")}`,
    {
      headers: {
        Authorization: `Bearer ${config.public.TMDB_READ_TOKEN}`,
      },
    }
  )

  const data = await res.json()
  const movies = data.results.slice(0, 10)

  slotMovies.value = [...movies, ...movies, ...movies]

  const resultIndex = Math.floor(Math.random() * movies.length)
  translateY.value = (movies.length * 2 + resultIndex) * 180
  resultMovie.value = movies[resultIndex]

  setTimeout(() => {
    isSpinning.value = false
    showResult.value = true
  }, 2000)
}

const retrySpin = () => {
  showResult.value = false
  translateY.value = 0
}

const openMovieDetail = (id: number) => {
  showResult.value = false
  selectedId.value = id
  showPopup.value = true
}

const closeDetail = () => {
  showPopup.value = false
  selectedId.value = null
}
</script>
