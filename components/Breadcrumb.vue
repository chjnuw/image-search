<template>
  <nav class="text-gray-400 text-xs flex items-center gap-2 p-2">
    <NuxtLink class="hover:text-white" to="/">หน้าหลัก</NuxtLink>

    <template v-for="(c, i) in crumbs" :key="i">
      <span class="text-gray-500">></span>

      <NuxtLink
        v-if="i !== crumbs.length - 1"
        class="capitalize hover:text-white"
        :to="'/' + crumbs.slice(0, i + 1).join('/')"
      >
        {{ c.label }}
      </NuxtLink>

      <span v-else class="capitalize text-white font-bold">
        {{ c.label }}
      </span>
    </template>
  </nav>
</template>
<script setup lang="ts">
import { useRoute } from "vue-router";
import { computed } from "vue";

const route = useRoute();
const breadcrumbMap: Record<string, string> = {
  actor: "นักแสดง",
  catagory: "หมวดหมู่",
  favoritescreen: "รายการโปรด",
  login: "เข้าสู่ระบบ",
  profile: "โปรไฟล์",
};

const rawCrumbs = computed(() => route.path.split("/").filter(Boolean));

const crumbs = computed(() =>
  rawCrumbs.value.map((c) => ({
    key: c,
    label: breadcrumbMap[c] ?? c, // fallback ถ้าไม่เจอ
  }))
);
</script>
