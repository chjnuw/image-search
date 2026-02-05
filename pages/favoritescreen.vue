<template>
  <!-- ⏳ กำลังเช็ค login -->
  <div v-if="pending" class="w-full min-h-screen bg-[#0B0A0A] flex items-center justify-center">
    <h1 class="text-white">Loading...</h1>
  </div>

  <!-- ❌ ยังไม่ล็อกอิน -->
  <div v-else-if="!isLoggedIn" class="w-full min-h-screen bg-[#0B0A0A] flex items-center justify-center">
    <div class="flex flex-col items-center gap-6 text-center">
      <h1 class="text-white text-2xl">
        คุณยังไม่ได้ล็อกอินบัญชีผู้ใช้
      </h1>

      <button @click="goToLogin"
        class="px-8 py-3 bg-[#90CB38] text-white text-shadow-4xl rounded-xl font-medium cursor-pointer hover:bg-[#6da11f]">
        เข้าสู่ระบบ
      </button>
    </div>
  </div>

  <!-- ✅ ล็อกอินแล้ว -->
  <div v-else class="mt-22 mx-[10%] bg-[#0B0A0A]">
    <!-- header -->
    <div class="relative w-full flex items-center px-10 pt-6">
      <div class="w-[100px]"></div>

      <!-- title -->
      <h1 class="text-2xl md:text-3xl font-medium text-center">
        รายการโปรด
      </h1>

      <button
        @click="openFavPopup"
        class="bg-[#90CB38] hover:bg-[#699627] rounded-2xl cursor-pointer px-4 py-2"
      >
        จุ่มหนังจากรายการโปรด
      </button>

      <!-- Popup เลือกสุ่ม -->
      <PopupFav v-if="showFavPopup" :key="favPopupKey" @close="showFavPopup = false" @result="openResult" />

      <!-- Popup ผลลัพธ์ -->
      <PopupResultFav v-if="resultMovie" :movie="resultMovie" @retry="retrySpin" @view="openMovieDetail" />


    </div>

    <!-- list -->
<div class="bg-[#0B0A0A] text-white w-full rounded-xl h-full p-8 pt-4">
  <transition name="fade" mode="out-in">
    <!-- ⏳ loading -->
    <div
      v-if="isLoadingMovies"
      class="grid gap-3.5 px-4 pt-3
             grid-cols-2
             sm:grid-cols-3
             md:grid-cols-4
             lg:grid-cols-5
             xl:grid-cols-6"
    >
      <SkeletonCatagorySkeletonMovieList :count="20" />
    </div>

    <!-- ✅ loaded -->



        <div v-else class="grid gap-3.5 px-4 pt-3
         grid-cols-2
         sm:grid-cols-3
         md:grid-cols-4
         lg:grid-cols-5
         xl:grid-cols-6">
          <CardM v-for="movie in movies" :key="movie.id" :movie="movie"
            @removed="movies = movies.filter(m => m.id !== $event)" @open="openPopup" />
        </div>

      </transition>

      <PopupM v-if="showPopup" :selectedId="selectedId" @close="showPopup = false" />
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

      <div v-if="userTags.length" class="flex gap-2 flex-wrap text-sm">
        <span v-for="tag in userTags" :key="tag.id" class="px-3 py-1 rounded-full bg-green-600/20 text-green-400">
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


/* ---------------- router ---------------- */
const router = useRouter()

/* ---------------- login check ---------------- */
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

/** 🔁 กดสุ่มใหม่ */
const retrySpin = () => {
  resultMovie.value = null
  showFavPopup.value = true
}

/** 👁️ ดูรายละเอียด */
const openMovieDetail = (id: number) => {
  resultMovie.value = null
  openPopup(id)
}

/** เปิด popup สุ่ม */
const openFavPopup = () => {
  showFavPopup.value = true
}

/** รับผลลัพธ์จาก PopupFav */
const openResult = (movie: Movie) => {
  resultMovie.value = movie
  showFavPopup.value = false
}

/* ---------------- movies ---------------- */
const movies = ref<Movie[]>([])
const favoriteIds = ref<number[]>([])
const isLoadingMovies = ref(true)

/* ---------------- movie popup ---------------- */
const showPopup = ref(false)
const selectedId = ref<number | null>(null)

function openPopup(id: number) {
  selectedId.value = id
  showPopup.value = true
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
