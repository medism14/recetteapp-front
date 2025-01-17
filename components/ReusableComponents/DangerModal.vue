<!-- @format -->

<script setup lang="ts">
defineProps<{
  modalDangerShow: boolean;
  content: string;
}>();
</script>

<template>
  <Transition
    enter-active-class="transition duration-300 ease-out"
    enter-from-class="transform opacity-0 scale-95"
    enter-to-class="opacity-100 scale-100"
    leave-active-class="transition duration-200 ease-in"
    leave-from-class="opacity-100 scale-100"
    leave-to-class="transform opacity-0 scale-95"
  >
    <div
      v-if="modalDangerShow"
      class="fixed bottom-[15px] right-[15px] z-50 bg-red-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3"
    >
      <Icon name="mdi:alert-circle" class="text-2xl" />
      <span>{{ content }}</span>
    </div>
  </Transition>
</template>
