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
        class="rounded-2xl w-[65%] h-[80%] overflow-y-auto grid grid-cols-4 custom-scrollbar"
      >
        <div
          v-if="selectedItem"
          class="col-span-1 bg-[#000000] p-4 text-white flex flex-col items-center justify-start object-contain"
        >
          <img
            :src="selectedItem.poster"
            alt=""
            class="rounded-xl aspect-[2/3] w-64 border-2"
          />
          <h1
            v-if="selectedItem"
            class="p-2 w-full flex items-center justify-center text-lg font-bold text-center"
          >
            {{ selectedItem.title }}
          </h1>
          <p
            v-if="selectedItem"
            class="p-2 text-shadow-lg/40 drop-shadow-lg/100 text-sm flex items-center justify-center gap-2"
          >
            <span
              class="px-2 py-1 border border-white/40 bg-white/10 backdrop-blur-md rounded-md text-xs justify-center flex items-center font-bold"
            >
              {{ selectedItem.ageRating }}
            </span>

            <span class="">·</span>

            <span class="text-xs justify-center flex items-center">{{
              selectedItem.time
            }}</span>
          </p>
          <p class="flex flex-wrap gap-2 p-2 text-sm justify-center">
            <button
              v-for="tag in selectedItem.tages"
              :key="tag.id"
              class="p-2 bg-gray-800 rounded-full text-white cursor-pointer hover:text-black hover:bg-gray-600 transition-colors duration-200"
            >
              # {{ tag.name }}
            </button>
          </p>
          <img src="/img/review.png" alt="" class="p-4 self-start" />
          <div class="p-4 flex justify-center text-center flex-col gap-2">
            <div class="p-2">
              <p class="text-base font-bold">Status :</p>
              <p class="text-sm">Released</p>
            </div>
            <div class="p-2">
              <p class="text-base font-bold">Original Language :</p>
              <p class="text-sm">English</p>
            </div>
            <div class="p-2">
              <p class="text-base font-bold">Budget :</p>
              <p class="text-sm">150,000,000.00</p>
            </div>
            <div class="p-2">
              <p class="text-base font-bold">Revenue :</p>
              <p class="text-sm">-</p>
            </div>
          </div>

          <div
            class="w-34 aspect-[2/3] bg-white rounded-2xl flex flex-col mt-3"
          >
            <img
              src="/img/directorex..png"
              alt=""
              class="w-full h-full object-cover rounded-2xl"
            />
            <div class="h-auto w-full text-center text-black p-2 rounded-2xl">
              <h2 class="font-bold text-md">Director</h2>
              <p class="text-sm">Enrico Casarosa</p>
            </div>
          </div>
        </div>

        <div
          class="bg-[#0B0A0A] text-white col-span-3 h-full flex flex-col items-center justify-center"
        >
          <div
            class="relative bg-[#0B0A0A] w-full max-w-full mx-auto aspect-video overflow-hidden"
          >
            <img
              :src="currentImage"
              alt=""
              class="w-full h-full object-contain object-center transition-opacity duration-700"
            />
            <button
              class="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full hover:bg-black/70 cursor-pointer"
              @click="$emit('close')"
            >
              <FontAwesomeIcon
                icon="fa-solid fa-xmark"
                class="text-white cursor-pointer"
              />
            </button>
            <FontAwesomeIcon
              icon="fa-solid fa-play"
              class="text-4xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
            />
          </div>
          <div class="relative w-full h-auto text-white overflow-hidden">
            <div
              class="flex gap-2 p-3 snap-center px-2 overflow-x-auto custom-scrollbar"
            >
              <div
                v-for="img in filteredImages"
                :key="img"
                class="flex-shrink-0 w-auto h-20 bg-center bg-no-repeat overflow-hidden cursor-pointer"
                :class="{
                  'border-3': currentImage === img,
                  '': selectedItem.id !== img,
                }"
                @click="currentImage = img"
              >
                <img :src="img" class="max-w-full max-h-full object-contain" />
              </div>
            </div>
          </div>
          <div class="w-[95%] h-auto text-white ">
            <div class="p-2 flex w-full gap-3">
              <button
                class="w-[115px] h-[35px] bg-[#ffffff]/65 flex items-center justify-center gap-2 rounded-sm p-4 mt-3 cursor-pointer hover:bg-[#90CB38]"
              >
                <FontAwesomeIcon
                  icon="fa-solid fa-heart"
                  class="w-[24px] h-[24px] inline-block"
                />
                <span class="text-white">Favorite</span>
              </button>
              <button
                class="w-[115px] h-[35px] bg-[#90CB38] flex items-center justify-center gap-2 rounded-sm p-4 mt-3 mb-2 cursor-pointer hover:bg-[#ffffff]/65"
              >
                <Icon icon="mdi:play" class="w-6 h-6" />
                <span class="text-white">PLAY</span>
              </button>
            </div>
            <p class="mt-2 text-2xl font-bold">Overview</p>
            <p class="p-2">
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
            <div class="p-4 flex items-center gap-3">
              <h2 class="font-bold text-2xl leading-none whitespace-nowrap">
                Actor
              </h2>
              <div class="flex-1 border-b-2"></div>
            </div>

            <div class="flex gap-3.5 overflow-x-auto custom-scrollbar p-4">
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
                      ><FontAwesomeIcon icon="fa-solid fa-arrow-right"
                    /></span>
                  </h1>
                </button>
              </div>
            </div>
            <div class="p-4 flex items-center gap-3">
              <h2 class="font-bold text-2xl leading-none whitespace-nowrap">
                Crew
              </h2>
              <div class="flex-1 border-b-2"></div>
            </div>

            <div class="flex gap-3.5 overflow-x-auto custom-scrollbar p-4">
              <imgNameAct
                v-for="(actor, index) in visibleActors"
                :key="index"
                :img="actor.profile"
                :name="actor.name"
              />
              <div
                class="flex justify-center items-center ml-4 w-24 flex-shrink-0 p-2"
              >
                <button
                  class="hover:bg-gray-600 p-4 rounded-full flex flex-nowrap items-center text-green-500 cursor-pointer"
                >
                  <h1>
                    Sell All<br /><span
                      ><FontAwesomeIcon icon="fa-solid fa-arrow-right"
                    /></span>
                  </h1>
                </button>
              </div>
            </div>
            <div class="p-4 flex items-center gap-3">
              <h2 class="font-bold text-2xl leading-none whitespace-nowrap">
                Recommendations
              </h2>
              <div class="flex-1 border-b-2"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>
<script setup>
import { Icon } from "@iconify/vue";
import imgNameAct from "./imgNameAct.vue";
import { ref, onMounted, onUnmounted, computed } from "vue";
const props = defineProps({
  selectedId: [String, Number],
});

//จำกัดการแสดงนักแสดง
const visibleLimit = ref(10);
const visibleActors = computed(() => actors.slice(0, visibleLimit.value));
const actors = [
  { name: "Jacob Tremblay", profile: "/img/directorex..png" },
  { name: "Jacob Tremblay", profile: "/img/directorex..png" },
  { name: "Jacob Tremblay", profile: "/img/directorex..png" },
  { name: "Jacob Tremblay", profile: "/img/directorex..png" },
  { name: "Jacob Tremblay", profile: "/img/directorex..png" },
  { name: "Jacob Tremblay", profile: "/img/directorex..png" },
  { name: "Jacob Tremblay", profile: "/img/directorex..png" },
  { name: "Jacob Tremblay", profile: "/img/directorex..png" },
  { name: "Jacob Tremblay", profile: "/img/directorex..png" },
];

const emit = defineEmits(["close"]);
const { items } = mockdata();
const selectedItem = ref(
  items.value.find((i) => i.id == props.selectedId) || items.value[0]
);
const currentImage = ref(
  selectedItem.value.backdrop?.[0] || selectedItem.value.image
);

function selectImage(item) {
  currentImage.value = item.image;
}
const filteredImages = computed(() => {
  const found = items.value.find((i) => i.id === selectedItem.value.id);
  return found?.backdrop || [];
});
let interval = null;

onMounted(() => {
  interval = setInterval(() => {
    const index = filteredImages.value.indexOf(currentImage.value);
    currentImage.value =
      filteredImages.value[(index + 1) % filteredImages.value.length];
  }, 10000); // เปลี่ยนทุก 10 วิ
});

onUnmounted(() => clearInterval(interval));
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
img {
  transition: opacity 0.3s ease;
}
</style>
