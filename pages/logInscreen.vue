<template>
    <div class="relative w-full h-screen flex justify-center items-center">
        <div class="absolute inset-0 bg-[url('/img/bglogin2.webp')] bg-cover bg-center"></div>
        <div class="absolute inset-0 bg-black/50"></div>
        <img src="/img/logo.png" alt="" class="shadow-2xl w-[370px] h-[370px] absolute bottom-110 left-8 z-20" />
        <div class="w-[700px] h-[400px] bg-white/45 rounded-[70px] shadow-2xl relative z-20 p-5">
            <div class="w-full h-full flex flex-col items-center gap-4 ">
                <h1 class="text-4xl font-bold text-[#ffffff] text-shadow-2xl">Log In</h1>
                <h2 class="text-lg text-[#ffffff]">Welcome Back, You’ve Been Missed</h2>
                <div
                    class="w-[500px] h-[50px] flex items-center bg-white/50 backdrop-blur-md border border-gray-300 rounded-4xl px-3">
                    <!-- <img src="/img/iconUser.png" class="w-5 h-5 opacity-70" /> -->
                    <input type="text" placeholder="Email" class="flex-1 p-3 bg-transparent focus:outline-none text-[#ffffff] font-extrabold text-shadow-2xl" />
                </div>
                <div
                    class="w-[500px] h-[50px] flex items-center bg-white/55 backdrop-blur-md border border-gray-300 rounded-4xl px-3 text-[#ffffff] font-extrabold text-shadow-2xl">
                    <!-- <img src="/img/iconUser.png" class="w-5 h-5 opacity-70" /> -->
                    <input type="text" placeholder="Password" class="flex-1 p-3 bg-transparent focus:outline-none" />
                </div>
                <div class="flex justify-between items-center w-[500px] ">
                    <label class="flex items-center gap-2 cursor-pointer select-none">
                        <input type="checkbox" v-model="checked" class="peer hidden" />
                        <!-- กล่อง checkbox -->
                        <div
                            class="w-5 h-5 rounded-sm border-2 border-gray-400 peer-checked:border-[#ffffff] peer-checked:bg-[#ffffff] flex items-center justify-center transition-all">
                            <!-- ไอคอนถูก -->
                            <svg class="w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition" fill="none"
                                stroke="currentColor" stroke-width="3" viewBox="0 0 24 24">
                                <path d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <span class="text-[#ffffff]">Remember me</span>
                    </label>

                    <span class="text-white underline cursor-pointer hover:text-[#A0E13E]" @click="handlepassword">
                        Forgot Password?
                    </span>
                </div>
                <button class="w-[500px] h-[45px] bg-[#A0E13E] text-[#ffffff] text-shadow-2xl rounded-[70px] font-bold shadow-2xl cursor-pointer hover:bg-[#80b432]" @click="handleToHomepage">Log In</button>
                <div class="flex gap-4">
                <p class="text-[#ffffff] text-shadow-2xl">You Haven’t any account?</p> <span class="text-[#A0E13E] cursor-pointer  " @click="handleRegister">Register</span>

                </div>


            </div>


        </div>
    </div>
</template>

<script setup>
definePageMeta({ layout: "login" });
import { ref } from 'vue';

const checked = ref(true)
const handleRegister = () => {
  navigateTo('/registerscreen')
}
const handlepassword = () =>{
    navigateTo('/password')
}

const handleToHomepage = () =>{
    navigateTo('/')
}
</script>

<style></style>
