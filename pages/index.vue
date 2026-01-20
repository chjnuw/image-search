<template>
  <div class="">
    <section class="snap-start">
      <Slide />
    </section>

    <section class="my-20 max-w-[80%] mx-auto">
      <div class="snap-start mb-10">
        <PopularM class="" />
      </div>

      <div class="snap-start mb-10">
        <div class="p-4 flex items-center gap-3">
          <h2 class="font-bold text-2xl whitespace-nowrap">
            แนะนำสำหรับคุณ
          </h2>
          <p class="text-gray-500 text-sm">จากแนวหนังที่คุณชื่นชอบ</p>
          <div class="flex-1 border-b-2"></div>
        </div>
        <div v-if="userTags.length" class="flex gap-2 flex-wrap text-sm">
          <span
            v-for="tag in userTags"
            :key="tag.id"
            class="px-3 py-1 rounded-full bg-green-600/20 text-green-400"
          >
            # {{ tag.name }}
          </span>
        </div>
        <Recomment class="" />
      </div>
    </section>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from "vue";
import { $fetch } from "ofetch";

const userTags = ref<{ id: number; name: string }[]>([]);

onMounted(async () => {
  try {
    userTags.value = await $fetch("/api/user/tags");
  } catch {
    userTags.value = [];
  }
});
</script>

<style></style>
