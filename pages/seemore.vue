<template>
  <div class="bg-black mt-22">
    <div class="z-40 mx-[10%]">
      <Breadcrumb />
    </div>
    <div
      class="bg-[#0B0A0A] text-white h-full justify-center rounded-xl max-w-[80%] mx-auto mb-20 m-4 p-6"
    >
      <div v-if="isImageSearch && imagePreview" class="mb-4">
        <p class="text-sm text-gray-400 mb-2">ค้นหาด้วยรูป:</p>
        <img
          :src="imagePreview"
          class="h-32 rounded-lg border border-white/10"
        />
      </div>
      
      <h1 class="text-2xl font-bold mb-4">
        <span v-if="isImageSearch">ผลการค้นหาจากรูปภาพ</span>
        <span v-else>ผลการค้นหา: "{{ route.query.q }}"</span>
      </h1>

      <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
        <CardM v-for="m in movies" :key="m.id" :movie="m" @open="openPopup" />
      </div>

      <div class="flex justify-center mt-6">
        <button
          v-if="hasMore && !loading"
          @click="loadMore"
          class="px-6 py-3 bg-[#A0E13E] rounded-lg font-bold w-full"
        >
          ดูเพิ่มเติม
        </button>

        <p v-if="loading" class="text-center text-gray-400 mt-4">
          กำลังโหลด...
        </p>

        <p v-if="!hasMore" class="text-center text-gray-500 mt-4">
          ไม่มีผลลัพธ์เพิ่มเติมแล้ว
        </p>
      </div>
    </div>
  </div>
  <ClientOnly>
    <PopupM
      v-if="showPopup"
      :selectedId="selectedId"
      @close="showPopup = false"
    />
  </ClientOnly>
</template>
<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useTMDB } from "../composables/useTMDB";
import { useSearchState } from "../composables/useSearchState";

const { imageResults, isImageSearch, imagePreview } = useSearchState();

const route = useRoute();
const { searchMovies } = useTMDB();

const movies = ref<any[]>([]);
const page = ref(1);
const loading = ref(false);
const hasMore = ref(true);
const showPopup = ref(false);
const selectedId = ref<number | null>(null);

function openPopup(id: number) {
  console.log("OPEN POPUP:", id);
  selectedId.value = id;
  showPopup.value = true;
}

watch(showPopup, (val) => {
  document.body.style.overflow = val ? "hidden" : "";
});

// ✅ โหลดข้อมูลหลัก
async function load() {
  // 🔴 ถ้าเป็น image search
  if (isImageSearch.value) {
    movies.value = imageResults.value;
    hasMore.value = false;
    return;
  }

  // 🟢 text search ปกติ
  if (!route.query.q) return;
  if (loading.value || !hasMore.value) return;

  loading.value = true;

  try {
    const res = await searchMovies(route.query.q as string, page.value);

    if (!res?.results?.length) {
      hasMore.value = false;
      return;
    }

    const existingIds = new Set(movies.value.map((m) => m.id));
    const newOnes = res.results.filter((m) => !existingIds.has(m.id));

    movies.value.push(...newOnes);

    if (page.value >= res.total_pages) {
      hasMore.value = false;
    }
  } finally {
    loading.value = false;
  }
}

// ✅ ปุ่มโหลดเพิ่ม
async function loadMore() {
  if (loading.value || !hasMore.value) return;
  page.value++;
  await load();
}

// ✅ เมื่อเปลี่ยนคำค้น
watch(
  () => route.query.q,
  async (q) => {
    if (!q) return;
    movies.value = [];
    page.value = 1;
    hasMore.value = true;
    await load();
  },
  { immediate: true },
);

onMounted(async () => {
  if (route.query.q) {
    await load();
  }
});
</script>
