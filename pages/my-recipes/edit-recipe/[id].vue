<!-- @format -->

<script setup lang="ts">
import { object, string, number } from "yup";
import BackButton from "~/components/ReusableComponents/BackButton.vue";
import FormSubmission from "~/components/ReusableComponents/FormSubmission.vue";
import Input from "~/components/ReusableComponents/Input.vue";
import ValidationButton from "~/components/ReusableComponents/ValidationButton.vue";
import type { Category } from "~/types/category";
import type { Recipe } from "~/types/recipe";

definePageMeta({
  layout: "default",
  middleware: "auth",
});

const router = useRouter();
const route = useRoute();
const recipeId = route.params.id;
const categoriesOptions = ref(null);
const imagePreview = ref("");
const imageFile = ref<File | null>(null);
const imageError = ref("");
const fileInput = ref<HTMLInputElement | null>(null);
const recipeData = ref<Recipe | null>(null);

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
      console.error("Erreur lors de la modification de la recette");
    }
  } catch (error) {
    console.error("Erreur:", error);
  }
};

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

    if (response.ok) {
      const data = await response.json();
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
    }
  } catch (error) {
    console.error("Erreur lors de la récupération de la recette:", error);
    router.push("/my-recipes");
  }
};

const goBack = () => {
  router.back();
};

const handleImageUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    const file = target.files[0];
    imageFile.value = file;
    imagePreview.value = URL.createObjectURL(file);
  }
  if (imageError.value) imageError.value = "";
};

const clearImage = () => {
  imagePreview.value = "";
  imageFile.value = null;
  if (fileInput.value) {
    (fileInput.value as HTMLInputElement).value = "";
  }
};

const difficultyOptions = [
  { label: "Facile", value: "EASY" },
  { label: "Moyenne", value: "MEDIUM" },
  { label: "Difficile", value: "HARD" },
];

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

const triggerFileInput = () => {
  fileInput.value?.click();
};

onMounted(async () => {
  await getCategories();
  await getRecipe();
});
</script>

<template>
  <div class="flex justify-between items-center mb-4">
    <BackButton name="Revenir en arrière" :onClick="goBack" />
  </div>

  <FormSubmission
    v-if="recipeData"
    ref="formRef"
    name="Modification de la recette"
    size-percentage="60"
    :validation-schema="schema"
    :initial-values="recipeData"
    :on-submit="handleSubmit"
  >
    <div class="flex justify-between w-full">
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

    <div class="flex justify-between w-full">
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

    <div class="flex justify-between w-full">
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

    <div class="flex justify-between w-full">
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

    <ValidationButton text="Modifier" />
  </FormSubmission>
</template>
