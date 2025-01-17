<!-- @format -->
<script setup lang="ts">
import MyRecipeInfo from "~/components/PageComponents/my-recipes/MyRecipeInfo.vue";
import SuccessModal from "~/components/ReusableComponents/SuccessModal.vue";
import DangerModal from "~/components/ReusableComponents/DangerModal.vue";
import type { Recipe } from "~/types/recipe";
import BackButton from "~/components/ReusableComponents/BackButton.vue";

// Définition des métadonnées de la page, y compris le layout et le middleware pour l'authentification
definePageMeta({
  layout: "default",
  middleware: "auth",
});

// Initialisation des variables réactives pour gérer l'état de l'application
const router = useRouter();
const recipes = ref<Recipe[]>([]);
const modalAddCategoryShow = ref(false);
const modalSuccessAddCategoryShow = ref(false);
const modalDangerDeleteRecipeShow = ref(false);
const categoryName = ref("");
const categoryNameError = ref("");

// Fonction de validation du nom de la catégorie, vérifiant la présence et la longueur minimale
const validateCategoryName = () => {
  if (!categoryName.value) {
    categoryNameError.value = "Le nom de la catégorie est requis";
    return false;
  }

  if (categoryName.value.length < 3) {
    categoryNameError.value = "Le nom doit contenir au moins 3 caractères";
    return false;
  }

  categoryNameError.value = "";
  return true;
};

// Ouverture du modal pour ajouter une catégorie, avec gestion de l'état de débordement du corps
const openModalAddCategory = () => {
  modalAddCategoryShow.value = true;
  document.body.classList.add("overflow-hidden");
};

// Fermeture du modal et réinitialisation des valeurs de catégorie
const closeModalAddCategory = () => {
  modalAddCategoryShow.value = false;
  document.body.classList.remove("overflow-hidden");
  categoryName.value = "";
  categoryNameError.value = "";
};

// Navigation vers la page d'accueil
const goBack = () => {
  router.push("/");
};

// Navigation vers la page d'édition d'une recette
const handleEditRecipe = (recipeId: number) => {
  router.push(`/my-recipes/edit-recipe/${recipeId}`);
};

// Navigation vers la page de détails d'une recette
const handleViewRecipe = (recipeId: number) => {
  router.push(`/recipe-detail/${recipeId}`);
};

// Fonction pour ajouter une catégorie, incluant la validation et la gestion des erreurs
const handleAddCategory = async () => {
  if (!validateCategoryName()) return;

  try {
    const response = await fetch("http://localhost:3001/categories", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: categoryName.value }),
    });

    if (!response.ok) {
      throw new Error("Erreur lors de la création de la catégorie");
    }

    closeModalAddCategory();

    modalSuccessAddCategoryShow.value = true;
    setTimeout(() => {
      modalSuccessAddCategoryShow.value = false;
    }, 2000);
  } catch (error) {
    console.error("Erreur:", error);
  }
};

// Fonction pour récupérer les recettes de l'utilisateur, avec gestion des erreurs
const getMyRecipes = async () => {
  try {
    const response = await fetch("http://localhost:3001/recipes/user/recipe", {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Erreur lors de la récupération des recettes");
    }

    recipes.value = await response.json();
  } catch (error) {
    console.error("Erreur:", error);
  }
};

// Appel initial pour récupérer les recettes
getMyRecipes();

// Fonction pour supprimer une recette, avec mise à jour de l'état des recettes et gestion des erreurs
const handleDeleteRecipe = async (recipeId: number) => {
  try {
    const response = await fetch(`http://localhost:3001/recipes/${recipeId}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Erreur lors de la suppression de la recette");
    }

    // Mise à jour de la liste des recettes après la suppression
    recipes.value = recipes.value.filter((recipe) => recipe.id !== recipeId);
    modalDangerDeleteRecipeShow.value = true;
    setTimeout(() => {
      modalDangerDeleteRecipeShow.value = false;
    }, 2000);
  } catch (error) {
    console.error("Erreur:", error);
  }
};

useSeoMeta({
  title: "Mes Recettes - RecetteApp",
  description:
    "Gérez vos recettes personnelles, ajoutez de nouvelles recettes et organisez vos catégories.",
  ogTitle: "Mes Recettes - RecetteApp",
  ogDescription:
    "Gérez vos recettes personnelles, ajoutez de nouvelles recettes et organisez vos catégories.",
  ogImage: "/hyarotech.png",
  ogUrl: "https://recettes.com/my-recipes",
  twitterTitle: "Mes Recettes - RecetteApp",
  twitterDescription:
    "Gérez vos recettes personnelles, ajoutez de nouvelles recettes et organisez vos catégories.",
  twitterImage: "/hyarotech.png",
  twitterCard: "summary",
});
</script>

<template>
  <div class="mb-[20px]">
    <!-- Colonne de gauche : bouton de retour -->
    <BackButton name="Revenir à la page d'accueil" :onClick="goBack" />
  </div>

  <!-- En-tête : Titre et boutons d'action -->
  <div class="flex flex-col gap-4 sm:flex-row sm:justify-between mb-[20px]">
    <h1
      class="text-2xl sm:text-3xl lg:text-[40px] font-bold text-textColor text-center sm:text-left self-end"
    >
      Mes recettes
    </h1>

    <div class="flex flex-col xs:flex-row gap-2 sm:gap-3">
      <!-- Bouton pour ajouter une catégorie -->
      <button
        class="bg-secondary flex justify-center items-center px-3 py-2 sm:px-4 rounded-lg text-sm sm:text-base"
        @click="openModalAddCategory"
      >
        <span class="text-white whitespace-nowrap">Ajouter une catégorie</span>
        <Icon
          name="fa6-solid:folder-plus"
          class="text-white text-lg font-bold ml-2"
        />
      </button>

      <!-- Bouton pour ajouter une recette -->
      <button
        class="bg-secondary flex justify-center items-center px-3 py-2 sm:px-4 rounded-lg text-sm sm:text-base"
        @click="router.push('/my-recipes/add-recipe')"
      >
        <span class="text-white whitespace-nowrap">Ajouter une recette</span>
        <Icon name="fa6-solid:plus" class="text-white text-lg font-bold ml-2" />
      </button>
    </div>
  </div>

  <div class="flex flex-col gap-[35px]">
    <!-- Section pour afficher les recettes ou un message si aucune donnée n'est disponible -->
    <template v-if="recipes.length === 0">
      <!-- État de l'absence de résultats -->
      <div
        class="flex flex-col items-center justify-center flex-1 text-center mt-[40px]"
      >
        <Icon
          name="fa6-regular:face-frown"
          class="text-6xl text-gray-400 mb-4"
        />
        <h2 class="text-2xl font-semibold text-gray-600 mb-2">
          Aucun résultat trouvé
        </h2>
        <p class="text-gray-500 max-w-md">
          Vous n'avez pas de recette posté.
        </p>
      </div>
      >
    </template>
    <MyRecipeInfo
      v-for="recipe in recipes"
      :key="recipe.id"
      :recipe="recipe"
      :handleDeleteRecipe="handleDeleteRecipe"
      :handleEditRecipe="handleEditRecipe"
      :handleViewRecipe="handleViewRecipe"
    />

    <!-- Modal pour ajouter une catégorie -->
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="transform opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="transform opacity-0"
    >
      <div
        v-if="modalAddCategoryShow"
        class="fixed inset-0 z-50 bg-[rgba(20,20,20,0.7)] select-none flex items-center justify-center"
        @click="closeModalAddCategory"
      >
        <div
          class="bg-white rounded-xl p-8 w-[90%] md:w-[500px] shadow-2xl transform transition-all"
          @click.stop
        >
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-bold text-textColor">
              Ajouter une catégorie
            </h2>
            <button
              @click="closeModalAddCategory"
              class="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <Icon name="mdi:close" class="text-2xl" />
            </button>
          </div>

          <div class="mb-6">
            <label
              for="categoryName"
              class="block text-sm font-medium text-gray-700 mb-2"
            >
              Nom de la catégorie
            </label>
            <input
              id="categoryName"
              v-model="categoryName"
              type="text"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all"
              :class="{ 'border-red-500': categoryNameError }"
              @input="validateCategoryName"
              placeholder="Entrez le nom de la catégorie"
            />
            <p v-if="categoryNameError" class="mt-2 text-sm text-red-600">
              {{ categoryNameError }}
            </p>
          </div>

          <div class="flex justify-end gap-4">
            <!-- Bouton d'annulation -->
            <button
              @click="closeModalAddCategory"
              class="px-4 py-2 bg-red-500 text-gray-50 rounded-lg hover:text-gray-100 transition-colors"
            >
              Annuler
            </button>
            <!-- Bouton pour ajouter la catégorie -->
            <button
              @click="handleAddCategory"
              class="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/80 transition-colors"
            >
              Ajouter
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Modal de succès catégorie -->
    <SuccessModal
      :modalSuccessShow="modalSuccessAddCategoryShow"
      content="Catégorie ajouté avec succès"
    />

    <!-- Modal de suppression recette -->
    <DangerModal
      :modalDangerShow="modalDangerDeleteRecipeShow"
      content="Recette supprimé avec succès"
    />
  </div>
</template>
