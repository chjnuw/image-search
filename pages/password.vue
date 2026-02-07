<template>
  <div
    class="relative w-full min-h-screen bg-[url('/img/bglogin2.webp')] bg-cover bg-center"
  >
    <!-- overlay -->
    <div class="absolute inset-0 bg-black/50"></div>

    <!-- logo (ซ้ายบน ตลอด) -->
    <img
      src="/img/logo.png"
      alt="logo"
      class="absolute top-4 left-4 sm:top-6 sm:left-6 w-[80px] h-[80px] sm:w-[110px] sm:h-[110px] lg:w-[140px] lg:h-[140px] z-20 shadow-2xl"
    />

    <!-- center wrapper -->
    <div
      class="relative z-20 min-h-screen flex items-center justify-center px-4"
    >
      <!-- card -->
      <div
        class="w-full max-w-[380px] sm:max-w-[500px] lg:max-w-[700px] bg-white/45 backdrop-blur-md rounded-[28px] sm:rounded-[40px] lg:rounded-[70px] shadow-2xl p-5 sm:p-8"
      >
        <div class="w-full flex flex-col items-center gap-4">
          <h1
            class="text-2xl sm:text-3xl lg:text-4xl font-bold text-white text-shadow-2xl"
          >
            ลืมรหัสผ่าน?
          </h1>

          <h2 class="text-sm sm:text-base text-white font-bold text-center">
            รีเซ็ตรหัสผ่านของคุณอย่างปลอดภัยผ่านบัญชีอีเมลของคุณ
          </h2>

          <img
            src="/img/passwordicon.png"
            alt=""
            class="w-[60px] sm:w-[90px]"
          />

          <!-- email -->
          <div
            class="w-full h-[48px] flex items-center bg-white/50 backdrop-blur-md border border-gray-300 rounded-full px-3"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              viewBox="0 0 20 20"
              class="ml-2 text-[#737373]"
            >
              <path
                fill="currentColor"
                fill-rule="evenodd"
                d="m7.172 11.334l2.83 1.935l2.728-1.882l6.115 6.033q-.242.079-.512.08H1.667c-.22 0-.43-.043-.623-.12zM20 6.376v9.457c0 .247-.054.481-.15.692l-5.994-5.914zM0 6.429l6.042 4.132l-5.936 5.858A1.7 1.7 0 0 1 0 15.833zM18.333 2.5c.92 0 1.667.746 1.667 1.667v.586L9.998 11.648L0 4.81v-.643C0 3.247.746 2.5 1.667 2.5z"
              />
            </svg>

            <input
              v-model="email"
              type="text"
              placeholder="อีเมล"
              class="flex-1 p-3 bg-transparent focus:outline-none text-black font-extrabold"
            />
          </div>

          <!-- button -->
          <button
            class="w-full h-[45px] bg-[#A0E13E] text-white rounded-full font-bold shadow-2xl hover:bg-[#80b432] disabled:opacity-50 cursor-pointer"
            style="text-shadow: 0px 0px 8px rgba(0, 0, 0, 0.5)"
            @click="handleVertify"
            :disabled="loading"
          >
            {{ loading ? "Sending..." : "ขอรหัสยืนยันตัวตน" }}
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

import { ref } from "vue";
const email = ref("");
const loading = ref(false);

const handleVertify = async () => {
  if (!email.value) {
    alert("กรุณากรอกอีเมล");
    return;
  }

  if (loading.value) return;
  loading.value = true;

  try {
    await $fetch("/api/auth/forgot-password", {
      method: "POST",
      body: { email: email.value },
    });

    useState("resetEmail").value = email.value;
    navigateTo("/verifyEmail");
  } catch (err) {
    alert(err?.data?.statusMessage || "Something went wrong");
  } finally {
    loading.value = false;
  }
};

const checked = ref(true);
</script>

<style></style>
