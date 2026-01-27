<template>
  <transition name="popup-fade" appear>
    <div v-if="actor" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      @click.self="$emit('close')">
      <div class="w-[60%] h-[75%] bg-[#0B0A0A] rounded-2xl grid grid-cols-4 overflow-hidden" @click.stop>
        <!-- ================= Sidebar ================= -->
        <div class="col-span-1 bg-black p-4 text-white flex flex-col items-center">
          <img :src="actor.profile_path
            ? 'https://image.tmdb.org/t/p/w500' + actor.profile_path
            : 'img/no-profile.png'" class="w-48 aspect-[2/3] object-cover rounded-xl border" />

          <h2 class="text-xl font-bold mt-4 text-center">
            {{ actor.name }}
          </h2>

          <div class="flex items-center mt-2 gap-3.5">
            <span class=" text-[#90CB38] cursor-pointer hover:text-[#699627]">
              <svg xmlns="http://www.w3.org/2000/svg" width="45" height="45" viewBox="0 0 16 16">
                <path fill="currentColor" fill-rule="evenodd"
                  d="M3.11 15c-.559 0-1.09-.222-1.49-.617s-.617-.931-.617-1.49v-9.79c0-.559.222-1.09.617-1.49S2.551.996 3.11.996h9.79c.559 0 1.09.222 1.49.617s.617.931.617 1.49v9.79c0 .559-.222 1.09-.617 1.49S13.459 15 12.9 15zm8.55-5.91h-1.48v4.89h2.72a1.084 1.084 0 0 0 1.087-1.087v-9.79A1.086 1.086 0 0 0 12.9 2.016H3.11a1.09 1.09 0 0 0-1.087 1.087v9.79A1.09 1.09 0 0 0 3.11 13.98h5.44V9.09H6.92V7.46h1.63v-.876c0-1.66.808-2.39 2.19-2.39c.647 0 .995.047 1.16.07l.01.001v1.56h-.94c-.474 0-.698.203-.766.612a2 2 0 0 0-.023.322v.697h1.71l-.233 1.63z"
                  clip-rule="evenodd" />
              </svg>
            </span>

            <span class=" text-[#90CB38] cursor-pointer hover:text-[#699627]">
              <svg xmlns="http://www.w3.org/2000/svg" width="43" height="43" viewBox="0 0 24 24">
                <g fill="currentColor">
                  <path fill-rule="evenodd" d="M12 7a5 5 0 1 0 0 10a5 5 0 0 0 0-10m-3 5a3 3 0 1 0 6 0a3 3 0 0 0-6 0"
                    clip-rule="evenodd" />
                  <path d="M18 5a1 1 0 1 0 0 2a1 1 0 0 0 0-2" />
                  <path fill-rule="evenodd"
                    d="M5 1a4 4 0 0 0-4 4v14a4 4 0 0 0 4 4h14a4 4 0 0 0 4-4V5a4 4 0 0 0-4-4zm14 2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2"
                    clip-rule="evenodd" />
                </g>
              </svg>
            </span>

            <span class="text-[#90CB38] cursor-pointer hover:text-[#699627] ">
              <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24">
                <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5">
                  <path d="M21 8v8a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5V8a5 5 0 0 1 5-5h8a5 5 0 0 1 5 5" />
                  <path d="M10 12a3 3 0 1 0 3 3V6c.333 1 1.6 3 4 3" />
                </g>
              </svg>
            </span>

          </div>

        </div>

        <!-- ================= Main ================= -->
        <div class="col-span-3 p-6 text-white  overflow-y-auto relative pl-15">
          <button class="absolute top-4 right-4 text-white/70 hover:text-white cursor-pointer" @click="$emit('close')">
            ✕
          </button>

          <h3 class="text-2xl font-bold mb-4">ชีวประวัติ</h3>

          <div class="space-y-3 text-m leading-relaxed">
            <p>
              Lorem ipsum dolor sit amet,consectetur adipisicing elit. Nemo earum ad quod illum eius? Alias unde iure
              placeat illo cupiditate aut expedita ,consectetur adipisicing elit. Nemo earum ad quod illum eius? Alias
              unde iure placeat illo cupiditate aut expedita consectetur adipisicing elit. Nemo earum ad quod illum
              eius? Alias unde iure placeat illo cupiditate aut expedita repellat deserunt, animi tempore iusto quod?
              Praesentium animi facilis maiores enim, doloribus fugit magni fuga explicabo repudiandae repellat eligendi
              corporis, quam, sit maxime cumque in nostrum temporibus voluptatem.
              <span class=" text-[#90CB38] underline cursor-pointer hover:text-[#699627]">เพิ่มเติม</span>
            </p>
          </div>
          <div class="mt-5">
            <h2 class="text-white font-bold text-xl mb-4">ผลงานโดดเด่น</h2>

            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              <div v-for="movie in knownForMovies" :key="movie.id"
                class="hover:scale-105 transition-transform duration-300 cursor-pointer">
                <img :src="movie.poster_path
                  ? 'https://image.tmdb.org/t/p/w500' + movie.poster_path
                  : fallback
                  " class="aspect-[2/3] object-cover w-full rounded" @click="openMovie(movie.id)" />
              </div>
            </div>
          </div>

          <hr class=" mt-15 border-white/85" />

          <!-- ===== ประวัติการทำงาน 1===== -->
          <div class="mt-8 w-full text-left">
            <h2 class="font-bold text-xl mb-3 text-white">
              ประวัติการทำงาน
            </h2>

            <div class="w-full overflow-hidden rounded-xl border border-white/10">

              <!-- แถวปี -->
              <div class="bg-[#1E1E1E] text-white px-4 py-3 font-bold text-left">
                ปีที่ฉาย 2011
              </div>

              <!-- รายการ -->
              <div class="bg-[#5B6B3F] text-white px-4 py-3 text-left">
                TV debut in Law &amp; Order (minor role)
              </div>

              <div class="bg-[#3A3A3A] text-white px-4 py-3 text-left">
                Supporting role in XYZ Series
              </div>

              <div class="bg-[#5B6B3F] text-white px-4 py-3 text-left">
                Lead role in ABC Movie
              </div>

            </div>
          </div>
          <!-- ===== ประวัติการทำงาน 2===== -->
          <div class="mt-8 w-full text-left">
            <div class="w-full overflow-hidden rounded-xl border border-white/10">

              <!-- แถวปี -->
              <div class="bg-[#1E1E1E] text-white px-4 py-3 font-bold text-left">
                ปีที่ฉาย 2015
              </div>

              <!-- รายการ -->
              <div class="bg-[#5B6B3F] text-white px-4 py-3 text-left">
                TV debut in Law &amp; Order (minor role)
              </div>

              <div class="bg-[#3A3A3A] text-white px-4 py-3 text-left">
                Supporting role in XYZ Series
              </div>

              <div class="bg-[#5B6B3F] text-white px-4 py-3 text-left">
                Lead role in ABC Movie
              </div>

            </div>
          </div>
          <!-- ===== ประวัติการทำงาน 3===== -->
          <div class="mt-8 w-full text-left">
            <div class="w-full overflow-hidden rounded-xl border border-white/10">

              <!-- แถวปี -->
              <div class="bg-[#1E1E1E] text-white px-4 py-3 font-bold text-left">
                ปีที่ฉาย 2018
              </div>

              <!-- รายการ -->
              <div class="bg-[#5B6B3F] text-white px-4 py-3 text-left">
                TV debut in Law &amp; Order (minor role)
              </div>

              <div class="bg-[#3A3A3A] text-white px-4 py-3 text-left">
                Supporting role in XYZ Series
              </div>

              <div class="bg-[#5B6B3F] text-white px-4 py-3 text-left">
                Lead role in ABC Movie
              </div>

            </div>
          </div>



        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import type { Movie } from "@/Type/tmdb";
import { useTMDB } from "@/composables/useTMDB";

const props = defineProps<{
  actor: {
    id: number | string
    name: string
    department: string
    gender: string
    profile_path?: string
  }
}>()

defineEmits(["close"])

const { getPopularMovies } = useTMDB();

const knownForMovies = ref<Movie[]>([]);
const fallback = "img/no-poster.png";

onMounted(async () => {
  console.log("mounted popupA"); // ← เช็ก
  const res = await getPopularMovies();
  console.log("movies:", res);   // ← เช็ก
  knownForMovies.value = res?.results?.slice(0, 10) ?? [];
});

const openMovie = (id: number) => {
  console.log("open movie:", id);
};
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
