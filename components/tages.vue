<template>
  <div class="flex flex-wrap gap-2 p-1 text-sm justify-center ">
    <div class="text-center w-full">
      <!-- <button
        class="p-2 bg-[#A0E13E] rounded-full text-white text-shadow-lg/20 cursor-pointer hover:text-black hover:bg-[#90CB38] transition-colors duration-200"
      >
        # {{ name }} 
      </button> -->
      <div
        class="p-2 text-white text-shadow-lg/20 cursor-pointer hover:text-black hover:bg-[#90CB38] transition-colors duration-200"
      >
        # {{ name }} 
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  
  name: String,
});
</script>
