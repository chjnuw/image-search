<template>
  <div class="">
    <section class="snap-start">
      <Slide />
    </section>

    <section class="my-20 max-w-[80%] mx-auto">
      <div class="snap-start mb-10" v-if="isLoggedIn">
        <div class="p-4 flex items-center gap-3">
          <h2 class="font-bold text-2xl whitespace-nowrap">แนะนำสำหรับคุณ</h2>
          <p class="text-gray-500 text-sm">จากแนวหนังที่คุณชื่นชอบ</p>
          <div class="flex-1 border-b-2"></div>
        </div>
        <div v-if="userTags.length" class="flex gap-2 flex-wrap text-sm">
          <span
            v-for="tag in userTags"
            :key="tag.id"
            class="px-3 py-1 rounded-full bg-green-600/20 text-green-400"
          >
            # {{ tag.name }}
          </span>
        </div>
        <Recomment v-if="userTags.length" />
        <div v-else class="justify-center items-center flex flex-col p-6 gap-4">
          <p class="text-sm text-gray-400 px-4">
            เข้าสู่ระบบเพื่อเลือกแนวหนังที่คุณชอบ
          </p>
          <button
            @click="goToLogin"
            class="px-8 py-3 bg-[#90CB38] text-white text-shadow-4xl rounded-xl font-medium cursor-pointer hover:bg-[#6da11f]"
          >
            เข้าสู่ระบบ
          </button>
        </div>
      </div>

      <div class="snap-start mb-10">
        <div class="p-4 flex items-center gap-3">
          <h2 class="font-bold text-2xl whitespace-nowrap">หนังยอดนิยม</h2>
          <div class="flex-1 border-b-2"></div>
        </div>
        <PopularM />
      </div>
    </section>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from "vue";
import { $fetch } from "ofetch";
import { computed } from "vue";
import { useRouter } from "vue-router";

const userTags = ref<{ id: number; name: string }[]>([]);

onMounted(async () => {
  try {
    userTags.value = await $fetch("/api/user/tags");
  } catch {
    userTags.value = [];
  }
});

const router = useRouter();
const isLoggedIn = ref(false);

onMounted(async () => {
  try {
    await $fetch("/api/me");
    isLoggedIn.value = true;

    // โหลด tag ต่อเมื่อ login แล้ว
    userTags.value = await $fetch("/api/user/tags");
  } catch {
    isLoggedIn.value = false;
    userTags.value = [];
  }
});
const goToLogin = () => {
  router.push("/logInscreen");
};
</script>

<style></style>
