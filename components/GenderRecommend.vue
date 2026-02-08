<template>
  <div class="px-2 sm:px-4 mx-auto">
    <div class="gap-2 py-4 px-2 flex overflow-x-auto custom-scrollbar">
      <div
        v-for="movie in movies"
        :key="movie.id"
        class="transition-transform duration-300 cursor-pointer"
        @click="$emit('open', movie.id)"
      >
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
import { ref, onMounted, computed, watch } from "vue";
import { $fetch } from "ofetch";

/* ---------------- props ---------------- */
const props = withDefaults(
  defineProps<{
    endpoint: string; // ⭐ API ที่จะเรียก
    size?: "xs" | "sm" | "md" | "lg";
  }>(),
  {
    size: "md",
  },
);

/* ---------------- emits ---------------- */
defineEmits<{
  (e: "open", id: number): void;
}>();

/* ---------------- state ---------------- */
const movies = ref<any[]>([]);
const loading = ref(false);

/* ---------------- logic ---------------- */
const loadMovies = async () => {
  loading.value = true;
  try {
    const res = await $fetch<any[]>(props.endpoint, {
      credentials: "include",
    });
    movies.value = res || [];
  } catch (err) {
    console.error("Failed to load movies:", err);
    movies.value = [];
  } finally {
    loading.value = false;
  }
};

/* ---------------- style ---------------- */
const cardClass = computed(() => {
  switch (props.size) {
    case "xs":
      return "w-24 sm:w-28";
    case "sm":
      return "w-28 sm:w-32";
    case "lg":
      return "w-44 sm:w-52";
    default:
      return "w-34 sm:w-40";
  }
});

async function fetchRecommend() {
  loading.value = true;
  try {
    const res = await $fetch<any[]>(props.endpoint, {
      credentials: "include",
    });
    movies.value = res ?? [];
  } catch (e) {
    console.error("recommend error", e);
    movies.value = [];
  } finally {
    loading.value = false;
  }
}

onMounted(fetchRecommend);
</script>
