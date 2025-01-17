<!-- @format -->
<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import type { Recipe } from "~/types/recipe";
import BackButton from "~/components/ReusableComponents/BackButton.vue";
import Loading from "~/components/ReusableComponents/Loading.vue";

// Définition des métadonnées de la page
definePageMeta({
  layout: "default",
  middleware: "auth",
});

// Initialisation des variables réactives
const route = useRoute();
const router = useRouter();
const recipe = ref<Recipe | null>(null);
const difficulty = ref("");
const isFavorite = ref(false);
const loading = ref(true);

// Fonction pour revenir à la page précédente
const goBack = () => {
  router.back();
};

// Fonction pour basculer l'état des favoris d'une recette
const toggleFavorite = async (recipeId: number) => {
  const url = `http://localhost:3001/favorites/${recipeId}`;
  const method = isFavorite.value ? "DELETE" : "POST"; // Choix du verbe HTTP basé sur l'état actuel
  try {
    const response = await fetch(url, {
      method: method,
      credentials: "include",
      headers: {
        Accept: "application/json",
      },
    });

    isFavorite.value = !isFavorite.value; // Mise à jour de l'état des favoris
  } catch (error) {
    console.error(error); // Gestion des erreurs
  }
};

// Fonction pour vérifier si une recette est marquée comme favorite
const isRecipeFavorite = async (recipeId: number) => {
  try {
    const response = await fetch(
      `http://localhost:3001/favorites/check/${recipeId}`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          Accept: "application/json",
        },
      }
    );
    const data = await response.json();
    isFavorite.value = data.isFavorite; // Mise à jour de l'état des favoris
  } catch (error) {
    console.error("Erreur lors de la vérification des favoris:", error);
    return false; // Retourne false en cas d'erreur
  }
};

// Chargement des données de la recette lors du montage du composant
onMounted(async () => {
  try {
    const response = await fetch(
      `http://localhost:3001/recipes/${route.params.id}`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Erreur lors de la récupération de la recette");
    }

    const recipeData = await response.json();
    recipe.value = recipeData; // Stockage des données de la recette

    if (recipe.value && recipe.value.id) {
      await isRecipeFavorite(recipe.value.id); // Vérification des favoris

      // Mapping des niveaux de difficulté
      switch (recipe.value.difficulty) {
        case "EASY":
          difficulty.value = "Facile";
          break;
        case "MEDIUM":
          difficulty.value = "Moyenne";
          break;
        case "HARD":
          difficulty.value = "Difficile";
          break;
        default:
          difficulty.value = "Inconnue"; // Gestion des cas non prévus
      }
    }
  } catch (error) {
    console.error("Erreur:", error); // Gestion des erreurs
  } finally {
    loading.value = false; // Fin du chargement
  }
});

// Fonction pour formater les dates
const formatDate = (date: Date | undefined) => {
  if (!date) return "";
  return new Date(date).toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// Ajouter dans le watch de recipe.value ou dans onMounted après le chargement des données
watch(() => recipe.value, (newRecipe) => {
  if (newRecipe) {
    useSeoMeta({
      title: newRecipe.name,
      description: newRecipe.description,
      ogTitle: newRecipe.name,
      ogDescription: newRecipe.description,
      ogImage: newRecipe.image,
      ogUrl: `https://recettes.com/recipe-detail/${newRecipe.id}`,
      twitterTitle: newRecipe.name,
      twitterDescription: newRecipe.description,
      twitterImage: newRecipe.image,
      twitterCard: "summary",
    });
  }
}, { immediate: true });
</script>

<template>
  <div v-if="loading" class="flex-1 flex justify-center items-center">
    <Loading />
  </div>
  <div v-else>
    <BackButton name="Revenir en arrière" :onClick="goBack" />
    <div class="bg-gray-50 mt-2">
      <!-- Section héro avec l'image -->
      <div class="relative h-[40vh] md:h-[50vh]">
        <img
          :src="recipe?.image"
          :alt="recipe?.name"
          class="w-full h-full object-fit"
        />
        <div class="absolute inset-0 bg-black bg-opacity-40"></div>
        <div class="absolute bottom-0 left-0 right-0 p-4 md:p-6 text-white">
          <div
            class="flex flex-col md:flex-row items-center justify-between w-full"
          >
            <h1
              class="text-2xl md:text-4xl font-bold mb-2 break-words text-center md:text-left w-full truncate"
            >
              {{ recipe?.name }}
            </h1>
            <div
              class="cursor-pointer"
              @click="recipe?.id && toggleFavorite(recipe.id)"
            >
              <Icon
                name="fa6-solid:star"
                class="text-[30px]"
                :class="isFavorite ? 'text-yellow-400' : 'text-primary'"
              />
            </div>
          </div>
          <div class="flex flex-col md:flex-row items-center gap-2 md:gap-4">
            <div
              class="flex items-center bg-white/20 backdrop-blur-sm rounded-lg py-2 px-3"
            >
              <Icon name="mdi:clock-outline" class="mr-2 text-xl" />
              <span>Préparation: {{ recipe?.prepTime }}min</span>
            </div>
            <div
              class="flex items-center bg-white/20 backdrop-blur-sm rounded-lg py-2 px-3"
            >
              <Icon name="mdi:pot-steam-outline" class="mr-2 text-xl" />
              <span>Cuisson: {{ recipe?.cookTime }}min</span>
            </div>
            <div
              class="flex items-center justify-center py-1 px-3 rounded-lg"
              :class="{
                'bg-green-100 text-green-700': difficulty === 'Facile',
                'bg-yellow-100 text-yellow-700': difficulty === 'Moyenne',
                'bg-red-100 text-red-700': difficulty === 'Difficile',
              }"
            >
              <span>{{ difficulty }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Contenu principal -->
      <div class="mx-auto px-4 py-4 md:py-8">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
          <!-- Colonne de gauche -->
          <div class="md:col-span-2 space-y-4 md:space-y-8">
            <!-- Description -->
            <div
              class="bg-primary/10 rounded-xl p-4 md:p-6 shadow-sm overflow-hidden"
            >
              <h2 class="text-xl md:text-2xl font-semibold mb-2">
                Description
              </h2>
              <p class="text-gray-600 break-words">{{ recipe?.description }}</p>
            </div>

            <!-- Instructions -->
            <div class="bg-primary/10 rounded-xl p-4 md:p-6 shadow-sm">
              <h2 class="text-xl md:text-2xl font-semibold mb-2">
                Instructions
              </h2>
              <p class="text-gray-600 break-words">
                {{ recipe?.instructions }}
              </p>
            </div>
          </div>

          <!-- Colonne de droite -->
          <div class="space-y-4 md:space-y-8">
            <!-- Ingrédients -->
            <div class="bg-primary/10 rounded-xl p-4 md:p-6 shadow-sm">
              <h2 class="text-xl md:text-2xl font-semibold mb-2">
                Ingrédients
              </h2>
              <p class="text-gray-600 break-words">{{ recipe?.ingredients }}</p>
            </div>

            <!-- Informations supplémentaires -->
            <div class="bg-primary/10 rounded-xl p-4 md:p-6 shadow-sm">
              <h2 class="text-xl md:text-2xl font-semibold mb-2">
                Informations
              </h2>
              <div class="space-y-2">
                <div class="flex items-center gap-2">
                  <i class="ri-user-line text-primary"></i>
                  <span
                    ><span class="font-bold text-gray-700">Par:</span>
                    {{ recipe?.user?.firstName }}
                    {{ recipe?.user?.lastName }}</span
                  >
                </div>
                <div class="flex items-center gap-2">
                  <i class="ri-price-tag-3-line text-primary"></i>
                  <span
                    ><span class="font-bold text-gray-700">Categorie:</span>
                    {{ recipe?.category?.name }}</span
                  >
                </div>
                <div class="flex items-center gap-2">
                  <i class="ri-calendar-line text-primary"></i>
                  <span
                    ><span class="font-bold text-gray-700">Créé le:</span>
                    {{ formatDate(recipe?.createdAt) }}</span
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
