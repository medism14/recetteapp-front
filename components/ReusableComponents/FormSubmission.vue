<!-- @format -->
<script setup lang="ts">
import { Form } from "vee-validate";
import type { SubmissionHandler } from 'vee-validate';

interface Props {
  name: string;
  validationSchema: object;
  onSubmit: SubmissionHandler;
  inputPerRow?: number;
}

withDefaults(defineProps<Props>(), {
  name: '',
  inputPerRow: 1 // 1 ou 2
});
</script>

<template>
  <!-- Cette section définit le conteneur principal du formulaire avec un style adaptatif en fonction du nombre d'entrées par ligne -->
  <div class="bg-secondary mx-auto px-[40px] py-[20px] rounded-lg my-[20px] w-full" :class="inputPerRow == 1 ? 'max-w-[600px]' : 'max-w-[600px] md:max-w-[900px]'">
    <h1 v-if="name" class="text-center text-[30px] font-[600] mb-[10px] text-white">
      {{ name }}
    </h1>
    <hr v-if="name" class="w-[70%] bg-white mx-auto" />

    <!-- Cette section définit le formulaire proprement dit avec sa validation et son gestionnaire de soumission -->
    <Form 
      :validation-schema="validationSchema"
      @submit="onSubmit"
      class="mt-[30px] flex flex-col items-center gap-[8px] md:gap-[15px]"
    >
      <slot />
    </Form>
  </div>
</template>
