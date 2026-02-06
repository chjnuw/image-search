<template>
  <footer class="relative bg-black text-gray-300 border-t border-gray-800">
    <!-- Scroll to top -->
    <button
      class="fixed right-6 bottom-6 bg-gray-800 hover:bg-gray-700 text-white p-4 rounded-full shadow-lg transition-all duration-300 z-50"
      :class="[
        buttonOnTop === 'show'
          ? 'opacity-100 translate-y-0 transition-all duration-500 '
          : 'opacity-0 translate-y-10 pointer-events-none ',
      ]"
      @click="OnTop"
    >
      <font-awesome-icon
        icon="fa-solid fa-arrow-up"
        class="transition-transform duration-500"
        :class="buttonOnTop === 'show' ? 'rotate-0' : 'rotate-180'"
      />
    </button>

    <!-- Content -->
    <div class="max-w-7xl mx-auto px-6 py-12 grid gap-8 md:grid-cols-3">
      <!-- Brand -->
      <div
        class="justify-center items-center flex flex-col border-r border-gray-800 md:pr-6"
      >
        <img src="/img/logo.png" alt="MovieGuie Logo" class="mb-4 w-28 h-28" />
        <p class="text-sm text-gray-400 text-center md:text-left mb-4">
          ค้นพบรสนิยมการดูหนังที่คุณชื่่นชอบ
        </p>

        <button
          v-if="!isLoggedIn"
          @click="goToLogin"
          class="px-6 sm:px-8 py-2.5 sm:py-3 bg-[#90CB38] text-white text-shadow-4xl rounded-xl font-medium cursor-pointer hover:bg-[#6da11f]"
        >
          เข้าสู่ระบบ
        </button>
      </div>

      <!-- Links -->
      <div
        class="border-r border-gray-800 md:pr-6 justify-center flex flex-col"
      >
        <h3 class="text-white font-semibold mb-3">สำรวจ</h3>
        <ul class="space-y-2 text-sm">
          <li class="hover:text-white cursor-pointer">หน้าหลัก</li>
          <li class="hover:text-white cursor-pointer">หมวดหมู่</li>
          <li class="hover:text-white cursor-pointer">นักแสดง</li>
          <li class="hover:text-white cursor-pointer">สุ่มภาพยนตร์</li>
          <li class="hover:text-white cursor-pointer">รายการโปรด</li>
        </ul>
      </div>

      <!-- Credit -->
      <div class="text-sm text-gray-400 justify-center flex flex-col">
        <p>Powered by TMDB API</p>
        <p class="mt-2">Built with Nuxt 3</p>
        <p class="mt-4 text-xs">© 2026 MovieGuie</p>
      </div>
    </div>
  </footer>
</template>
<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const user = useState("user", () => null);

const { data, pending, error } = await useFetch("/api/profile", {
  credentials: "include",
  throw: false, // สำคัญมาก
});

//  logic เดียว
const isLoggedIn = computed(() => {
  if (pending.value) return false;
  if (error.value) return false;
  return true;
});
let lastScroll = 0;
const buttonOnTop = ref("hidden");

const handleScroll = () => {
  const currentScroll = window.scrollY;

  if (currentScroll <= 50) {
    buttonOnTop.value = "hidden";
    lastScroll = currentScroll;
    return;
  }

  if (currentScroll < lastScroll) {
    // กำลังเลื่อนขึ้น
    buttonOnTop.value = "show";
  } else {
    // กำลังเลื่อนลง
    buttonOnTop.value = "hidden";
  }

  lastScroll = currentScroll;
};
onMounted(() => {
  window.addEventListener("scroll", handleScroll);
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});

const OnTop = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};

const goToLogin = () => {
  router.push("/logInscreen");
};
</script>
