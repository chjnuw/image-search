<template>
  <nav
    :class="[
      'fixed top-0 left-0 w-full z-50 transition-all duration-300',
      navState === 'transparent'
        ? 'bg-gradient-to-t from-transparent to-black/70 translate-y-0 p-6 text-white'
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
        <div class="items-center list-none gap-4 p-4 hidden lg:flex">
          <li
            class="hover:cursor-pointer hover:text-[#a0e13e] duration-300"
            :class="{ 'text-[#a0e13e]': $route.path === '/' }"
          >
            <NuxtLink to="/" reload> HOME </NuxtLink>
          </li>
          <li
            class="hover:cursor-pointer hover:text-[#a0e13e] duration-300"
            :class="{ 'text-[#a0e13e]': $route.path === '/catagory' }"
          >
            <NuxtLink to="/catagory" reload> CATERGORY </NuxtLink>
          </li>
          <li class="hover:cursor-pointer hover:text-[#a0e13e] duration-300"
           :class="{ 'text-[#a0e13e]': $route.path === '/favoritescreen' }">
            <NuxtLink to="/favoritescreen" reload> FAVORITE </NuxtLink>
          </li>
          <li class="hover:cursor-pointer hover:text-[#a0e13e] duration-300"
           :class="{ 'text-[#a0e13e]': $route.path === '/actor' }">
            <NuxtLink to="/actor" reload> ACTOR </NuxtLink>
          </li>
        </div>
      </div>
      <div class="flex justify-center gap-4 items-center">
        <div class="hidden lg:flex relative">
          <input
            type="text"
            placeholder="Search..."
            class="pl-4 pr-10 py-1 border rounded-lg"
            @click="openpopup"
          />
          <span
            ><FontAwesomeIcon
              icon="fa-solid fa-magnifying-glass"
              class="absolute right-3 top-1/2 -translate-y-1/2"
          /></span>
        </div>

        <FontAwesomeIcon
          icon="fa-solid fa-heart"
          class="flex text-3xl cursor-pointer"
        />

        <FontAwesomeIcon
          icon="fa-regular fa-circle-user"
          class="flex text-3xl cursor-pointer"
        />
      </div>
    </div>
  </nav>
</template>
<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
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
</script>

<style>
/* optional: เพิ่ม shadow เล็ก ๆ เวลา visible */
nav {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>
