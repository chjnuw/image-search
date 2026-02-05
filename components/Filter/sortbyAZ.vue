<template>
  <div class="relative inline-flex items-center">
    <!-- Trigger -->
    <button
      @click="openFilterAZDrop = !openFilterAZDrop"
      class="flex items-center gap-2 px-4 py-2 rounded-full
             bg-[#A0E13E] text-black font-semibold
             hover:bg-[#90CB38] active:scale-95
             transition-all duration-200 shadow-md cursor-pointer"
    >
      <span class="text-sm">{{ sortLabel }}</span>

      <Icon
        icon="weui:arrow-outlined"
        class="w-4 h-4 transition-transform duration-200"
        :class="{ 'rotate-90': openFilterAZDrop }"
      />
    </button>

    <!-- Dropdown -->
    <Transition
      enter-active-class="transition ease-out duration-150"
      enter-from-class="opacity-0 scale-95 -translate-y-1"
      enter-to-class="opacity-100 scale-100 translate-y-0"
      leave-active-class="transition ease-in duration-100"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-if="openFilterAZDrop"
        class="absolute right-0 top-full mt-2 w-44
               rounded-xl border border-white/10
               bg-[#0B0A0A]/80 backdrop-blur-md
               shadow-xl z-50 p-2 space-y-1"
      >
        <button
          @click="resetSort"
          class="w-full px-3 py-2 rounded-lg text-sm text-red-400
                 hover:bg-red-500/10 hover:text-red-300
                 transition cursor-pointer text-left"
        >
          ล้างการเรียง
        </button>

        <button
          @click="sortAZ"
          class="w-full px-3 py-2 rounded-lg text-sm text-white
                 hover:bg-white/10 transition cursor-pointer text-left"
        >
          ชื่อ ก → ฮ
        </button>

        <button
          @click="sortZA"
          class="w-full px-3 py-2 rounded-lg text-sm text-white
                 hover:bg-white/10 transition cursor-pointer text-left"
        >
          ชื่อ ฮ → ก
        </button>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, unref, Ref, ref, computed } from "vue";
type SortMode = "az" | "za" | null;

const sortMode = ref<SortMode>(null);
const originalItems = ref<any[] | null>(null);

const sortLabel = computed(() => {
  if (sortMode.value === "az") return "Title A → Z";
  if (sortMode.value === "za") return "Title Z → A";
  return "ค้นหาคำนำหน้า";
});

const props = defineProps<{
  items: any[] | Ref<any[]>; // array ของ object ที่จะ sort
  keyName: string; // property ของ object เช่น 'name' หรือ 'title'
}>();

const openFilterAZDrop = ref(false);

const emit = defineEmits<{
  (e: "update", sorted: any[]): void;
}>();

// Options สำหรับ localeCompare
const localeOptions: Intl.CollatorOptions = {
  sensitivity: "base", // ไม่สน case และ accent เล็กๆ
  numeric: true, // ให้เลขเรียงถูกต้อง เช่น "Movie 2" < "Movie 10"
};

const getItemsArray = () => {
  const arr = unref(props.items);
  return Array.isArray(arr) ? arr : [];
};

const locales = ["th", "en"]; // ไทยก่อน อังกฤษ

const resetSort = () => {
  if (originalItems.value) {
    emit("update", [...originalItems.value]);
  }
  sortMode.value = null;
  originalItems.value = null;
  openFilterAZDrop.value = false;
};

const sortAZ = () => {
  if (!originalItems.value) {
    originalItems.value = [...getItemsArray()];
  }

  const sorted = [...getItemsArray()].sort((a, b) =>
    String(a[props.keyName] ?? "").localeCompare(
      String(b[props.keyName] ?? ""),
      locales,
      localeOptions
    )
  );

  sortMode.value = "az";
  emit("update", sorted);
  openFilterAZDrop.value = false;
};

const sortZA = () => {
  if (!originalItems.value) {
    originalItems.value = [...getItemsArray()];
  }

  const sorted = [...getItemsArray()].sort((a, b) =>
    String(b[props.keyName] ?? "").localeCompare(
      String(a[props.keyName] ?? ""),
      locales,
      localeOptions
    )
  );

  sortMode.value = "za";
  emit("update", sorted);
  openFilterAZDrop.value = false;
};
</script>
