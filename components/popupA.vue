<template>
  <transition name="popup-fade" appear>
    <div
      v-if="actorDetail"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
    >
      <button
        class="fixed top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full cursor-pointer text-white/70 hover:text-white transition duration-200"
        @click="$emit('close')"
      >
        <FontAwesomeIcon icon="fa-solid fa-xmark" />
      </button>
      <SkeletonpopActorPopupSkeleton v-if="loading" />
      <template v-else>
        <div
          class="w-[65%] h-[80%] bg-[#0B0A0A] rounded-2xl grid grid-cols-4 overflow-y-auto custom-scrollbar"
        >
          <!-- ================= Sidebar ================= -->

          <div class="col-span-1 bg-black p-4 text-white flex flex-col">
            <img
              :src="
                actorDetail.profile_path
                  ? 'https://image.tmdb.org/t/p/w300' + actorDetail.profile_path
                  : 'img/no-profile.png'
              "
              class="w-48 aspect-[2/3] object-cover rounded-xl border"
            />

            <h2 class="text-xl font-bold mt-4 text-center">
              {{ actorDetail?.name || actor.name }}
            </h2>

            <div class="flex items-center mt-2 gap-3 px-4 justify-center">
              <a
                v-if="social?.facebook_id"
                :href="`https://www.facebook.com/${social.facebook_id}`"
                target="_blank"
                class="text-[#90CB38] hover:text-[#699627]"
              >
                <FontAwesomeIcon
                  icon="fa-brands fa-facebook"
                  class="text-2xl"
                />
              </a>

              <a
                v-if="social?.instagram_id"
                :href="`https://www.instagram.com/${social.instagram_id}`"
                target="_blank"
                class="text-[#90CB38] hover:text-[#699627]"
              >
                <FontAwesomeIcon
                  icon="fa-brands fa-instagram"
                  class="text-2xl"
                />
              </a>

              <a
                v-if="social?.twitter_id"
                :href="`https://twitter.com/${social.twitter_id}`"
                target="_blank"
                class="text-[#90CB38] hover:text-[#699627]"
              >
                <FontAwesomeIcon
                  icon="fa-brands fa-x-twitter"
                  class="text-2xl"
                />
              </a>

              <a
                v-if="social?.imdb_id"
                :href="`https://www.imdb.com/name/${social.imdb_id}`"
                target="_blank"
                class="text-[#90CB38] hover:text-[#699627]"
              >
                <FontAwesomeIcon icon="fa-brands fa-imdb" class="text-2xl" />
              </a>
            </div>

            <div class="mt-3 px-2">
              <h1 class="text-lg font-semibold">ประวัติ</h1>

              <div class="mt-3 text-sm text-white/70 space-y-3 px-2">
                <!-- วันเกิด / อายุ -->
                <div>
                  <h2 class="font-bold text-white">วันเกิด</h2>
                  <p>
                    {{ actorDetail?.birthday || "-" }}
                    <span v-if="actorDetail?.birthday">
                      (อายุ {{ getAge(actorDetail.birthday) }} ปี)
                    </span>
                  </p>
                </div>

                <!-- สถานที่เกิด -->
                <div>
                  <h2 class="font-bold text-white">สถานที่เกิด</h2>
                  <p>{{ actorDetail?.place_of_birth || "-" }}</p>
                </div>

                <!-- อาชีพ -->
                <div>
                  <h2 class="font-bold text-white">อาชีพ</h2>
                  <p>{{ actorDetail?.known_for_department || "-" }}</p>
                </div>

                <!-- เพศ -->
                <div>
                  <h2 class="font-bold text-white">เพศ</h2>
                  <p>{{ genderText(actorDetail?.gender) }}</p>
                </div>

                <!-- ชื่ออื่น -->
                <div v-if="actorDetail?.also_known_as?.length">
                  <h2 class="font-bold text-white">ชื่ออื่น</h2>
                  <p class="text-white/60">
                    {{ actorDetail.also_known_as.join(", ") }}
                  </p>
                </div>

                <!-- เว็บไซต์ -->
                <div v-if="actorDetail?.homepage">
                  <h2 class="font-bold text-white">เว็บไซต์ทางการ</h2>
                  <a
                    :href="actorDetail.homepage"
                    target="_blank"
                    class="text-[#A0E13E] hover:underline break-all"
                  >
                    {{ actorDetail.homepage }}
                  </a>
                </div>
              </div>
            </div>
          </div>

          <!-- ================= Main ================= -->
          <div class="col-span-3 p-6 text-white relative custom-scrollbar">
            <h3 class="text-2xl font-bold mb-4">ชีวประวัติ</h3>

            <div class="space-y-3 text-m leading-relaxed indent-8">
              <p v-if="actorDetail?.biography">
                {{ actorDetail.biography }}
              </p>

              <p v-else class="text-white/60">ไม่มีข้อมูลชีวประวัติ</p>
            </div>
            <div class="mt-5">
              <h2 class="text-white font-bold text-xl mb-4">ผลงานโดดเด่น</h2>

              <div
                class="flex gap-2 overflow-x-auto custom-scrollbar px-4 py-2 mx-2"
              >
                <CardM
                  v-for="movie in knownForMovies"
                  :key="movie.id"
                  :movie="movie"
                  loading="lazy"
                  class="w-28 flex-shrink-0"
                  @click="openPopup(movie.id)"
                />
              </div>
            </div>

            <hr class="mt-15 border-white/85" />

            <!-- ===== ประวัติการทำงาน 1===== -->
            <div class="mt-8 w-full text-left">
              <div class="flex items-center justify-between">
                <h2 class="font-bold text-xl mb-3 text-white">
                  ประวัติการทำงาน
                </h2>
                <div class="relative w-64 mb-4 transition-all duration-300">
                  <select
                    v-model="currentFilter"
                    class="w-full bg-[#1E1E1E] text-white px-4 py-2 rounded-xl border border-white/10 transition-all duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-[#90CB38] focus:border-[#90CB38] hover:border-white/30"
                  >
                    <option value="movie">ภาพยนตร์</option>
                    <option value="tv">ซีรีส์</option>
                    <option value="guest">รายการทีวี / Guest</option>
                    <option value="crew-movie">เบื้องหลังภาพยนตร์</option>
                    <option value="crew-tv">เบื้องหลังซีรีส์</option>
                  </select>
                </div>
              </div>
              <div
                v-if="groupedCredits.length === 0"
                class="text-center py-10 text-white/70"
              >
                ไม่มีข้อมูล
              </div>
              <div
                v-for="group in groupedCredits"
                :key="group.year"
                class="mt-8 w-full"
              >
                <div class="rounded-xl overflow-hidden border border-white/10">
                  <!-- ปี -->
                  <div class="bg-[#1E1E1E] px-4 py-3 font-bold text-white">
                    ปีที่ฉาย {{ group.year }}
                  </div>

                  <!-- รายการ -->
                  <div
                    v-for="(item, index) in group.items"
                    :key="item.credit_id"
                    :class="index % 2 ? 'bg-[#3A3A3A]' : 'bg-[#5B6B3F]'"
                    class="flex items-start gap-4 px-4 py-3 text-white"
                    @click="openPopup(item.id)"
                  >
                    <!-- Poster -->
                    <SafeImage
                      :src="tmdbImage(item.poster_path, 'w342')"
                      :alt="item.title"
                      class=" w-12 aspect-[2/3] rounded-md object-cover flex-shrink-0"
                    />

                    <!-- Info -->
                    <div
                      class="flex flex-col cursor-pointer"
                      @mouseenter="onHover(item, $event)"
                      @mouseleave="onLeave"
                    >
                      <span class="font-semibold leading-tight">
                        {{ item.title || item.name }}
                      </span>

                      <!-- TV Episode -->
                      <span
                        v-if="item.media_type === 'tv' && item.episode_count"
                        class="text-xs mt-1 px-2 py-0.5 rounded bg-white/20 w-fit"
                      >
                        {{ item.episode_count }} ตอน
                      </span>

                      <span class="text-sm text-white/70 mt-1">
                        As {{ item.character || item.job }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
      <MovieHover
        v-if="hoverMovie"
        :show="isHover"
        :movie="hoverMovie"
        :style="popupStyle"
        :loading="false"
        :title="getDisplayTitle(hoverMovie)"
        :year="
          hoverMovie.release_date?.slice(0, 4) ||
          hoverMovie.first_air_date?.slice(0, 4)
        "
        :genreMap="genreMap"
      />
      <PopupM
        v-if="showPopup"
        :selectedId="selectedId"
        @close="showPopup = false"
      />
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from "vue";
import type { Movie } from "../Type/tmdb";
import { useTMDB } from "../composables/useTMDB";

const props = defineProps<{
  actorId?: number;
  actor?: {
    id: number;
    name: string;
    profile_path?: string;
    gender?: string | number;
    department?: string;
  };
}>();

type CreditFilter = "movie" | "tv" | "guest" | "crew-movie" | "crew-tv";

const currentFilter = ref<CreditFilter>("movie");
const filterItem = (item: any) => {
  switch (currentFilter.value) {
    case "movie":
      return item.media_type === "movie" && item.character;
    case "tv":
      return (
        item.media_type === "tv" && item.character && item.episode_count > 1
      );
    case "guest":
      return item.media_type === "tv" && item.episode_count === 1;
    case "crew-movie":
      return item.media_type === "movie" && item.job;
    case "crew-tv":
      return item.media_type === "tv" && item.job;
    default:
      return true;
  }
};

defineEmits(["close"]);
const actorDetail = ref<any>(null);
const knownForMovies = ref<Movie[]>([]);
const {
  getPopularMovies,
  getActorMovieCredits,
  getPersonDetails,
  getPersonCredits,
  getPersonExternalIds,
  getTvAggregateCredits,
} = useTMDB();

const fallback = "img/no-poster.png";

const loading = ref(true);

onMounted(async () => {
  const id = props.actor?.id || props.actorId;
  if (!id) return;

  loading.value = true;

  try {
    const [detail, credits, fullCredits, external] = await Promise.all([
      getPersonDetails(Number(id)),
      getActorMovieCredits(Number(id)),
      getPersonCredits(Number(id)),
      getPersonExternalIds(Number(id)),
    ]);

    actorDetail.value = detail;
    social.value = external;
    rawCredits.value = fullCredits;

    knownForMovies.value =
      credits?.cast
        ?.filter((m) => m.poster_path)
        .sort((a, b) => b.popularity - a.popularity)
        .slice(0, 10) ?? [];

    rebuildCredits();
  } finally {
    loading.value = false;
  }
});

const openMovie = (id: number) => {
  console.log("open movie:", id);
};
const showPopup = ref(false);
const selectedId = ref<number | null>(null);

function openPopup(id) {
  selectedId.value = id;
  showPopup.value = true;
}

const groupedCredits = ref<
  {
    year: string;
    items: any[];
  }[]
>([]);

function getYear(item: any) {
  return (
    item.release_date?.slice(0, 4) ||
    item.first_air_date?.slice(0, 4) ||
    "ไม่ทราบปี"
  );
}

function isGuest(item: any) {
  return (
    item.character === "Self" ||
    ["Host", "Guest", "Presenter"].includes(item.job)
  );
}

const rawCredits = ref<any | null>(null);

onMounted(async () => {
  if (!props.actor?.id) return;
  rawCredits.value = await getPersonCredits(Number(props.actor.id));
  rebuildCredits();
});

function rebuildCredits() {
  if (!rawCredits.value) return;

  const res = rawCredits.value;
  let list: any[] = [];

  if (currentFilter.value === "movie") {
    list = res.cast?.filter(
      (i: any) => i.media_type === "movie" && !isGuest(i),
    );
  }

  if (currentFilter.value === "tv") {
    list = res.cast?.filter((i: any) => i.media_type === "tv" && !isGuest(i));
  }

  if (currentFilter.value === "guest") {
    list = res.cast?.filter((i: any) => isGuest(i));
  }

  if (currentFilter.value === "crew-movie") {
    list = res.crew?.filter((i: any) => i.media_type === "movie");
  }

  if (currentFilter.value === "crew-tv") {
    list = res.crew?.filter((i: any) => i.media_type === "tv");
  }

  const map: Record<string, any[]> = {};

  list.forEach((item) => {
    const year = getYear(item);
    if (!map[year]) map[year] = [];
    map[year].push(item);
  });

  groupedCredits.value = Object.entries(map)
    .sort(([a], [b]) => {
      if (a === "ไม่ทราบปี") return 1;
      if (b === "ไม่ทราบปี") return -1;
      return Number(b) - Number(a);
    })
    .map(([year, items]) => ({
      year,
      items: items.sort((a, b) => {
        const da = a.release_date || a.first_air_date || "";
        const db = b.release_date || b.first_air_date || "";
        return db.localeCompare(da);
      }),
    }));
}

const isHover = ref(false);
const hoverMovie = ref<any>(null);

const popupStyle = ref<Record<string, string>>({});

function onHover(item: any, e: MouseEvent) {
  hoverMovie.value = item;
  isHover.value = true;

  popupStyle.value = {
    top: e.clientY + 15 + "px",
    left: e.clientX + 15 + "px",
  };
}

function onLeave() {
  isHover.value = false;
  hoverMovie.value = null;
}

const social = ref<any>(null);

const getAge = (birthday: string) => {
  const birth = new Date(birthday);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
};

const genderText = (gender?: number) => {
  switch (gender) {
    case 1:
      return "หญิง";
    case 2:
      return "ชาย";
    case 3:
      return "ไม่ระบุเพศ";
    default:
      return "-";
  }
};

function getDisplayTitle(item: any) {
  const main =
    item.original_title || item.original_name || item.title || item.name;

  const th = item.title || item.name;

  return {
    main,
    sub: th && main && th !== main ? th : null,
  };
}

const episodesPlayed = ref<any[]>([]);

async function loadEpisodes(tvId: number) {
  const res = await getTvAggregateCredits(tvId);
  const role = res.cast?.find((c: any) => c.person_id === props.actor.id);

  episodesPlayed.value =
    role?.roles?.flatMap((r: any) => r.episode_count) ?? [];
}

onMounted(async () => {
  if (!props.actor?.id) return;

  social.value = await getPersonExternalIds(Number(props.actor.id));
});

import {
  lockBodyScroll,
  unlockBodyScroll,
} from "../composables/useBodyScrollLock";

onMounted(() => {
  lockBodyScroll();
});

onUnmounted(() => {
  unlockBodyScroll();
});
console.log(actorDetail);
watch(currentFilter, rebuildCredits);
</script>

<style scoped>
.popup-fade-enter-from,
.popup-fade-leave-to {
  opacity: 0;
}

.popup-fade-enter-to,
.popup-fade-leave-from {
  opacity: 1;
}

.popup-fade-enter-active,
.popup-fade-leave-active {
  transition: opacity 0.25s ease;
}
</style>
