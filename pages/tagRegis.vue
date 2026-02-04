<template>
  <div
    class="relative w-full min-h-screen
           flex justify-center items-center
           bg-[url('/img/bglogin2.webp')] bg-cover bg-center"
  >
    <!-- overlay -->
    <div class="absolute inset-0 bg-black/60"></div>

    <!-- LOGO : ซ้ายบนเสมอ -->
    <img
      src="/img/logo.png"
      alt="logo"
      class="absolute top-4 left-4 sm:top-6 sm:left-6
             w-[80px] h-[80px]
             sm:w-[110px] sm:h-[110px]
             lg:w-[140px] lg:h-[140px]
             z-20 shadow-2xl"
    />

    <!-- CARD -->
    <div
      class="relative z-20
             w-full max-w-[380px]
             sm:max-w-[520px]
             lg:max-w-[720px]
             bg-white/45 backdrop-blur-md
             rounded-[32px] sm:rounded-[48px] lg:rounded-[60px]
             shadow-2xl
             p-5 sm:p-6 lg:p-8"
    >
      <div class="flex flex-col items-center gap-4">

        <h1 class="text-2xl sm:text-3xl lg:text-4xl font-bold text-white text-shadow">
         เลือกแท็กภาพยนตร์ที่คุณชอบ!
        </h1>

        <h2 class="text-sm sm:text-base lg:text-lg text-white text-center">
          เลือกแท็กที่คุณชื่นชอบ 3 แท็ก แล้วให้เราช่วยแนะนำภาพยนตร์ที่เหมาะกับคุณ
        </h2>

        <!-- TAG GRID -->
        <div
          class="grid grid-cols-2 sm:grid-cols-3
                 gap-3 sm:gap-4
                 w-full max-w-[300px] sm:max-w-[520px]
                 mt-4"
        >
          <button
            v-for="tag in tags"
            :key="tag.id"
            @click="toggleTag(tag.id)"
            :class="[
              'h-10 sm:h-11 rounded-full font-bold shadow-xl transition text-[#ffffff] text-shadow-8xl',
              selectedTags.includes(tag.id)
                ? 'bg-[#A0E13E]'
                : 'bg-white/50 hover:bg-[#A0E13E]/70'
            ]"
          >
            #{{ tag.name }}
          </button>
        </div>

        <!-- ERROR -->
        <p v-if="errorMsg" class="text-red-500 font-bold mt-2">
          {{ errorMsg }}
        </p>

        <!-- REGISTER BUTTON -->
        <button
          class="mt-6 w-[180px] sm:w-[220px] h-[44px] sm:h-[46px]
                 bg-[#A0E13E] text-white rounded-full
                 font-bold shadow-xl hover:bg-[#80b432] cursor-pointer"
          @click="submitTags"
        >
          สมัครบัญชี
        </button>

      </div>
    </div>
  </div>
</template>


<script setup>
definePageMeta({ layout: 'login' })

import { ref } from 'vue'
import { useRoute } from '#app'

const route = useRoute()
const userId = route.query.userId

const { data: tags } = await useFetch('/api/tag')

const selectedTags = ref([])
const errorMsg = ref('')

const toggleTag = (tagId) => {
  if (selectedTags.value.includes(tagId)) {
    selectedTags.value = selectedTags.value.filter(t => t !== tagId)
    return
  }

  if (selectedTags.value.length < 3) {
    selectedTags.value.push(tagId)
  }
}

const submitTags = async () => {
  console.log('🔥 submitTags called')

  try {
    const res = await $fetch('/api/user/tag', {
      method: 'POST',
      body: {
        userId,
        tags: selectedTags.value
      }
    })

    console.log('🔥 API RES =', res)

    if (res.ok) {
      navigateTo('/logInscreen')
    } else {
      errorMsg.value = res.message
    }
  } catch (err) {
    console.error('🔥 FETCH ERROR', err)
  }
}

</script>


