<script setup lang="ts">
interface Props {
  text?: string;
}

defineProps<Props>();
</script>

<template>
    <div>
        <button type="submit" class="bg-tertiary hover:bg-tertiary/80 text-white font-bold py-2 px-8 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg">
            {{ text || 'Confirmer' }}
        </button>
    </div>
</template>
