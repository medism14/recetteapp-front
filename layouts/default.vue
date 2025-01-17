<!-- @format -->

<script setup lang="ts">
import Footer from "~/components/Structure/Footer.vue";
import HeaderDefault from "~/components/Structure/HeaderDefault.vue";
import Loading from "~/components/ReusableComponents/Loading.vue";
import { useAuthStore } from "~/stores/useAuthStore";
import { storeToRefs } from "pinia";

const authStore = useAuthStore();
const { isAuthLoading } = storeToRefs(authStore);
</script>

<template>
  <div class="min-h-screen flex flex-col justify-between relative bg-slate-200">
    <ClientOnly>
      <HeaderDefault v-if="!isAuthLoading" />

      <main class="flex-1 flex flex-col pb-[50px] containerInterne">
        <Loading v-if="isAuthLoading" />
        <slot v-else />
      </main>
    </ClientOnly>
    <Footer />
  </div>
</template>
