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
        {{ c }}
      </NuxtLink>

      <span v-else class="capitalize text-white font-bold">
        {{ c }}
      </span>
    </template>
  </nav>
</template>
<script setup>
import { useRoute } from "vue-router";

const route = useRoute();
const crumbs = route.path.split("/").filter(Boolean);
</script>