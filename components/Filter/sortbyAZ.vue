<template>
  <div class="relative flex items-center gap-2">
    <button
      class="px-4 py-2 bg-[#A0E13E] font-bold text-white text-shadow-lg/20 rounded-md hover:bg-[#90CB38] transition flex justify-between items-center cursor-pointer"
      @click="openFilterAZDrop = !openFilterAZDrop"
    >
      {{ sortLabel }}
      <Icon
        icon="weui:arrow-outlined"
        class="ml-1 w-4 h-4 text-white transition-transform duration-200"
        :class="{ 'rotate-90': openFilterAZDrop }"
      />
    </button>

    <div
      v-if="openFilterAZDrop"
      class="absolute top-full right-0 p-2 mt-2 bg-[#0B0A0A]/50 shadow-lg rounded-md z-50 flex flex-wrap animate-fade gap-3 text-md "
    >
      <button
        class="px-3 py-1 bg-red-600/80 text-white rounded hover:bg-red-600 text-left w-full cursor-pointer"
        @click="resetSort"
      >
        ล้าง
      </button>
      <button
        class="px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-600 text-left w-full cursor-pointer"
        @click="sortAZ"
      >
        ชื่อ ก → ฮ
      </button>
      <button
        class="px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-600 text-left w-full cursor-pointer"
        @click="sortZA"
      >
        ชื่อ ฮ → ก
      </button>
    </div>
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
