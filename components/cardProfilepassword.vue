<template>
  <div
    class="
      border-2 border-white/20
      px-4 sm:px-6
      py-5 sm:py-7
      w-full max-w-[900px]
      min-h-[680px]        <!-- 👈 เพิ่มตัวนี้ให้สูงเท่ากัน -->
      bg-[#D9D9D9]/10
      rounded-3xl sm:rounded-4xl
      flex flex-col
      gap-5 sm:gap-6
      justify-center items-center
      mt-20 sm:mt-24 lg:mt-28
      mx-auto
    "
  >
    <!-- ===== VIEW MODE ===== -->
    <template v-if="!isEditing">
      <div class="flex flex-col w-full max-w-[320px] sm:max-w-[363px] gap-1">
        <label class="text-white text-sm font-bold">รหัสผ่าน</label>
        <input
          type="password"
          value="********"
          disabled
          class="w-full h-11 sm:h-12 bg-white/20 rounded-2xl px-4 text-white cursor-not-allowed"
        />
      </div>
    </template>

    <!-- ===== EDIT MODE ===== -->
    <template v-else>
      <div class="flex flex-col w-full max-w-[320px] sm:max-w-[363px] gap-1">
        <label class="text-white text-sm font-bold">รหัสผ่านเก่า</label>
        <input
          type="password"
          v-model="form.oldPassword"
          class="w-full h-11 sm:h-12 bg-white/40 rounded-2xl px-4 text-white"
        />
      </div>

      <div class="flex flex-col w-full max-w-[320px] sm:max-w-[363px] gap-1">
        <label class="text-white text-sm font-bold">รหัสผ่านใหม่</label>
        <input
          type="password"
          v-model="form.newPassword"
          class="w-full h-11 sm:h-12 bg-white/40 rounded-2xl px-4 text-white"
        />
      </div>

      <div class="flex flex-col w-full max-w-[320px] sm:max-w-[363px] gap-1">
        <label class="text-white text-sm font-bold">
ยืนยันรหัสผ่านใหม่        </label>
        <input
          type="password"
          v-model="form.confirmPassword"
          class="w-full h-11 sm:h-12 bg-white/40 rounded-2xl px-4 text-white"
        />
      </div>
    </template>

    <!-- ปุ่ม -->
    <button
      @click="toggleEdit"
      class="w-[150px] sm:w-[170px]
             h-[40px] sm:h-[44px]
             bg-[#90CB38]
             rounded-2xl
             text-white font-medium text-base sm:text-lg
             hover:bg-[#7fbb32]"
    >
      {{ isEditing ? 'ยืนยัน' : 'แก้ไข' }}
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
