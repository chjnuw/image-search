<template>
<ClientOnly>
  <Navbar />
  <main
    class="overflow-auto bg-black text-white min-h-screen" >
    <slot />
  </main>

  <Footer />
  <GlobalLoading />
</ClientOnly>
</template>
<script setup lang="ts">
import { onMounted } from "vue";
import { useGenres } from "../composables/useGenres";
const { loadGenres } = useGenres();
onMounted(() => {
  loadGenres();
});
</script>
