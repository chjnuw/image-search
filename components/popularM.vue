<template>
  <div class="px-2 sm:px-4 mx-auto max-w-[80%]">
    <div class="p-4 flex items-center gap-3">
      <h2 class="font-bold text-2xl whitespace-nowrap">POPULAR MOVIES</h2>
      <div class="flex-1 border-b-2"></div>
    </div>
    <div
      class="gap-4 py-6 px-4 snap-x snap-mandatory flex overflow-x-auto custom-scrollbar"
    >
      <div
        v-for="item in items"
        :key="item.id"
        class="hover:scale-110 transition-transform duration-300 cursor-pointer overflow-hidden w-auto h-64 snap-center"
      >
        <img :src="item.poster" class="max-w-full max-h-full object-contain border" />
      </div>
      <div class="flex justify-center items-center ml-4 w-32 flex-shrink-0">
        <button
          class="hover:bg-gray-600 p-4 rounded-full flex flex-col items-center text-green-500 cursor-pointer"
        >
          <h1 class="text-center text-sm sm:text-base">
            Sell All<br /><span
              ><FontAwesomeIcon  icon="fa-solid fa-arrow-right"
            /></span>
          </h1>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { mockdata } from "~/composables/mockdata";
const { items } = mockdata();

</script>

<style></style>
