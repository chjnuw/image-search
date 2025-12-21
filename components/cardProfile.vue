<template>
  <div
    class="w-[1100px] h-[600px] bg-[#D9D9D9]/10 rounded-4xl flex flex-col mt-35 gap-6 justify-center items-center"
  >
    <!-- รูปโปรไฟล์ -->
    <div class="relative">
      <img
  :src="previewImage || userData.image || '/img/avatar.png'"
  class="w-[150px] h-[150px] rounded-full object-cover border-2 border-white"
/>



      <!-- ปุ่มเปลี่ยนรูป (เฉพาะตอน Edit) -->
      <label
        v-if="isEditing"
        for="fileInput"
        class="w-8 h-8 bg-black/60 rounded-full absolute bottom-2 right-2
               flex justify-center items-center cursor-pointer hover:bg-black/80"
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
    <div class="flex flex-col w-[363px] gap-1">
      <label class="text-white text-sm font-bold">Username</label>
      <input
        v-model="userData.username"
        :disabled="!isEditing"
        class="w-full h-12 bg-white/40 rounded-2xl px-4 text-white
               disabled:cursor-not-allowed"
      />
    </div>

    <!-- Email (แก้ไม่ได้) -->
    <div class="flex flex-col w-[363px] gap-1">
      <label class="text-white text-sm font-bold">Email</label>
      <input
        v-model="userData.email"
        disabled
        class="w-full h-12 bg-white/20 rounded-2xl px-4 text-white
               cursor-not-allowed"
      />
    </div>

    <!-- ปุ่ม Edit / Confirm -->
    <button
      @click="toggleEdit"
      class="w-[180px] h-[45px] bg-[#90CB38] rounded-2xl
             text-white font-medium text-lg hover:bg-[#7fbb32]"
    >
      {{ isEditing ? 'Confirm' : 'Edit' }}
    </button>
    <!-- Delete account -->
<p
  class="text-sm text-white/70 underline cursor-pointer hover:text-red-400"
  @click="showDeletePopup = true"
>
  Delete account
</p>

<!-- Popup -->
<DeletePopup
  v-if="showDeletePopup"
  @close="showDeletePopup = false"
/>
  </div>
</template>



<script setup>
import { ref, watch } from 'vue'

/* ---------------- state ---------------- */
const isEditing = ref(false)
const previewImage = ref(null)
const showDeletePopup = ref(false)
const selectedFile = ref(null)

const userData = ref({
  username: '',
  email: '',
  image: ''
})

watch(userData, () => {
  console.log('USER DATA =', userData.value)
}, { deep: true })


/* ---------------- โหลดโปรไฟล์ ---------------- */
const { data: profile } = await useFetch('/api/profile', {
  server: false,
  credentials: 'include'
})


watchEffect(() => {
  if (!profile.value) return

   userData.value.username = profile.value.username ?? ''
 userData.value.email = profile.value.email ?? ''
 userData.value.image = profile.value.image || null
})


/* ---------------- เปลี่ยนรูป (preview อย่างเดียว) ---------------- */
const onImageChange = (e) => {
  const file = e.target.files[0]
  if (!file) return

  selectedFile.value = file
  previewImage.value = URL.createObjectURL(file)
}

/* ---------------- Edit / Confirm ---------------- */
const toggleEdit = async () => {
  // กด Edit
  if (!isEditing.value) {
    isEditing.value = true
    return
  }

  // กด Confirm
const formData = new FormData()
formData.append('username', userData.value.username)

if (selectedFile.value) {
  formData.append('image', selectedFile.value)
}

await $fetch('/api/profile', {
  method: 'PUT',
  body: formData,
  credentials: 'include'
})


  // reset state
  isEditing.value = false
  previewImage.value = null
  selectedFile.value = null
}
</script>

