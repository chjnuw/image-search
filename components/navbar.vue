<template>
  <nav
    :class="[
      'fixed top-0 left-0 w-full z-50 transition-all duration-300',
      navState === 'transparent'
        ? 'bg-linear-to-t from-transparent to-black/70 translate-y-0 p-6 text-white'
        : navState === 'hidden'
        ? '-translate-y-full p-0'
        : 'bg-black/100 translate-y-0 p-6 text-white',
    ]"
  >
    <div
      class="flex justify-evenly items-center h-10 overflow-hidden text-white text-sm sm:text-base"
    >
      <div class="flex justify-center gap-4">
        <div class="flex items-center">
          <img src="/img/logo.png" alt="Logo" class="size-30 object-contain" />
        </div>
        <div class="items-center list-none gap-4 p-4 hidden text-lg lg:flex">
          <li
            class="hover:cursor-pointer hover:text-[#a0e13e] duration-300"
            :class="{ 'text-[#a0e13e]': $route.path === '/' }"
          >
            <NuxtLink to="/" reload> หน้าหลัก </NuxtLink>
          </li>
          <li
            class="hover:cursor-pointer hover:text-[#a0e13e] duration-300"
            :class="{ 'text-[#a0e13e]': $route.path === '/catagory' }"
          >
            <NuxtLink to="/catagory" reload> หมวดหมู่ </NuxtLink>
          </li>
          <li
            class="hover:cursor-pointer hover:text-[#a0e13e] duration-300"
            :class="{ 'text-[#a0e13e]': $route.path === '/actor' }"
          >
            <NuxtLink to="/actor" reload> นักแสดง </NuxtLink>
          </li>
          <li
            class="hover:cursor-pointer hover:text-[#a0e13e] duration-300"
            :class="{ 'text-[#a0e13e]': $route.path === '' }"
          >
            <NuxtLink to="" reload> สุ่มภาพยนตร์ </NuxtLink>
          </li>
        </div>
      </div>
      <div class="flex justify-center gap-4 items-center">
        <div class="hidden lg:flex">
          <span
            ><FontAwesomeIcon
              icon="fa-solid fa-magnifying-glass"
              class="text-2xl cursor-pointer"
              @click="openSearch = true"
          /></span>
        </div>
        <NuxtLink to="/favoritescreen" reload>
          <FontAwesomeIcon
            icon="fa-solid fa-heart"
            class="flex text-3xl cursor-pointer"
          />
        </NuxtLink>

        <NuxtLink to="/profile" reload>
          <FontAwesomeIcon
            icon="fa-regular fa-circle-user"
            class="flex text-3xl cursor-pointer"
          />
        </NuxtLink>
      </div>
    </div>
  </nav>
  <transition name="search-fade">
    <div
      v-if="openSearch"
      class="fixed inset-0 z-[999] bg-black/95 backdrop-blur-sm flex flex-col"
    >
      <!-- Close -->
      <button
        class="absolute top-6 right-6 text-white text-2xl cursor-pointer z-50 text-white/70 hover:text-white transition duration-200"
        @click="openSearch = false"
      >
        ✕
      </button>

      <!-- Search box -->
      <div class="mt-40 max-w-2xl mx-auto w-full px-6">
        <MovieSearch
          autofocus
          ref="searchRef"
          @select="onSelectSearchMovie"
          @close="openSearch = false"
        />
      </div>
    </div>
  </transition>
  <PopupM
    v-if="showPopup"
    :selectedId="selectedId"
    class="z-50"
    @close="showPopup = false"
  />
</template>
<script setup>
import { ref, watch, onMounted, onUnmounted, nextTick } from "vue";
import { useRoute } from "vue-router";
import { useGlobalLoading } from "../composables/useGlobalLoading";

const route = useRoute();
const showPopup = ref(false);
const selectedId = ref(null);
const searchRef = ref(null);
const { start, stop } = useGlobalLoading();

const navState = ref("black"); // "transparent" | "hidden" | "black"
let lastScroll = 0;

watch(
  () => route.path,
  (newPath) => {
    if (newPath === "/") {
      navState.value = "transparent"; // หน้าแรกต้องโปร่งก่อน
    } else {
      navState.value = "black"; // หน้าอื่นเริ่มสีดำเลย
    }
  },
  { immediate: true } // ให้เช็คทันทีตอน render ครั้งแรก
);

const handleScroll = () => {
  const currentScroll = window.scrollY;

  if (route.path !== "/") {
    navState.value = currentScroll > lastScroll ? "hidden" : "black";
    lastScroll = currentScroll;
    return;
  }

  if (currentScroll <= 50) {
    // อยู่บนสุด → โปร่ง
    navState.value = "transparent";
  } else if (currentScroll > lastScroll) {
    // เลื่อนลง → ซ่อน nav
    navState.value = "hidden";
  } else {
    // เลื่อนขึ้น → สีดำ
    navState.value = "black";
  }

  lastScroll = currentScroll;
};

onMounted(() => {
  window.addEventListener("scroll", handleScroll);
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});

const openSearch = ref(false);

const emit = defineEmits(["search-select"]);

const onSelectSearchMovie = async (movie) => {
  openSearch.value = false;
  await nextTick();
  start();
  selectedId.value = movie.id;
  showPopup.value = true;
};

watch(openSearch, (val) => {
  document.body.style.overflow = val ? "hidden" : "";
});

const handleEsc = (e) => {
  if (e.key === "Escape") {
    if (showPopup.value) showPopup.value = false;
    else openSearch.value = false;
  }
};

onMounted(() => document.addEventListener("keydown", handleEsc));
onUnmounted(() => document.removeEventListener("keydown", handleEsc));

watch(openSearch, async (val) => {
  document.body.style.overflow = val ? "hidden" : "";

  if (val) {
    await nextTick();
    searchRef.value?.focusInput(); // ⭐ โฟกัสทันที
  }
});
</script>

<style>
/* optional: เพิ่ม shadow เล็ก ๆ เวลา visible */
nav {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
.search-fade-enter-from {
  opacity: 0;
}
.search-fade-enter-to {
  opacity: 1;
}
.search-fade-enter-active {
  transition: opacity 0.35s ease;
}

.search-fade-leave-from {
  opacity: 1;
}
.search-fade-leave-to {
  opacity: 0;
}
.search-fade-leave-active {
  transition: opacity 0.25s ease;
}
</style>
