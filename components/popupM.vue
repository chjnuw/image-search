<template>
  <transition
    name="popup-fade"
    appear
    enter-active-class="duration-300 ease-out"
    leave-active-class="duration-200 ease-in"
  >
    <div
      v-if="true"
      class="fixed inset-0 flex items-center justify-center z-50 min-h-screen bg-black/50 backdrop-blur-sm"
    >
      <div
        class="rounded-2xl w-[60%] h-[75%] overflow-y-auto grid grid-cols-4 custom-scrollbar"
      >
        <div
          class="col-span-1 bg-[#000000] p-4 text-white flex flex-col items-center justify-start"
        >
          <img
            src="/img/luca.png"
            alt="posterLuca"
            class="rounded-xl w-auto h-auto object-cover border-2"
          />
          <h1 class="p-4 w-full flex items-center justify-center">
            Luca (2021)
          </h1>

          <img src="/img/review.png" alt="" class="mt-3" />
          <h2 class="mt-6">Director</h2>
          <img
            src="/img/directorex..png"
            alt=""
            class="w-[130px] h-[130px] mt-3"
          />
          <h2 class="mt-3">Enrico Casarosa</h2>
          <button
            class="w-[100px] h-[35px] bg-[#90CB38] flex items-center justify-center gap-2 rounded-sm px-2 mt-3 mb-2 cursor-pointer hover:bg-[#ffffff]/65"
          >
            <img src="/img/iconPlay.png" alt="" class="w-[15px] h-5" />
            <span class="text-white">PLAY</span>
          </button>
        </div>

        <div class="bg-[#0B0A0A] text-white col-span-3 h-full flex flex-col">
          <div class="relative bg-[#0B0A0A] max-h-auto overflow-hidden">
            <img
              src="/img/image.png"
              alt=""
              class="w-full h-full object-cover"
            />
            <button
              class="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full hover:bg-black/70 cursor-pointer"
              @click="$emit('close')"
            >
              <font-awesome-icon
                icon="fa-solid fa-xmark"
                class="text-white cursor-pointer"
              />
            </button>
            <font-awesome-icon
              icon="fa-solid fa-play"
              class="text-4xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
            />
          </div>
          <div
            class="relative w-full h-auto justify-center items-center text-white overflow-hidden overflow-x-auto custom-scrollbar group"
          >
            <div class="flex h-full gap-2 p-3">
              <div
                v-for="item in items"
                :key="item.id"
                class="flex-shrink-0 w-64 h-32 relative bg-cover bg-top border-2"
                :style="{ backgroundImage: 'url(' + item.image + ')' }"
              ></div>
            </div>
          </div>
          <div class="w-full h-auto p-5">
            <p class="">
              Luca’s summer adventure follows a young sea monster who disguises
              himself as a human. He forms a strong friendship with Alberto, and
              together they try to keep their true identities a secret while
              living like human boys in a seaside village in Italy. Their goal
              is to win a prize to buy a Vespa scooter.
              <span
                class="ml-3 underline underline-offset-4 decoration-[#90CB38] text-[#90CB38] cursor-pointer hover:text-[#e2f6c3] hover:decoration-[#e2f6c3]"
              >
                see more</span
              >
            </p>
            <h2 class="mt-4">Actor :</h2>
            <div
              class="flex gap-3.5 overflow-x-auto custom-scrollbar p-4 snap-x snap-start"
            >
              <imgNameAct
                v-for="(actor, index) in visibleActors"
                :key="index"
                :img="actor.profile"
                :name="actor.name"
              />
              <div
                class="flex justify-center items-center ml-4 w-24 flex-shrink-0"
              >
                <button
                  class="hover:bg-gray-600 p-4 rounded-full flex flex-nowrap items-center text-green-500 cursor-pointer"
                >
                  <h1>
                    Sell All<br /><span
                      ><font-awesome-icon icon="fa-solid fa-arrow-right"
                    /></span>
                  </h1>
                </button>
              </div>
            </div>
            <div class="flex justify-center">
              <button
                class="w-[115px] h-[35px] bg-[#ffffff]/65 flex items-center justify-center gap-2 rounded-sm px-2 mt-3 mb- cursor-pointer hover:bg-[#90CB38]"
              >
                <font-awesome-icon
                  icon="fa-solid fa-heart"
                  class="w-[22px] h-[22px] inline-block mt-1.5"
                />
                <span class="text-white">Favorite</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>
<script setup>
import imgNameAct from "./imgNameAct.vue";
import { ref, onMounted, onUnmounted, computed, defineEmits } from "vue";

//จำกัดการแสดงนักแสดง
const visibleLimit = ref(10);
const visibleActors = computed(() => actors.slice(0, visibleLimit.value));
const actors = [
  { name: "Jacob Tremblay", profile: "/img/luca.png" },
  { name: "Jacob Tremblay", profile: "/img/luca.png" },
  { name: "Jacob Tremblay", profile: "/img/luca.png" },
  { name: "Jacob Tremblay", profile: "/img/luca.png" },
  { name: "Jacob Tremblay", profile: "/img/luca.png" },
  { name: "Jacob Tremblay", profile: "/img/luca.png" },
  { name: "Jacob Tremblay", profile: "/img/luca.png" },
  { name: "Jacob Tremblay", profile: "/img/luca.png" },
  { name: "Jacob Tremblay", profile: "/img/luca.png" },
  { name: "Jacob Tremblay", profile: "/img/luca.png" },
  { name: "Jacob Tremblay", profile: "/img/luca.png" },
];
const items = ref([
  {
    id: 1,
    title: "The Tunnel to Summer, the Exit of Goodbyes (2022)",
    tages: [
      { id: 1, name: "Adventure" },
      { id: 2, name: "Fantasy" },
      { id: 3, name: "Slice of Life" },
    ],
    ageRating: "13+",
    time: "1h 50m",
    description:
      "lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    image: "/img/image.png",
    textPosition: "left",
  },
  {
    id: 2,
    title: "The Tunnel to Summer, the Exit of Goodbyes (2022)",
    tages: [
      { id: 1, name: "Adventure" },
      { id: 2, name: "Fantasy" },
      { id: 3, name: "Slice of Life" },
    ],
    ageRating: "13+",
    time: "1h 50m",
    description:
      "lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    image: "/img/gb.png",
    textPosition: "left",
  },
  {
    id: 3,
    title: "CHANSAW MAN",
    tages: [
      { id: 1, name: "Adventure" },
      { id: 2, name: "Fantasy" },
      { id: 3, name: "Slice of Life" },
    ],
    ageRating: "13+",
    time: "1h 50m",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    image: "/img/chan.png",
    textPosition: "right",
  },
  {
    id: 4,
    title: "Friren: Beyond Journey's End",
    tages: [
      { id: 1, name: "Adventure" },
      { id: 2, name: "Fantasy" },
      { id: 3, name: "Slice of Life" },
    ],
    ageRating: "13+",
    time: "1h 50m",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    image: "/img/fri.png",
    textPosition: "left",
  },
]);
const emit = defineEmits(["close"]);
</script>
<style scoped>
.popup-fade-enter-from {
  opacity: 0;
}
.popup-fade-enter-to {
  opacity: 1;
}
.popup-fade-leave-from {
  opacity: 1;
}
.popup-fade-leave-to {
  opacity: 0;
}
</style>
