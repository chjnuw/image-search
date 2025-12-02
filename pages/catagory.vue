<template>
  <div class="bg-black mt-22 flex flex-col">
    <div class="z-50 mx-[10%]">
      <Breadcrumb />
    </div>
    <!-- <section
      class="relative h-[80vh] w-full flex items-center justify-center overflow-hidden"
    >
      <img
        src="/public/img/fri.png"
        alt=""
        class="object-cover object-top w-full h-full mask-b-from-30% mask-b-to-85% mask-x-from-60% mask-x-to-90%"
      />
      <div class="absolute w-[60%] aspect[3/2] bg-black top-40  z-50">1</div>
    </section> รูปภาพข้างบน กำลังคิดรูปแบบ-->
    <section class="grid grid-cols-5 gap-4 p-4 mb-[10rem] max-w-[80%] mx-auto">
      <div
        class="bg-[#0B0A0A] text-white col-span-1 h-full flex flex-wrap items-start justify-center rounded-xl"
      >
        <div class="w-full p-4 justify-start">
          <h2 class="font-bold text-2xl mb-2 w-full text-start"></h2>

          <div class="relative inline-block text-left w-full p-2">
            <button
              class="px-4 py-2 bg-[#A0E13E] font-bold text-white text-shadow-lg/20 rounded-md hover:bg-[#90CB38] transition flex justify-between items-center w-full cursor-pointer"
              @click="FillterDrop"
            >
              {{ "Fillter" }}
              <Icon
                icon="weui:arrow-outlined"
                class="ml-1 w-4 h-4 text-white transition-transform duration-200"
                :class="{ 'rotate-90': openFillterDrop }"
              />
            </button>
            <div
              v-if="openFillterDrop"
              class="p-2 mt-2 bg-[#0B0A0A] shadow-lg rounded-md z-50 flex flex-wrap animate-fade"
            >
              <p class="font-bold text-xl mb-2 w-full text-start text-white">
                Type
                <span class="text-xs font-normal"
                  >({{ movieTags.length }})</span
                >
              </p>
              <Tages
                v-for="tag in movieTags"
                :key="tag.id"
                :name="tag.name"
                class="p-1 w-full"
              />
              <p class="font-bold text-xl mb-2 w-full text-start text-white">
                Genres
                <span class="text-xs font-normal"
                  >({{ movieTags.length }})</span
                >
              </p>
              <Tages
                v-for="tag in movieTags"
                :key="tag.id"
                :name="tag.name"
                class="p-1 w-full"
              />
            </div>
          </div>
          <div class="relative inline-block text-left w-full p-2">
            <button
              class="px-4 py-2 bg-[#A0E13E] font-bold text-white text-shadow-lg/20 rounded-md hover:bg-[#90CB38] transition flex justify-between items-center w-full cursor-pointer"
              @click="StreamimgDrop"
            >
              {{ "Streamimg" }}
              <Icon
                icon="weui:arrow-outlined"
                class="ml-1 w-4 h-4 text-white transition-transform duration-200"
                :class="{ 'rotate-90': openStreamimgDrop }"
              />
            </button>
            <div
              v-if="openStreamimgDrop"
              class="p-2 mt-2 bg-[#0B0A0A] shadow-lg rounded-md z-50 flex flex-wrap animate-fade"
            >
              <p class="font-bold text-xl mb-2 w-full text-start text-white">
                Tages
                <span class="text-xs font-normal"
                  >({{ movieTags.length }})</span
                >
              </p>
              <Tages
                v-for="tag in movieTags"
                :key="tag.id"
                :name="tag.name"
                class="p-1"
              />
            </div>
          </div>
        </div>
      </div>

      <div
        class="bg-[#0B0A0A] text-white col-span-4 h-full flex flex-wrap items-start justify-center rounded-xl"
      >
        <section class="w-full p-4 flex flex-wrap justify-start">
          <h2 class="font-bold text-2xl mb-2 w-full text-start">movies</h2>
          <div class="flex gap-4 p-4">
            <CardM />
          </div>
        </section>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from "vue";
const { movieTags } = mockdata();
const selected = ref(null);
const openFillterDrop = ref(true);
const openStreamimgDrop = ref(false);

const FillterDrop = () => (openFillterDrop.value = !openFillterDrop.value);
const StreamimgDrop = () =>
  (openStreamimgDrop.value = !openStreamimgDrop.value);

const selectItem = (item) => {
  selected.value = item.name;
  open.value = false;
};
</script>

<style>
@keyframes fade {
  from {
    opacity: 0;
    transform: translateY(-5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-fade {
  animation: fade 0.15s ease-in-out;
}
</style>
