<!-- @format -->

<script setup lang="ts">
import { ref } from "vue";
import FilterModal from "~/components/PageComponents/home/FilterModal.vue";
import RecipeInfo from "~/components/ReusableComponents/RecipeInfo.vue";
import type { Recipe } from "~/types/recipe";

definePageMeta({
  layout: "default",
  middleware: "auth",
});

const recipes = ref<Recipe[]>([]);
const favorites = ref<Recipe[]>([]);
const showFilterModal = ref<boolean>(false);

const closeFilterModal = () => {
  showFilterModal.value = false;
};

const getRecipes = async () => {
  try {
    const response = await fetch("http://localhost:3001/recipes", {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      credentials: "include",
    });
    const data = await response.json();
    recipes.value = data;
  } catch (error) {
    console.error("Erreur lors de la récupération des recettes:", error);
  }
};

const getFavorites = async () => {
  try {
    const response = await fetch("http://localhost:3001/favorites", {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      credentials: "include",
    });
    const data = await response.json();

    const favoriteSerialized = data.map((favorite: any) => {
      return favorite.recipe;
    });

    favorites.value = favoriteSerialized;
  } catch (error) {
    console.error("Erreur lors de la récupération des favoris:", error);
  }
};

// Fonction pour mettre à jour les favoris
const handleUpdateFavorites = async () => {
  await getFavorites();
};

onMounted(() => {
  getRecipes();
  getFavorites();
});
</script>

<template>
  <!-- Favoris -->
  <div class="flex flex-col gap-[30px]">
    <!-- Titre -->
    <div class="flex items-center gap-[5px]">
      <h1 class="font-bold text-3xl text-textColor">Mes Recettes Favoris</h1>
      <p class="text-[26px] flex items-center font-bold text-textColor">
        ({{ favorites.length }}
        <Icon name="fa6-solid:star" class="text-yellow-500 border-black" />)
      </p>
    </div>

    <!-- Recettes favorites -->
    <div class="w-full grid grid-cols-3 gap-4">
      <RecipeInfo
        v-for="favorite in favorites"
        :key="favorite.id"
        :recipe="favorite"
        @update-favorites="handleUpdateFavorites"
      />
    </div>
  </div>

  <!-- Toutes les recettes -->
  <div class="flex flex-col gap-[30px]">
    <!-- Titre -->
    <div class="flex justify-between items-center gap-[5px] mt-[50px]">
      <h1 class="font-bold text-3xl text-textColor">Recettes</h1>

      <button
        class="bg-secondary/90 text-white px-[24px] py-[8px] rounded flex items-center gap-[5px] transition-all duration-300 hover:bg-secondary"
        @click="showFilterModal = !showFilterModal"
      >
        <p>Filtrer</p>
        <Icon name="fa6-solid:filter" class="text-white border-black" />
      </button>
    </div>

    <!-- Liste des recettes -->
    <div class="w-full grid grid-cols-3 gap-4">
      <RecipeInfo
        v-for="recipe in recipes"
        :key="recipe?.id"
        :recipe="recipe"
        @update-favorites="handleUpdateFavorites"
      />
    </div>
  </div>

  <FilterModal
    :showFilterModal="showFilterModal"
    @closeFilterModal="closeFilterModal"
  />
</template>
