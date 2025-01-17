<!-- @format -->

<script setup lang="ts">
const currentYear = new Date().getFullYear();
</script>

<template>
  <footer
    class="bottom-0 left-0 w-full h-[50px] flex items-center justify-center py-0 bg-primary backdrop-blur-sm shadow-lg border-t border-gray-200/20"
  >
    <div class="flex items-center justify-center gap-[4px] text-textColor hover:text-gray-700 transition-colors duration-300 w-full">
      <span class="text-sm font-medium">&copy; {{ currentYear }}</span>
      <span class="font-semibold text-gray-800 hover:text-gray-600/90 transition-colors duration-300">Mohamed Ismael Otban</span>
    </div>
  </footer>
</template>
