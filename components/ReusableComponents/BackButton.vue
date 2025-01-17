<!-- @format -->

<script setup lang="ts">

interface Props {
  name: string;
  onClick: () => void;
}

defineProps<Props>();
</script>

<template>
  <button @click="onClick" class="bg-secondary flex items-center gap-2 text-white py-2 px-4 md:py-3 md:px-6 rounded-lg shadow-lg transition-transform transform hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 self-start">
    <Icon name="fa6-solid:arrow-left" />
    <span class="font-semibold text-sm md:text-base">{{ name }}</span>
  </button>
</template>
