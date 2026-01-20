<template>
  <div>
    <p class="font-bold text-xl mb-2 text-white">
      บริการสตรีมมิ่ง
    </p>

    <div class="flex gap-2 flex-wrap p-2">
      <button
        v-for="prov in providers"
        :key="prov.provider_id"
        @click="toggle(prov.provider_id)"
        class="rounded-lg p-2 transition border cursor-pointer"
        :class="
          selected.includes(prov.provider_id)
            ? 'border-green-400 bg-white/10'
            : 'border-transparent opacity-60 hover:opacity-100'
        "
      >
        <img
          :src="`https://image.tmdb.org/t/p/w92${prov.logo_path}`"
          :alt="prov.provider_name"
          class="h-8 object-contain"
        />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useTMDB } from "../composables/useTMDB";
import type { WatchProvider } from "../Type/tmdb";

const emit = defineEmits<{
  (e: "update", value: number[]): void;
}>();

const { getWatchProviders } = useTMDB();

const providers = ref<WatchProvider[]>([]);
const selected = ref<number[]>([]);

onMounted(async () => {
  const res = await getWatchProviders("TH");
  providers.value = res?.results ?? [];
});

function toggle(id: number) {
  if (selected.value.includes(id)) {
    selected.value = selected.value.filter(p => p !== id);
  } else {
    selected.value.push(id);
  }
  emit("update", selected.value);
}
</script>
