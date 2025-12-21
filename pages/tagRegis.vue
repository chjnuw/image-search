<template>
  <div class="relative w-full h-screen flex justify-center items-center">
    <div class="absolute inset-0 bg-[url('/img/bglogin2.webp')] bg-cover bg-center"></div>
    <div class="absolute inset-0 bg-black/60"></div>

    <div class="w-[720px] bg-white/40 rounded-[60px] shadow-2xl relative z-20 p-8">
      <div class="flex flex-col items-center gap-4">

        <h1 class="text-4xl font-bold text-white text-shadow">
          Choose Your Movie Tag !
        </h1>

        <h2 class="text-lg text-white">
          Choose 3 favorite tags and let us find movies for you
        </h2>

        <!-- TAG GRID -->
        <div class="grid grid-cols-3 gap-4 w-[520px] mt-4">
          <button
            v-for="tag in tags"
            :key="tag.id"
            @click="toggleTag(tag.id)"
            :class="[
              'h-11 rounded-full font-bold shadow-xl transition text-white',
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
          class="mt-6 w-[220px] h-[46px] bg-[#A0E13E] text-white rounded-full font-bold shadow-xl hover:bg-[#80b432]"
          @click="submitTags"
        >
          Register
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


