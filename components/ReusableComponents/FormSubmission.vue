<!-- @format -->
<script setup lang="ts">
import { Form } from "vee-validate";
import type { SubmissionHandler } from 'vee-validate';

interface Props {
  name: string;
  validationSchema: object;
  onSubmit: SubmissionHandler;
  sizePercentage?: string;
}

withDefaults(defineProps<Props>(), {
  name: '',
  sizePercentage: "50"
});
</script>

<template>
  <div :style="`width: ${sizePercentage}%`" class="bg-secondary mx-auto px-[40px] py-[20px] rounded-lg my-[20px]">
    <h1 v-if="name" class="text-center text-[30px] font-[600] mb-[10px] text-white">
      {{ name }}
    </h1>
    <hr v-if="name" class="w-[70%] bg-white mx-auto" />

    <Form 
      :validation-schema="validationSchema"
      @submit="onSubmit"
      class="mt-[30px] flex flex-col items-center gap-[15px]"
    >
      <slot />
    </Form>
  </div>
</template>
