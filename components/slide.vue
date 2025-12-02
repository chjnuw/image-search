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
          :src="item.backdrop?.[0] || item.image"
          alt=""
          class="w-full h-full object-cover object-top"
        />

        <div
          :class="[
            'absolute text-white p-4 overflow-hidden',
            item.textPosition === 'left'
              ? 'left-[0] text-left w-1/3 inset-0 bg-gradient-to-l from-transparent via-black/30 to-black/70'
              : 'right-[0] text-right -w-1/3 inset-0 bg-gradient-to-r from-transparent via-black/30 to-black/70',
          ]"
        ></div>
        <span
          :class="[
            'absolute top-[15%] text-white p-4 w-1/3',
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
            <span class="w-auto h-full">{{ item.time }}</span>
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
          <p class="mt-4 text-shadow-lg/40 drop-shadow-lg/100 text-2xl indent-8">
            {{ item.description }}
          </p>
          <div class="justify-self-center space-x-14 mt-10">
            <button
              class="bg-green-500 w-40 h-13 rounded-xl text-shadow-md drop-shadow-xl/50 cursor-pointer"
              @click="openPopup(item.id)"
            >
              <span class="pr-1"
                ><FontAwesomeIcon  icon="fa-solid fa-circle-info" /></span
              >
              More info
            </button>
            <button
              class="bg-gray-500 w-40 h-13 rounded-xl text-shadow-md drop-shadow-xl/50 cursor-pointer"
            >
              <span class="pr-1"
                ><FontAwesomeIcon  icon="fa-regular fa-heart" /></span
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
        <FontAwesomeIcon  icon="fa-solid fa-arrow-left" />
      </button>
    </div>
    <div class="flex absolute top-1/2 right-0 w-auto px-4">
      <button
        class="text-white text-2xl p-4 bg-black/30 hover:bg-gray-700 rounded-full cursor-pointer opacity-0 translate-x-6 transition-all duration-500 group-hover:translate-x-0 group-hover:opacity-100"
        @click="nextSlide"
      >
        <FontAwesomeIcon  icon="fa-solid fa-arrow-right" />
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
import { mockdata } from "~/composables/mockdata";
const { items } = mockdata();

const currentIndex = ref(0);
let interval = null;
let timeout = null;

// เริ่ม slide
const startAutoSlide = () => {
  interval = setInterval(() => {
    currentIndex.value = (currentIndex.value + 1) % items.value.length;
  }, 5000); // เปลี่ยน slide ทุก 5 วินาที
};

// หยุด slide
const pauseSlider = () => {
  clearInterval(interval);
  clearTimeout(timeout);
  timeout = setTimeout(() => {
    interval = setInterval(() => {
      currentIndex.value = (currentIndex.value + 1) % items.value.length;
    }, 5000);
  }, 1000); // หยุดชั่วคราว 5 วินาที
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

onMounted(() => {
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
});

const handleEsc = (e) => {
  if (e.key === "Escape") showPopup.value = false;
};
</script>

<style></style>
