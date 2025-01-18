<!-- @format -->

<script setup lang="ts">
import { Field, useField } from "vee-validate";
import { ref } from "vue";

// Interface pour les différents options du select
interface Option {
  label: string;
  value: string | number;
}

// Propriétés récupérés pour la page
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

// Si des valeurs par defaut, alors on les applique
if (props.modelValue) {
  const { setValue } = useField<string | number>(props.name);
  setValue(props.modelValue);
}
</script>

<template>
  <div class="flex flex-col mb-4 gap-[3px] w-full">
    <!-- Label -->
    <label class="text-white font-bold text-[18px]">{{ label }}</label>

    <!-- Input -->
    <Field :name="name" v-slot="{ field, errorMessage }">
      <div class="relative w-full">
        <!-- Si textarea -->
        <template v-if="type === 'textarea'">
          <textarea
            v-bind="field"
            :rows="rows || 4"
            class="outline-none p-[12px] w-full rounded focus:ring-2 text-[16px] resize-none"
            :class="{ 'ring-2 ring-red-400': errorMessage }"
          />
        </template>

        <!-- Si select -->
        <template v-else-if="type === 'select'">
          <select
            v-bind="field"
            class="outline-none px-[12px] h-[40px] w-full rounded focus:ring-2 text-[16px]"
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

        <!-- Si type number -->
        <template v-else-if="type === 'number'">
          <input
            v-bind="field"
            type="number"
            class="outline-none px-[12px] h-[40px] w-full rounded focus:ring-2 text-[16px]"
            :class="[
              errorMessage && 'ring-2 ring-red-400',
              secure && 'pr-[40px]',
            ]"
          />
        </template>

        <template v-else>
          <!-- Si type text -->
          <input
            v-bind="field"
            :type="secure ? (showPassword ? 'text' : 'password') : type"
            class="outline-none px-[12px] h-[40px] w-full rounded focus:ring-2 text-[16px]"
            :class="[
              errorMessage && 'ring-2 ring-red-400',
              secure && 'pr-[40px]',
            ]"
          />

          <!-- Si présence de secure alors on affiche le mot de passe avec l'îcone -->
          <Icon
            v-if="secure"
            :name="showPassword ? 'fa6-solid:eye-slash' : 'fa6-solid:eye'"
            class="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500 hover:text-gray-700"
            @click="showPassword = !showPassword"
          />
        </template>
      </div>
      <span class="text-red-400 text-[14px] font-bold" v-if="errorMessage">{{
        errorMessage
      }}</span>
    </Field>
  </div>
</template>
