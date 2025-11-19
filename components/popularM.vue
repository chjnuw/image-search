<template>
  <div class="p-8">
    <h1 class="font-bold text-2xl">POPULAR MOVIES</h1>
    <div class="gap-4 py-6 px-2 w-[95%] flex flex-nowrap overflow-x-auto custom-scrollbar justify-self-center">
      <div
        v-for="item in items"
        :key="item.id"
        class="hover:scale-110 transition-transform duration-300 cursor-pointer flex-shrink-0"
      >
        <img :src="item.image" class="w-46 h-72 object-cover" />
        <h2 class="text-lg font-bold">{{ item.title }}</h2>
        <p class="text-gray-400">{{ item.description }}</p>
      </div>
      <div class="flex justify-center items-center ml-4 w-32 flex-shrink-0">
        <button
          class="hover:bg-gray-600 p-4 rounded-full flex flex-nowrap items-center text-green-500 cursor-pointer"
        >
          <h1>
            Sell All<br><span
              ><font-awesome-icon icon="fa-solid fa-arrow-right"
            /></span>
          </h1>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
const items = [
  {
    id: 1,
    title: "ธรรมชาติภูเขา",
    description: "",
    image: "/img/luca.png",
  },
  {
    id: 2,
    title: "ธรรมชาติภูเขา",
    description: "",
    image: "/img/luca.png",
  },
  {
    id: 3,
    title: "ธรรมชาติภูเขา",
    description: "",
    image: "/img/luca.png",
  },
  {
    id: 4,
    title: "ธรรมชาติภูเขา",
    description: "",
    image: "/img/luca.png",
  },
  {
    id: 5,
    title: "ธรรมชาติภูเขา",
    description: "",
    image: "/img/luca.png",
  },
  {
    id: 6,
    title: "ธรรมชาติภูเขา",
    description: "",
    image: "/img/luca.png",
  },
  {
    id: 7,
    title: "ธรรมชาติภูเขา",
    description: "",
    image: "/img/luca.png",
  },
  {
    id: 8,
    title: "ธรรมชาติภูเขา",
    description: "",
    image: "/img/luca.png",
  },
  {
    id: 9,
    title: "ธรรมชาติภูเขา",
    description: "",
    image: "/img/luca.png",
  },
  {
    id: 10,
    title: "ธรรมชาติภูเขา",
    description: "",
    image: "/img/luca.png",
  },
];
</script>

<style>

</style>
