<!-- @format -->

<script setup lang="ts">
// Importation des dépendances et des composants nécessaires
import { object, string, number } from "yup";
import BackButton from "~/components/ReusableComponents/BackButton.vue";
import FormSubmission from "~/components/ReusableComponents/FormSubmission.vue";
import Input from "~/components/ReusableComponents/Input.vue";
import ValidationButton from "~/components/ReusableComponents/ValidationButton.vue";
import type { Category } from "~/types/category";
import DangerModal from "~/components/ReusableComponents/DangerModal.vue";

// Configuration des métadonnées de la page
definePageMeta({
  layout: "default",
  middleware: "auth",
});

useSeoMeta({
  title: "Ajouter une Recette - RecetteApp",
  description: "Créez et partagez une nouvelle recette de cuisine avec la communauté.",
  ogTitle: "Ajouter une Recette - RecetteApp",
  ogDescription: "Créez et partagez une nouvelle recette de cuisine avec la communauté.",
  ogImage: "/hyarotech.png",
  ogUrl: "https://recettes.com/my-recipes/add-recipe",
  twitterTitle: "Ajouter une Recette - RecetteApp",
  twitterDescription: "Créez et partagez une nouvelle recette de cuisine avec la communauté.",
  twitterImage: "/hyarotech.png",
  twitterCard: "summary",
});

// Initialisation des variables réactives
const router = useRouter();
const categoriesOptions = ref(null);
const imagePreview = ref("");
const imageFile = ref<File | null>(null);
const imageError = ref("");
const fileInput = ref<HTMLInputElement | null>(null);

// Ajout des refs pour la gestion des erreurs
const showDangerModal = ref<boolean>(false);
const errorGlobal = ref<string>("");

// Définition du schéma de validation pour le formulaire d'ajout de recette
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

// Fonction de gestion de la soumission du formulaire d'ajout de recette
// Effectue la validation de l'image, la lecture de l'image et l'envoi des données au serveur
const handleSubmit = async (values: object) => {
  if (!imageFile.value) {
    imageError.value = "Veuillez sélectionner une image";
    return;
  }

  const reader = new FileReader();
  reader.readAsDataURL(imageFile.value);
  reader.onload = async () => {
    const recipeData = {
      ...values,
      image: reader.result,
    };

    try {
      const response = await fetch("http://localhost:3001/recipes", {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(recipeData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Erreur lors de l'ajout de la recette");
      }

      router.push("/my-recipes");
    } catch (error: any) {
      errorGlobal.value = error.message || "Erreur lors de l'ajout de la recette";
      showDangerModal.value = true;
      setTimeout(() => {
        showDangerModal.value = false;
        errorGlobal.value = "";
      }, 3000);
    }
  };
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

// Fonction de gestion du clic sur le bouton de soumission
// Vérifie si une image a été sélectionnée et affiche une erreur si nécessaire
const handleSubmitClicked = () => {
  if (!imageFile.value) {
    imageError.value = "Veuillez sélectionner une image";
  }
};

// Options pour le champ de sélection de la difficulté
const difficultyOptions = [
  {
    label: "Facile",
    value: "EASY",
  },
  {
    label: "Moyenne",
    value: "MEDIUM",
  },
  {
    label: "Difficile",
    value: "HARD",
  },
];

// Fonction pour récupérer les catégories depuis le serveur
// Transforme les données reçues en un format adapté pour le champ de sélection des catégories
const getCategories = async () => {
  try {
    const response = await fetch("http://localhost:3001/categories", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Erreur lors de la récupération des catégories");
    }

    const data = await response.json();
    const categorieSerialized = data.map((category: Category) => ({
      label: category.name,
      value: category.id,
    }));

    categoriesOptions.value = categorieSerialized;
  } catch (error) {
    errorGlobal.value = "Erreur lors de la récupération des catégories";
    showDangerModal.value = true;
    setTimeout(() => {
      showDangerModal.value = false;
      errorGlobal.value = "";
    }, 3000);
  }
};

// Fonction pour déclencher l'ouverture de la boîte de dialogue de sélection de fichier
const triggerFileInput = () => {
  fileInput.value?.click();
};

// Appel de la fonction pour récupérer les catégories au chargement du composant
getCategories();
</script>

<template>
  <!-- Bouton de retour -->
  <div class="flex justify-between items-center mb-4">
    <BackButton name="Revenir en arrière" :onClick="goBack" />
  </div>

  <!-- Formulaire d'ajout de recette -->
  <FormSubmission
    ref="formRef"
    name="Ajout de recette"
    :inputPerRow="2"
    :validation-schema="schema"
    :on-submit="handleSubmit"
  >
    <!-- Champs pour le nom et la description de la recette -->
    <div class="flex flex-col md:flex-row justify-between w-full gap-[8px] md:gap-[15px]">
      <Input label="Nom de la recette" name="name" type="text" />
      <Input label="Description" name="description" type="textarea" />
    </div>

    <!-- Champs pour les temps de préparation et de cuisson -->
    <div class="flex flex-col md:flex-row justify-between w-full gap-[8px] md:gap-[15px]">
      <Input label="Temps de préparation (min)" name="prepTime" type="number" />
      <Input label="Temps de cuisson (min)" name="cookTime" type="number" />
    </div>

    <!-- Champs pour la difficulté et la catégorie -->
    <div class="flex flex-col md:flex-row justify-between w-full gap-[8px] md:gap-[15px]">
      <Input
        label="Difficulté"
        name="difficulty"
        type="select"
        :options="difficultyOptions"
      />
      <Input
        label="Catégorie"
        name="categoryId"
        type="select"
        :options="categoriesOptions"
      />
    </div>

    <!-- Champs pour les ingrédients et les instructions -->
    <div class="flex flex-col md:flex-row justify-between w-full gap-[8px] md:gap-[15px]">
      <Input label="Ingrédients" name="ingredients" type="textarea" />
      <Input label="Instructions" name="instructions" type="textarea" />
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
          accept=".png, .jpg"
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

      <div v-if="imageError" class="text-red-500 text-center mt-4">
        {{ imageError }}
      </div>
    </div>

    <!-- Bouton de validation du formulaire -->
    <ValidationButton text="Enregistrer" />
  </FormSubmission>

  <!-- Ajout du DangerModal à la fin du template -->
  <DangerModal :modalDangerShow="showDangerModal" :content="errorGlobal" />
</template>
