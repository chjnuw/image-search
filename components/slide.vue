<template>
  <div
    class="relative w-full h-[100vh] justify-center items-center text-white overflow-hidden group"
  >
    <div
      class="flex transition-transform duration-700 ease-in-out h-full"
      :style="{ transform: `translateX(-${currentIndex * 100}%)` }"
    >
      <div
        v-for="item in items"
        :key="item.id"
        class="flex-shrink-0 w-full h-full overflow-hidden relative"
      >
        <img
          :src="item.lq"
          class="absolute inset-0 w-full h-full object-cover blur-lg scale-105 transition-opacity duration-700 object-top"
          :class="item.loadedHD ? 'opacity-100' : 'opacity-0'"
        />

        <img
          v-if="item.loadedHD"
          :src="item.hd"
          class="absolute inset-0 w-full h-full object-cover transition-opacity duration-700 object-top"
          :class="item.loadedHD ? 'opacity-100' : 'opacity-0'"
        />

        <img
          v-if="item.loadedFull"
          :src="item.full"
          class="absolute inset-0 w-full h-full object-cover transition-opacity duration-700 object-top"
          :class="item.loadedHD ? 'opacity-100' : 'opacity-0'"
        />

<!-- ================================================= Gradient overlays ======================================================-->
        <div
          class="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-black/100 to-transparent pointer-events-none"
        ></div>
        <div
          class="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.6)_100%)] pointer-events-none"
        ></div>
        <div
          class="absolute inset-0 bg-gradient-to-r from-black/70 via-transparent to-black/30 pointer-events-none"
        ></div>
<!-- ======================================================================================================================== -->
        <span
          :class="[
            'absolute top-1/2 -translate-y-1/2 text-white p-4 w-1/3 ',
            item.textPosition === 'left'
              ? 'left-[5%] text-left'
              : 'right-[5%] text-left',
          ]"
        >
          <h2
            class="text-5xl font-bold text-shadow-lg/40 drop-shadow-lg/70 text-center"
          >
            {{ item.title }}
          </h2>
          <p
            class="mt-4 p-2 text-shadow-lg/40 drop-shadow-lg/100 text-base justify-center flex text-center w-full items-center gap-2"
          >
            <span
              class="px-2 py-1 border border-white/40 bg-white/10 backdrop-blur-md rounded-md h-full font-bold"
            >
              {{ item.ageRating }}
            </span>
            <span class="">·</span>
            <span class="w-auto h-full">{{ item.release }}</span>
          </p>
          <p
            class="text-shadow-lg/40 drop-shadow-lg/100 text-base justify-center flex text-center w-full items-center"
          >
            <span class="w-full"
              ><span class="px-2">●</span
              >{{
                item.tages ? item.tages.map((tag) => tag.name).join(" , ") : ""
              }}<span class="px-2">●</span></span
            >
          </p>
          <p
            class="mt-4 text-shadow-lg/40 drop-shadow-lg/100 text-lg indent-8 overflow-y-auto max-h-40 custom-scrollbar"
          >
            {{ item.description }}
          </p>
          <div class="justify-self-center space-x-14 mt-10">
            <button
              class="bg-green-500 w-40 h-13 rounded-xl text-shadow-md drop-shadow-xl/50 cursor-pointer"
              @click="openPopup(item.id)"
            >
              <span class="pr-1"
                ><FontAwesomeIcon icon="fa-solid fa-circle-info"
              /></span>
              More info
            </button>
            <button
              class="bg-gray-500 w-40 h-13 rounded-xl text-shadow-md drop-shadow-xl/50 cursor-pointer"
            >
              <span class="pr-1"
                ><FontAwesomeIcon icon="fa-regular fa-heart" /></span
              >Favorite
            </button>
          </div>
        </span>
      </div>
    </div>
    <div class="flex absolute top-1/2 left-0 w-auto px-4">
      <button
        class="text-white text-2xl p-4 bg-black/30 hover:bg-gray-700 rounded-full cursor-pointer opacity-0 -translate-x-6 transition-all duration-500 group-hover:translate-x-0 group-hover:opacity-100"
        @click="prevSlide"
      >
        <FontAwesomeIcon icon="fa-solid fa-arrow-left" />
      </button>
    </div>
    <div class="flex absolute top-1/2 right-0 w-auto px-4">
      <button
        class="text-white text-2xl p-4 bg-black/30 hover:bg-gray-700 rounded-full cursor-pointer opacity-0 translate-x-6 transition-all duration-500 group-hover:translate-x-0 group-hover:opacity-100"
        @click="nextSlide"
      >
        <FontAwesomeIcon icon="fa-solid fa-arrow-right" />
      </button>
    </div>
    <div class="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-3">
      <div
        v-for="(item, i) in items"
        :key="i"
        class="w-3 h-3 rounded-full cursor-pointer transition-all duration-300"
        :class="currentIndex === i ? 'bg-green-600 scale-125' : 'bg-white/80'"
        @click="goToSlide(i)"
      ></div>
    </div>
    <PopupM
      v-if="showPopup"
      :selectedId="selectedId"
      @close="showPopup = false"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from "vue";
import { useTMDB } from "../composables/useTMDB";
import { genreMap } from "../composables/genreMap";
const items = ref([]);
const { getPopularMovies } = useTMDB();

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

  if (res?.results) {
    const mapped = res.results.map((m) => ({
      id: m.id,
      title: m.title,
      description: m.overview,

      lq: `https://image.tmdb.org/t/p/w92${m.backdrop_path}`,

      hd: `https://image.tmdb.org/t/p/w780${m.backdrop_path}`,

      full: `https://image.tmdb.org/t/p/original${m.backdrop_path}`,

      loadedHD: false,
      loadedFull: false,

      ageRating: m.adult ? "18+" : "PG-13",
      release: m.release_date,
      tages:
        m.genre_ids?.map((g) => ({ name: genreMap[g] || "Unknown" })) || [],
      textPosition: "left",
    }));
    for (const item of mapped) {
      const lqImg = new Image();
      lqImg.src = item.lq;
      lqImg.onload = () => (item.loadedLQ = true);

      const hdImg = new Image();
      hdImg.src = item.hd;
      hdImg.onload = () => (item.loadedHD = true);

      const fullImg = new Image();
      fullImg.src = item.full;
      fullImg.onload = () => (item.loadedFull = true);
    }

    items.value = mapped;
    mapped.forEach((item) => {
      const lqImg = new Image();
      lqImg.src = item.lq;
      lqImg.onload = () => (item.loadedLQ = true);
    });

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
  startAutoSlide();
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
</script>

<style></style>
