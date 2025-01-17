<!-- @format -->

<script setup lang="ts">
import type { Difficulty } from '~/types/recipe';

interface Props {
  showFilterModal: boolean;
}

defineProps<Props>();

const emit = defineEmits<{
  closeFilterModal: [];
  applyFilters: [filters: {
    difficulty?: Difficulty;
    categoryId?: number;
    ingredients?: string;
    sortBy?: 'createdAt' | 'name' | 'prepTime' | 'cookTime';
  }];
}>();

const sortByOptions = [
  { value: 'createdAt', label: 'Date de création' },
  { value: 'name', label: 'Nom' },
  { value: 'prepTime', label: 'Temps de préparation' },
  { value: 'cookTime', label: 'Temps de cuisson' },
];

const difficultyOptions = [
  { value: 'EASY', label: 'Facile' },
  { value: 'MEDIUM', label: 'Moyen' },
  { value: 'HARD', label: 'Difficile' },
];

const categories = ref<{ id: number; name: string; }[]>([]);
const selectedCategory = ref<any>();
const selectedDifficulty = ref<any>('all');
const ingredients = ref<string>('');
const selectedSortBy = ref<string>(sortByOptions[0].value);

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

const closeModal = () => {
  emit('closeFilterModal');
};

const applyFilters = () => {
  emit('applyFilters', {
    difficulty: selectedDifficulty.value,
    categoryId: selectedCategory.value,
    ingredients: ingredients.value,
    sortBy: selectedSortBy.value as 'createdAt' | 'name' | 'prepTime' | 'cookTime',
  });
  closeModal();
};

const resetFilters = () => {
  selectedCategory.value = 'all';
  selectedDifficulty.value = 'all';
  ingredients.value = '';
  selectedSortBy.value = sortByOptions[0].value;
};

onMounted(() => {
  getCategories();
});
</script>

<template>
  <Transition
    enter-active-class="transition-all duration-300"
    enter-from-class="opacity-0 translate-x-full"
    enter-to-class="opacity-100 translate-x-0"
    leave-active-class="transition-all duration-300"
    leave-from-class="opacity-100 translate-x-0"
    leave-to-class="opacity-0 translate-x-full"
  >
    <div v-if="showFilterModal" @click="closeModal" class="inset-0 fixed z-50">
      <div
        class="absolute top-0 right-0 w-[400px] bg-white h-full z-100 p-6 overflow-y-auto"
        @click.stop
      >
        <!-- Header -->
        <div class="flex justify-between items-center mb-8">
          <h2 class="text-2xl font-bold text-textColor">Filtres</h2>
          <button @click="closeModal" class="text-gray-500 hover:text-gray-700">
            <Icon name="mdi:close" class="text-2xl" />
          </button>
        </div>

        <!-- Filtres -->
        <div class="space-y-6">
          <!-- Catégories -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
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

          <!-- Difficulté -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
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

          <!-- Ingrédients -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Ingrédients
            </label>
            <input
              v-model="ingredients"
              type="text"
              placeholder="Rechercher par ingrédients"
              class="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>

          <!-- Tri -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
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

        <!-- Boutons -->
        <div class="absolute bottom-0 left-0 right-0 p-6 bg-white border-t">
          <div class="flex gap-4">
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
