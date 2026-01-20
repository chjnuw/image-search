<template>
<ClientOnly>
  <Navbar />
  <main
    class="overflow-auto bg-black text-white min-h-screen" >
    <slot />
  </main>

  <Footer />
  <GlobalLoading />
</ClientOnly>
</template>
<script setup>


</script>
