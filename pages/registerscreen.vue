
<template>
  <div class="relative w-full min-h-screen flex justify-center items-center">
    <div class="absolute inset-0 bg-[url('/img/bglogin2.webp')] bg-cover bg-center"></div>
    <div class="absolute inset-0 bg-black/50"></div>
    <!-- LOGO : ซ้ายบนเสมอ -->
    <img src="/img/logo.png" alt="logo"
      class="absolute top-4 left-4 z-20 w-[120px] sm:w-[180px] md:w-[240px] lg:w-[300px] drop-shadow-2xl" />

    <div class="relative z-10 w-[700px]  bg-white/45 backdrop-blur-md rounded-[70px] shadow-2xl p-8">
      <div class="w-full h-full flex flex-col items-center gap-4">
        <h1 class="text-4xl font-bold text-[#ffffff] text-shadow-2xl">
          สมัครสมาชิก
        </h1>
        <h2 class="text-lg text-[#ffffff]">
          สมัครสมาชิกเพื่อเริ่มต้นการเดินทางในโลกภาพยนตร์ของคุณ!
        </h2>
        <!-- =================== ชื่อผู้ใช้ =================== -->
        <div class="flex flex-col">
          <div
            class="w-[500px] h-[50px] flex items-center bg-white/50 backdrop-blur-md border border-gray-300 rounded-4xl px-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 512 512"
              class="ml-2.5 text-[#737373]">
              <path fill="currentColor"
                d="M256 42.667A213.333 213.333 0 0 1 469.334 256c0 117.821-95.513 213.334-213.334 213.334c-117.82 0-213.333-95.513-213.333-213.334C42.667 138.18 138.18 42.667 256 42.667m21.334 234.667h-42.667c-52.815 0-98.158 31.987-117.715 77.648c30.944 43.391 81.692 71.685 139.048 71.685s108.104-28.294 139.049-71.688c-19.557-45.658-64.9-77.645-117.715-77.645M256 106.667c-35.346 0-64 28.654-64 64s28.654 64 64 64s64-28.654 64-64s-28.653-64-64-64" />
            </svg>

            <input type="text" placeholder="ชื่อผู้ใช้" v-model="form.name"
              class="flex-1 p-3 bg-transparent focus:outline-none text-black font-extrabold text-shadow-2xl" />
          </div>
          <p v-if="errors.name" class="text-red-600 text-xs mt-0.5 ml-6 text-shadow-5xl">
            {{ errors.name }}
          </p>
        </div>
        <!-- =================== อีเมล =================== -->
        <div class="flex flex-col">
          <div
            class="w-[500px] h-[50px] flex items-center bg-white/50 backdrop-blur-md border border-gray-300 rounded-4xl px-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 20 20"
              class="ml-2.5 text-[#737373]">
              <path fill="currentColor"
                d="m7.172 11.334l2.83 1.935l2.728-1.882l6.115 6.033q-.242.079-.512.08H1.667c-.22 0-.43-.043-.623-.12zM20 6.376v9.457c0 .247-.054.481-.15.692l-5.994-5.914zM0 6.429l6.042 4.132l-5.936 5.858A1.7 1.7 0 0 1 0 15.833zM18.333 2.5c.92 0 1.667.746 1.667 1.667v.586L9.998 11.648L0 4.81v-.643C0 3.247.746 2.5 1.667 2.5z" />
            </svg>

            <input type="text" placeholder="อีเมล" v-model="form.email"
              class="flex-1 p-3 bg-transparent focus:outline-none text-black font-extrabold text-shadow-2xl" />
          </div>
          <p v-if="errors.email" class="text-red-600 text-xs mt-0.5 ml-6">
            {{ errors.email }}
          </p>
        </div>
        <!-- =================== เพศ =================== -->
        <div class="flex flex-col">
          <div class="flex text-white w-[500px] gap-[100px] ml-6">
            <label class="flex items-center gap-2 font-bold">
              <input type="radio" value="1" v-model="form.gender" class="accent-[#90CB38] w-5 h-5" />
              ชาย
            </label>
            <label class="flex items-center gap-2 font-bold">
              <input type="radio" value="2" v-model="form.gender" class="accent-[#90CB38] w-5 h-5" />
              หญิง
            </label>
            <label class="flex items-center gap-2 font-bold">
              <input type="radio" value="3" v-model="form.gender" class="accent-[#90CB38] w-5 h-5" />
              อื่นๆ
            </label>
          </div>
          <p v-if="errors.gender" class="text-red-600 text-xs mt-0.5 ml-6">
            {{ errors.gender }}
          </p>
        </div>
        <!-- วันเดือนปีเกิด -->
        <div class="flex flex-col">
          <div
            class="w-[500px] h-[50px] flex items-center bg-white/50 backdrop-blur-md border border-gray-300 rounded-4xl px-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"
              class="ml-2.5 text-[#737373]">
              <path fill="currentColor"
                d="M7 10h5v5H7zm7 0h3v5h-3zM7 3v2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2V3h-2v2H9V3zm12 16H5V9h14z" />
            </svg>
            <input ref="birthInput" type="text" placeholder="วันเดือนปีเกิด"
              class="flex-1 p-3 bg-transparent font-bold focus:outline-none text-[#737373]" />
          </div>
          <p v-if="errors.birthdate" class="text-red-600 text-xs mt-0.5 ml-6">
            {{ errors.birthdate }}
          </p>
        </div>
        <!-- อายุ  -->
        <div
          class="w-[500px] h-[50px] flex items-center bg-white/40 backdrop-blur-md border border-gray-300 rounded-4xl px-3 opacity-80">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"
            class="ml-2.5 text-[#737373]">
            <path fill="currentColor" d="M12 2a10 10 0 1 0 10 10A10.01
         10.01 0 0 0 12 2m1 15h-2v-6h2zm0-8h-2V7h2z" />
          </svg>

          <input type="text" :value="age ? `${age} ปี` : ''" disabled placeholder="อายุ"
            class="flex-1 p-3 bg-transparent focus:outline-none text-black font-extrabold text-shadow-2xl cursor-not-allowed" />
        </div>
        <!-- =================== รหัสผ่าน =================== -->
        <div class="flex flex-col">
          <div
            class="w-[500px] h-[50px] flex items-center bg-white/55 backdrop-blur-md border border-gray-300 rounded-4xl px-3 text-[#ffffff] font-extrabold text-shadow-2xl justify-between">
            <!-- ซ้าย: ไอคอน + Password -->
            <div class="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 256 256"
                class="text-[#737373] ml-2.5">
                <path fill="currentColor"
                  d="M208 80h-32V56a48 48 0 0 0-96 0v24H48a16 16 0 0 0-16 16v112a16 16 0 0 0 16 16h160a16 16 0 0 0 16-16V96a16 16 0 0 0-16-16m-72 78.63V184a8 8 0 0 1-16 0v-25.37a24 24 0 1 1 16 0M160 80H96V56a32 32 0 0 1 64 0Z" />
              </svg>

              <input :type="showPassword ? 'text' : 'password'" placeholder="รหัสผ่าน" v-model="form.password"
                class="bg-transparent focus:outline-none text-black font-bold" />
            </div>

            <!-- ไอคอนตา -->
            <div @click="togglePassword" class="cursor-pointer">
              <!-- ถ้า show อยู่ → ไอคอนตาเปิด -->
              <svg v-if="showPassword" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 512 512"
                class="text-[#737373] mr-1.5">
                <circle cx="256" cy="256" r="64" fill="currentColor" />
                <path fill="currentColor"
                  d="M490.84 238.6c-26.46-40.92-60.79-75.68-99.27-100.53C349 110.55 302 96 255.66 96c-42.52 0-84.33 12.15-124.27 36.11c-40.73 24.43-77.63 60.12-109.68 106.07a31.92 31.92 0 0 0-.64 35.54c26.41 41.33 60.4 76.14 98.28 100.65C162 402 207.9 416 255.66 416c46.71 0 93.81-14.43 136.2-41.72c38.46-24.77 72.72-59.66 99.08-100.92a32.2 32.2 0 0 0-.1-34.76M256 352a96 96 0 1 1 96-96a96.11 96.11 0 0 1-96 96" />
              </svg>

              <!-- ถ้า show ปิด → ไอคอนตาปิด -->
              <svg v-else xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 512 512"
                class="text-[#737373] mr-1.5">
                <path fill="currentColor"
                  d="M432 448a15.92 15.92 0 0 1-11.31-4.69l-352-352a16 16 0 0 1 22.62-22.62l352 352A16 16 0 0 1 432 448M248 315.85l-51.79-51.79a2 2 0 0 0-3.39 1.69a64.11 64.11 0 0 0 53.49 53.49a2 2 0 0 0 1.69-3.39m16-119.7L315.87 248a2 2 0 0 0 3.4-1.69a64.13 64.13 0 0 0-53.55-53.55a2 2 0 0 0-1.72 3.39" />
                <path fill="currentColor"
                  d="M491 273.36a32.2 32.2 0 0 0-.1-34.76c-26.46-40.92-60.79-75.68-99.27-100.53C349 110.55 302 96 255.68 96a226.5 226.5 0 0 0-71.82 11.79a4 4 0 0 0-1.56 6.63l47.24 47.24a4 4 0 0 0 3.82 1.05a96 96 0 0 1 116 116a4 4 0 0 0 1.05 3.81l67.95 68a4 4 0 0 0 5.4.24a343.8 343.8 0 0 0 67.24-77.4M256 352a96 96 0 0 1-93.3-118.63a4 4 0 0 0-1.05-3.81l-66.84-66.87a4 4 0 0 0-5.41-.23c-24.39 20.81-47 46.13-67.67 75.72a31.92 31.92 0 0 0-.64 35.54c26.41 41.33 60.39 76.14 98.28 100.65C162.06 402 207.92 416 255.68 416a238.2 238.2 0 0 0 72.64-11.55a4 4 0 0 0 1.61-6.64l-47.47-47.46a4 4 0 0 0-3.81-1.05A96 96 0 0 1 256 352" />
              </svg>
            </div>
          </div>
          <p v-if="errors.password" class="text-red-600 text-xs mt-0.5 ml-6">
            {{ errors.password }}
          </p>
        </div>
<button
  type="button"
  :disabled="loading || !acceptTerms"
  class="w-[500px] h-[45px] bg-[#A0E13E] hover:bg-[#78aa2d] 
         text-white rounded-[70px] font-bold shadow-2xl 
         cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
  @click="gototag"
>
  {{ loading ? "กำลังโหลด..." : "ถัดไป" }}
</button>

        <!-- Terms & Conditions -->
<div class="mt-3 ml-1">
  <label class="flex items-start gap-2 text-sm text-gray-700">
    <input
      type="checkbox"
      v-model="acceptTerms"
      class="mt-1 cursor-pointer"
    />

    <span>
      ฉันยอมรับ
      <button
        type="button"
        class="text-[#A0E13E] cursor-pointer hover:text-[#91cd38] underline ml-1"
        @click="showPolicy = true"
      >
        นโยบายความเป็นส่วนตัว
      </button>
    </span>
  </label>

  <p v-if="errors.acceptTerms" class="text-red-600 text-xs mt-1 ml-6">
    {{ errors.acceptTerms }}
  </p>
</div>



        <div class="flex gap-4">
          <p class="text-[#ffffff] text-shadow-2xl">มีบัญชีอยู่แล้วใช่ไหม?</p>
          <span class="text-[#A0E13E] cursor-pointer hover:text-[#91cd38]" @click="gotoLogin">เข้าสู่ระบบ</span>
        </div>
      </div>

      <div @click="togglePassword" class="cursor-pointer">
        <!-- eye open -->
        <svg v-if="showPassword" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 512 512"
          class="text-[#737373] mr-1.5">
          <circle cx="256" cy="256" r="64" fill="currentColor" />
          <path fill="currentColor"
            d="M490.84 238.6c-26.46-40.92-60.79-75.68-99.27-100.53C349 110.55 302 96 255.66 96c-42.52 0-84.33 12.15-124.27 36.11c-40.73 24.43-77.63 60.12-109.68 106.07a31.92 31.92 0 0 0-.64 35.54c26.41 41.33 60.4 76.14 98.28 100.65C162 402 207.9 416 255.66 416c46.71 0 93.81-14.43 136.2-41.72c38.46-24.77 72.72-59.66 99.08-100.92a32.2 32.2 0 0 0-.1-34.76M256 352a96 96 0 1 1 96-96a96.11 96.11 0 0 1-96 96" />
        </svg>

        <!-- eye close -->
        <svg v-else xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 512 512"
          class="text-[#737373] mr-1.5">
          <path fill="currentColor"
            d="M432 448a15.92 15.92 0 0 1-11.31-4.69l-352-352a16 16 0 0 1 22.62-22.62l352 352A16 16 0 0 1 432 448M248 315.85l-51.79-51.79a2 2 0 0 0-3.39 1.69a64.11 64.11 0 0 0 53.49 53.49a2 2 0 0 0 1.69-3.39m16-119.7L315.87 248a2 2 0 0 0 3.4-1.69a64.13 64.13 0 0 0-53.55-53.55a2 2 0 0 0-1.72 3.39" />
          <path fill="currentColor"
            d="M491 273.36a32.2 32.2 0 0 0-.1-34.76c-26.46-40.92-60.79-75.68-99.27-100.53C349 110.55 302 96 255.68 96a226.5 226.5 0 0 0-71.82 11.79a4 4 0 0 0-1.56 6.63l47.24 47.24a4 4 0 0 0 3.82 1.05a96 96 0 0 1 116 116a4 4 0 0 0 1.05 3.81l67.95 68a4 4 0 0 0 5.4.24a343.8 343.8 0 0 0 67.24-77.4M256 352a96 96 0 0 1-93.3-118.63a4 4 0 0 0-1.05-3.81l-66.84-66.87a4 4 0 0 0-5.41-.23c-24.39 20.81-47 46.13-67.67 75.72a31.92 31.92 0 0 0-.64 35.54c26.41 41.33 60.39 76.14 98.28 100.65C162.06 402 207.92 416 255.68 416a238.2 238.2 0 0 0 72.64-11.55a4 4 0 0 0 1.61-6.64l-47.47-47.46a4 4 0 0 0-3.81-1.05A96 96 0 0 1 256 352" />
        </svg>
      </div>
    </div>
  </div>
  <div
  v-if="showPolicy"
  class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
>
  <div class="bg-white rounded-xl w-[90%] max-w-lg p-6 relative">
    <h2 class="text-lg font-bold mb-3">
      นโยบายความเป็นส่วนตัว
    </h2>

    <div class="text-sm text-gray-700 space-y-2 max-h-[300px] overflow-y-auto">
      <p>
        เว็บไซต์นี้จะเก็บข้อมูลส่วนบุคคล เช่น ชื่อ อีเมล เพศ และวันเกิด
        เพื่อใช้ในการสมัครสมาชิกและให้บริการเท่านั้น
      </p>
      <p>
        ข้อมูลของคุณจะไม่ถูกเปิดเผยแก่บุคคลภายนอก
        เว้นแต่เป็นไปตามที่กฎหมายกำหนด
      </p>
    </div>

    <div class="flex justify-end mt-4">
      <button
        class="px-4 py-2 bg-[#A0E13E] hover:bg-[#78aa2d] text-white rounded-lg cursor-pointer"
        @click="showPolicy = false"
      >
        ปิด
      </button>
    </div>
  </div>
</div>

</template>

<script setup>
definePageMeta({
  layout: "guest"
});
import { ref, watch, onMounted } from "vue";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.css";
import { Thai } from "flatpickr/dist/l10n/th.js";
  // form
  const form = ref({
    name: "",
    email: "",
    password: "",
    gender: "",
    birthdate: "", 
    age: null,
  });
  const acceptTerms = ref(false)
const errors = ref({
  name: "",
  email: "",
  password: "",
  gender: "",
  birthdate: "",
  acceptTerms: ""
});
const validatePassword = (password) => {
  const regex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,10}$/;
  return regex.test(password);
};
const validateEmail = (email) => {
  const regex =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

const validateForm = () => {
  let valid = true;

  // reset error
  Object.keys(errors.value).forEach(
    (k) => (errors.value[k] = "")
  );

  if (!form.value.name) {
    errors.value.name = "กรุณากรอกชื่อผู้ใช้";
    valid = false;
  }

  if (!form.value.email) {
    errors.value.email = "กรุณากรอกอีเมล";
    valid = false;
  } else if (!validateEmail(form.value.email)) {
    errors.value.email = "รูปแบบอีเมลไม่ถูกต้อง";
    valid = false;
  }

  if (!form.value.password) {
    errors.value.password = "กรุณากรอกรหัสผ่าน";
    valid = false;
  } else if (!validatePassword(form.value.password)) {
    errors.value.password =
      "รหัสผ่านต้องมีอย่างน้อย 8 ตัวแต่ไม่เกิน10ตัว และประกอบด้วย A-Z, a-z และตัวเลข";
    valid = false;
  }

  if (!form.value.gender) {
    errors.value.gender = "กรุณาเลือกเพศ";
    valid = false;
  }

  if (!form.value.birthdate) {
    errors.value.birthdate = "กรุณาเลือกวันเกิด";
    valid = false;
  } else {
    //  เช็กอายุขั้นต่ำ 10 ปี
    const birth = new Date(form.value.birthdate);
    const today = new Date();

    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();

    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }

    if (age < 10) {
      errors.value.birthdate = "ต้องมีอายุอย่างน้อย 10 ปี";
      valid = false;
    }
  }
  if (!acceptTerms.value) {
    errors.value.acceptTerms = "กรุณายอมรับเงื่อนไขก่อนสมัคร";
    valid = false;
  }
return valid;
};
const showPolicy = ref(false)
  // age
  const age = ref(null);
  // flatpickr ref
  const birthInput = ref(null);
  onMounted(() => {
    const today = new Date();
    const maxDate = new Date(
      today.getFullYear() - 10,
      today.getMonth(),
      today.getDate()
    );

    flatpickr(birthInput.value, {
      locale: Thai,
      dateFormat: "d/m/Y",
      disableMobile: true,
      maxDate, // ✅ สำคัญ

      onChange: (selectedDates) => {
        if (!selectedDates[0]) {
          form.value.birthdate = "";
          return;
        }

        const d = selectedDates[0];
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");

        form.value.birthdate = `${y}-${m}-${day}`;
      },
    });
  });
  // watch birthdate → คำนวณอายุ
  // --------------------
  watch(
    () => form.value.birthdate,
    (newDate) => {
      if (!newDate) {
        age.value = null;
        return;
      }

      const birth = new Date(`${newDate}T00:00:00`);
      if (isNaN(birth)) return;

      const today = new Date();
      let years = today.getFullYear() - birth.getFullYear();

      const m = today.getMonth() - birth.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
        years--;
      }

      age.value = years;
      form.value.age = years;
    }
  );
  // password toggle
  // --------------------
  const showPassword = ref(false);
  const togglePassword = () => {
    showPassword.value = !showPassword.value;
  };
  // register
  // --------------------
  const loading = ref(false);
  const errorMsg = ref("");

  const gototag = async () => {
    if (loading.value) return;

    if (!validateForm()) {
      return;
    }

    loading.value = true;

    try {
      const res = await $fetch("/api/register", {
        method: "POST",
        body: form.value,
      });
     console.log("REGISTER RES:", res);


     if (res?.ok && res.userId !== undefined) {
  navigateTo(`/verify-email?email=${form.value.email}`);
  return;
}
      alert(res.message || "Register failed");
    } catch (err) {
      console.error(err);
      alert("API error");
    } finally {
      loading.value = false;
    }
  };
  const gotoLogin = () => {
    navigateTo("/logInscreen");
  };
</script>

<style></style>
