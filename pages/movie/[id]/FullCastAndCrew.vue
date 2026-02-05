<template>
  <div class="bg-black mt-22">
    <div class="z-40 mx-[10%]">
      <Breadcrumb />
    </div>
    <div
      class="bg-[#0B0A0A] text-white h-full flex flex-wrap justify-center rounded-xl max-w-[80%] mx-auto mb-20 m-4"
    >
      <div class="min-h-screen bg-[#0B0A0A] text-white px-6 py-8">
        <!-- ===== Header ===== -->
        <div class="flex items-center justify-between mb-6">
          <NuxtLink
            :to="`/movie/${movieId}`"
            class="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition"
          >
            ← กลับไปหน้าหนัง
          </NuxtLink>
        </div>
        <h1 class="text-2xl font-bold">นักแสดง & ทีมงานทั้งหมด</h1>

        <!-- ===== Highlight Crew ===== -->
        <div v-if="directors.length || writers.length" class="my-10">
          <h2 class="text-xl font-semibold mb-4">ทีมหลัก</h2>

          <div class="grid md:grid-cols-2 gap-6">
            <!-- Directors -->
            <div v-if="directors.length">
              <h3 class="font-bold mb-2">Director</h3>
              <ul class="space-y-1 text-white/80">
                <li v-for="d in directors" :key="d.id">
                  {{ d.name }}
                </li>
              </ul>
            </div>

            <!-- Writers -->
            <div v-if="writers.length">
              <h3 class="font-bold mb-2">Writer</h3>
              <ul class="space-y-1 text-white/80">
                <li v-for="w in writers" :key="w.id">
                  {{ w.name }}
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- ===== Cast ===== -->
        <section class="mb-12">
          <h2 class="text-xl font-bold mb-4">นักแสดง</h2>

          <div
            class="p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-4"
          >
            <ImgNameAct
              v-for="cast in castList"
              :key="cast.id"
              :img="tmdbImage(cast.profile_path, 'w185')"
              :name="cast.name"
              :character="cast.character"
              class="border"
              fallback="/img/no-profile.png"
               @click="openActorPopup(cast.id)"
            />
          </div>
        </section>

        <!-- ===== Crew ===== -->
        <section>
          <h2 class="text-xl font-bold mb-4">ทีมงาน</h2>

          <div
            v-for="group in crewGrouped"
            :key="group.department"
            class="mb-8"
          >
            <details class="group">
              <!-- Dropdown Header -->
              <summary
                class="cursor-pointer select-none px-4 py-3 bg-white/5 hover:bg-white/10 transition flex items-center justify-between"
              >
                <span class="font-semibold text-lg">
                  {{ group.department }}
                  <span class="text-white/50 text-sm">
                    ({{ group.items.length }})
                  </span>
                </span>

                <!-- Arrow -->
                <span
                  class="transition-transform duration-300 group-open:rotate-180"
                >
                  ▼
                </span>
              </summary>

              <!-- Content -->
              <div
                class="p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-4"
              >
                <ImgNameCrew
                  v-for="crew in group.items"
                  :key="crew.id"
                  :img="tmdbImage(crew.profile_path, 'w185')"
                  :name="crew.name"
                  :job="crew.job"
                  fallback="/img/no-profile.png"
                  class="border"
                  @click="openActorPopup(crew.id)"
                />
              </div>
            </details>
          </div>
        </section>
      </div>
    </div>
  </div>
<PopupA
  v-if="showActorPopup && selectedActorId"
  :actor-id="selectedActorId"
  @close="closeActorPopup"
/>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from "vue";
import { useRoute } from "vue-router";
import { useTMDB } from "../../../composables/useTMDB";
import { tmdbImage } from "../../../utils/tmdbImage";

const route = useRoute();
const movieId = Number(route.params.id);

const { getMovieCreditsEN } = useTMDB();

const castList = ref<any[]>([]);
const crewList = ref<any[]>([]);

onMounted(async () => {
  const res = await getMovieCreditsEN(movieId);
  castList.value = res.cast || [];
  crewList.value = res.crew || [];
});

/* ===== Highlight Crew ===== */
const directors = computed(() =>
  crewList.value.filter((c) => c.job === "Director"),
);

const writers = computed(() =>
  crewList.value.filter((c) =>
    ["Writer", "Screenplay", "Story"].includes(c.job),
  ),
);

/* ===== Group Crew ===== */
const crewGrouped = computed(() => {
  const map: Record<string, any[]> = {};

  crewList.value.forEach((c) => {
    if (!map[c.department]) map[c.department] = [];
    map[c.department].push(c);
  });

  return Object.entries(map).map(([department, items]) => ({
    department,
    items,
  }));
});

const selectedActorId = ref<number | null>(null);
const showActorPopup = ref(false);

const openActorPopup = (id: number) => {
  selectedActorId.value = id;
  showActorPopup.value = true;
};

const closeActorPopup = () => {
  showActorPopup.value = false;
  selectedActorId.value = null;
};

</script>
<style scoped>
@keyframes dropdown {
  from {
    opacity: 0;
    transform: translateY(-6px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-dropdown {
  animation: dropdown 0.25s ease-out;
}
</style>
