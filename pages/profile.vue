<template>
  <!-- ⏳ กำลังเช็ค -->
  <div
    v-if="pending"
    class="w-full min-h-screen bg-[#0B0A0A] flex items-center justify-center"
  >
    <h1 class="text-white">กำลังโหลด...</h1>
  </div>

  <!--  ไม่ได้ล็อกอิน -->
  <div
    v-else-if="!isLoggedIn"
    class="w-full min-h-screen bg-[#0B0A0A] flex items-center justify-center"
  >
    <div class="flex flex-col items-center gap-6 text-center">
      <h1 class="text-white text-2xl">
        คุณยังไม่ได้ล็อกอินบัญชีผู้ใช้
      </h1>

      <button
        @click="goToLogin"
        class="px-8 py-3 bg-[#90CB38] text-white text-shadow-4xl rounded-xl font-medium cursor-pointer hover:bg-[#6da11f]"
      >
        เข้าสู่ระบบ
      </button>
    </div>
  </div>

  <!-- ล็อกอินแล้ว -->
  <div
  v-else
  class="w-full min-h-screen flex flex-col md:flex-row bg-[#0B0A0A] gap-6 md:gap-20 px-4 md:px-6"
>
  <!-- MENU -->
  <div
    class="w-full md:w-[350px]
           h-auto md:h-[450px]
           bg-[#0B0A0A]
           rounded-4xl flex
           md:flex-col flex-row
           shadow-2xl overflow-hidden mt-25"
  >
    <!-- PROFILE -->
    <div
      @click="activeTab = 'profile'"
      class="w-1/3 md:w-full
             h-[60px]
             bg-[#0B0A0A]
             hover:bg-[#90CB38]
             cursor-pointer flex items-center justify-center"
      :class="activeTab === 'profile' ? 'bg-[#90CB38]' : ''"
    >
      <h1 class="text-white text-[18px] md:text-[20px]">โปรไฟล์</h1>
    </div>

    <!-- PASSWORD -->
    <div
      @click="activeTab = 'password'"
      class="w-1/3 md:w-full
             h-[60px]
             bg-[#0B0A0A]
             hover:bg-[#90CB38]
             cursor-pointer flex items-center justify-center"
      :class="activeTab === 'password' ? 'bg-[#90CB38]' : ''"
    >
      <h1 class="text-white text-[18px] md:text-[20px]">รหัสผ่าน</h1>
    </div>

    <!-- LOGOUT -->
    <div
      @click="showLogout = true"
      class="w-1/3 md:w-full
             h-[60px]
             bg-[#151414]
             hover:bg-[#90CB38]
             cursor-pointer flex items-center justify-center
             md:mt-auto"
    >
      <h1 class="text-[#eb1313] text-[18px] md:text-[20px]">ออกจากระบบ</h1>
    </div>
  </div>

  <!-- CONTENT -->
  <div class="flex-1 w-full">
    <CardProfile v-if="activeTab === 'profile'" />
    <CardProfilepassword v-if="activeTab === 'password'" />
  </div>

  <logout v-if="showLogout" @close="showLogout = false" />
</div>

</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

import CardProfile from '~/components/cardProfile.vue'
import CardProfilepassword from '~/components/cardProfilepassword.vue'
import logout from '~/components/logout.vue'

const router = useRouter()

const activeTab = ref('profile')
const showLogout = ref(false)

//  ตัวตัดสิน login 
const { data, pending, error } = await useFetch('/api/profile', {
  credentials: 'include',
  throw: false // สำคัญมาก
})

//  logic เดียว
const isLoggedIn = computed(() => {
  if (pending.value) return false
  if (error.value) return false 
  return true
})

const goToLogin = () => {
  router.push('/logInscreen')
}
</script>
