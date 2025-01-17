<!-- @format -->

<script setup lang="ts">

interface Props {
  name: string;
  onClick: () => void;
}

defineProps<Props>();
</script>

<!-- Start of Selection -->
<template>
  <button @click="onClick" class="bg-secondary flex items-center gap-[10px] text-white py-[10px] px-[23px] rounded-lg shadow-lg transition-transform transform hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 self-start">
    <Icon name="fa6-solid:arrow-left" />
    <span class="font-semibold text-base">{{ name }}</span>
  </button>
</template>
<!-- End of Selection -->
