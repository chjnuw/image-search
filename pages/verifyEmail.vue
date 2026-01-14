<template>
    <div class="relative w-full h-screen flex justify-center items-center">
        <div class="absolute inset-0 bg-[url('/img/bglogin2.webp')] bg-cover bg-center"></div>
        <div class="absolute inset-0 bg-black/50"></div>
        <img src="/img/logo.png" alt="" class="shadow-2xl w-[370px] h-[370px] absolute bottom-110 left-8 z-20" />
        <div class="w-[700px] h-auto bg-white/45 rounded-[70px] shadow-2xl relative z-20 p-5">
            <div class="w-full h-full flex flex-col items-center gap-4 ">
                <h1 class="text-4xl font-bold text-[#ffffff] text-shadow-2xl">Verify Email Address</h1>
                <h2 class="text-lg text-[#ffffff] font-bold ">We’ve sent a code to your email. Kindly check and enter it
                    to continue</h2>
                <img src="/public//img/mailicon.png" alt="" class="">
                <div class="flex gap-3">
                    <input v-for="(code, index) in otp" :key="index" v-model="otp[index]" maxlength="1"
                        @input="moveNext(index)" @keydown.backspace="movePrev(index)"
                        class="w-12 h-12 bg-[#DFF0B5] text-center text-2xl font-bold rounded-md text-black outline-none focus:ring-2 focus:ring-[#A0E13E]" />
                </div>


                <button
                    class="w-[500px] h-[45px] bg-[#A0E13E] text-[#ffffff] text-shadow-4xl rounded-[70px] font-bold shadow-2xl cursor-pointer hover:bg-[#80b432]"
                    style="text-shadow: 0px 0px 8px rgba(0,0,0,0.5);" @click="handleconfirmpassword">Confirm Code
                </button>


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
