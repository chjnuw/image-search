<template>
  <div
    class="relative w-full min-h-screen
           bg-[url('/img/bglogin2.webp')] bg-cover bg-center"
  >
    <!-- overlay -->
    <div class="absolute inset-0 bg-black/50"></div>

    <!-- logo (ซ้ายบน ตลอด) -->
    <img
      src="/img/logo.png"
      alt="logo"
      class="absolute top-4 left-4 sm:top-6 sm:left-6
             w-[80px] h-[80px]
             sm:w-[110px] sm:h-[110px]
             lg:w-[140px] lg:h-[140px]
             z-20 shadow-2xl"
    />

    <!-- center wrapper -->
    <div
      class="relative z-20
             min-h-screen
             flex items-center justify-center
             px-4"
    >
      <!-- card -->
      <div
        class="w-full max-w-[380px]
               sm:max-w-[450px]
               lg:max-w-[700px]
               bg-white/45 backdrop-blur-md
               rounded-[28px] sm:rounded-[40px] lg:rounded-[70px]
               shadow-2xl
               p-5 sm:p-8"
      >
        <div class="w-full flex flex-col items-center gap-4">

          <!-- title -->
          <h1 class="text-2xl sm:text-3xl lg:text-4xl font-bold text-white text-shadow-2xl">
            เข้าสู่ระบบ
          </h1>
          <h2 class="text-sm sm:text-base text-white text-center">
            ยินดีต้อนรับกลับมา, พวกเราคิดถึงคุณ
          </h2>

          <!-- email -->
          <div
            class="w-full h-[48px]
                   flex items-center bg-white/50
                   border border-gray-300 rounded-full px-3"
          >
           <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 20 20" class="ml-2.5 text-[#737373]" > <path fill="currentColor" fill-rule="evenodd" d="m7.172 11.334l2.83 1.935l2.728-1.882l6.115 6.033q-.242.079-.512.08H1.667c-.22 0-.43-.043-.623-.12zM20 6.376v9.457c0 .247-.054.481-.15.692l-5.994-5.914zM0 6.429l6.042 4.132l-5.936 5.858A1.7 1.7 0 0 1 0 15.833zM18.333 2.5c.92 0 1.667.746 1.667 1.667v.586L9.998 11.648L0 4.81v-.643C0 3.247.746 2.5 1.667 2.5z" /></svg>

            <input
              type="text"
              placeholder="อีเมล"
              v-model="form.email"
              class="flex-1 p-3 bg-transparent
                     focus:outline-none text-black font-bold"
            />
          </div>

          <!-- password -->
          <div
            class="w-full h-[48px]
                   flex items-center bg-white/55
                   border border-gray-300 rounded-full px-3 justify-between"
          >
            <div class="flex items-center gap-2 flex-1">
           <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 256 256" class="text-[#737373] ml-2.5" > <path fill="currentColor" d="M208 80h-32V56a48 48 0 0 0-96 0v24H48a16 16 0 0 0-16 16v112a16 16 0 0 0 16 16h160a16 16 0 0 0 16-16V96a16 16 0 0 0-16-16m-72 78.63V184a8 8 0 0 1-16 0v-25.37a24 24 0 1 1 16 0M160 80H96V56a32 32 0 0 1 64 0Z" /> </svg>

              <input
                :type="showPassword ? 'text' : 'password'"
                placeholder="รหัสผ่าน"
                v-model="form.password"
                class="w-full bg-transparent
                       focus:outline-none text-black font-bold"
              />
            </svg>
          </div>
        </div>
        <div class="flex justify-between items-center w-[500px]">
          <label class="flex items-center gap-2 cursor-pointer select-none">
            <input type="checkbox" v-model="checked" class="peer hidden" />
          </label>

            <span
              class="text-white underline cursor-pointer hover:text-[#A0E13E]"
              @click="handlepassword"
            >
              ลืมรหัสผ่าน?
            </span>
          </div>

          <!-- button -->
          <button
            class="w-full h-[45px]
                   bg-[#A0E13E] rounded-full
                   font-bold text-white shadow-2xl
                   hover:bg-[#80b432] cursor-pointer"
            @click="handleToHomepage"
          >
            เข้าสู่ระบบ
          </button>

          <!-- register -->
          <div class="flex flex-wrap justify-center gap-2 text-sm">
            <p class="text-white">ยังไม่มีบัญชีใช่ไหม ?</p>
            <span class="text-[#A0E13E] cursor-pointer" @click="handleRegister">
              สมัครบัญชี
            </span>
          </div>

          <p v-if="errorMsg" class="text-red-500 text-sm">
            {{ errorMsg }}
          </p>

        </div>
      </div>
    </div>
  </div>
</template>



<script setup>
definePageMeta({ layout: "login" });

import { ref } from "vue";

const checked = ref(true);
const showPassword = ref(false);
const errorMsg = ref("");

// 🔹 ฟอร์มล็อกอิน
const form = ref({
  email: "",
  password: "",
});

const togglePassword = () => {
  showPassword.value = !showPassword.value;
};

const handleRegister = () => {
  navigateTo("/registerscreen");
};

const handlepassword = () => {
  navigateTo("/password");
};

//  ตัวล็อกอินจริง
const handleToHomepage = async () => {
  errorMsg.value = "";

  try {
    const res = await $fetch("/api/login", {
      method: "POST",
      body: form.value,
    });

    if (res.ok) {
      // เก็บ user (ชั่วคราว)
      localStorage.setItem("user", JSON.stringify(res.user));

      // ไปหน้าโปรไฟล์ หรือหน้าแรก
      navigateTo("/");
    } else {
      errorMsg.value = res.message;
    }
  } catch (err) {
    errorMsg.value = "Server error";
  }
};
</script>

<style></style>
