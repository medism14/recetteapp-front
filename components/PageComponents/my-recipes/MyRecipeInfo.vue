<!-- @format -->

<script setup lang="ts">
import type { Recipe } from "~/types/recipe";
import { ref } from "vue";

const difficulte = ref("");
const showModalConfirmation = ref(false);
const recipeToDelete = ref<number | null>(null);

interface Props {
  recipe: Recipe;
  handleDeleteRecipe: (recipeId: number) => void; // Ajout de la fonction handleDeleteRecipe
  handleEditRecipe: (recipeId: number) => void;
  handleViewRecipe: (recipeId: number) => void;
}

const props = defineProps<Props>();

if (props.recipe) {
  switch (props.recipe.difficulty) {
    case "EASY":
      difficulte.value = "Facile";
      break;
    case "MEDIUM":
      difficulte.value = "Moyenne";
      break;
    case "HARD":
      difficulte.value = "Difficile";
      break;
    default:
      difficulte.value = "Inconnue";
  }
}

const confirmDelete = (recipeId: number) => {
  recipeToDelete.value = recipeId;
  showModalConfirmation.value = true;
};

const deleteRecipe = () => {
  if (recipeToDelete.value !== null) {
    props.handleDeleteRecipe(recipeToDelete.value);
    closeModal();
  }
};

const closeModal = () => {
  showModalConfirmation.value = false;
  recipeToDelete.value = null;
};
</script>

<template>
  <!-- Modification de la classe max-h pour être plus adaptative -->
  <div class="bg-white shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col md:flex-row md:max-h-[300px] rounded-xl overflow-hidden border border-gray-100">
    <!-- Ajustement de la hauteur de l'image sur mobile -->
    <div class="w-full md:w-1/3 h-[200px] md:h-full">
      <NuxtImg :src="recipe.image" class="w-full h-full object-fit" />
    </div>

    <!-- Amélioration de l'espacement sur mobile -->
    <div class="w-full md:w-2/3 flex flex-col p-4 md:p-6 relative justify-between gap-4">
      <div class="flex flex-col justify-between items-start">
        <div>
          <h1 class="font-bold text-lg md:text-2xl text-textColor mb-2">
            {{ recipe.name }}
          </h1>
          <h2 class="text-base md:text-lg text-textColor/90">{{ recipe.category?.name }}</h2>
          <p class="text-sm md:text-base text-gray-600 mt-2 line-clamp-2 text-textColor/70">
            {{ recipe.description }}
          </p>
        </div>
      </div>

      <!-- Ajustement de la marge pour mobile -->
      <div class="w-full flex justify-center">
        <span
          class="px-3 py-1 md:px-4 md:py-2 rounded-full text-sm font-semibold"
          :class="{
            'bg-green-100 text-green-700': difficulte === 'Facile',
            'bg-yellow-100 text-yellow-700': difficulte === 'Moyenne',
            'bg-red-100 text-red-700': difficulte === 'Difficile',
          }"
        >
          {{ difficulte }}
        </span>
      </div>

      <!-- Réorganisation des temps et boutons pour mobile -->
      <div class="flex flex-col gap-4">
        <div class="flex flex-wrap gap-4 justify-center md:justify-start">
          <div class="flex items-center">
            <Icon name="mdi:clock-outline" class="text-primary mr-2" />
            <span class="text-sm text-gray-600">Prep: {{ recipe.prepTime }}min</span>
          </div>
          <div class="flex items-center">
            <Icon name="mdi:pot-steam-outline" class="text-primary mr-2" />
            <span class="text-sm text-gray-600">Cuisson: {{ recipe.cookTime }}min</span>
          </div>
        </div>

        <!-- Réorganisation des boutons pour mobile -->
        <div class="flex flex-wrap justify-center md:justify-end gap-2">
          <button
            class="flex-1 md:flex-none px-4 py-2 bg-tertiary hover:bg-success text-white rounded-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
            @click="handleViewRecipe(recipe.id)"
          >
            <Icon name="mdi:eye" class="text-sm" />
            <span class="text-sm font-medium">Voir</span>
          </button>
          <button
            class="flex-1 md:flex-none px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
            @click="handleEditRecipe(recipe.id)"
          >
            <Icon name="mdi:pencil" class="text-sm" />
            <span class="text-sm font-medium">Modifier</span>
          </button>
          <button
            class="flex-1 md:flex-none px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
            @click="confirmDelete(recipe.id)"
          >
            <Icon name="mdi:delete" class="text-sm" />
            <span class="text-sm font-medium">Supprimer</span>
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal de confirmation pour la suppression -->
  <Transition
    enter-active-class="transition duration-300 ease-out"
    enter-from-class="transform opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition duration-200 ease-in"
    leave-from-class="opacity-100"
    leave-to-class="transform opacity-0"
  >
    <div
      v-if="showModalConfirmation"
      class="fixed inset-0 z-50 bg-[rgba(20,20,20,0.7)] select-none flex items-center justify-center"
      @click="closeModal"
    >
      <div @click.stop class="bg-white rounded-xl p-8 w-[90%] md:w-[300px] shadow-2xl">
        <h2 class="text-lg font-bold text-textColor mb-4">
          Confirmer la suppression
        </h2>
        <p>Êtes-vous sûr de vouloir supprimer cette recette ?</p>
        <div class="flex justify-end gap-4 mt-4">
          <button
            class="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg"
            @click="closeModal"
          >
            Annuler
          </button>
          <button
            class="px-4 py-2 bg-red-500 text-white rounded-lg"
            @click="deleteRecipe"
          >
            Supprimer
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>