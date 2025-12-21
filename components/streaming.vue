<template>
  <div class="">
    <p class="font-bold text-xl mb-2 w-full text-start text-white">Streaming Platforms</p>
    <div class="flex gap-3 flex-wrap p-3">
      <img
        v-for="prov in providers"
        :key="prov.provider_id"
        :src="`https://image.tmdb.org/t/p/w92${prov.logo_path}`"
        class="w-11 h-11 rounded-md bg-white object-contain hover:scale-110 cursor-pointer"
        :alt="prov.provider_name"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useTMDB } from "../composables/useTMDB";

interface ProviderResponse {
  results?: Array<{
    provider_id: number;
    logo_path: string;
    provider_name: string;
  }>;
}

const providers = ref([]);

const { getMovieProviders } = useTMDB();

onMounted(async () => {
  const res = (await getMovieProviders()) as ProviderResponse;

  // ถ้าไม่มี results ให้เป็น [] เพื่อกัน error
  providers.value = res?.results ?? [];
});
</script>
