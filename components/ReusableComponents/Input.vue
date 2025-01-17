<!-- @format -->

<script setup lang="ts">
import { Field, useField } from "vee-validate";
import { ref } from "vue";

interface Option {
  label: string;
  value: string | number;
}

interface Props {
  label?: string;
  name: string;
  type: string;
  secure?: boolean;
  options?: Option[] | null;
  rows?: number;
  modelValue?: any;
}

const props = defineProps<Props>();

const showPassword = ref(false);
if (props.modelValue) {
  const { setValue } = useField<string | number>(props.name);
  setValue(props.modelValue);
}
</script>

<template>
  <div class="flex flex-col mb-4 gap-[3px]">
    <label class="text-white font-bold">{{ label }}</label>
    <Field :name="name" v-slot="{ field, errorMessage }">
      <div class="relative">
        <template v-if="type === 'textarea'">
          <textarea
            v-bind="field"
            :rows="rows || 4"
            class="outline-none p-[10px] w-[340px] rounded focus:ring-2 text-[16px] resize-none"
            :class="{ 'ring-2 ring-red-400': errorMessage }"
          />
        </template>

        <template v-else-if="type === 'select'">
          <select
            v-bind="field"
            class="outline-none px-[10px] h-[40px] w-[340px] rounded focus:ring-2 text-[16px]"
            :class="{ 'ring-2 ring-red-400': errorMessage }"
          >
            <option
              v-for="option in options"
              :key="option.value"
              :value="option.value"
            >
              {{ option.label }}
            </option>
          </select>
        </template>

        <template v-else-if="type === 'number'">
          <input
            v-bind="field"
            type="number"
            class="outline-none px-[10px] h-[40px] w-[340px] rounded focus:ring-2 text-[16px]"
            :class="[
              errorMessage && 'ring-2 ring-red-400',
              secure && 'pr-[40px]',
            ]"
          />
        </template>

        <template v-else>
          <input
            v-bind="field"
            :type="secure ? (showPassword ? 'text' : 'password') : type"
            class="outline-none px-[10px] h-[40px] w-[340px] rounded focus:ring-2 text-[16px]"
            :class="[
              errorMessage && 'ring-2 ring-red-400',
              secure && 'pr-[40px]',
            ]"
          />
          <Icon
            v-if="secure"
            :name="showPassword ? 'fa6-solid:eye-slash' : 'fa6-solid:eye'"
            class="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500 hover:text-gray-700"
            @click="showPassword = !showPassword"
          />
        </template>
      </div>
      <span class="text-red-400 text-sm font-bold" v-if="errorMessage">{{
        errorMessage
      }}</span>
    </Field>
  </div>
</template>
