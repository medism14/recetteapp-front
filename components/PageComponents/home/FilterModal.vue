<!-- @format -->

<script setup lang="ts">
// Importation du type Difficulty pour les recettes et définition de l'interface Props pour les propriétés du composant.
import type { Difficulty } from '~/types/recipe';

interface Props {
  showFilterModal: boolean;
}

// Définition des propriétés du composant.
defineProps<Props>();

// Définition des émissions du composant pour communiquer avec le parent.
const emit = defineEmits<{
  closeFilterModal: [];
  applyFilters: [filters: {
    difficulty?: Difficulty;
    categoryId?: number;
    ingredients?: string;
    sortBy?: 'createdAt' | 'name' | 'prepTime' | 'cookTime';
    type ?: string;
  }];
  removeFilters: [],
}>();

// Options de tri disponibles.
const sortByOptions = [
  { value: 'createdAt', label: 'Date de création' },
  { value: 'name', label: 'Nom' },
  { value: 'prepTime', label: 'Temps de préparation' },
  { value: 'cookTime', label: 'Temps de cuisson' },
];

// Options de difficulté disponibles.
const difficultyOptions = [
  { value: 'EASY', label: 'Facile' },
  { value: 'MEDIUM', label: 'Moyen' },
  { value: 'HARD', label: 'Difficile' },
];

// Références réactives pour stocker les données.
const categories = ref<{ id: number; name: string; }[]>([]);
const selectedCategory = ref<any>();
const selectedDifficulty = ref<any>('all');
const ingredients = ref<string>('');
const selectedSortBy = ref<string>(sortByOptions[0].value);

// Fonction asynchrone pour récupérer les catégories.
const getCategories = async () => {
  try {
    const response = await fetch('http://localhost:3001/categories', {
      credentials: 'include',
    });
    categories.value = await response.json();
    selectedCategory.value = "all";
  } catch (error) {
    console.error('Erreur lors de la récupération des catégories:', error);
  }
};

// Fonction pour fermer le modal.
const closeModal = () => {
  emit('closeFilterModal');
};

// Fonction pour appliquer les filtres.
const applyFilters = () => {
  emit('applyFilters', {
    difficulty: selectedDifficulty.value,
    categoryId: selectedCategory.value,
    ingredients: ingredients.value,
    sortBy: selectedSortBy.value as 'createdAt' | 'name' | 'prepTime' | 'cookTime',
    type: "apply",
  });
  closeModal();
};

// Fonction pour réinitialiser les filtres.
const resetFilters = () => {
  selectedCategory.value = 'all';
  selectedDifficulty.value = 'all';
  ingredients.value = '';
  selectedSortBy.value = sortByOptions[0].value;
  emit('removeFilters');
  closeModal();
};

// Initialisation des catégories lors du montage du composant.
onMounted(() => {
  getCategories();
});
</script>

<template>
  <!-- Transition pour gérer l'animation d'entrée et de sortie du modal -->
  <Transition
    enter-active-class="transition-all duration-300"
    enter-from-class="opacity-0 translate-x-full"
    enter-to-class="opacity-100 translate-x-0"
    leave-active-class="transition-all duration-300"
    leave-from-class="opacity-100 translate-x-0"
    leave-to-class="opacity-0 translate-x-full"
  >
    <!-- Conteneur du modal -->
    <div v-if="showFilterModal" @click="closeModal" class="inset-0 fixed z-50">
      <!-- Conteneur principal du modal -->
      <div
        class="absolute top-0 right-0 w-full max-w-[400px] bg-white h-full z-100 p-4 overflow-y-auto"
        @click.stop
      >
        <!-- En-tête du modal -->
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-bold text-textColor">Filtres</h2>
          <button @click="closeModal" class="text-gray-500 hover:text-gray-700">
            <Icon name="mdi:close" class="text-2xl" />
          </button>
        </div>

        <!-- Section des filtres -->
        <div class="space-y-4">
          <!-- Sélection de la catégorie -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Catégorie
            </label>
            <select
              v-model="selectedCategory"
              class="w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary h-[40px]"
            >
              <option value="all">Toutes les catégories</option>
              <option
                v-for="category in categories"
                :key="category.id"
                :value="category.id"
              >
                {{ category.name }}
              </option>
            </select>
          </div>

          <!-- Sélection de la difficulté -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Niveau de difficulté
            </label>
            <select
              v-model="selectedDifficulty"
              class="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary h-[40px]"
            >
              <option value="all">Toutes les difficultés</option>
              <option
                v-for="difficulty in difficultyOptions"
                :key="difficulty.value"
                :value="difficulty.value"
              >
                {{ difficulty.label }}
              </option>
            </select>
          </div>

          <!-- Recherche par ingrédients -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Ingrédients
            </label>
            <input
              v-model="ingredients"
              type="text"
              placeholder="Rechercher par ingrédients"
              class="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>

          <!-- Sélection du tri -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Trier par
            </label>
            <select
              v-model="selectedSortBy"
              class="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary h-[40px]"
            >
              <option
                v-for="option in sortByOptions"
                :key="option.value"
                :value="option.value"
              >
                {{ option.label }}
              </option>
            </select>
          </div>
        </div>

        <!-- Pied de page avec les boutons -->
        <div class="absolute bottom-0 left-0 right-0 p-4 bg-white border-t">
          <div class="flex gap-2">
            <button
              @click="resetFilters"
              class="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Réinitialiser
            </button>
            <button
              @click="applyFilters"
              class="flex-1 px-4 py-2 text-white bg-secondary rounded-lg hover:bg-secondary/90 transition-colors"
            >
              Appliquer
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>
