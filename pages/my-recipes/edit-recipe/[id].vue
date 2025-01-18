<!-- @format -->

<script setup lang="ts">
// Importation des dépendances et des composants nécessaires
import { object, string, number } from "yup";
import BackButton from "~/components/ReusableComponents/BackButton.vue";
import FormSubmission from "~/components/ReusableComponents/FormSubmission.vue";
import Input from "~/components/ReusableComponents/Input.vue";
import ValidationButton from "~/components/ReusableComponents/ValidationButton.vue";
import type { Category } from "~/types/category";
import type { Recipe } from "~/types/recipe";
import Loading from "~/components/ReusableComponents/Loading.vue";
import { createError } from "nuxt/app";
import { useAuthStore } from "~/stores/useAuthStore";
import DangerModal from "~/components/ReusableComponents/DangerModal.vue";

// Configuration des métadonnées de la page
definePageMeta({
  layout: "default",
  middleware: "auth",
});

// Initialisation des variables réactives
const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();
const recipeId = route.params.id;
const categoriesOptions = ref(null);
const imagePreview = ref("");
const imageFile = ref<File | null>(null);
const imageError = ref("");
const fileInput = ref<HTMLInputElement | null>(null);
const recipeData = ref<Recipe | null>(null);
const loading = ref(true);
const error = ref(false);
const errorType = ref<number>(0);
const recipe = ref<Recipe | null>(null);
const errorGlobal = ref("");
const showDangerModal = ref<boolean>(false);

// Définition du schéma de validation pour le formulaire de modification de recette
// Utilise la bibliothèque Yup pour définir les règles de validation pour chaque champ
const schema = object({
  name: string()
    .required("Le nom est requis")
    .min(6, "Veuillez au moins ajouter 6 caractères")
    .typeError("Le nom doit être une chaîne de caractères"),
  description: string()
    .required("La description est requise")
    .min(10, "Veuillez au moins ajouter 10 caractères")
    .typeError("La description doit être une chaîne de caractères"),
  prepTime: number()
    .required("Le temps de préparation est requis")
    .min(1, "Le temps doit être supérieur à 0")
    .typeError("Le temps de préparation doit être un nombre"),
  cookTime: number()
    .required("Le temps de cuisson est requis")
    .min(0, "Le temps ne peut pas être négatif")
    .typeError("Le temps de cuisson doit être un nombre"),
  difficulty: string()
    .required("La difficulté est requise")
    .oneOf(["EASY", "MEDIUM", "HARD"], "Difficulté invalide")
    .typeError("La difficulté doit être une chaîne de caractères"),
  ingredients: string()
    .required("Les ingrédients sont requis")
    .min(10, "Veuillez détailler davantage les ingrédients")
    .typeError("Les ingrédients doivent être une chaîne de caractères"),
  instructions: string()
    .required("Les instructions sont requises")
    .min(20, "Veuillez détailler davantage les instructions")
    .typeError("Les instructions doivent être une chaîne de caractères"),
  categoryId: number()
    .required("La catégorie est requise")
    .positive("Catégorie invalide")
    .typeError("La catégorie doit être un nombre"),
});

// Fonction de gestion de la soumission du formulaire de modification de recette
// Effectue la validation des données, la lecture de l'image (si présente) et l'envoi des données au serveur
const handleSubmit = async (values: object) => {
  try {
    const recipeData: { [key: string]: any } = {
      ...values,
    };

    if (imageFile.value) {
      const reader = new FileReader();
      reader.readAsDataURL(imageFile.value);
      reader.onload = async () => {
        recipeData.image = reader.result;
      };
    }

    const response = await fetch(`http://localhost:3001/recipes/${recipeId}`, {
      method: "PUT",
      body: JSON.stringify(recipeData),
      headers: {
        Accept: "application/json",
        "Content-type": "application/json",
      },
      credentials: "include",
    });

    if (response.ok) {
      router.push("/my-recipes");
    } else {
      errorGlobal.value = "Erreur lors de la modification de la recette";
      showDangerModal.value = true;

      setTimeout(() => {
        errorGlobal.value = "";
        showDangerModal.value = false;
      }, 3000);
    }
  } catch (error) {
    errorGlobal.value = "Erreur lors de la modification de la recette";
    showDangerModal.value = true;

    setTimeout(() => {
      errorGlobal.value = "";
      showDangerModal.value = false;
    }, 3000);
  }
};

// Fonction pour récupérer les détails de la recette à modifier depuis le serveur
const getRecipe = async () => {
  try {
    const response = await fetch(`http://localhost:3001/recipes/${recipeId}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      if (response.status === 404) {
        error.value = true;
        errorType.value = 404;
      }
      throw new Error("Erreur lors de la récupération de la recette");
    }

    const data = await response.json();

    if (!data) {
      error.value = true;
      errorType.value = 404;
      throw new Error("Erreur lors de la récupération de la recette");
    }

    // Vérification de l'autorisation
    if (data.userId !== authStore.id) {
      error.value = true;
      errorType.value = 403;
      throw new Error(
        "Vous n'avez pas l'autorisation de modifier cette recette"
      );
    }

    recipeData.value = {
      id: Number(data.id),
      name: data.name,
      description: data.description,
      prepTime: Number(data.prepTime),
      cookTime: Number(data.cookTime),
      difficulty: data.difficulty,
      ingredients: data.ingredients,
      instructions: data.instructions,
      image: data.image,
      categoryId: Number(data.categoryId),
      userId: Number(data.userId),
    };
    imagePreview.value = data.image;
  } catch (error) {
    throw error;
  } finally {
    loading.value = false;
  }
};

// Fonction pour revenir à la page précédente
const goBack = () => {
  router.back();
};

// Fonction de gestion du téléchargement de l'image
// Met à jour les variables réactives imageFile et imagePreview lors de la sélection d'une image
const handleImageUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    const file = target.files[0];
    imageFile.value = file;
    imagePreview.value = URL.createObjectURL(file);
  }
  if (imageError.value) imageError.value = "";
};

// Fonction pour effacer l'image sélectionnée
// Réinitialise les variables réactives imagePreview, imageFile et vide l'input de fichier
const clearImage = () => {
  imagePreview.value = "";
  imageFile.value = null;
  if (fileInput.value) {
    (fileInput.value as HTMLInputElement).value = "";
  }
};

// Options pour le champ de sélection de la difficulté
const difficultyOptions = [
  { label: "Facile", value: "EASY" },
  { label: "Moyenne", value: "MEDIUM" },
  { label: "Difficile", value: "HARD" },
];

// Fonction pour récupérer les catégories depuis le serveur
// Transforme les données reçues en un format adapté pour le champ de sélection des catégories
const getCategories = async () => {
  const response = await fetch("http://localhost:3001/categories", {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  const data = await response.json();
  categoriesOptions.value = data.map((category: Category) => ({
    label: category.name,
    value: category.id,
  }));
};

// Fonction pour déclencher l'ouverture de la boîte de dialogue de sélection de fichier
const triggerFileInput = () => {
  fileInput.value?.click();
};

// Appel des fonctions pour récupérer les catégories et les détails de la recette au chargement du composant
onMounted(async () => {
  try {
    await Promise.all([getCategories(), getRecipe()]);
  } catch (error) {
    loading.value = false;
    if (errorType.value == 403) {
      throw createError({
        statusCode: 403,
        message: "Vous n'avez pas l'autorisation de modifier cette recette",
        fatal: true,
      });
    } else if (errorType.value == 404) {
      throw createError({
        statusCode: 404,
        message: "Cette recette n'existe pas",
        fatal: true,
      });
    } else {
      throw createError({
        statusCode: 400,
        message:
          "Impossible d'accéder à cette page, veuillez revenir en arrière",
        fatal: true,
      });
    }
  }
});

// Ajouter dans le watch de recipe.value ou dans onMounted après le chargement des données
watch(
  () => recipe.value,
  (newRecipe) => {
    if (newRecipe) {
      useSeoMeta({
        title: `Modifier ${newRecipe.name} - RecetteApp`,
        description: `Modifiez votre recette: ${newRecipe.description}`,
        ogTitle: `Modifier ${newRecipe.name} - RecetteApp`,
        ogDescription: newRecipe.description,
        ogImage: newRecipe.image,
        ogUrl: `https://recettes.com/my-recipes/edit-recipe/${newRecipe.id}`,
        twitterTitle: `Modifier ${newRecipe.name} - RecetteApp`,
        twitterDescription: newRecipe.description,
        twitterImage: newRecipe.image,
        twitterCard: "summary",
      });
    }
  },
  { immediate: true }
);
</script>

<template>
  <!-- Affichage d'un indicateur de chargement pendant la récupération des données -->
  <div v-if="loading" class="flex-1 flex justify-center items-center">
    <Loading />
  </div>
  <div v-else-if="!error && recipeData">
    <!-- En-tête avec le bouton de retour -->
    <div class="flex justify-between items-center mb-4">
      <BackButton name="Revenir en arrière" :onClick="goBack" />
    </div>

    <!-- Formulaire de modification de recette -->
    <FormSubmission
      ref="formRef"
      name="Modification de la recette"
      size-percentage="60"
      :validation-schema="schema"
      :initial-values="recipeData"
      :on-submit="handleSubmit"
      :inputPerRow="2"
    >
      <!-- Champs pour le nom et la description de la recette -->
      <div
        class="flex flex-col md:flex-row justify-between w-full gap-[8px] md:gap-[15px]"
      >
        <Input
          label="Nom de la recette"
          name="name"
          type="text"
          :modelValue="recipeData.name"
        />
        <Input
          label="Description"
          name="description"
          type="textarea"
          :modelValue="recipeData.description"
        />
      </div>

      <!-- Champs pour les temps de préparation et de cuisson -->
      <div
        class="flex flex-col md:flex-row justify-between w-full gap-[8px] md:gap-[15px]"
      >
        <Input
          label="Temps de préparation (min)"
          name="prepTime"
          type="number"
          :modelValue="recipeData.prepTime"
        />
        <Input
          label="Temps de cuisson (min)"
          name="cookTime"
          type="number"
          :modelValue="recipeData.cookTime"
        />
      </div>

      <!-- Champs pour la difficulté et la catégorie -->
      <div
        class="flex flex-col md:flex-row justify-between w-full gap-[8px] md:gap-[15px]"
      >
        <Input
          label="Difficulté"
          name="difficulty"
          type="select"
          :options="difficultyOptions"
          :modelValue="recipeData.difficulty"
        />
        <Input
          label="Catégorie"
          name="categoryId"
          type="select"
          :options="categoriesOptions"
          :modelValue="recipeData.categoryId"
        />
      </div>

      <!-- Champs pour les ingrédients et les instructions -->
      <div
        class="flex flex-col md:flex-row justify-between w-full gap-[8px] md:gap-[15px]"
      >
        <Input
          label="Ingrédients"
          name="ingredients"
          type="textarea"
          :modelValue="recipeData.ingredients"
        />
        <Input
          label="Instructions"
          name="instructions"
          type="textarea"
          :modelValue="recipeData.instructions"
        />
      </div>

      <!-- Section pour l'upload d'image -->
      <div class="flex flex-col items-center justify-center mb-[30px]">
        <div
          class="relative bg-white p-[20px] rounded-full w-[150px] h-[150px] flex justify-center items-center cursor-pointer"
          @click="triggerFileInput"
        >
          <NuxtImg
            v-if="!imagePreview"
            src="imageIconAdd.png"
            class="text-white w-[100px] h-[100px] relative"
          />
          <NuxtImg
            v-else
            :src="imagePreview"
            class="w-[100px] h-[100px] rounded-lg object-fit"
          />
          <input
            ref="fileInput"
            type="file"
            class="hidden"
            name="image"
            accept="image/*"
            @change="handleImageUpload"
          />

          <div
            v-if="imagePreview"
            @click.stop="clearImage()"
            class="bg-red-500 absolute top-0 right-0 flex items-center justify-center rounded-full p-[5px]"
          >
            <Icon name="fa6-solid:trash" class="text-white w-6 h-6" />
          </div>
        </div>
      </div>

      <!-- Bouton de validation du formulaire -->
      <ValidationButton text="Modifier" />
    </FormSubmission>

    <DangerModal :modalDangerShow="showDangerModal" :content="errorGlobal" />
  </div>
</template>
