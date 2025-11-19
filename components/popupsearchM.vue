<template>
  <transition name="fade" duration="500">
    <div
      v-if="showPopup"
      class="fixed inset-0 flex items-center justify-center z-50 border-2 border-white"
    >
      <div
        class="bg-black rounded-lg p-6 w-[100%] h-[100%] mt-40  items-center"
      >
        <div class="grid grid-rows-[auto_1fr] grid-cols-3  p-4">
          <div class="col-span-3 border h-auto p-4 gap-2">
            <p class="text-white text-center font-bold">
              <span
                v-for="id in selected"
                :key="id"
                class="bg-green-500 text-white px-4 py-2 rounded-full font-bold "
              >
                {{ tags.find((t) => t.id === id).name }}
              </span>
            </p>
          </div>
          <div class="col-span-1 border p-4 flex flex-wrap  text-lg bg-[#000000]">
            <button
              v-for="item in tags"
              :key="item.id"
              class="inline-flex items-center bg-gray-800 hover:bg-green-500 text-white font-bold py-2 px-4 rounded-full cursor-pointer duration-300 w-auto"
              :class="
                selected.includes(item.id)
                  ? 'bg-green-500'
                  : 'bg-gray-800 hover:bg-green-500 text-white'
              "
              @click="toggleTag(item.id)"
            >
              {{ item.name
              }}<font-awesome-icon
                icon="fa-solid fa-xmark"
                class="text-sm pl-1"
                :class="
                  selected.includes(item.id)
                    ? 'opacity-100 duration-300'
                    : 'opacity-0 pointer-events-none duration-300'
                "
              />
            </button>
          </div>
          <div class="col-span-2 border bg-[#0B0A0A] overflow-y-auto">03</div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, computed } from "vue";

const tags = [
  { id: 1, name: "Action" },
  { id: 2, name: "Comedy" },
  { id: 3, name: "Romace" },
  { id: 4, name: "Drama" },
  { id: 5, name: "Horror" },
  { id: 6, name: "Sci-Fi" },
  { id: 7, name: "Fantasy" },
  { id: 8, name: "Thriller" },
  { id: 9, name: "Animation" },
  { id: 10, name: "Documentary" },
];
const movie = [
  {
    id: 1,
    title: "The Tunnel to Summer, the Exit of Goodbyes (2022)",
    description:
      "the Greek general Themistocles uniting the city-states to lead the naval charge against the invading Persian forces, commanded by the vengeful Artemisia under the god-king Xerxes.",
    image: "/img/gb.png",
    textPosition: "left",
  },
  {
    id: 2,
    title: "CHANSAW MAN",
    description:
      "the Greek general Themistocles uniting the city-states to lead the naval charge against the invading Persian forces, commanded by the vengeful Artemisia under the god-king Xerxes.",
    image: "/img/chan.png",
    textPosition: "right",
  },
  {
    id: 3,
    title: "Friren: Beyond Journey's End",
    description:
      "the Greek general Themistocles uniting the city-states to lead the naval charge against the invading Persian forces, commanded by the vengeful Artemisia under the god-king Xerxes.",
    image: "/img/fri.png",
    textPosition: "left",
  },
];

const selected = ref([]);

const toggleTag = (id) => {
  if (selected.value.includes(id)) {
    selected.value = selected.value.filter((t) => t !== id);
  } else {
    selected.value.push(id);
  }
};
</script>

<style></style>
