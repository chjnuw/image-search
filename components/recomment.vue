<template>
  <div class="px-2 sm:px-4 mx-auto">
    <div class="gap-2 py-4 px-2 flex overflow-x-auto custom-scrollbar">
      <div
        v-for="(movie, index) in movies"
        :key="movie.id"
        class="relative transition-transform duration-300 cursor-pointer"
        @click="$emit('open', movie.id)"
      >
        <!-- Bar -->
        <div
          class="absolute -left-1 -bottom-2 text-[72px] leading-none font-extrabold text-white/10 select-none pointer-events-none"
        >
          {{ index + 1 }}
        </div>

        <CardM
          :movie="movie"
          :class="[
            'relative z-10 aspect-[2/3] rounded-xl overflow-hidden flex-shrink-0',
            'transition-all duration-300',
            'shadow-md hover:shadow-2xl hover:-translate-y-1',
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
    const res = await $fetch<any>("/api/recommend/movies", {
      method: "POST",
      credentials: "include",
    });

    console.log("recommend res:", res);

    movies.value = Array.isArray(res) ? res : (res.movies ?? res.results ?? []);
  } catch (err) {
    console.error("Failed to load recommendations", err);
    movies.value = [];
  } finally {
    isLoadingDetail.value = false;
  }
};

defineEmits<{
  (e: "open", id: number): void;
}>();

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
