<!-- @format -->
<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import type { Recipe } from "~/types/recipe";
import BackButton from "~/components/ReusableComponents/BackButton.vue";

definePageMeta({
  layout: "default",
  middleware: "auth",
});

const route = useRoute();
const router = useRouter();
const recipe = ref<Recipe | null>(null);
const difficulty = ref("");
const isFavorite = ref(false);

const goBack = () => {
  router.back();
};

const toggleFavorite = async (recipeId: number) => {
  const url = `http://localhost:3001/favorites/${recipeId}`;
  const method = isFavorite.value ? "DELETE" : "POST";
  try {
    const response = await fetch(url, {
      method: method,
      credentials: "include",
      headers: {
        Accept: "application/json",
      },
    });

    isFavorite.value = !isFavorite.value;
  } catch (error) {
    console.error(error);
  }
};

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
    isFavorite.value = data.isFavorite;
  } catch (error) {
    console.error("Erreur lors de la vérification des favoris:", error);
    return false;
  }
};

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
    recipe.value = recipeData;
    
    if (recipe.value && recipe.value.id) {
      await isRecipeFavorite(recipe.value.id);

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
          difficulty.value = "Inconnue";
      }
    }
  } catch (error) {
    console.error("Erreur:", error);
  }
});

const ingredientsList = computed(() => {
  return recipe.value?.ingredients.split("\n").filter((i) => i.trim());
});

const instructionsList = computed(() => {
  return recipe.value?.instructions.split("\n").filter((i) => i.trim());
});

const formatDate = (date: Date | undefined) => {
  if (!date) return "";
  return new Date(date).toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};
</script>

<template>
  <BackButton name="Revenir en arrière" :onClick="goBack" />
  <div class="bg-gray-50 mt-[10px]">
    <!-- Hero Section avec l'image -->
    <div class="relative h-[40vh] md:h-[50vh]">
      <img
        :src="recipe?.image"
        :alt="recipe?.name"
        class="w-full h-full object-cover"
      />
      <div class="absolute inset-0 bg-black bg-opacity-40"></div>
      <div class="absolute bottom-0 left-0 right-0 p-6 text-white">
        <div class="flex items-center justify-between">
          <h1 class="text-3xl md:text-4xl font-bold mb-2">
            {{ recipe?.name }}
          </h1>
          <div class="cursor-pointer" @click="recipe?.id && toggleFavorite(recipe.id)">
            <Icon
              name="fa6-solid:star"
              class="text-[30px]"
              :class="isFavorite ? 'text-yellow-400' : 'text-secondary'"
            />
          </div>
        </div>
        <div class="flex items-center gap-4">
          <div
            class="flex items-center bg-white/20 backdrop-blur-sm rounded-lg py-2 px-4"
          >
            <Icon name="mdi:clock-outline" class="mr-2 text-xl" />
            <span>Préparation: {{ recipe?.prepTime }}min</span>
          </div>
          <div
            class="flex items-center bg-white/20 backdrop-blur-sm rounded-lg py-2 px-4"
          >
            <Icon name="mdi:pot-steam-outline" class="mr-2 text-xl" />
            <span>Cuisson: {{ recipe?.cookTime }}min</span>
          </div>
          <div
            class="flex items-center justify-center py-[7px] px-[14px] rounded-lg"
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
    <div class="max-w-7xl mx-auto px-4 py-8">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <!-- Colonne de gauche -->
        <div class="md:col-span-2 space-y-8">
          <!-- Description -->
          <div class="bg-white rounded-xl p-6 shadow-sm">
            <h2 class="text-2xl font-semibold mb-4">Description</h2>
            <p class="text-gray-600">{{ recipe?.description }}</p>
          </div>

          <!-- Instructions -->
          <div class="bg-white rounded-xl p-6 shadow-sm">
            <h2 class="text-2xl font-semibold mb-4">Instructions</h2>
            <div class="space-y-4">
              <div
                v-for="(instruction, index) in instructionsList"
                :key="index"
                class="flex items-start gap-4"
              >
                <p class="text-gray-600">{{ instruction }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Colonne de droite -->
        <div class="space-y-8">
          <!-- Ingrédients -->
          <div class="bg-white rounded-xl p-6 shadow-sm">
            <h2 class="text-2xl font-semibold mb-4">Ingrédients</h2>
            <ul class="space-y-2">
              <li
                v-for="(ingredient, index) in ingredientsList"
                :key="index"
                class="flex items-center gap-2 text-gray-600"
              >
                <i class="ri-checkbox-circle-line text-primary"></i>
                {{ ingredient }}
              </li>
            </ul>
          </div>

          <!-- Informations supplémentaires -->
          <div class="bg-white rounded-xl p-6 shadow-sm">
            <h2 class="text-2xl font-semibold mb-4">Informations</h2>
            <div class="space-y-3">
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
</template>
