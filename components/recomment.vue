<template>
  <div class="px-2 sm:px-4 mx-auto">
    <div class="gap-2 py-4 px-2 flex overflow-x-auto custom-scrollbar">
      <div
        v-for="movie in movies"
        :key="movie.id"
        class="transition-transform duration-300 cursor-pointer"
      >
        <CardM
          :movie="movie"
          :class="[
            'aspect-[2/3] object-cover rounded hover:scale-105 overflow-hidden flex-shrink-0 transition-transform',
            cardClass,
          ]"
        />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { $fetch } from "ofetch";

const props = withDefaults(
  defineProps<{
    size?: "xs" | "sm" | "md" | "lg";
  }>(),
  {
    size: "md",
  },
);

const movies = ref<any[]>([]);
const isLoadingDetail = ref(false);

console.log("recommend called");

const recommend = async () => {
  isLoadingDetail.value = true;
  try {
    const res = await $fetch<any[]>("/api/recommend/movies", {
      method: "POST",
      credentials: "include",
    });
    
console.log("recommend res:", res);
    movies.value = res || [];
  } catch (err) {
    console.error("Failed to load recommendations", err);
    movies.value = [];
    isLoadingDetail.value = false;
  }
};

const cardClass = computed(() => {
  switch (props.size) {
    case "xs":
      return "w-24 sm:w-28";
    case "sm":
      return "w-28 sm:w-32";
    case "lg":
      return "w-44 sm:w-52";
    default: // md
      return "w-34 sm:w-40";
  }
});

onMounted(() => {
  recommend();
});
</script>
