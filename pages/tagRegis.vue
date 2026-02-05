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
            :disabled="isDisabled(tag.id)"
            :class="[
              'h-11 rounded-full font-bold shadow-xl transition',
              selectedTags.includes(tag.id)
                ? 'bg-[#A0E13E] text-black'
                : 'bg-white/50 text-white text-shadow-5xl hover:bg-[#A0E13E]/70',
              isDisabled(tag.id) && !selectedTags.includes(tag.id)
                ? 'opacity-40 cursor-not-allowed'
                : ''
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
          class="mt-6 w-[220px] h-[46px] bg-[#A0E13E] text-black rounded-full font-bold shadow-xl
                 hover:bg-[#80b432] disabled:opacity-40 disabled:cursor-not-allowed"
          :disabled="selectedTags.length !== 3"
          @click="submitTags"
        >
          Register
        </button>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'login' })

import { ref } from 'vue'

/* ---------- ROUTE ---------- */
const route = useRoute()
const userId = route.query.userId

/* ---------- TAGS (NO CACHE) ---------- */
const { data: tags, refresh } = await useFetch('/api/tag', {
  server: false,
  key: 'tag-list'
})

/* ---------- STATE ---------- */
const selectedTags = ref<number[]>([])
const errorMsg = ref('')

/* ---------- METHODS ---------- */
const toggleTag = (tagId: number) => {
  errorMsg.value = ''

  if (selectedTags.value.includes(tagId)) {
    selectedTags.value = selectedTags.value.filter(id => id !== tagId)
    return
  }

  if (selectedTags.value.length >= 3) {
    errorMsg.value = 'You can select up to 3 tags only'
    return
  }

  selectedTags.value.push(tagId)
}

const isDisabled = (tagId: number) =>
  selectedTags.value.length === 3 &&
  !selectedTags.value.includes(tagId)

const submitTags = async () => {
  errorMsg.value = ''

  if (selectedTags.value.length !== 3) {
    errorMsg.value = 'Please select exactly 3 tags'
    return
  }

  try {
    const res = await $fetch('/api/user/tag', {
      method: 'POST',
      body: {
        userId,
        tags: selectedTags.value
      }
    })

    if (res?.ok) {
      navigateTo('/logInscreen')
    } else {
      errorMsg.value = res?.message || 'Something went wrong'
    }
  } catch (err) {
    console.error(err)
    errorMsg.value = 'Server error'
  }
}
</script>
