<!-- @format -->

<script setup lang="ts">
import Footer from "~/components/Structure/Footer.vue";
import HeaderAuth from "~/components/Structure/HeaderAuth.vue";
import Loading from "~/components/ReusableComponents/Loading.vue";
import { useAuthStore } from "~/stores/useAuthStore";
import { storeToRefs } from "pinia";

// Utilise le store d'authentification et extrait la propriété isAuthLoading
const authStore = useAuthStore();
const { isAuthLoading } = storeToRefs(authStore);

// Crée une référence vers l'élément racine du layout
const layoutRef = ref<HTMLElement | null>(null);
</script>

<template>
  <!-- 
    Conteneur principal du layout avec flexbox en colonne,
    espacement vertical entre les éléments et hauteur minimale de l'écran 
  -->
  <div
    ref="layoutRef"
    class="min-h-screen flex flex-col justify-between relative gap-[50px]"
  >
    <ClientOnly>
      <!-- Affiche l'en-tête d'authentification si l'authentification n'est pas en cours de chargement -->
      <HeaderAuth v-if="!isAuthLoading" />

      <!-- 
        Contenu principal avec flexbox en colonne, 
        centré verticalement et utilisant la classe CSS "containerInterne"
      -->
      <main
        class="flex-1 flex flex-col justify-center containerInterne"
      >
        <!-- Affiche un indicateur de chargement si l'authentification est en cours, sinon affiche le contenu enfant -->
        <Loading v-if="isAuthLoading" />
        <slot v-else />
      </main>
    </ClientOnly>
    <!-- Pied de page -->
    <Footer />
  </div>
</template>
