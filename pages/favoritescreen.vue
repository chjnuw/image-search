<template>
  <div class="mt-22 mx-[10%] bg-[#0B0A0A]">
    <h1 class="text-3xl font-medium pt-4 flex justify-center">
      รายการโปรด
    </h1>

    <div class="bg-[#0B0A0A] text-white w-full flex rounded-xl h-full p-8 pt-4">
      <transition name="fade" mode="out-in">
        <SkeletonCatagorySkeletonMovieList v-if="isLoadingMovies" :count="20" />

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

    <!-- แนะนำสำหรับคุณ -->
    <div class="snap-start mb-10 p-7">
      <div class="p-4 flex items-center gap-3">
        <h2 class="font-bold text-2xl whitespace-nowrap">
          แนะนำสำหรับคุณ
        </h2>
        <p class="text-gray-500 text-sm">
          จากแนวหนังที่คุณชื่นชอบ
        </p>
        <div class="flex-1 border-b-2"></div>
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
import { ref, onMounted, watch, onUnmounted } from "vue"
import type { Movie } from "../Type/tmdb"
import { useTMDB } from "../composables/useTMDB"
import Recomment from "~/components/recomment.vue"

/* ---------------- state ---------------- */
const movies = ref<Movie[]>([])
const favoriteIds = ref<number[]>([])
const isLoadingMovies = ref(true)

const showPopup = ref(false)
const selectedId = ref<number | null>(null)

const userTags = ref<{ id: number; name: string }[]>([])

/* ---------------- TMDB ---------------- */
const { getMovieDetails } = useTMDB()

/* ---------------- load favorites ---------------- */
const loadFavorites = async () => {
  isLoadingMovies.value = true

  try {
    const favs = await $fetch<{ movie_id: number }[]>(
      "/api/favorite",
      { credentials: "include" }
    )

    favoriteIds.value = favs.map(f => f.movie_id)

    const results = await Promise.all(
      favoriteIds.value.map(id => getMovieDetails(id))
    )

    movies.value = results.filter(Boolean) as Movie[]
  } catch (err) {
    console.error("load favorite error", err)
    movies.value = []
  } finally {
    isLoadingMovies.value = false
  }
}




/* ---------------- popup ---------------- */
function openPopup(id: number) {
  selectedId.value = id
  showPopup.value = true
}

watch(showPopup, (val) => {
  document.body.style.overflow = val ? "hidden" : ""
})

const handleEsc = (e: KeyboardEvent) => {
  if (e.key === "Escape") showPopup.value = false
}

/* ---------------- mounted ---------------- */
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
  document.body.style.overflow = ""
})
</script>
