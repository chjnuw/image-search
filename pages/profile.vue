<template>
  <!-- ⏳ กำลังเช็ค -->
  <div
    v-if="pending"
    class="w-full min-h-screen bg-[#0B0A0A] flex items-center justify-center"
  >
    <h1 class="text-white">กำลังโหลด...</h1>
  </div>

  <!--  ไม่ได้ล็อกอิน -->
  <div
    v-else-if="!isLoggedIn"
    class="w-full min-h-screen bg-[#0B0A0A] flex items-center justify-center"
  >
    <div class="flex flex-col items-center gap-6 text-center">
      <h1 class="text-white text-2xl">คุณยังไม่ได้ล็อกอินบัญชีผู้ใช้</h1>

      <button
        @click="goToLogin"
        class="px-8 py-3 bg-[#90CB38] text-white text-shadow-4xl rounded-xl font-medium cursor-pointer hover:bg-[#6da11f]"
      >
        เข้าสู่ระบบ
      </button>
    </div>
  </div>

  <!-- ล็อกอินแล้ว -->
  <div v-else class="w-full min-h-screen flex bg-[#0B0A0A] gap-20 px-6 pb-20 ">
    <div
      class="w-[350px] h-[450px] bg-[#0B0A0A] mt-35 rounded-4xl flex flex-col shadow-2xl justify-between "
    >
      <div class="">
        <div
          @click="activeTab = 'profile'"
          class="px-4 py-2 bg-[#0B0A0A] hover:bg-[#90CB38] cursor-pointer flex items-center justify-center"
          :class="{ 'bg-[#90CB38]': activeTab === 'profile' }">
          <h1 class="text-lg">Profile</h1>
        </div>

        <div
          @click="activeTab = 'password'"
          class="px-4 py-2 bg-[#0B0A0A] hover:bg-[#90CB38] cursor-pointer flex items-center justify-center"
          :class="{ 'bg-[#90CB38]': activeTab === 'password' }">
          <h1 class="text-lg">Password</h1>
        </div>
      </div>

      <div
        @click="showLogout = true"
        class="px-4 py-2 bg-[#151414] hover:bg-[#90CB38] rounded-br-4xl cursor-pointer flex items-center justify-center"
      >
        <h1 class="text-[#eb1313] text-lg">Log out</h1>
      </div>
    </div>
  </div>

  <!-- CONTENT -->
  <div class="flex-1 w-full">
    <CardProfile v-if="activeTab === 'profile'" />
    <CardProfilepassword v-if="activeTab === 'password'" />
  </div>

  <logout v-if="showLogout" @close="showLogout = false" />
</div>

</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";

import CardProfile from "~/components/cardProfile.vue";
import CardProfilepassword from "~/components/cardProfilepassword.vue";
import logout from "~/components/logout.vue";

const router = useRouter();

const activeTab = ref("profile");
const showLogout = ref(false);

//  ตัวตัดสิน login
const { data, pending, error } = await useFetch("/api/profile", {
  credentials: "include",
  throw: false, // สำคัญมาก
});

//  logic เดียว
const isLoggedIn = computed(() => {
  if (pending.value) return false;
  if (error.value) return false;
  return true;
});

const goToLogin = () => {
  router.push("/logInscreen");
};

</script>
