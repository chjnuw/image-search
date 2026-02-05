<template>
  <nav class="text-gray-400 text-xs flex items-center gap-2 p-2">
    <NuxtLink class="hover:text-white" to="/">หน้าหลัก</NuxtLink>

    <template v-for="(c, i) in crumbs" :key="i">
      <span class="text-gray-500">></span>

  <!-- clickable -->
  <NuxtLink
    v-if="c.link && i !== crumbs.length - 1"
    class="capitalize hover:text-white"
    :to="c.link"
  >
    {{ c.label }}
  </NuxtLink>

  <!-- non-clickable -->
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
const breadcrumbMap: Record<
  string,
  { label: string; link?: string | null }
> = {
  actor: { label: "นักแสดง", link: "/actor" },
  catagory: { label: "หมวดหมู่", link: "/catagory" },
  favoritescreen: { label: "รายการโปรด" },
  login: { label: "เข้าสู่ระบบ" },
  profile: { label: "โปรไฟล์" },
  seemore: { label: "ดูเพิ่มเติม" },
  search: { label: "ค้นหา" },

  movie: {
    label: "ภาพยนตร์",
    link: null, // 🚫 ไม่มีหน้า → ไม่ให้คลิก
  },

  tv: {
    label: "ทีวี",
    link: null,
  },

  FullCastAndCrew: {
    label: "นักแสดงและทีมงานทั้งหมด",
  },
};

const rawCrumbs = computed(() =>
  route.path
    .split("/")
    .filter(Boolean)
    // 🔥 ตัด path ที่เป็น id (ตัวเลขล้วน)
    .filter((c) => isNaN(Number(c))),
);

const crumbs = computed(() =>
  rawCrumbs.value.map((c) => {
    const map = breadcrumbMap[c];
    return {
      key: c,
      label: map?.label ?? c,
      link: map?.link,
    };
  })
);
</script>
