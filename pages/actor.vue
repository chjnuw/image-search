<template>
  <div class="bg-black mt-22">
    <div class="z-40 mx-[10%]">
      <Breadcrumb />
    </div>
    <div
      class="bg-[#0B0A0A] text-white h-full flex flex-wrap justify-center rounded-xl max-w-[80%] mx-auto mb-20 m-4"
    >
      <h2 class="font-bold text-4xl text-center mt-8">นักแสดง</h2>

      <section class="w-full p-4 justify-center mb-10">
        <div class="w-full flex justify-center mt-4">
          <div class="relative w-full max-w-md">
            <input
              v-model="keyword"
              type="text"
              placeholder="ค้นหานักแสดง..."
              class="w-full px-4 py-2 pr-10 rounded-full bg-black border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-[#A0E13E]"
            />

            <!-- ปุ่มล้าง -->
            <button
              v-if="keyword"
              @click="clearSearch"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white"
            >
              ✕
            </button>
          </div>
        </div>

        <div class="flex w-full justify-center">
          <div
            @click="emit('click')"
            v-if="loading || (actors.length && !loading)"
            class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 px-4 pt-6 w-full max-w-[1400px] mx-auto"
          >
            <template v-if="loading">
              <SkeletonActSkeletonActorCard v-for="n in 10" :key="'skeleton-' + n" />
            </template>
            <template v-else>
              <CardAct
                v-for="actor in actors"
                :key="actor.id"
                loading="lazy"
                @click="openActorPopup(actor)"
                :img="
                  actor.profile_path
                    ? 'https://image.tmdb.org/t/p/w300' + actor.profile_path
                    : 'img/no-profile.png'
                "
                :name="actor.name"
                :gender="actor.gender"
                :department="actor.department"
                class="border cursor-pointer"
              />
            </template>
          </div>
        </div>

        <div class="w-full flex justify-center mt-10">
          <button
            v-if="hasMore"
            @click="loadActors"
            :disabled="loading"
            class="px-6 py-2 rounded-full bg-[#A0E13E] text-black font-bold hover:bg-[#90CB38] transition disabled:opacity-50 cursor-pointer"
          >
            <span v-if="!loading">โหลดเพิ่ม</span>
            <span v-else>กำลังโหลด...</span>
          </button>
        </div>
      </section>
    </div>
    <PopupA v-if="showPopup" :actor="selectedActor" @close="closePopup" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { useTMDB } from "../composables/useTMDB";

const showPopup = ref(false);
const selectedActor = ref<any>(null);
const emit = defineEmits(["click"]);

const openActorPopup = (actor: any) => {
  selectedActor.value = actor;
  showPopup.value = true;
};

const closePopup = () => {
  showPopup.value = false;
  selectedActor.value = null;
};

const { getPopularActorsEN, searchActorsEN } = useTMDB();

const actors = ref<any[]>([]);
const page = ref(1);
const loading = ref(false);
const hasMore = ref(true);
const keyword = ref("");
const isSearching = ref(false);

const genderMap: Record<number, string> = {
  0: "ไม่ระบุ",
  1: "เพศหญิง",
  2: "เพศชาย",
  3: "Non-binary",
};

const mapActors = (results: any[]) =>
  results.map((actor) => ({
    id: actor.id,
    name: actor.name,
    profile_path: actor.profile_path,
    gender: genderMap[actor.gender] ?? "ไม่ระบุ",
    department: actor.known_for_department,
  }));

const loadActors = async () => {
  if (loading.value) return;
  loading.value = true;

  const res = isSearching.value
    ? await searchActorsEN(keyword.value, page.value)
    : await getPopularActorsEN(page.value);

  const results = res?.results ?? [];

  if (results.length === 0) {
    hasMore.value = false;
    loading.value = false;
    return;
  }

  actors.value.push(...mapActors(results));
  hasMore.value = res.page < res.total_pages;
  page.value++;
  loading.value = false;
};

const searchActors = async () => {
  loading.value = true;
  isSearching.value = true;
  page.value = 1;
  actors.value = [];

  const res = await searchActorsEN(keyword.value, page.value);

  actors.value = mapActors(res.results ?? []);
  hasMore.value = res.page < res.total_pages;
  page.value++;
  loading.value = false;
};

const resetActors = () => {
  isSearching.value = false;
  actors.value = [];
  page.value = 1;
  hasMore.value = true;
};

const debounceTimer = ref<number | null>(null);

watch(keyword, (val) => {
  if (debounceTimer.value) {
    clearTimeout(debounceTimer.value);
  }

  debounceTimer.value = window.setTimeout(async () => {
    actors.value = [];
    page.value = 1;
    hasMore.value = true;

    if (!val.trim()) {
      isSearching.value = false;
      await loadActors(); // popular
    } else {
      isSearching.value = true;
      await loadActors(); // search
    }
  }, 500);
});

const clearSearch = () => {
  keyword.value = "";
};

onMounted(loadActors);
</script>

<style></style>
