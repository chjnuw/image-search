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
        class="w-full
               max-w-[380px]
               sm:max-w-[480px]
               lg:max-w-[700px]
               bg-white/45 backdrop-blur-md
               rounded-[28px] sm:rounded-[40px] lg:rounded-[70px]
               shadow-2xl
               p-5 sm:p-8"
      >
        <div class="w-full flex flex-col items-center gap-4">

          <h1 class="text-2xl sm:text-3xl lg:text-4xl font-bold text-white text-shadow-2xl">
            สมัครสมาชิก
          </h1>
          <h2 class="text-sm sm:text-base text-white text-center">
            สมัครสมาชิกเพื่อเริ่มต้นการเดินทางในโลกภาพยนตร์ของคุณ!
          </h2>

          <!-- username -->
          <div class="w-full h-[48px] flex items-center bg-white/50 border border-gray-300 rounded-full px-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 512 512" class="ml-2.5 text-[#737373]"> <path fill="currentColor" fill-rule="evenodd" d="M256 42.667A213.333 213.333 0 0 1 469.334 256c0 117.821-95.513 213.334-213.334 213.334c-117.82 0-213.333-95.513-213.333-213.334C42.667 138.18 138.18 42.667 256 42.667m21.334 234.667h-42.667c-52.815 0-98.158 31.987-117.715 77.648c30.944 43.391 81.692 71.685 139.048 71.685s108.104-28.294 139.049-71.688c-19.557-45.658-64.9-77.645-117.715-77.645M256 106.667c-35.346 0-64 28.654-64 64s28.654 64 64 64s64-28.654 64-64s-28.653-64-64-64" /> </svg>
            <input
              type="text"
              placeholder="ชื่อผู้ใช้"
              v-model="form.name"
              class="flex-1 p-3 bg-transparent focus:outline-none
                     text-black font-extrabold text-shadow-2xl"
            />
          </div>

          <!-- email -->
          <div class="w-full h-[48px] flex items-center bg-white/50 border border-gray-300 rounded-full px-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 20 20" class="ml-2.5 text-[#737373]"> <path fill="currentColor" fill-rule="evenodd" d="m7.172 11.334l2.83 1.935l2.728-1.882l6.115 6.033q-.242.079-.512.08H1.667c-.22 0-.43-.043-.623-.12zM20 6.376v9.457c0 .247-.054.481-.15.692l-5.994-5.914zM0 6.429l6.042 4.132l-5.936 5.858A1.7 1.7 0 0 1 0 15.833zM18.333 2.5c.92 0 1.667.746 1.667 1.667v.586L9.998 11.648L0 4.81v-.643C0 3.247.746 2.5 1.667 2.5z" /> </svg>
            <input
              type="text"
              placeholder="อีเมล"
              v-model="form.email"
              class="flex-1 p-3 bg-transparent focus:outline-none
                     text-black font-extrabold text-shadow-2xl"
            />
          </div>

          <!-- gender -->
          <div class="w-full flex flex-wrap gap-6 justify-center text-white font-bold">
            <label class="flex items-center gap-2">
              <input type="radio" value="1" v-model="form.gender" class="accent-[#90CB38] w-5 h-5" /> ชาย
            </label>
            <label class="flex items-center gap-2">
              <input type="radio" value="2" v-model="form.gender" class="accent-[#90CB38] w-5 h-5" /> หญิง
            </label>
            <label class="flex items-center gap-2">
              <input type="radio" value="3" v-model="form.gender" class="accent-[#90CB38] w-5 h-5" /> อื่นๆ
            </label>
          </div>

          <!-- birthdate -->
          <div class="w-full h-[48px] flex items-center bg-white/50 border border-gray-300 rounded-full px-3">
           <input
  ref="birthInput"
  type="text"
  placeholder="วว/ดด/ปปปป"
  readonly
  class="flex-1 p-3 bg-transparent focus:outline-none
         text-black font-extrabold text-shadow-2xl"
/>

          </div>

          <!-- age -->
          <div class="w-full h-[48px] flex items-center bg-white/40 border border-gray-300 rounded-full px-3 opacity-80">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" class="ml-2.5 text-[#737373]"> <path fill="currentColor" d="M12 2a10 10 0 1 0 10 10A10.01 10.01 0 0 0 12 2m1 15h-2v-6h2zm0-8h-2V7h2z"/> </svg>
            <input
              type="text"
              :value="age ? `${age} ปี` : ''"
              disabled
              placeholder="อายุ"
              class="flex-1 p-3 bg-transparent focus:outline-none
                     text-black font-extrabold text-shadow-2xl cursor-not-allowed"
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
            </div>

       <!-- eye (อันเดิมตามที่ขอ) -->
            <div @click="togglePassword" class="cursor-pointer">
              <!-- eye open -->
              <svg
                v-if="showPassword"
                xmlns="http://www.w3.org/2000/svg"
                width="24" height="24"
                viewBox="0 0 512 512"
                class="text-[#737373] mr-1.5"
              >
                <circle cx="256" cy="256" r="64" fill="currentColor" />
                <path fill="currentColor" d="M490.84 238.6c-26.46-40.92-60.79-75.68-99.27-100.53C349 110.55 302 96 255.66 96c-42.52 0-84.33 12.15-124.27 36.11c-40.73 24.43-77.63 60.12-109.68 106.07a31.92 31.92 0 0 0-.64 35.54c26.41 41.33 60.4 76.14 98.28 100.65C162 402 207.9 416 255.66 416c46.71 0 93.81-14.43 136.2-41.72c38.46-24.77 72.72-59.66 99.08-100.92a32.2 32.2 0 0 0-.1-34.76M256 352a96 96 0 1 1 96-96a96.11 96.11 0 0 1-96 96"/>
              </svg>

              <!-- eye close -->
              <svg v-else xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 512 512" class="text-[#737373] mr-1.5" > <path fill="currentColor" d="M432 448a15.92 15.92 0 0 1-11.31-4.69l-352-352a16 16 0 0 1 22.62-22.62l352 352A16 16 0 0 1 432 448M248 315.85l-51.79-51.79a2 2 0 0 0-3.39 1.69a64.11 64.11 0 0 0 53.49 53.49a2 2 0 0 0 1.69-3.39m16-119.7L315.87 248a2 2 0 0 0 3.4-1.69a64.13 64.13 0 0 0-53.55-53.55a2 2 0 0 0-1.72 3.39" /> <path fill="currentColor" d="M491 273.36a32.2 32.2 0 0 0-.1-34.76c-26.46-40.92-60.79-75.68-99.27-100.53C349 110.55 302 96 255.68 96a226.5 226.5 0 0 0-71.82 11.79a4 4 0 0 0-1.56 6.63l47.24 47.24a4 4 0 0 0 3.82 1.05a96 96 0 0 1 116 116a4 4 0 0 0 1.05 3.81l67.95 68a4 4 0 0 0 5.4.24a343.8 343.8 0 0 0 67.24-77.4M256 352a96 96 0 0 1-93.3-118.63a4 4 0 0 0-1.05-3.81l-66.84-66.87a4 4 0 0 0-5.41-.23c-24.39 20.81-47 46.13-67.67 75.72a31.92 31.92 0 0 0-.64 35.54c26.41 41.33 60.39 76.14 98.28 100.65C162.06 402 207.92 416 255.68 416a238.2 238.2 0 0 0 72.64-11.55a4 4 0 0 0 1.61-6.64l-47.47-47.46a4 4 0 0 0-3.81-1.05A96 96 0 0 1 256 352" /> </svg>
            </div>
          </div>
          

          <button
            class="w-full h-[45px]
                   bg-[#A0E13E] rounded-full
                   font-bold text-white shadow-2xl
                   hover:bg-[#80b432] cursor-pointer"
            @click="gototag"
          >
            ถัดไป
          </button>

          <div class="flex flex-wrap justify-center gap-2 text-sm">
            <p class="text-white">มีบัญชีอยู่แล้วใช่ไหม?</p>
            <span class="text-[#A0E13E] cursor-pointer" @click="gotoLogin">
              เข้าสู่ระบบ
            </span>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>


<script setup>
definePageMeta({ layout: "login" })

import { ref, watch, onMounted } from 'vue'
import flatpickr from 'flatpickr'
import 'flatpickr/dist/flatpickr.css'
import { Thai } from 'flatpickr/dist/l10n/th.js'

// --------------------
// form
// --------------------
const form = ref({
  name: '',
  email: '',
  password: '',
  gender: '',
  birthdate: '', // 👉 ส่ง backend เป็น YYYY-MM-DD
  age: null
})

// --------------------
// age
// --------------------
const age = ref(null)

// --------------------
// flatpickr ref
// --------------------
const birthInput = ref(null)

// --------------------
// init flatpickr
// --------------------
onMounted(() => {
  flatpickr(birthInput.value, {
    locale: Thai,
    dateFormat: 'd/m/Y', // ✅ แสดง วว/ดด/ปปปป
    disableMobile: true,
    maxDate: new Date(2016, 11, 31),
    
    onChange: (selectedDates) => {
      if (!selectedDates[0]) {
        form.value.birthdate = ''
        return
      }

      const d = selectedDates[0]
      const y = d.getFullYear()
      const m = String(d.getMonth() + 1).padStart(2, '0')
      const day = String(d.getDate()).padStart(2, '0')

      // ✅ ค่า backend (ไม่พัง API)
      form.value.birthdate = `${y}-${m}-${day}`
    }
  })
})

// --------------------
// watch birthdate → คำนวณอายุ
// --------------------
watch(() => form.value.birthdate, (newDate) => {
  if (!newDate) {
    age.value = null
    form.value.age = null
    return
  }

  const today = new Date()
  const birth = new Date(newDate)

  let years = today.getFullYear() - birth.getFullYear()
  const m = today.getMonth() - birth.getMonth()

  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    years--
  }

  age.value = years
  form.value.age = years
})

// --------------------
// password toggle
// --------------------
const showPassword = ref(false)
const togglePassword = () => {
  showPassword.value = !showPassword.value
}

// --------------------
// register
// --------------------
const loading = ref(false)
const errorMsg = ref('')

const gototag = async () => {
  if (loading.value) return
  loading.value = true

  try {
    const res = await $fetch('/api/register', {
      method: 'POST',
      body: form.value
    })

    if (res.userId) {
      navigateTo(`/tagRegis?userId=${res.userId}`)
      return
    }

    alert(res.message || 'Register failed')
  } catch (err) {
    console.error(err)
    alert('API error')
  } finally {
    loading.value = false
  }
}

const gotoLogin = () => {
  navigateTo('/logInscreen')
}
</script>



<style></style>
