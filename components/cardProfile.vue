<template>
  <div
    class="border-2 border-white/20
           px-4 sm:px-6
           py-5 sm:py-7
           w-full max-w-[900px]
           bg-[#D9D9D9]/10
           rounded-3xl sm:rounded-4xl
           flex flex-col
           mt-20 sm:mt-24 lg:mt-28
           gap-5 sm:gap-6
           justify-center items-center
           mx-auto"
  >
    <!-- รูปโปรไฟล์ -->
    <div class="relative">
      <img
        v-if="previewImage || userData.image"
        :src="previewImage || userData.image"
        class="w-[90px] h-[90px]
               sm:w-[110px] sm:h-[110px]
               md:w-[130px] md:h-[130px]
               rounded-full object-cover border-2 border-white"
      />

      <!-- ไม่มีรูป -->
      <div
        v-else
        class="w-[90px] h-[90px]
               sm:w-[110px] sm:h-[110px]
               md:w-[130px] md:h-[130px]
               rounded-full border-2 border-white
               flex items-center justify-center
               text-white text-3xl sm:text-4xl
               font-bold select-none"
        :class="avatarBg"
      >
        {{ userInitial }}
      </div>

      <!-- ปุ่มเปลี่ยนรูป -->
      <label
        v-if="isEditing"
        for="fileInput"
        class="w-7 h-7 sm:w-8 sm:h-8
               bg-black/60 rounded-full
               absolute bottom-2 right-2
               flex justify-center items-center
               cursor-pointer hover:bg-black/80"
      >
        ✎
      </label>

      <input
        id="fileInput"
        type="file"
        accept="image/*"
        class="hidden"
        @change="onImageChange"
      />
    </div>

    <!-- Username -->
    <div class="flex flex-col w-full max-w-[320px] sm:max-w-[363px] gap-1">
      <label class="text-white text-sm font-bold">ชื่อผู้ใช้</label>
      <input
        v-model="userData.username"
        :disabled="!isEditing"
        class="w-full h-11 sm:h-12
               bg-white/40 rounded-2xl
               px-4 text-white disabled:cursor-not-allowed"
      />
    </div>

    <!-- Email -->
    <div class="flex flex-col w-full max-w-[320px] sm:max-w-[363px] gap-1">
      <label class="text-white text-sm font-bold">อีเมล</label>
      <input
        v-model="userData.email"
        disabled
        class="w-full h-11 sm:h-12
               bg-white/20 rounded-2xl
               px-4 text-white cursor-not-allowed"
      />
    </div>

    <!-- Movie Tags -->
    <div class="flex flex-col gap-2 relative">
      <p class="text-white text-sm font-bold text-center">รสนิยมภาพยนตร์</p>

      <!-- view -->
      <div v-if="!isEditing" class="flex flex-wrap gap-3 justify-center px-4">
        <div
          v-for="tag in userTags.slice(0, 3)"
          :key="tag.id"
          class="px-4 py-2 rounded-full bg-white/30 backdrop-blur-md text-white font-semibold text-sm border border-white/20 shadow-md"
        >
          {{ tag.name }}
        </div>
      </div>

      <!-- edit -->
      <div v-else class="flex flex-wrap gap-3 justify-center max-w-[520px]">
        <button
          v-for="tag in allTags"
          :key="tag.id"
          @click="toggleTag(tag.id)"
          :disabled="!selectedTags.includes(tag.id) && selectedTags.length >= 3"
          class="px-3.5 py-2 rounded-full text-sm font-semibold transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
          :class="
            selectedTags.includes(tag.id)
              ? 'bg-[#90CB38] text-white'
              : 'bg-white/20 text-white hover:bg-white/30'
          "
        >
          {{ tag.name }}
        </button>
      </div>

      <p
        v-if="isEditing && selectedTags.length >= 3"
        class="text-xs text-white text-center mt-2"
      >
        เลือกได้ 3 แท็ก
      </p>
    </div>

    <!-- ปุ่ม -->
    <button
      @click="toggleEdit"
      class="w-[150px] sm:w-[170px]
             h-[40px] sm:h-[44px]
             bg-[#90CB38]
             rounded-2xl
             text-white font-medium text-base sm:text-lg
             hover:bg-[#7fbb32] cursor-pointer"
    >
      {{ isEditing ? "ยืนยัน" : "แก้ไข" }}
    </button>

    <!-- delete -->
    <p
      class="text-sm text-white/70 underline cursor-pointer hover:text-red-400"
      @click="showDeletePopup = true"
    >
      ลบบัญชี
    </p>

    <DeletePopup v-if="showDeletePopup" @close="showDeletePopup = false" />
  </div>
</template>



<script setup>
import { ref, watchEffect } from "vue";

/* ---------- state ---------- */
const isEditing = ref(false);
const previewImage = ref(null);
const showDeletePopup = ref(false);
const selectedFile = ref(null);

const userTags = ref([]);
const allTags = ref([]);
const selectedTags = ref([]);

const userData = ref({
  username: "",
  email: "",
  image: "",
});

const user = useUser();

/* ---------- fetch profile ---------- */
const { data: profile } = await useFetch("/api/profile", {
  server: false,
  credentials: "include",
});

const { data: tagsData } = await useFetch("/api/tag", {
  server: false,
});

watchEffect(() => {
  if (!profile.value) return;

  userData.value.username = profile.value.username;
  userData.value.email = profile.value.email;
  userData.value.image = profile.value.image || null;

  userTags.value = profile.value.tags || [];
  selectedTags.value = userTags.value.map((t) => t.id);

  // ⭐ sync ไป navbar
  user.value = {
    id: profile.value.id,
    username: profile.value.username,
    email: profile.value.email,
    image: profile.value.image,
  };
});

watchEffect(() => {
  if (!tagsData.value) return;
  allTags.value = tagsData.value;
});

/* ---------- image preview ---------- */
const onImageChange = (e) => {
  const file = e.target.files[0];
  if (!file) return;
  selectedFile.value = file;
  previewImage.value = URL.createObjectURL(file);
};

/* ---------- tag logic ---------- */
const toggleTag = (tagId) => {
  if (selectedTags.value.includes(tagId)) {
    selectedTags.value = selectedTags.value.filter((id) => id !== tagId);
    return;
  }
  if (selectedTags.value.length >= 3) return;
  selectedTags.value.push(tagId);
};

/* ---------- Edit / Confirm ---------- */
const toggleEdit = async () => {
  if (!isEditing.value) {
    selectedTags.value = userTags.value.map((t) => t.id);
    isEditing.value = true;
    return;
  }

  const formData = new FormData();
  formData.append("username", userData.value.username);
  formData.append("tags", JSON.stringify(selectedTags.value));
  if (selectedFile.value) {
    formData.append("image", selectedFile.value);
  }

  const updatedProfile = await $fetch("/api/profile", {
    method: "PUT",
    body: formData,
    credentials: "include",
  });

  isEditing.value = false;
  previewImage.value = null;
  selectedFile.value = null;

  window.location.reload();
};

import { computed } from "vue";

const avatarColors = [
  "bg-[#F87171]", // red
  "bg-[#FB923C]", // orange
  "bg-[#FACC15]", // yellow
  "bg-[#4ADE80]", // green
  "bg-[#22D3EE]", // cyan
  "bg-[#60A5FA]", // blue
  "bg-[#A78BFA]", // purple
  "bg-[#F472B6]", // pink
];

// ตัวอักษรแรก
const userInitial = computed(() => {
  if (!userData.value.username) return "?";
  return userData.value.username.charAt(0).toUpperCase();
});

// สี avatar (สุ่มแต่คงที่)
const avatarBg = computed(() => {
  if (!userData.value.username) return "bg-gray-400";

  let hash = 0;
  for (let i = 0; i < userData.value.username.length; i++) {
    hash = userData.value.username.charCodeAt(i) + ((hash << 5) - hash);
  }

  const index = Math.abs(hash) % avatarColors.length;
  return avatarColors[index];
});
</script>
