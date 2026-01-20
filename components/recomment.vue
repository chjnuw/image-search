<template>

    <div class="px-2 sm:px-4 mx-auto">
      <div class="gap-2 py-4 px-2 flex overflow-x-auto custom-scrollbar">
        <div
          v-for="movie in movies"
          :key="movie.id"
          class="transition-transform duration-300 cursor-pointer"
        >
          <CardM
            CardM
            :movie="movie"
            class="aspect-[2/3] w-34 sm:w-40 object-cover rounded hover:scale-105 overflow-hidden flex-shrink-0"
          />
        </div>

        <!-- See all -->
        <div class="flex justify-center items-center ml-4 w-32 flex-shrink-0">
          <button
            class="hover:bg-gray-600 p-4 rounded-full flex flex-col items-center text-green-500"
          >
            <span class="text-center text-sm sm:text-base">
              See All<br />
              <FontAwesomeIcon icon="fa-solid fa-arrow-right" />
            </span>
          </button>
        </div>
      </div>
    </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from "vue";
import { $fetch } from "ofetch";

const movies = ref<any[]>([]);
const isLoadingDetail = ref(false);

const recommend = async () => {
  isLoadingDetail.value = true;
  try {
    const res = await $fetch<any[]>("/api/recommend/movies", {
      method: "POST",
    });

    movies.value = res || [];
  } catch (err) {
    console.error("Failed to load recommendations", err);
    movies.value = [];
    isLoadingDetail.value = false;
  }
};

onMounted(() => {
  recommend();
});
</script>
