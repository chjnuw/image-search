<template>
  <div class="bg-black mt-22">
    <div class="z-40 mx-[10%]">
      <Breadcrumb />
    </div>
    <div
      class="bg-[#0B0A0A] text-white h-full flex flex-wrap justify-center rounded-xl max-w-[80%] mx-auto mb-20 m-4"
    >
      <h2 class="font-bold text-4xl text-center mt-8">นักแสดง</h2>

      <section class="w-full p-4 justify-center mb-10">
        <div class="flex w-full justify-center ">
          <div 
          @click="emit('click')"
            v-if="actors.length"
            class="grid grid-cols-2  sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 px-4 pt-6 w-full max-w-[1400px] mx-auto"
          >
            <CardAct
              v-for="actor in actors"
              :key="actor.id"
              @click="openActorPopup(actor)"
              :img="
                actor.profile_path
                  ? 'https://image.tmdb.org/t/p/w500' + actor.profile_path
                  : 'img/no-profile.png'
              "
              :name="actor.name"
              :gender="actor.gender"
              :department="actor.department"
              class="border cursor-pointer"
            />
          </div>
        </div>

        <div class="w-full flex justify-center mt-10">
          <button
            v-if="hasMore"
            @click="loadActors"
            :disabled="loading"
            class="px-6 py-2 rounded-full bg-[#A0E13E] text-black font-bold hover:bg-[#90CB38] transition disabled:opacity-50 cursor-pointer"
          >
            <span v-if="!loading">โหลดเพิ่ม</span>
            <span v-else>กำลังโหลด...</span>
          </button>
        </div>
      </section>
    </div>
    <popupA
      v-if="showPopup"
      :actor="selectedActor"
      @close="closePopup"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useTMDB } from "../composables/useTMDB";
import popupA from "@/components/popupA.vue";

const showPopup = ref(false);
const selectedActor = ref<any>(null);
  const emit = defineEmits(['click'])


const openActorPopup = (actor: any) => {
  selectedActor.value = actor;
  showPopup.value = true;
};

const closePopup = () => {
  showPopup.value = false;
  selectedActor.value = null;
};

const { getPopularActorsEN } = useTMDB();

const actors = ref<any[]>([]);
const page = ref(1);
const loading = ref(false);
const hasMore = ref(true);

const loadActors = async () => {
  loading.value = true;

  const res = await getPopularActorsEN(page.value);
  if (!res?.results?.length) {
    hasMore.value = false;
    loading.value = false;
    return;
  }

  const genderMap: Record<number, string> = {
    0: "ไม่ระบุ",
    1: "เพศหญิง",
    2: "เพศชาย",
    3: "Non-binary",
  };

  actors.value.push(
    ...res.results.map((actor) => ({
      id: actor.id,
      name: actor.name,
      profile_path: actor.profile_path,
      gender: genderMap[actor.gender] ?? "ไม่ระบุ",
      department: actor.known_for_department,
    }))
  );

  page.value++;
  loading.value = false;
};

onMounted(loadActors);
</script>


<style></style>
