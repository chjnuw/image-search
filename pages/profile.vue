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
    class="w-full min-h-screen bg-[#0B0A0A] flex items-center justify-center px-4"
  >
    <div class="flex flex-col items-center gap-6 text-center">
      <h1 class="text-white text-xl sm:text-2xl">
        คุณยังไม่ได้ล็อกอินบัญชีผู้ใช้
      </h1>

      <button
        @click="goToLogin"
        class="px-6 sm:px-8 py-2.5 sm:py-3 bg-[#90CB38] text-white text-shadow-4xl rounded-xl font-medium cursor-pointer hover:bg-[#6da11f]"
      >
        เข้าสู่ระบบ
      </button>
    </div>
  </div>

  <!-- ล็อกอินแล้ว -->
  <div
    v-else
    class="w-full min-h-screen flex flex-col lg:flex-row bg-[#0B0A0A] gap-8 lg:gap-20 px-4 sm:px-6 pb-20"
  >
    <!-- SIDEBAR -->
    <div
      class="w-full lg:w-[350px] h-auto lg:h-[450px] bg-[#0B0A0A] mt-24 lg:mt-35 rounded-3xl lg:rounded-4xl flex flex-col shadow-2xl justify-between"
    >
      <div>
        <div
          @click="activeTab = 'profile'"
          class="px-4 py-2 bg-[#0B0A0A] hover:bg-[#90CB38] cursor-pointer flex items-center justify-center rounded-tl-3xl rounded-tr-3xl"
          :class="{ 'bg-[#90CB38]': activeTab === 'profile' }"
        >
          <h1 class="text-base sm:text-lg">โปรไฟล์</h1>
        </div>

        <div
          @click="activeTab = 'password'"
          class="px-4 py-2 bg-[#0B0A0A] hover:bg-[#90CB38] cursor-pointer flex items-center justify-center"
          :class="{ 'bg-[#90CB38]': activeTab === 'password' }"
        >
          <h1 class="text-base sm:text-lg">รหัสผ่าน</h1>
        </div>

        <div
          @click="activeTab = 'chart'"
          class="px-4 py-2 bg-[#0B0A0A] hover:bg-[#90CB38] cursor-pointer flex items-center justify-center"
          :class="{ 'bg-[#90CB38]': activeTab === 'chart' }"
        >
          <h1 class="text-base sm:text-lg">สถิติ</h1>
        </div>
      </div>

      <div
        @click="showLogout = true"
        class="px-4 py-2 bg-[#151414] hover:bg-[#90CB38] rounded-b-3xl lg:rounded-br-4xl h-[48px] cursor-pointer flex items-center justify-center"
      >
        <h1 class="text-[#eb1313] text-base sm:text-lg">ออกจากระบบ</h1>
      </div>
    </div>

    <!-- CONTENT -->
    <div class="flex-1 w-full mt-1">
      <CardProfile v-if="activeTab === 'profile'" />
      <CardProfilepassword v-if="activeTab === 'password'" />
      <TastePie v-if="activeTab === 'chart'"/>
    </div>

    <logout v-if="showLogout" @close="showLogout = false" />
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";

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
