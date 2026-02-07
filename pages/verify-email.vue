<template>
  <div
    class="relative w-full min-h-screen bg-[url('/img/bglogin2.webp')] bg-cover bg-center"
  >
    <!-- overlay -->
    <div class="absolute inset-0 bg-black/55"></div>

    <!-- logo -->
    <img
      src="/img/logo.png"
      alt="logo"
      class="absolute top-4 left-4 sm:top-6 sm:left-6
             w-[80px] h-[80px] sm:w-[110px] sm:h-[110px] lg:w-[140px] lg:h-[140px]
             z-20 shadow-2xl"
    />

    <!-- center -->
    <div class="relative z-20 min-h-screen flex items-center justify-center px-4">
      <!-- card -->
      <div
        class="w-full max-w-[380px] sm:max-w-[450px]
               bg-white/45 backdrop-blur-md
               rounded-[28px] sm:rounded-[40px]
               shadow-2xl p-6 sm:p-8"
      >
        <div class="flex flex-col items-center gap-4">
          <!-- title -->
          <h2
            class="text-2xl sm:text-3xl font-bold
                   text-white text-shadow-2xl"
          >
            ยืนยันอีเมล
          </h2>

          <p class="text-sm text-white text-center">
            เราได้ส่งรหัสยืนยันไปที่อีเมลของคุณ
          </p>

          <!-- OTP input -->
          <input
            v-model="otp"
            maxlength="6"
            placeholder="กรอกรหัส 6 หลัก"
            class="w-full h-[48px]
                   bg-white/60 border border-gray-300
                   rounded-full text-center text-lg
                   font-bold tracking-widest
                   text-[#1c270b]
                   focus:outline-none"
          />

          <!-- error -->
          <p v-if="error" class="text-red-600 text-sm">
            {{ error }}
          </p>

          <!-- button -->
          <button
            class="w-full h-[45px]
                   bg-[#A0E13E] rounded-full
                   font-bold text-white shadow-2xl
                   hover:bg-[#80b432] transition cursor-pointer"
            @click="verifyOtp"
            :disabled="loading"
          >
            {{ loading ? 'กำลังตรวจสอบ...' : 'ยืนยัน' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: "guest"
});

const route = useRoute()
const email = route.query.email

const otp = ref("")
const error = ref("")
const loading = ref(false)

const verifyOtp = async () => {
  error.value = ""

  if (otp.value.length !== 6) {
    error.value = "กรุณากรอกรหัสให้ครบ 6 หลัก"
    return
  }

  loading.value = true

  try {
    const res = await $fetch("/api/verify-email", {
      method: "POST",
      body: {
        email,
        otp: otp.value
      }
    })
console.log("API response:", res)
   if (res.ok && res.userId) {
  navigateTo(`/tagRegis?userId=${res.userId}`)
}
  } catch (err) {
    error.value = "รหัสไม่ถูกต้องหรือหมดอายุ"
  } finally {
    loading.value = false
  }
}
</script>
