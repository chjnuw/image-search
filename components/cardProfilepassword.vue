<template>
  <div
    
     class="
    w-full
    max-w-[900px]        <!-- ลดความกว้าง -->
    min-h-[650px]        <!-- ไม่สูงจนเกิน -->
    bg-[#D9D9D9]/10
    rounded-4xl
    flex flex-col
    gap-6
    justify-center items-center
    mt-28
    mx-auto              <!-- เว้นซ้ายขวา -->
    px-6 py-10           <!-- ขอบในโปร่งขึ้น -->
  "
  >
    <!-- ===== VIEW MODE ===== -->
    <template v-if="!isEditing">
      <div class="flex flex-col w-full max-w-[363px] gap-1">
        <label class="text-white text-sm font-bold">Password</label>
        <input
          type="password"
          value="********"
          disabled
          class="w-full h-12 bg-white/20 rounded-2xl px-4 text-white cursor-not-allowed"
        />
      </div>
    </template>

    <!-- ===== EDIT MODE ===== -->
    <template v-else>
      <div class="flex flex-col w-full max-w-[363px] gap-1">
        <label class="text-white text-sm font-bold">Old Password</label>
        <input
          type="password"
          v-model="form.oldPassword"
          class="w-full h-12 bg-white/40 rounded-2xl px-4 text-white"
        />
      </div>

      <div class="flex flex-col w-full max-w-[363px] gap-1">
        <label class="text-white text-sm font-bold">New Password</label>
        <input
          type="password"
          v-model="form.newPassword"
          class="w-full h-12 bg-white/40 rounded-2xl px-4 text-white"
        />
      </div>

      <div class="flex flex-col w-full max-w-[363px] gap-1">
        <label class="text-white text-sm font-bold">
          Confirm New Password
        </label>
        <input
          type="password"
          v-model="form.confirmPassword"
          class="w-full h-12 bg-white/40 rounded-2xl px-4 text-white"
        />
      </div>
    </template>

    <!-- ปุ่ม -->
    <button
      @click="toggleEdit"
      class="w-[180px] h-[45px] bg-[#90CB38] rounded-2xl text-white font-medium text-lg hover:bg-[#7fbb32]"
    >
      {{ isEditing ? 'Confirm' : 'Edit' }}
    </button>
  </div>
</template>


<script setup>
import { ref } from 'vue'

const isEditing = ref(false)

const form = ref({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const toggleEdit = async () => {
  // ===== กด Edit =====
  if (!isEditing.value) {
    isEditing.value = true
    return
  }

  // ===== Validate =====
  if (
    !form.value.oldPassword ||
    !form.value.newPassword ||
    !form.value.confirmPassword
  ) {
    alert('กรุณากรอกข้อมูลให้ครบ')
    return
  }

  if (form.value.newPassword !== form.value.confirmPassword) {
    alert('รหัสผ่านใหม่ไม่ตรงกัน')
    return
  }

  // ===== ยิง API =====
  await $fetch('/api/password', {
    method: 'PUT',
    body: {
      oldPassword: form.value.oldPassword,
      newPassword: form.value.newPassword
    },
    credentials: 'include'
  })

  alert('เปลี่ยนรหัสผ่านเรียบร้อย')

  // reset
  form.value.oldPassword = ''
  form.value.newPassword = ''
  form.value.confirmPassword = ''
  isEditing.value = false
}
</script>
