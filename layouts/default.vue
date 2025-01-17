<!-- @format -->

<script setup lang="ts">
import Footer from "~/components/Structure/Footer.vue";
import HeaderDefault from "~/components/Structure/HeaderDefault.vue";
import Loading from "~/components/ReusableComponents/Loading.vue";
import { useAuthStore } from "~/stores/useAuthStore";
import { storeToRefs } from "pinia";

// Utilise le store d'authentification et extrait la propriété isAuthLoading
const authStore = useAuthStore();
const { isAuthLoading } = storeToRefs(authStore);
</script>

<template>
  <!-- Conteneur principal avec une hauteur minimale, un affichage en colonne et un fond gris -->
  <div class="min-h-screen flex flex-col justify-between relative bg-slate-200 gap-[50px]">
    <ClientOnly>
      <!-- Affiche l'en-tête uniquement si l'authentification n'est pas en cours de chargement -->
      <HeaderDefault v-if="!isAuthLoading" />

      <!-- Contenu principal avec un affichage en colonne et une marge supérieure -->
      <main
        class="flex-1 flex flex-col containerInterne"
      >
        <!-- Affiche le composant de chargement si l'authentification est en cours, sinon affiche le contenu enfant -->
        <Loading v-if="isAuthLoading" />
        <slot v-else />
      </main>
    </ClientOnly>
    <!-- Pied de page -->
    <Footer />
  </div>
</template>
