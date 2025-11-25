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

                        <input type="text" placeholder="Password"
                            class="bg-transparent focus:outline-none text-white font-bold" />
                    </div>

                    <!-- ขวาสุด: ไอคอนตา สีเทา -->
                    <div>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 512 512"
                            class="text-[#737373] mr-1.5">
                            <circle cx="256" cy="256" r="64" fill="currentColor" />
                            <path fill="currentColor"
                                d="M490.84 238.6c-26.46-40.92-60.79-75.68-99.27-100.53C349 110.55 302 96 255.66 96c-42.52 0-84.33 12.15-124.27 36.11c-40.73 24.43-77.63 60.12-109.68 106.07a31.92 31.92 0 0 0-.64 35.54c26.41 41.33 60.4 76.14 98.28 100.65C162 402 207.9 416 255.66 416c46.71 0 93.81-14.43 136.2-41.72c38.46-24.77 72.72-59.66 99.08-100.92a32.2 32.2 0 0 0-.1-34.76M256 352a96 96 0 1 1 96-96a96.11 96.11 0 0 1-96 96" />
                        </svg>
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

                        <input type="text" placeholder="Confirm Password"
                            class="bg-transparent focus:outline-none text-white font-bold" />
                    </div>

                    <!-- ขวาสุด: ไอคอนตา สีเทา -->
                    <div>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 512 512"
                            class="text-[#737373] mr-1.5">
                            <circle cx="256" cy="256" r="64" fill="currentColor" />
                            <path fill="currentColor"
                                d="M490.84 238.6c-26.46-40.92-60.79-75.68-99.27-100.53C349 110.55 302 96 255.66 96c-42.52 0-84.33 12.15-124.27 36.11c-40.73 24.43-77.63 60.12-109.68 106.07a31.92 31.92 0 0 0-.64 35.54c26.41 41.33 60.4 76.14 98.28 100.65C162 402 207.9 416 255.66 416c46.71 0 93.81-14.43 136.2-41.72c38.46-24.77 72.72-59.66 99.08-100.92a32.2 32.2 0 0 0-.1-34.76M256 352a96 96 0 1 1 96-96a96.11 96.11 0 0 1-96 96" />
                        </svg>
                    </div>

                </div>
                <button class="w-[500px] h-[45px] bg-[#A0E13E] text-[#ffffff] text-shadow-4xl rounded-[70px] font-bold shadow-2xl cursor-pointer hover:bg-[#80b432]"
                 style="text-shadow: 0px 0px 8px rgba(0,0,0,0.5);"
                 @click="handleGotologin">Confirm Code </button>


            </div>


        </div>
    </div>
</template>

<script setup>
definePageMeta({ layout: "login" });
import { ref } from 'vue';

const handleGotologin = () => {
    navigateTo('/logInscreen')
}
const checked = ref(true)
</script>

<style></style>
