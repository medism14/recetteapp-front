<!-- @format -->

<script setup lang="ts">
import { ref, onMounted } from "vue";
import FilterModal from "~/components/PageComponents/home/FilterModal.vue";
import RecipeInfo from "~/components/ReusableComponents/RecipeInfo.vue";
import SuccessModal from "~/components/ReusableComponents/SuccessModal.vue";
import Loading from "~/components/ReusableComponents/Loading.vue";
import type { Recipe } from "~/types/recipe";

definePageMeta({
  layout: "default",
  middleware: "auth",
});

const recipes = ref<Recipe[]>([]);
const favorites = ref<Recipe[]>([]);
const showFilterModal = ref<boolean>(false);
const modalSuccessShow = ref<boolean>(false);
const modalSuccessShowContent = ref<string>("");
const loading = ref<boolean>(true);

const manageBodyOverflow = (isOpen: boolean) => {
  document.body.style.overflow = isOpen ? "hidden" : "auto";
};

const openFilterModal = () => {
  manageBodyOverflow(true);
  showFilterModal.value = true;
};

const closeFilterModal = () => {
  manageBodyOverflow(false);
  showFilterModal.value = false;
};

const handleApplyFilter = (filters: any) => {
  getRecipes(filters);

  modalSuccessShowContent.value = "Filtres appliqués avec succès";

  modalSuccessShow.value = true;
  setTimeout(() => {
    modalSuccessShow.value = false;
  }, 3000);
};

const handleRemoveFilter = () => {
  getRecipes();
  modalSuccessShowContent.value = "Filtres supprimés avec succès";

  modalSuccessShow.value = true;
  setTimeout(() => {
    modalSuccessShow.value = false;
  }, 3000);
};

const getRecipes = async (filter?: any) => {
  loading.value = true;
  try {
    let url = "http://localhost:3001/recipes";
    let paramAdded = false;

    if (filter && filter.difficulty && filter.difficulty != "all") {
      url += paramAdded ? "&" : "?";
      url += `difficulty=${filter.difficulty}`;
      paramAdded = true;
    }

    if (filter && filter.categoryId && filter.categoryId != "all") {
      url += paramAdded ? "&" : "?";
      url += `categoryId=${filter.categoryId}`;
      paramAdded = true;
    }

    if (filter && filter.ingredients) {
      url += paramAdded ? "&" : "?";
      url += `ingredients=${filter.ingredients}`;
      paramAdded = true;
    }

    if (filter && filter.sortBy) {
      url += paramAdded ? "&" : "?";
      url += `sortBy=${filter.sortBy}`;
    }

    const response = await fetch(url, {
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
  } finally {
    loading.value = false;
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

onMounted(async () => {
  loading.value = true;
  try {
    await Promise.all([getRecipes(), getFavorites()]);
  } catch (error) {
    console.error("Erreur lors du chargement initial:", error);
  } finally {
    loading.value = false;
  }
});

useSeoMeta({
  title: "RecetteApp - Accueil",
  description: "Découvrez et partagez des recettes de cuisine. Gérez vos recettes favorites et créez votre collection personnelle.",
  ogTitle: "RecetteApp - Accueil",
  ogDescription: "Découvrez et partagez des recettes de cuisine. Gérez vos recettes favorites et créez votre collection personnelle.",
  ogImage: "/hyarotech.png",
  ogUrl: "https://recettes.com",
  twitterTitle: "RecetteApp - Accueil",
  twitterDescription: "Découvrez et partagez des recettes de cuisine. Gérez vos recettes favorites et créez votre collection personnelle.",
  twitterImage: "/hyarotech.png",
  twitterCard: "summary",
});
</script>

<template>
  <div v-if="loading" class="flex-1 flex justify-center items-center">
    <Loading />
  </div>
  <div v-else class="flex flex-col gap-8">
    <!-- Favoris -->
    <div
      class="flex flex-col gap-6 bg-gradient-to-r from-primary to-secondary py-6 px-4 rounded-lg shadow-xl"
    >
      <!-- Titre -->
      <div class="flex items-center gap-2">
        <h1 class="font-bold text-3xl md:text-4xl text-white">
          Mes Recettes Favoris
        </h1>
        <p class="text-xl flex items-center font-bold text-white">
          ({{ favorites.length }}
          <Icon name="fa6-solid:star" class="text-yellow-300 border-black" />)
        </p>
      </div>

      <!-- Recettes favorites -->
      <div class="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <RecipeInfo
          v-for="favorite in favorites"
          :key="favorite.id"
          :recipe="favorite"
          @update-favorites="handleUpdateFavorites"
        />
      </div>
    </div>

    <!-- Toutes les recettes -->
    <div class="flex flex-col gap-6 bg-white py-6 px-4 rounded-lg shadow-lg">
      <!-- Titre -->
      <div class="flex justify-between items-center gap-2">
        <h1 class="font-bold text-2xl md:text-3xl text-textColor">Recettes</h1>

        <button
          class="bg-secondary/90 text-white px-4 py-2 rounded flex items-center gap-2 transition-all duration-300 hover:bg-secondary"
          @click="openFilterModal"
        >
          <p>Filtrer</p>
          <Icon name="fa6-solid:filter" class="text-white border-black" />
        </button>
      </div>

      <!-- Liste des recettes -->
      <div class="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <template v-if="recipes.length > 0">
          <RecipeInfo
            v-for="recipe in recipes"
            :key="recipe?.id"
            :recipe="recipe"
            @update-favorites="handleUpdateFavorites"
          />
        </template>
        <template v-else>
          <p class="text-center text-gray-600">Il n'y a aucune recette.</p>
        </template>
      </div>
    </div>
  </div>

  <!-- Composant modal pour filtrer les recettes -->
  <FilterModal
    :showFilterModal="showFilterModal"
    @closeFilterModal="closeFilterModal"
    @applyFilters="handleApplyFilter"
    @removeFilters="handleRemoveFilter"
  />

  <!-- Composant modal de succès pour afficher les messages de confirmation -->  
  <SuccessModal
    :modalSuccessShow="modalSuccessShow"
    :content="modalSuccessShowContent"
  />
</template>
