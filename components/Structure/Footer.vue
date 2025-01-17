<!-- @format -->

<script setup lang="ts">
// Récupère l'année actuelle pour l'afficher dans le pied de page
const currentYear = new Date().getFullYear();
</script>

<template>
  <!-- Pied de page avec des classes pour le style et le positionnement -->
  <footer
    ref="footerRef"
    class="bottom-0 left-0 w-full py-4 md:py-3 bg-primary backdrop-blur-sm shadow-lg border-t border-gray-200/20"
  >
    <div class="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
      <!-- Conteneur flexible qui passe de colonne à ligne sur les écrans de taille moyenne et plus -->
      <div
        class="flex flex-col md:flex-row items-center justify-center md:justify-between gap-2 md:gap-4"
      >
        <!-- Affiche le copyright et le nom -->
        <div
          class="flex items-center justify-center gap-[4px] text-textColor hover:text-gray-700 transition-colors duration-300"
        >
          <span class="text-sm font-medium">&copy; {{ currentYear }}</span>
          <span
            class="font-semibold text-gray-800 hover:text-gray-600/90 transition-colors duration-300 text-center md:text-left"
          >
            Mohamed Ismael Otban
          </span>
        </div>

        <!-- Liens légaux et de confidentialité, cachés sur les petits écrans -->
        <div
          class="hidden md:flex items-center space-x-4 text-sm text-textColor"
        >
          <a href="#" class="hover:text-gray-700 transition-colors duration-300"
            >Mentions légales</a
          >
          <a href="#" class="hover:text-gray-700 transition-colors duration-300"
            >Politique de confidentialité</a
          >
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
/* Ajoute un padding en bas du pied de page sur les petits écrans pour tenir compte de la zone de sécurité */
@media (max-width: 640px) {
  footer {
    padding-bottom: calc(env(safe-area-inset-bottom) + 1rem);
  }
}
</style>
