<template>
  <!-- ⏳ กำลังเช็ค login (คงเดิม) -->
  <div
    v-if="pending"
    class="w-full min-h-screen bg-black flex items-center justify-center"
  >
    <h1 class="text-white text-xl">Loading...</h1>
  </div>

  <!-- ❌ ยังไม่ล็อกอิน -->
  <div
    v-else-if="!isLoggedIn"
    class="w-full min-h-screen bg-[#0B0A0A] flex items-center justify-center px-4"
  >
    <div class="flex flex-col items-center gap-6 text-center">
      <h1 class="text-white text-xl sm:text-2xl">
        คุณยังไม่ได้ล็อกอินบัญชีผู้ใช้
      </h1>

      <button
        @click="goToLogin"
        class="px-8 py-3 bg-[#90CB38] text-white rounded-xl font-medium cursor-pointer hover:bg-[#6da11f]"
      >
        เข้าสู่ระบบ
      </button>
    </div>
  </div>

  <!-- ✅ ล็อกอินแล้ว -->
  <div
    v-else
    class="relative mt-16 sm:mt-20 min-h-screen text-white
    bg-gradient-to-br from-black via-[#0b0b0b] to-[#111]
    flex flex-col lg:flex-row gap-6 lg:gap-8
    p-4 sm:p-6 overflow-hidden"
  >
    <!-- glow bg -->
    <div class="absolute inset-0 bg-[radial-gradient(circle_at_top,#90CB3820,transparent_60%)]"></div>

    <!-- LEFT : GENRE PANEL -->
    <div
      class="relative z-10 w-full lg:w-1/4
      bg-gradient-to-b from-[#111] to-[#0b0b0b]
      rounded-2xl sm:rounded-3xl
      p-4 sm:p-6
      border border-[#222]
      shadow-[0_0_30px_#000]"
    >
      <h2
        class="text-lg sm:text-xl font-bold mb-4 text-[#90CB38] tracking-wide"
      >
        🎬 เลือกแท็กหนัง (สูงสุด 3)
      </h2>

      <div class="flex flex-wrap gap-2 sm:gap-3">
        <button
          v-for="genre in genres"
          :key="genre.id"
          @click="toggleGenre(genre.id)"
          :disabled="isDisabled(genre.id)"
          class="px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm transition border
          disabled:opacity-40 disabled:cursor-not-allowed"
          :class="
            selectedGenres.includes(genre.id)
              ? 'bg-[#90CB38] text-black border-[#90CB38] shadow-[0_0_15px_#90CB38]'
              : 'border-[#444] text-gray-300 hover:border-[#90CB38] hover:text-white'
          "
        >
          {{ genre.name }}
        </button>
      </div>

      <button
        @click="spin"
        :disabled="selectedGenres.length === 0 || isSpinning"
        class="relative overflow-hidden
        w-full mt-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl
        font-extrabold text-black bg-[#90CB38]
        shadow-[0_0_25px_#90CB38]
        hover:scale-105 transition
        disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
      >
        🎰 สุ่มหนัง
      </button>
    </div>

    <!-- RIGHT : SLOT -->
    <div
      class="relative z-10 flex-1 flex items-center justify-center
      mt-4 lg:mt-0"
    >
      <div
        class="relative w-full max-w-full sm:max-w-[520px]
        bg-gradient-to-b from-[#111] to-[#0b0b0b]
        rounded-2xl sm:rounded-[2rem]
        p-4 sm:p-6
        border border-[#222]
        shadow-[0_0_40px_#000]"
      >
        <h2
          class="text-xl sm:text-2xl font-extrabold text-center mb-4 sm:mb-6 tracking-wide"
        >
          🎥 สุ่มหนังที่คุณชอบเลย !
        </h2>

        <div
          class="relative overflow-hidden h-[160px] sm:h-[180px]
          rounded-2xl
          border-4 border-[#90CB38]
          shadow-[inset_0_0_30px_#000,0_0_30px_#90CB3840]"
        >
          <!-- fade -->
          <div class="pointer-events-none absolute top-0 left-0 right-0 h-8 sm:h-10 bg-gradient-to-b from-black to-transparent z-10"></div>
          <div class="pointer-events-none absolute bottom-0 left-0 right-0 h-8 sm:h-10 bg-gradient-to-t from-black to-transparent z-10"></div>

          <div
            class="transition-transform duration-[2000ms] ease-out"
            :style="{ transform: `translateY(-${translateY}px)` }"
          >
            <div
              v-for="(movie, i) in slotMovies"
              :key="i"
              class="h-[160px] sm:h-[180px]
              flex items-center gap-4 sm:gap-5 px-4 sm:px-5
              hover:bg-white/5 transition"
            >
              <img
                :src="
                  movie.poster_path
                    ? 'https://image.tmdb.org/t/p/w500' + movie.poster_path
                    : '/img/no-poster.png'
                "
                class="w-[80px] sm:w-[100px] h-[120px] sm:h-[150px]
                object-cover rounded-xl shadow-lg"
              />
              <h3 class="text-base sm:text-xl font-medium line-clamp-2">
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
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useFetch, useRuntimeConfig } from "nuxt/app";

const config = useRuntimeConfig()
console.log("TOKEN:", config.public.TMDB_READ_TOKEN)

const router = useRouter();


/* ---------------- login check ---------------- */
const data = ref(null);
const pending = ref(true);
const error = ref(null);

/* ---------------- GENRES ---------------- */
const genres = ref<any[]>([]);
const selectedGenres = ref<number[]>([]);

/* ---------------- โหลดข้อมูลทั้งหมด ---------------- */
onMounted(async () => {
  try {
    /* ===== LOGIN ===== */
    const result = await useFetch("/api/profile", {
      credentials: "include",
    });

    data.value = result.data.value;
    error.value = result.error.value;

    /* ===== GENRES ===== */
    const res = await fetch(
      "https://api.themoviedb.org/3/genre/movie/list?language=en-US",
      {
        headers: {
          Authorization: `Bearer ${config.public.TMDB_READ_TOKEN}`,
          "Content-Type": "application/json;charset=utf-8",
        },
      }
    );

    const genreData = await res.json();

    /* กัน API พัง */
    if (genreData?.genres) {
      genres.value = genreData.genres;
    } else {
      console.error("TMDB GENRE ERROR:", genreData);
      genres.value = [];
    }
  } catch (e) {
    console.error("LOAD ERROR:", e);
    error.value = e;
  } finally {
    pending.value = false;
  }
});

/* ---------------- LOGIN STATE ---------------- */
const isLoggedIn = computed(() => {
  if (pending.value) return false;
  if (error.value) return false;
  return true;
});

const goToLogin = () => {
  router.push("/logInscreen");
};

/* ---------------- TOGGLE GENRE ---------------- */
const toggleGenre = (id: number) => {
  const idx = selectedGenres.value.indexOf(id);

  if (idx !== -1) {
    selectedGenres.value.splice(idx, 1);
  } else if (selectedGenres.value.length < 3) {
    selectedGenres.value.push(id);
  }
};

const isDisabled = (id: number) => {
  return (
    selectedGenres.value.length === 3 &&
    !selectedGenres.value.includes(id)
  );
};

/* ---------------- SLOT ---------------- */
const isSpinning = ref(false);
const translateY = ref(0);
const slotMovies = ref<any[]>([]);

/* ---------------- RESULT ---------------- */
const showResult = ref(false);
const resultMovie = ref<any>(null);

/* ---------------- DETAIL POPUP ---------------- */
const selectedId = ref<number | null>(null);
const showPopup = ref(false);

/* ---------------- SPIN ---------------- */
import { nextTick } from "vue";

const spin = async () => {
  if (isSpinning.value) return;

  try {
    isSpinning.value = true;
    showResult.value = false;

    const res = await fetch(
      `https://api.themoviedb.org/3/discover/movie?with_genres=${selectedGenres.value.join(
        ","
      )}&sort_by=popularity.desc`,
      {
        headers: {
          Authorization: `Bearer ${config.public.TMDB_READ_TOKEN}`,
        },
      }
    );

    const data = await res.json();

    if (!data.results || data.results.length === 0) {
      alert("ไม่พบหนังจากแท็กที่เลือก");
      isSpinning.value = false;
      return;
    }

    const movies = data.results.slice(0, 10);

    /* ทำ loop */
    slotMovies.value = [...movies, ...movies, ...movies];

    await nextTick(); // 🔥 รอ DOM render ก่อน

    const resultIndex = Math.floor(Math.random() * movies.length);

    translateY.value =
      (movies.length * 2 + resultIndex) * 180;

    resultMovie.value = movies[resultIndex];

    setTimeout(() => {
      isSpinning.value = false;
      showResult.value = true;
    }, 2000);
  } catch (err) {
    console.error("SPIN ERROR:", err);
    isSpinning.value = false;
  }
};


/* ---------------- ACTIONS ---------------- */
const retrySpin = () => {
  showResult.value = false;
  translateY.value = 0;
};

const openMovieDetail = (id: number) => {
  showResult.value = false;
  selectedId.value = id;
  showPopup.value = true;
};

const closeDetail = () => {
  showPopup.value = false;
  selectedId.value = null;
};
</script>
