<!-- @format -->

<script setup lang="ts">
import type { Recipe } from '~/types/recipe';
import RecipeInfo from '~/components/ReusableComponents/RecipeInfo.vue';
import Loading from '~/components/ReusableComponents/Loading.vue';
import DangerModal from '~/components/ReusableComponents/DangerModal.vue';

definePageMeta({
  middleware: "auth",
});

const route = useRoute();
const searchText = ref(route.query.q as string || '');
const recipes = ref<Recipe[]>([]);
const loading = ref(false);
const noResults = ref(false);
const showDangerModal = ref<boolean>(false);
const errorGlobal = ref<string>("");

// Fonction pour effectuer la recherche de recettes
const searchRecipes = async () => {
  loading.value = true;
  try {
    noResults.value = false;

    const response = await fetch(`http://localhost:3001/recipes/search/${searchText.value}`, {
      method: 'GET',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Erreur lors de la recherche');
    }

    const data = await response.json();
    recipes.value = data;
    noResults.value = data.length === 0;
  } catch (error) {
    errorGlobal.value = "Une erreur est survenue lors de la recherche";
    showDangerModal.value = true;
    setTimeout(() => {
      showDangerModal.value = false;
      errorGlobal.value = "";
    }, 3000);
  } finally {
    loading.value = false;
  }
};

// Fonction pour mettre à jour les favoris
const handleUpdateFavorites = async () => {
  await searchRecipes();
};

// Observer les changements des paramètres de recherche
watch(
  () => route.query.q,
  (newQuery) => {
    searchText.value = newQuery as string || '';
    if (searchText.value) {
      searchRecipes();
    }
  }
);

// Exécuter la recherche au chargement si un terme est présent
onMounted(() => {
  if (searchText.value) {
    searchRecipes();
  }
});

// Ajouter un watch sur searchText et recipes
watch([searchText, recipes], ([newSearchText, newRecipes]) => {
  useSeoMeta({
    title: `Recherche: ${newSearchText} - RecetteApp`,
    description: `${newRecipes.length} résultats pour "${newSearchText}" - Trouvez les meilleures recettes`,
    ogTitle: `Recherche: ${newSearchText} - RecetteApp`,
    ogDescription: `${newRecipes.length} résultats pour "${newSearchText}" - Trouvez les meilleures recettes`,
    ogImage: "/hyarotech.png",
    ogUrl: `https://recettes.com/search?q=${newSearchText}`,
    twitterTitle: `Recherche: ${newSearchText} - RecetteApp`,
    twitterDescription: `${newRecipes.length} résultats pour "${newSearchText}" - Trouvez les meilleures recettes`,
    twitterImage: "/hyarotech.png",
    twitterCard: "summary",
  });
}, { immediate: true });
</script>

<template>
  <div v-if="loading" class="flex-1 flex justify-center items-center">
    <Loading />
  </div>
  <div v-else class="px-4 flex-1 flex flex-col">
    <!-- En-tête de recherche -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-textColor mb-2">
        Résultats de recherche
      </h1>
      <p class="text-gray-600">
        {{ recipes.length }} résultat(s) pour "{{ searchText }}"
      </p>
    </div>

    <!-- État de l'absence de résultats -->
    <div
      v-if="noResults"
      class="flex flex-col items-center justify-center flex-1 text-center"
    >
      <Icon
        name="fa6-regular:face-frown"
        class="text-6xl text-gray-400 mb-4"
      />
      <h2 class="text-2xl font-semibold text-gray-600 mb-2">
        Aucun résultat trouvé
      </h2>
      <p class="text-gray-500 max-w-md">
        Nous n'avons trouvé aucune recette correspondant à "{{ searchText }}".
        Essayez avec d'autres termes.
      </p>
    </div>

    <!-- Grille des résultats -->
    <div
      v-else
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
    >
      <RecipeInfo
        v-for="recipe in recipes"
        :key="recipe.id"
        :recipe="recipe"
        @update-favorites="handleUpdateFavorites"
      />
    </div>
  </div>

  <DangerModal :modalDangerShow="showDangerModal" :content="errorGlobal" />
</template>
