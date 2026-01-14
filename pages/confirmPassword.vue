<template>
    <div class="relative w-full h-screen flex justify-center items-center">
        <div class="absolute inset-0 bg-[url('/img/bglogin2.webp')] bg-cover bg-center"></div>
        <div class="absolute inset-0 bg-black/50"></div>
        <img src="/img/logo.png" alt="" class="shadow-2xl w-[370px] h-[370px] absolute bottom-110 left-8 z-20" />
        <div class="w-[700px] h-auto bg-white/45 rounded-[70px] shadow-2xl relative z-20 p-5">
            <div class="w-full h-full flex flex-col items-center gap-4 ">
                <h1 class="text-4xl font-bold text-[#ffffff] text-shadow-2xl">Forgot Password</h1>
                <h2 class="text-lg text-[#ffffff] font-bold ">Please create a new password and confirm your new password</h2>
                
                 <div
                    class="w-[500px] h-[50px] flex items-center bg-white/55 backdrop-blur-md border border-gray-300 rounded-4xl px-3 text-[#ffffff] font-extrabold text-shadow-2xl justify-between">

                    <!-- ซ้าย: ไอคอน + Password -->
                    <div class="flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 256 256"
                            class="text-[#737373] ml-2.5">
                            <path fill="currentColor"
                                d="M208 80h-32V56a48 48 0 0 0-96 0v24H48a16 16 0 0 0-16 16v112a16 16 0 0 0 16 16h160a16 16 0 0 0 16-16V96a16 16 0 0 0-16-16m-72 78.63V184a8 8 0 0 1-16 0v-25.37a24 24 0 1 1 16 0M160 80H96V56a32 32 0 0 1 64 0Z" />
                        </svg>

                        <input
  v-model="password"
  :type="showPassword ? 'text' : 'password'"
  placeholder="Password"
  class="bg-transparent focus:outline-none text-white font-bold"
/>
                    </div>

                    <!-- ไอคอนตา toggle -->
                    <div @click="togglePassword" class="cursor-pointer">
                        <!-- ถ้า show อยู่ → ไอคอนตาเปิด -->
                        <svg v-if="showPassword" xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                            viewBox="0 0 512 512" class="text-[#737373] mr-1.5">
                            <circle cx="256" cy="256" r="64" fill="currentColor" />
                            <path fill="currentColor"
                                d="M490.84 238.6c-26.46-40.92-60.79-75.68-99.27-100.53C349 110.55 302 96 255.66 96c-42.52 0-84.33 12.15-124.27 36.11c-40.73 24.43-77.63 60.12-109.68 106.07a31.92 31.92 0 0 0-.64 35.54c26.41 41.33 60.4 76.14 98.28 100.65C162 402 207.9 416 255.66 416c46.71 0 93.81-14.43 136.2-41.72c38.46-24.77 72.72-59.66 99.08-100.92a32.2 32.2 0 0 0-.1-34.76M256 352a96 96 0 1 1 96-96a96.11 96.11 0 0 1-96 96" />
                        </svg>

                        <!-- ถ้า show ปิด → ไอคอนตาปิด -->
                        <svg v-else  xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 512 512"
                        class="text-[#737373] mr-1.5"
                        ><path fill="currentColor" d="M432 448a15.92 15.92 0 0 1-11.31-4.69l-352-352a16 16 0 0 1 22.62-22.62l352 352A16 16 0 0 1 432 448M248 315.85l-51.79-51.79a2 2 0 0 0-3.39 1.69a64.11 64.11 0 0 0 53.49 53.49a2 2 0 0 0 1.69-3.39m16-119.7L315.87 248a2 2 0 0 0 3.4-1.69a64.13 64.13 0 0 0-53.55-53.55a2 2 0 0 0-1.72 3.39"/><path fill="currentColor" d="M491 273.36a32.2 32.2 0 0 0-.1-34.76c-26.46-40.92-60.79-75.68-99.27-100.53C349 110.55 302 96 255.68 96a226.5 226.5 0 0 0-71.82 11.79a4 4 0 0 0-1.56 6.63l47.24 47.24a4 4 0 0 0 3.82 1.05a96 96 0 0 1 116 116a4 4 0 0 0 1.05 3.81l67.95 68a4 4 0 0 0 5.4.24a343.8 343.8 0 0 0 67.24-77.4M256 352a96 96 0 0 1-93.3-118.63a4 4 0 0 0-1.05-3.81l-66.84-66.87a4 4 0 0 0-5.41-.23c-24.39 20.81-47 46.13-67.67 75.72a31.92 31.92 0 0 0-.64 35.54c26.41 41.33 60.39 76.14 98.28 100.65C162.06 402 207.92 416 255.68 416a238.2 238.2 0 0 0 72.64-11.55a4 4 0 0 0 1.61-6.64l-47.47-47.46a4 4 0 0 0-3.81-1.05A96 96 0 0 1 256 352"/></svg>
                    </div>

                </div>
               <div
                    class="w-[500px] h-[50px] flex items-center bg-white/55 backdrop-blur-md border border-gray-300 rounded-4xl px-3 text-[#ffffff] font-extrabold text-shadow-2xl justify-between">

                    <!-- ซ้าย: ไอคอน + Password -->
                    <div class="flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 256 256"
                            class="text-[#737373] ml-2.5">
                            <path fill="currentColor"
                                d="M208 80h-32V56a48 48 0 0 0-96 0v24H48a16 16 0 0 0-16 16v112a16 16 0 0 0 16 16h160a16 16 0 0 0 16-16V96a16 16 0 0 0-16-16m-72 78.63V184a8 8 0 0 1-16 0v-25.37a24 24 0 1 1 16 0M160 80H96V56a32 32 0 0 1 64 0Z" />
                        </svg>

                        <input
  v-model="confirm"
  :type="showConfirmPassword ? 'text' : 'password'"
  placeholder="Confirm Password"
  class="bg-transparent focus:outline-none text-white font-bold"
/>
                    </div>

                    <!-- ไอคอนตา toggle -->
                    <div @click="toggleConfirmPassword" class="cursor-pointer">
                        <!-- ถ้า show อยู่ → ไอคอนตาเปิด -->
                        <svg v-if="showConfirmPassword" xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                            viewBox="0 0 512 512" class="text-[#737373] mr-1.5">
                            <circle cx="256" cy="256" r="64" fill="currentColor" />
                            <path fill="currentColor"
                                d="M490.84 238.6c-26.46-40.92-60.79-75.68-99.27-100.53C349 110.55 302 96 255.66 96c-42.52 0-84.33 12.15-124.27 36.11c-40.73 24.43-77.63 60.12-109.68 106.07a31.92 31.92 0 0 0-.64 35.54c26.41 41.33 60.4 76.14 98.28 100.65C162 402 207.9 416 255.66 416c46.71 0 93.81-14.43 136.2-41.72c38.46-24.77 72.72-59.66 99.08-100.92a32.2 32.2 0 0 0-.1-34.76M256 352a96 96 0 1 1 96-96a96.11 96.11 0 0 1-96 96" />
                        </svg>

                        <!-- ถ้า show ปิด → ไอคอนตาปิด -->
                        <svg v-else  xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 512 512"
                        class="text-[#737373] mr-1.5"
                        ><path fill="currentColor" d="M432 448a15.92 15.92 0 0 1-11.31-4.69l-352-352a16 16 0 0 1 22.62-22.62l352 352A16 16 0 0 1 432 448M248 315.85l-51.79-51.79a2 2 0 0 0-3.39 1.69a64.11 64.11 0 0 0 53.49 53.49a2 2 0 0 0 1.69-3.39m16-119.7L315.87 248a2 2 0 0 0 3.4-1.69a64.13 64.13 0 0 0-53.55-53.55a2 2 0 0 0-1.72 3.39"/><path fill="currentColor" d="M491 273.36a32.2 32.2 0 0 0-.1-34.76c-26.46-40.92-60.79-75.68-99.27-100.53C349 110.55 302 96 255.68 96a226.5 226.5 0 0 0-71.82 11.79a4 4 0 0 0-1.56 6.63l47.24 47.24a4 4 0 0 0 3.82 1.05a96 96 0 0 1 116 116a4 4 0 0 0 1.05 3.81l67.95 68a4 4 0 0 0 5.4.24a343.8 343.8 0 0 0 67.24-77.4M256 352a96 96 0 0 1-93.3-118.63a4 4 0 0 0-1.05-3.81l-66.84-66.87a4 4 0 0 0-5.41-.23c-24.39 20.81-47 46.13-67.67 75.72a31.92 31.92 0 0 0-.64 35.54c26.41 41.33 60.39 76.14 98.28 100.65C162.06 402 207.92 416 255.68 416a238.2 238.2 0 0 0 72.64-11.55a4 4 0 0 0 1.61-6.64l-47.47-47.46a4 4 0 0 0-3.81-1.05A96 96 0 0 1 256 352"/></svg>
                    </div>

                </div>
                <button class="w-[500px] h-[45px] bg-[#A0E13E] text-[#ffffff] text-shadow-4xl rounded-[70px] font-bold shadow-2xl cursor-pointer hover:bg-[#80b432]"
                 style="text-shadow: 0px 0px 8px rgba(0,0,0,0.5);"
                 @click="handleGotologin">Confirm Password </button>


            </div>


        </div>
    </div>
</template>

<script setup>
definePageMeta({ layout: "login" });
import { ref } from 'vue';
const password = ref('')
const confirm = ref('')

const handleGotologin = async () => {
  if (password.value !== confirm.value) {
    alert('Password not match')
    return
  }

  await $fetch('/api/auth/reset-password', {
    method: 'POST',
    body: {
      email: useState('resetEmail').value,
      password: password.value
    }
  })

  navigateTo('/logInscreen')
}
const checked = ref(true)

const showPassword = ref(false);
const showConfirmPassword = ref(false);

const togglePassword = () => {
  showPassword.value = !showPassword.value;
};

const toggleConfirmPassword = () => {
  showConfirmPassword.value = !showConfirmPassword.value;
};
</script>

<style></style>
