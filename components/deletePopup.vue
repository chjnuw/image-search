<template>
  <div class="fixed inset-0 bg-black/60 flex items-center justify-center z-999">
    <div class="w-[525px] h-[293px] rounded-[30px] bg-[#ffffff] flex flex-col justify-center items-center gap-3 shadow-2xl">
        
        <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" 
             viewBox="0 0 24 24" class="text-[#FF0000]">
            <path fill="currentColor" d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10s-4.477 10-10 10m-1-7v2h2v-2zm2-1.645A3.502 3.502 0 0 0 12 6.5a3.5 3.5 0 0 0-3.433 2.813l1.962.393A1.5 1.5 0 1 1 12 11.5a1 1 0 0 0-1 1V14h2z"/>
        </svg>

        <p class="text-[#000000] font-bold text-[18px] text-center px-4">
            Are you sure you want to delete your account?
        </p>

        <div class="flex gap-4 mt-2">
            <!-- ปุ่ม Cancel -->
            <button 
                @click="$emit('close')"
                class="w-[136px] h-10 rounded-[20px] text-[#FF0000] font-bold border-2 border-[#FF0000] hover:text-white hover:bg-[#ff0000] cursor-pointer">
                Cancel
            </button>

            <!-- ปุ่ม Confirm -->
            <button 
            @click="handledelete"
                class="w-[136px] h-10 rounded-[20px] text-white font-bold bg-[#A0E13E] hover:bg-[#7fbb32] cursor-pointer">
                Confirm
            </button>
        </div>

    </div>

  </div>
</template>
<script setup>
const handledelete = async () => {
  await $fetch('/api/account', {
    method: 'DELETE',
    credentials: 'include'
  })

  navigateTo('/logInscreen')
}
</script>


