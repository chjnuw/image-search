<template>
  <transition name="fade">
    <div
      v-if="loading"
      class="fixed inset-0 z-[9999] bg-black/40 cursor-wait pointer-events-auto flex items-center justify-center"
    >
    </div>
  </transition>
</template>

<script setup>
import { useGlobalLoading } from "@/composables/useGlobalLoading"
const { loading } = useGlobalLoading()
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
