<template>
  <div
    v-for="item in items"
    :key="item.id"
    class="hover:scale-110 transition-transform duration-300 cursor-pointer"
  >
    <img :src="item.poster" class="aspect[2/3] h-64 object-contain" />
  </div>
</template>

<script setup>
import { mockdata } from "~/composables/mockdata";
const { items } = mockdata();
</script>

<style></style>
