<template>
    <div class="relative w-full h-screen flex justify-center items-center">
        <div class="absolute inset-0 bg-[url('/img/bglogin2.webp')] bg-cover bg-center"></div>
        <div class="absolute inset-0 bg-black/50"></div>
        <img src="/img/logo.png" alt="" class="shadow-2xl w-[370px] h-[370px] absolute bottom-110 left-8 z-20" />
        <div class="w-[700px] h-auto bg-white/45 rounded-[70px] shadow-2xl relative z-20 p-5">
            <div class="w-full h-full flex flex-col items-center gap-4 ">
                <h1 class="text-4xl font-bold text-[#ffffff] text-shadow-2xl">Forgot Password</h1>
                <h2 class="text-lg text-[#ffffff] font-bold ">Reset your password safely through your email account</h2>
                <img src="/public//img/passwordicon.png" alt="" class="">
                <div
                    class="w-[500px] h-[50px] flex items-center bg-white/50 backdrop-blur-md border border-gray-300 rounded-4xl px-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 20 20"
                        class="ml-1.5 text-[#737373]">
                        <path fill="currentColor" fill-rule="evenodd"
                            d="m7.172 11.334l2.83 1.935l2.728-1.882l6.115 6.033q-.242.079-.512.08H1.667c-.22 0-.43-.043-.623-.12zM20 6.376v9.457c0 .247-.054.481-.15.692l-5.994-5.914zM0 6.429l6.042 4.132l-5.936 5.858A1.7 1.7 0 0 1 0 15.833zM18.333 2.5c.92 0 1.667.746 1.667 1.667v.586L9.998 11.648L0 4.81v-.643C0 3.247.746 2.5 1.667 2.5z" />
                    </svg>
                   <input
  v-model="email"
  type="text"
  placeholder="Email"
  class="flex-1 p-3 bg-transparent rounded-4xl w-[500px] focus:outline-none text-[#ffffff] font-extrabold"
/>

                </div>
                <button  class="w-[500px] h-[45px] bg-[#A0E13E] text-[#ffffff] text-shadow-4xl rounded-[70px] font-bold shadow-2xl cursor-pointer hover:bg-[#80b432]"
                 style="text-shadow: 0px 0px 8px rgba(0,0,0,0.5);" @click="handleVertify"
  :disabled="loading"
  
>
  {{ loading ? 'Sending...' : 'Send Instructions' }}
</button>


            </div>


        </div>
    </div>
</template>

<script setup>
definePageMeta({ layout: "login" });
import { ref } from 'vue';
const email = ref('')
const loading = ref(false)


const handleVertify = async () => {
  if (!email.value) {
    alert('Please enter email')
    return
  }

  if (loading.value) return
  loading.value = true

  try {
    await $fetch('/api/auth/forgot-password', {
      method: 'POST',
      body: { email: email.value }
    })

    useState('resetEmail').value = email.value
    navigateTo('/verifyEmail')
  } catch (err) {
    alert(err?.data?.statusMessage || 'Something went wrong')
  } finally {
    loading.value = false
  }
}

const checked = ref(true)
</script>

<style></style>
