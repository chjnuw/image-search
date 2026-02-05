<template>
  <!-- ⏳ loading -->
  <div
    v-if="pending"
    class="w-full min-h-screen bg-[#0B0A0A] flex items-center justify-center"
  >
    <h1 class="text-white">Loading...</h1>
  </div>

  <!-- ❌ not login -->
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
        class="px-8 py-3 bg-[#90CB38] text-white rounded-xl hover:bg-[#6da11f]"
      >
        เข้าสู่ระบบ
      </button>
    </div>
  </div>

  <!-- ✅ logged in -->
  <div
    v-else
    class="w-full max-w-[1200px] mx-auto mt-20 bg-[#0B0A0A] px-4"
  >
    <!-- HEADER -->
    <div class="grid grid-cols-1 md:grid-cols-3 items-center gap-4 pt-6">
      <!-- ปุ่มซ้าย (จอใหญ่) -->
      <div class="hidden md:flex justify-start">
        <button
          @click="openFavPopup"
          class="w-[200px] h-[45px] bg-[#90CB38] hover:bg-[#699627] rounded-2xl text-white cursor-pointer"
        >
          จุ่มหนังจากรายการโปรด
        </button>
      </div>

      <!-- title -->
      <h1 class="text-2xl md:text-3xl font-medium text-center">
        รายการโปรด
      </h1>

      <!-- balance -->
      <div class="hidden md:block"></div>

      <!-- ปุ่มมือถือ -->
      <div class="flex md:hidden justify-center">
        <button
          @click="openFavPopup"
          class="w-full max-w-[240px] h-[45px] bg-[#90CB38] hover:bg-[#699627] rounded-2xl text-white"
        >
          จุ่มหนังจากรายการโปรด
        </button>
      </div>
    </div>

    <!-- LIST -->
    <div class="mt-6 pb-16 text-white">
      <transition name="fade" mode="out-in">
        <SkeletonCatagorySkeletonMovieList
          v-if="isLoadingMovies"
          :count="20"
        />

        <div
          v-else-if="movies.length"
          class="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
        >
          <CardM
            v-for="movie in movies"
            :key="movie.id"
            :movie="movie"
            @removed="removeMovie"
            @open="openPopup"
          />
        </div>

        <p
          v-else
          class="text-center text-gray-500 mt-10"
        >
          ยังไม่มีหนังในรายการโปรด
        </p>
      </transition>
    </div>

    <!-- popup movie -->
    <PopupM
      v-if="showPopup && selectedId !== null"
      :selectedId="selectedId"
      @close="showPopup = false"
    />

    <!-- popup fav -->
    <PopupFav
      v-if="showFavPopup"
      @close="showFavPopup = false"
      @result="openResult"
    />

    <PopupResultFav
      v-if="resultMovie"
      :movie="resultMovie"
      @close="resultMovie = null"
      @view="openMovieDetail"
      @retry="retrySpin"
    />

    <!-- recommend -->
    <div class="mt-10 mb-10 px-2">
      <div class="flex items-center gap-3 mb-3">
        <h2 class="font-bold text-xl md:text-2xl">
          แนะนำสำหรับคุณ
        </h2>
        <div class="flex-1 border-b border-gray-700"></div>
      </div>

      <p class="text-gray-500 text-sm mb-3">
        จากแนวหนังที่คุณชื่นชอบ
      </p>

      <div v-if="userTags.length" class="flex gap-2 flex-wrap text-sm mb-4">
        <span
          v-for="tag in userTags"
          :key="tag.id"
          class="px-3 py-1 rounded-full bg-green-600/20 text-green-400"
        >
          # {{ tag.name }}
        </span>
      </div>

      <Recomment />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue"
import { useRouter } from "vue-router"
import type { Movie } from "../Type/tmdb"
import { useTMDB } from "../composables/useTMDB"

/* components */
import cardM from "../components/cardM.vue"
import PopupM from "../components/popupM.vue"
import PopupFav from "../components/popupfav.vue"
import PopupResultFav from "../components/popupResultFav.vue"
import Recomment from "../components/recomment.vue"

/* router */
const router = useRouter()

/* login */
const { pending, error } = await useFetch("/api/profile", {
  credentials: "include",
  throw: false
})

const isLoggedIn = computed(() => !pending.value && !error.value)

const goToLogin = () => {
  router.push("/logInscreen")
}

/* movies */
const movies = ref<Movie[]>([])
const isLoadingMovies = ref(true)

/* popup movie */
const showPopup = ref(false)
const selectedId = ref<number | null>(null)

const openPopup = (id: number) => {
  selectedId.value = id
  showPopup.value = true
}

const removeMovie = (id: number) => {
  movies.value = movies.value.filter(m => m.id !== id)
}

/* popup fav */
const showFavPopup = ref(false)
const resultMovie = ref<Movie | null>(null)

const openFavPopup = () => {
  showFavPopup.value = true
}

const openResult = (movie: Movie) => {
  resultMovie.value = movie
  showFavPopup.value = false
}

const retrySpin = () => {
  resultMovie.value = null
  showFavPopup.value = true
}

const openMovieDetail = (id: number) => {
  resultMovie.value = null
  openPopup(id)
}

/* user tags */
const userTags = ref<{ id: number; name: string }[]>([])

/* TMDB */
const { getMovieDetails } = useTMDB()

const loadFavorites = async () => {
  isLoadingMovies.value = true
  try {
    const favs = await $fetch<{ movie_id: number }[]>(
      "/api/favorite",
      { credentials: "include" }
    )

    const results = await Promise.all(
      favs.map(f => getMovieDetails(f.movie_id))
    )

    movies.value = results.filter(Boolean) as Movie[]
  } catch {
    movies.value = []
  } finally {
    isLoadingMovies.value = false
  }
}

/* esc */
const handleEsc = (e: KeyboardEvent) => {
  if (e.key === "Escape") showPopup.value = false
}

onMounted(async () => {
  await loadFavorites()

  try {
    userTags.value = await $fetch("/api/user/tags", {
      credentials: "include"
    })
  } catch {
    userTags.value = []
  }

  document.addEventListener("keydown", handleEsc)
})

onUnmounted(() => {
  document.removeEventListener("keydown", handleEsc)
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
