<!-- @format -->
<script setup lang="ts">
import MyRecipeInfo from "~/components/PageComponents/my-recipes/MyRecipeInfo.vue";
import SuccessModal from "~/components/ReusableComponents/SuccessModal.vue";
import DangerModal from "~/components/ReusableComponents/DangerModal.vue";
import type { Recipe } from "~/types/recipe";
import BackButton from "~/components/ReusableComponents/BackButton.vue";

definePageMeta({
  layout: "default",
  middleware: "auth",
});

const router = useRouter();
const recipes = ref<Recipe[]>([]);
const modalAddCategoryShow = ref(false);
const modalSuccessAddCategoryShow = ref(false);
const modalDangerDeleteRecipeShow = ref(false);
const categoryName = ref("");
const categoryNameError = ref("");

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

const openModalAddCategory = () => {
  modalAddCategoryShow.value = true;
  document.body.classList.add("overflow-hidden");
};

const closeModalAddCategory = () => {
  modalAddCategoryShow.value = false;
  document.body.classList.remove("overflow-hidden");
  categoryName.value = "";
  categoryNameError.value = "";
};

const goBack = () => {
  router.push("/");
};

const handleEditRecipe = (recipeId: number) => {
  router.push(`/my-recipes/edit-recipe/${recipeId}`);
};

const handleViewRecipe = (recipeId: number) => {
  router.push(`/recipe-detail/${recipeId}`);
};

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

getMyRecipes();

const handleDeleteRecipe = async (recipeId: number) => {
  try {
    const response = await fetch(`http://localhost:3001/recipes/${recipeId}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Erreur lors de la suppression de la recette");
    }

    // Mettre à jour la liste des recettes après la suppression
    recipes.value = recipes.value.filter((recipe) => recipe.id !== recipeId);
    modalDangerDeleteRecipeShow.value = true;
    setTimeout(() => {
      modalDangerDeleteRecipeShow.value = false;
    }, 2000);
  } catch (error) {
    console.error("Erreur:", error);
  }
};
</script>

<template>
  <div class="mb-8">
    <BackButton name="Revenir à la page d'accueil" :onClick="goBack" />
  </div>

  <!-- Titre -->
  <div class="flex justify-between mb-[20px]">
    <h1 class="text-[40px] font-bold text-textColor">Mes recettes</h1>

    <div class="flex gap-[10px]">
      <button
        class="bg-secondary flex justify-center gap-[10px] items-center p-[20px] rounded-lg h-[50px]"
        @click="openModalAddCategory"
      >
        <p class="text-white">Ajouter une catégorie</p>
        <Icon
          name="fa6-solid:folder-plus"
          class="text-white text-lg font-bold"
        />
      </button>

      <button
        class="bg-secondary flex justify-center gap-[10px] items-center p-[20px] rounded-lg h-[50px]"
        @click="router.push('/my-recipes/add-recipe')"
      >
        <p class="text-white">Ajouter une recette</p>
        <Icon name="fa6-solid:plus" class="text-white text-lg font-bold" />
      </button>
    </div>
  </div>

  <div class="flex flex-col gap-[35px]">
    <template v-if="recipes.length === 0">
      <p class="text-center text-gray-600">Aucune donnée disponible</p>
    </template>
    <MyRecipeInfo
      v-for="recipe in recipes"
      :key="recipe.id"
      :recipe="recipe"
      :handleDeleteRecipe="handleDeleteRecipe"
      :handleEditRecipe="handleEditRecipe"
      :handleViewRecipe="handleViewRecipe"
    />

    <!-- Modal pour ajouter une categorie -->
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
          class="bg-white rounded-xl p-8 w-[500px] shadow-2xl transform transition-all"
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
            <button
              @click="closeModalAddCategory"
              class="px-4 py-2 bg-red-500 text-gray-50 rounded-lg hover:text-gray-100 transition-colors"
            >
              Annuler
            </button>
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
