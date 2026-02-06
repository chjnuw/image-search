<template>
  <div class="">
    <section class="snap-start">
      <Slide />
    </section>

    <section class="my-20 max-w-[80%] mx-auto">

      <div class="snap-start mb-10" v-if="isLoggedIn">
        <h2 class="font-bold text-2xl md:text-3xl whitespace-nowrap b">
          แนะนำภาพยนตร์ตามรสนิยมของผู้ใช้งาน
        </h2>
        <div
          class="p-4 flex flex-col md:flex-row md:items-center gap-2 md:gap-3"
        >
          <h2 class="font-bold text-xl md:text-2xl whitespace-nowrap">
            แนะนำสำหรับคุณ
          </h2>
          <p class="text-gray-500 text-xs md:text-sm">
            จากแนวหนังที่คุณชื่นชอบ
          </p>
          <div class="hidden md:block flex-1 border-b-2"></div>
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
        <Recomment v-if="userTags.length" @open="openPopup" />
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

      <div v-if="isLoggedIn && userGender === 1" class="snap-start mb-10">
        <div class="p-4 flex items-center gap-3">
          <h2 class="font-bold text-2xl whitespace-nowrap">
            ภาพยนตร์ตามแนวรสนิยมของผู้ชาย ♂️
          </h2>
          <div class="hidden md:block flex-1 border-b-2"></div>
        </div>
        <GenderRecommend
          title="แนะนำสำหรับผู้ชาย"
          endpoint="/api/recommend/male"
          @open="openPopup"
        />
      </div>

      <div v-if="isLoggedIn && userGender === 2" class="snap-start mb-10">
        <div class="p-4 flex items-center gap-3">
          <h2 class="font-bold text-2xl whitespace-nowrap">
            ภาพยนตร์ตามแนวรสนิยมของผู้หญิง ♀️
          </h2>
          <div class="hidden md:block flex-1 border-b-2"></div>
        </div>
        <GenderRecommend
          title="แนะนำสำหรับผู้หญิง"
          endpoint="/api/recommend/female"
          @open="openPopup"
        />
      </div>

      <div v-if="isLoggedIn && userGender === 3" class="snap-start mb-10">
        <div class="p-4 flex items-center gap-3">
          <h2 class="font-bold text-2xl whitespace-nowrap">
            แนวภาพยนตร์ที่ผู้หญิงชื่นชอบ ⚥
          </h2>
          <div class="hidden md:block flex-1 border-b-2"></div>
        </div>
        <GenderRecommend
          title="แนะนำยอดนิยม"
          endpoint="/api/recommend/popular"
          @open="openPopup"
        />
      </div>

      <div class="snap-start mb-10">
        <div class="p-4 flex items-center gap-3">
          <h2 class="font-bold text-2xl whitespace-nowrap">หนังยอดนิยม</h2>
          <div class="flex-1 border-b-2"></div>
        </div>
        <PopularM @open="openPopup" />
      </div>
    </section>
  </div>
  <PopupM
    v-if="showPopup && selectedId !== null"
    :selectedId="selectedId"
    @close="showPopup = false"
  />
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
const userGender = ref<number | null>(null);
onMounted(async () => {
  try {
    const me = await $fetch("/api/me");
    isLoggedIn.value = true;
    userGender.value = me.gender;

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

const showPopup = ref(false);
const selectedId = ref<number | null>(null);

const openPopup = (id: number) => {
  selectedId.value = id;
  showPopup.value = true;
};

const emit = defineEmits<{
  (e: "open", id: number): void;
}>();

const moviesMale = ref([]);
const moviesFemale = ref([]);

onMounted(async () => {
  moviesMale.value = await $fetch("/api/recommend/male");
  moviesFemale.value = await $fetch("/api/recommend/female");
});

const tastePieRef = ref<any>(null);

const onFavoriteChanged = () => {
  tastePieRef.value?.refreshTaste();
};
</script>

<style></style>
