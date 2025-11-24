<template>
    <div class="relative w-full h-screen flex justify-center items-center">
        <div class="absolute inset-0 bg-[url('/img/bglogin2.webp')] bg-cover bg-center"></div>
        <div class="absolute inset-0 bg-black/50"></div>
        <img src="/img/logo.png" alt="" class="shadow-2xl w-[370px] h-[370px] absolute bottom-110 left-8 z-20" />
        <div class="w-[700px] h-auto bg-white/45 rounded-[70px] shadow-2xl relative z-20 p-5">
            <div class="w-full h-full flex flex-col items-center gap-4 ">
                <h1 class="text-4xl font-bold text-[#ffffff] text-shadow-2xl">Register</h1>
                <h2 class="text-lg text-[#ffffff]">Register to start your movie journey!</h2>
                 <div
                    class="w-[500px] h-[50px] flex items-center bg-white/50 backdrop-blur-md border border-gray-300 rounded-4xl px-3">
                    <!-- <img src="/img/iconUser.png" class="w-5 h-5 opacity-70" /> -->
                    <input type="text" placeholder="Name" class="flex-1 p-3 bg-transparent focus:outline-none text-[#ffffff] font-extrabold text-shadow-2xl" />
                </div>
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
                <button class="w-[500px] h-[45px] bg-[#A0E13E] text-[#ffffff] text-shadow-4xl rounded-[70px] font-bold shadow-2xl cursor-pointer hover:bg-[#80b432]"
                 style="text-shadow: 0px 0px 8px rgba(0,0,0,0.5);"
               @click="gotologin" >Register</button>
                <div class="flex gap-4">
                <p class="text-[#ffffff] text-shadow-2xl">You Haven’t any account?</p> <span class="text-[#A0E13E] cursor-pointer ">Sign Up</span>

                </div>


            </div>


        </div>
    </div>
</template>

<script setup>
definePageMeta({ layout: "login" });
import { ref } from 'vue';
const gotologin = () => {
    navigateTo('/logInscreen')
}

const checked = ref(true)
</script>

<style></style>
