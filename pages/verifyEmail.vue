<template>
  <div class="relative w-full min-h-screen flex justify-center items-center px-4">
    <!-- BG -->
    <div class="absolute inset-0 bg-[url('/img/bglogin2.webp')] bg-cover bg-center"></div>
    <div class="absolute inset-0 bg-black/50"></div>

    <!-- LOGO : ซ้ายบนเสมอ -->
    <img
      src="/img/logo.png"
      alt="logo"
      class="absolute top-4 left-4 z-20
             w-[120px] sm:w-[180px] md:w-[240px] lg:w-[300px]
             drop-shadow-2xl"
    />

    <!-- CARD -->
    <div
      class="relative z-20 w-full max-w-[700px]
              bg-white/45 backdrop-blur-md rounded-[40px] sm:rounded-[70px]
             shadow-2xl p-5 sm:p-8"
    >
      <div class="flex flex-col items-center gap-4 text-center">
        
        <!-- TITLE -->
        <h1 class="text-2xl sm:text-3xl md:text-4xl font-bold text-white text-shadow-2xl">
          ยืนยันที่อยู่อีเมล
        </h1>

        <h2 class="text-sm sm:text-base md:text-lg text-white font-bold">
          เราได้ส่งรหัสยืนยันไปยังอีเมลของคุณแล้ว กรุณาตรวจสอบและกรอกรหัสเพื่อดำเนินการต่อ
        </h2>

        <img src="/img/mailicon.png" class="w-20 sm:w-24" />

        <!-- OTP -->
        <div class="flex gap-2 sm:gap-3">
          <input
            v-for="(code, index) in otp"
            :key="index"
            v-model="otp[index]"
            maxlength="1"
            @input="moveNext(index)"
            @keydown.backspace="movePrev(index)"
            class="w-10 h-10 sm:w-12 sm:h-12
                   bg-[#DFF0B5] text-center text-xl sm:text-2xl
                   font-bold rounded-md text-black
                   outline-none focus:ring-2 focus:ring-[#A0E13E]"
          />
        </div>

        <!-- BUTTON -->
        <button
          class="w-full max-w-[500px] h-[45px]
                 bg-[#A0E13E] text-white rounded-full
                 font-bold shadow-2xl hover:bg-[#80b432]"
          @click="handleconfirmpassword"
        >
ยืนยัน        </button>

      </div>
    </div>
  </div>
</template>



<script setup>
definePageMeta({ layout: "login" })

// ❌ ไม่ต้อง import ref / computed ใน Nuxt 3

const otp = ref(["", "", "", "", "", ""]) // 6 ช่อง
const otpCode = computed(() => otp.value.join(''))

const handleconfirmpassword = async () => {
  await $fetch('/api/auth/verify-otp', {
    method: 'POST',
    body: {
      email: useState('resetEmail').value,
      otp: otpCode.value
    }
  })

  navigateTo('/confirmPassword')
}

const moveNext = (index) => {
  if (otp.value[index].length === 1 && index < otp.value.length - 1) {
    document.querySelectorAll("input")[index + 1]?.focus()
  }
}

const movePrev = (index) => {
  if (otp.value[index] === "" && index > 0) {
    document.querySelectorAll("input")[index - 1]?.focus()
  }
}
</script>


<style></style>
