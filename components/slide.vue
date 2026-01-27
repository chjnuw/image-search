<template>
  <div class="relative w-full h-[100vh] justify-center items-center text-white overflow-hidden group">
    <div class="flex transition-transform duration-700 ease-in-out h-full"
      :style="{ transform: `translateX(-${currentIndex * 100}%)` }">
      <div v-for="item in items" :key="item.id" class="flex-shrink-0 w-full h-full overflow-hidden relative">
        <img :src="item.lq"
          class="absolute inset-0 w-full h-full object-cover blur-lg scale-105 transition-opacity duration-700 object-top"
          :class="item.loadedHD ? 'opacity-100' : 'opacity-0'" />

        <img v-if="item.loadedHD" :src="item.hd"
          class="absolute inset-0 w-full h-full object-cover transition-opacity duration-700 object-top"
          :class="item.loadedHD ? 'opacity-100' : 'opacity-0'" />

        <img v-if="item.loadedFull" :src="item.full"
          class="absolute inset-0 w-full h-full object-cover transition-opacity duration-700 object-top"
          :class="item.loadedHD ? 'opacity-100' : 'opacity-0'" />

        <!-- ================================================= Gradient overlays ======================================================-->
        <div
          class="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-black/100 to-transparent pointer-events-none">
        </div>
        <div
          class="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.6)_100%)] pointer-events-none">
        </div>
        <div class="absolute inset-0 bg-gradient-to-r from-black/70 via-transparent to-black/30 pointer-events-none">
        </div>
        <!-- ======================================================================================================================== -->
        <span :class="[
          'absolute top-1/2 -translate-y-1/2 text-white p-4 w-1/3',
          item.textPosition === 'left'
            ? 'left-[5%] text-left '
            : 'right-[5%] text-left',
        ]">

          <p class="text-5xl font-bold text-shadow-lg/40 drop-shadow-lg/70 text-center">
            {{ displayTitle.main }}
          </p>

          <p v-if="displayTitle.sub"
            class="text-2xl text-gray-300 text-center text-shadow-lg/40 drop-shadow-lg/70 mt-3">
            {{ displayTitle.sub }}
          </p>


          <p
            class="mt-2 p-2 text-shadow-lg/40 drop-shadow-lg/100 text-base justify-center flex text-center w-full items-center gap-2">
            <span class="px-2 py-1 border rounded-md font-bold backdrop-blur-md"
              :class="normalizeAgeRating(item.ageRating).class">
              {{ normalizeAgeRating(item.ageRating).label }}
            </span>
            <span class="">·</span>
            <span class="w-auto h-full">{{ item.release }}</span>
          </p>
          <p
            class="text-shadow-lg/40 drop-shadow-lg/100 text-base justify-center flex text-center w-full items-center text-green-400">
            <span class="w-full"><span class="px-2">●</span>{{
              item.tages ? item.tages.map((tag) => tag.name).join(" , ") : ""
            }}<span class="px-2">●</span></span>
          </p>
          <p
            class="mt-4 text-shadow-lg/50 drop-shadow-lg/100 text-lg indent-8 overflow-y-auto max-h-20 custom-scrollbar">
            {{ item.description }}
          </p>
          <div class="justify-self-center space-x-14 mt-10">
            <button class="bg-green-500 w-40 h-13 rounded-xl text-shadow-lg/40 drop-shadow-xl/50 cursor-pointer"
              @click="openPopup(item.id)">
              <span class="pr-1 ">
                <FontAwesomeIcon icon="fa-solid fa-circle-info" />
              </span>
              More info
            </button>
            <button class="w-40 h-13 rounded-xl text-shadow-lg/40 drop-shadow-xl/50 cursor-pointer transition-colors hover:bg-pink-600"
              :class="isFavorite(item.id) ? 'bg-pink-600' : 'bg-gray-500'" @click="toggleFavorite(item)">
              <span class="pr-1">
                <FontAwesomeIcon icon="fa-solid fa-heart"
                  :class="isFavorite(item.id) ? 'text-pink-300' : 'text-white'" />
              </span>
              Favorite
            </button>

          </div>
        </span>
      </div>
    </div>
    <div class="flex absolute top-1/2 left-0 w-auto px-4">
      <button
        class="text-white text-2xl p-4 bg-black/30 hover:bg-gray-700 rounded-full cursor-pointer opacity-0 -translate-x-6 transition-all duration-500 group-hover:translate-x-0 group-hover:opacity-100"
        @click="prevSlide">
        <FontAwesomeIcon icon="fa-solid fa-arrow-left" />
      </button>
    </div>
    <div class="flex absolute top-1/2 right-0 w-auto px-4">
      <button
        class="text-white text-2xl p-4 bg-black/30 hover:bg-gray-700 rounded-full cursor-pointer opacity-0 translate-x-6 transition-all duration-500 group-hover:translate-x-0 group-hover:opacity-100"
        @click="nextSlide">
        <FontAwesomeIcon icon="fa-solid fa-arrow-right" />
      </button>
    </div>
    <div class="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-3">
      <div v-for="(item, i) in items" :key="i" class="w-3 h-3 rounded-full cursor-pointer transition-all duration-300"
        :class="currentIndex === i ? 'bg-green-600 scale-125' : 'bg-white/80'" @click="goToSlide(i)"></div>
    </div>
    <PopupM v-if="showPopup" :selectedId="selectedId" @close="showPopup = false" />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, computed } from "vue";
import { useTMDB } from "../composables/useTMDB";
import { genreMap } from "../composables/genreMap";
import { normalizeAgeRating } from "../utils/ageRating";
const items = ref([]);
const { getPopularMovies, getMovieAgeRating, getMovieDetailsEN } = useTMDB();

const currentIndex = ref(0);
let interval = null;
let timeout = null;

const stopAutoSlide = () => {
  clearInterval(interval);
  clearTimeout(timeout);
  interval = null;
  timeout = null;
};

// เริ่ม slide
const startAutoSlide = () => {
  if (interval || showPopup.value) return;
  interval = setInterval(() => {
    currentIndex.value = (currentIndex.value + 1) % items.value.length;
  }, 5000); // เปลี่ยน slide ทุก 5 วินาที
};

// หยุด slide
const pauseSlider = () => {
  stopAutoSlide();

  if (showPopup.value) return;

  timeout = setTimeout(() => {
    startAutoSlide();
  }, 1000);
};

// ถัดไป
const nextSlide = () => {
  currentIndex.value = (currentIndex.value + 1) % items.value.length;
  pauseSlider();
};
//ก่อนหน้า
const prevSlide = () => {
  currentIndex.value =
    (currentIndex.value - 1 + items.value.length) % items.value.length;
  pauseSlider();
};
const goToSlide = (index) => {
  currentIndex.value = index;
  pauseSlider();
};

const selectedId = ref(null);
const selectedItem = computed(() =>
  items.find((i) => i.id == selectedId.value)
);

// async function getDominantSide(url) {
//   return new Promise((resolve) => {
//     const img = new Image();
//     img.crossOrigin = "anonymous";
//     img.src = url;

//     img.onload = () => {
//       const canvas = document.createElement("canvas");
//       const ctx = canvas.getContext("2d");

//       const TARGET_WIDTH = 200;
//       const scale = TARGET_WIDTH / img.width;

//       canvas.width = TARGET_WIDTH;
//       canvas.height = img.height * scale;

//       ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

//       const width = canvas.width;
//       const height = canvas.height;

//       const xStart = width * 0.2;
//       const xEnd = width * 0.8;
//       const w = xEnd - xStart;
//       const h = height;

//       const data = ctx.getImageData(xStart, 0, w, h).data;

//       let leftScore = 0;
//       let rightScore = 0;

//       for (let y = 0; y < h; y++) {
//         for (let x = 0; x < w; x++) {
//           const i = (y * w + x) * 4;

//           const r = data[i];
//           const g = data[i + 1];
//           const b = data[i + 2];

//           const contrast = Math.abs(r - g) + Math.abs(g - b) + Math.abs(r - b);

//           if (x < w / 2) leftScore += contrast;
//           else rightScore += contrast;
//         }
//       }

//       resolve(leftScore > rightScore ? "left" : "right");
//     };
//   });
// }
onMounted(async () => {
  const res = await getPopularMovies();

  if (res?.results?.length) {
    const mapped = res.results.map((m) => ({
      id: m.id,
      titleTH: m.title,
      description: m.overview,

      lq: `https://image.tmdb.org/t/p/w92${m.backdrop_path}`,

      hd: `https://image.tmdb.org/t/p/w780${m.backdrop_path}`,

      full: `https://image.tmdb.org/t/p/original${m.backdrop_path}`,

      loadedLQ: false,
      loadedHD: false,
      loadedFull: false,

      ageRating: null,
      release: m.release_date,
      tages:
        m.genre_ids?.map((g) => ({ name: genreMap[g] || "Unknown" })) || [],
      textPosition: "left",
    }));
    items.value = mapped;
    preloadEnTitles(items.value);
    mapped.forEach((item) => {
      const lq = new Image();
      lq.src = item.lq;
      lq.onload = () => (item.loadedLQ = true);

      const hd = new Image();
      hd.src = item.hd;
      hd.onload = () => (item.loadedHD = true);

      const full = new Image();
      full.src = item.full;
      full.onload = () => (item.loadedFull = true);
    });
    loadAgeRating(items.value[0]);
    startAutoSlide();
    // โหลด HD สำหรับ slide ปัจจุบัน + ถัดไป
    const loadHDForSlides = (index) => {
      const slidesToLoad = [mapped[index], mapped[(index + 1) % mapped.length]];
      slidesToLoad.forEach((item) => {
        if (!item.loadedHD) {
          const hdImg = new Image();
          hdImg.src = item.hd;
          hdImg.onload = () => (item.loadedHD = true);
        }
      });
    };

    loadHDForSlides(0); // เริ่มที่ slide แรก

    // โหลด HD/Full slide ต่อไปเมื่อเปลี่ยน slide
    watch(currentIndex, (index) => {
      loadHDForSlides(index);
    });
  }

  window.addEventListener("keydown", handleEsc);
});

onUnmounted(() => {
  clearInterval(interval);
  clearTimeout(timeout);
  window.removeEventListener("keydown", handleEsc);
});

import PopupM from "~/components/PopupM.vue";

const showPopup = ref(false);

function openPopup(id) {
  selectedId.value = id;
  showPopup.value = true;
}

watch(showPopup, (val) => {
  document.body.style.overflow = val ? "hidden" : "";

  if (val) {
    stopAutoSlide(); // เปิด popup = หยุดทันที
  } else {
    startAutoSlide(); // ปิด popup = กลับมาวิ่ง
  }
});

const handleEsc = (e) => {
  if (e.key === "Escape") showPopup.value = false;
};

const loadAgeRating = async (item) => {
  if (!item || item.ageRating) return;

  try {
    item.ageRating = await getMovieAgeRating(item.id);
  } catch (e) {
    item.ageRating = "NR";
  }
};

watch(currentIndex, (index) => {
  loadAgeRating(items.value[index]);
});

const preloadEnTitles = async (items) => {
  await Promise.all(
    items.map(async (item) => {
      try {
        const en = await getMovieDetailsEN(item.id);
        item.titleEN = en?.title || item.titleTH;
      } catch {
        item.titleEN = item.titleTH;
      }
    })
  );
};

const displayTitle = computed(() => {
  const item = items.value[visibleIndex.value];
  if (!item) return { main: null, sub: null };

  const main = item.titleEN || item.titleTH || null;

  const sub =
    item.titleTH && item.titleEN && item.titleTH !== item.titleEN
      ? item.titleTH
      : null;

  return { main, sub };
});

const visibleIndex = ref(0);

watch(currentIndex, (i) => {
  setTimeout(() => {
    visibleIndex.value = i;
  }, 250); // ครึ่งหนึ่งของ slide animation
});
// ===================== FAVORITE LOGIC =====================
const favoriteIds = ref([])

// โหลด favorite จาก backend ตอนเปิดหน้า
onMounted(async () => {
  try {
    const res = await $fetch("/api/favorite", {
      credentials: "include",
    })
    // สมมติ backend ส่ง array ของ movieId
    favoriteIds.value = res.map(f => f.movieId)
  } catch (err) {
    console.error("load favorite error", err)
    favoriteIds.value = []
  }
})

// เช็คว่า item นี้เป็น fav ไหม (ใช้กับ UI เท่านั้น)
const isFavorite = (id) => {
  return favoriteIds.value.includes(id)
}

// toggle favorite (ยิง API จริง)
const toggleFavorite = async (item) => {
  if (!item?.id) return

  try {
    if (isFavorite(item.id)) {
      // ================= DELETE =================
      await $fetch("/api/favorite", {
        method: "DELETE",
        body: { movieId: item.id },
        credentials: "include",
      })

      favoriteIds.value = favoriteIds.value.filter(id => id !== item.id)
      alert("ลบออกจากรายการโปรดแล้ว 💔")

    } else {
      // ================= ADD =================
      await $fetch("/api/favorite", {
        method: "POST",
        body: { movieId: item.id },
        credentials: "include",
      })

      favoriteIds.value.push(item.id)
      alert("เพิ่มเข้ารายการโปรดแล้ว ❤️")
    }
  } catch (err) {
    console.error(err)
    alert("กรูณาเข้าสู่ระบบ")
  }
}

</script>

<style></style>
