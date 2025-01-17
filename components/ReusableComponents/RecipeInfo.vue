<!-- @format -->

<script setup lang="ts">
import type { Recipe } from "~/types/recipe";

const difficulty = ref("");

interface Props {
  recipe: Recipe;
}

const isFavorite = ref(false);
const router = useRouter();

const props = defineProps<Props>();

const emit = defineEmits<{
  'update-favorites': []
}>();

if (props.recipe) {
  switch (props.recipe.difficulty) {
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

const handleNavigateShow = (recipeId: number) => {
  router.push(`/recipe-detail/${recipeId}`);
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

    if (response.ok) {
      isFavorite.value = !isFavorite.value;
      emit('update-favorites');
    }
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

onMounted(() => {
  isRecipeFavorite(props.recipe?.id);
});
</script>

<template>
  <div
    class="flex flex-col bg-white shadow-xl h-[400px] rounded-lg p-[10px] gap-[5px] hover:shadow-2xl transition-all duration-300 relative cursor-pointer border border-gray-200"
    @click="handleNavigateShow(recipe?.id)"
  >
    <!-- Icône star pour les favoris -->
    <div
      class="absolute top-[15px] right-[15px] cursor-pointer z-30 select-none"
      @click.stop
      @click="toggleFavorite(recipe?.id)"
    >
      <Icon
        name="fa6-solid:star"
        class="text-[30px]"
        :class="isFavorite ? 'text-yellow-400' : 'text-secondary'"
      />
    </div>

    <!-- Présentation de l'image -->
    <div
      class="h-2/4 bg-primary/10 rounded-lg flex items-center justify-center p-[10px] overflow-hidden"
    >
      <NuxtImg
        :src="recipe?.image"
        class="w-full h-full object-fit rounded-lg hover:scale-105 transition-transform duration-300"
      />
    </div>

    <!-- Informations de la recette -->
    <div class="h-2/4 flex flex-col justify-between p-2">
      <!-- Informations importantes -->
      <div>
        <h1 class="text-xl font-bold text-textColor line-clamp-1">
          {{ recipe?.name }}
        </h1>
        <p class="text-sm text-textColor/70 line-clamp-2">
          Catégorie : {{ recipe?.category?.name }}
        </p>
        <p
          v-if="recipe?.description"
          class="text-sm text-textColor/70 line-clamp-2"
        >
          {{ recipe?.description }}
        </p>
        <p v-else class="text-sm text-textColor/70 line-clamp-2">
          {{ recipe?.ingredients }}
        </p>
      </div>

      <!-- Difficultés -->
      <div class="flex justify-center">
        <span
          class="px-4 py-1 rounded-full text-sm font-semibold"
          :class="{
            'bg-green-100 text-green-700': difficulty === 'Facile',
            'bg-yellow-100 text-yellow-700': difficulty === 'Moyenne',
            'bg-red-100 text-red-700': difficulty === 'Difficile',
          }"
        >
          {{ difficulty }}
        </span>
      </div>

      <!-- Temps de préparation -->
      <div class="flex justify-between mt-2">
        <!-- Cook time -->
        <div class="flex items-center gap-1">
          <Icon name="mdi:pot-steam-outline" class="text-primary" />
          <span class="text-sm text-gray-600"
            >{{ recipe?.cookTime }}min de préparation</span
          >
        </div>

        <!-- Prep time -->
        <div class="flex items-center gap-1">
          <Icon name="mdi:clock-outline" class="text-primary" />
          <span class="text-sm text-gray-600"
            >{{ recipe?.prepTime }}min de cuisson</span
          >
        </div>
      </div>
    </div>
  </div>
</template>
