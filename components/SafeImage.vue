<template>
  <img
    :src="currentSrc"
    :alt="alt"
    loading="lazy"
    decoding="async"
    @error="onError"
  />
</template>

<script setup lang="ts">
import { ref, watch } from "vue";

const props = defineProps<{
  src: string;
  alt?: string;
  fallback?: string;
}>();

const currentSrc = ref(props.src);

watch(
  () => props.src,
  (v) => (currentSrc.value = v),
);

const onError = () => {
  currentSrc.value = props.fallback || "/img/no-poster.png";
};
</script>