<!-- @format -->

<script setup lang="ts">
import { object, string } from "yup";
import FormSubmission from "~/components/ReusableComponents/FormSubmission.vue";
import Input from "~/components/ReusableComponents/Input.vue";
import ValidationButton from "~/components/ReusableComponents/ValidationButton.vue";
import Loading from "~/components/ReusableComponents/Loading.vue";
import { useAuthStore } from "~/stores/useAuthStore";

// Définition des métadonnées de la page
definePageMeta({
  layout: "auth-layout",
});

const router = useRouter();
const errorMessage = ref("");
const authStore = useAuthStore();
const loading = ref(false);

// Définition du schéma de validation
const schema = object({
  firstName: string().required("Le prénom est requis"),
  lastName: string().required("Le nom est requis"),
  email: string()
    .required("L'email est requis")
    .email("Format d'email invalide"),
  password: string()
    .required("Le mot de passe est requis")
    .min(6, "Minimum 6 caractères"),
});

// Fonction de soumission du formulaire
const handleSubmit = async (values: object) => {
  loading.value = true; // Démarrer le loading
  try {
    const response = await fetch("http://localhost:3001/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(values),
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 400) {
        errorMessage.value =
          "Le mot de passe doit contenir au moins 6 caractères";
      } else if (response.status === 409) {
        errorMessage.value = "L'email est déjà utilisé";
      } else {
        errorMessage.value = "Erreur lors de la création du compte";
      }
      return;
    }

    authStore.setUser(data);
    await router.push("/");
  } catch (error) {
    errorMessage.value = "Une erreur est survenue lors de l'inscription";
  } finally {
    loading.value = false; // Arrêter le loading
  }
};

useSeoMeta({
  title: "Inscription - RecetteApp",
  description: "Créez votre compte sur RecetteApp et commencez à partager vos recettes.",
  ogTitle: "Inscription - RecetteApp",
  ogDescription: "Créez votre compte sur RecetteApp et commencez à partager vos recettes.",
  ogImage: "/hyarotech.png",
  ogUrl: "https://recettes.com/register",
  twitterTitle: "Inscription - RecetteApp",
  twitterDescription: "Créez votre compte sur RecetteApp et commencez à partager vos recettes.",
  twitterImage: "/hyarotech.png",
  twitterCard: "summary",
});
</script>

<template>
  <Loading v-if="loading" />
  <!-- Utilisation de loading normal -->
  <FormSubmission
    v-else
    name="Inscription"
    :validation-schema="schema"
    :on-submit="handleSubmit"
    size-percentage="50"
  >
    <Input label="Prenom" name="firstName" type="text" />

    <Input label="Nom" name="lastName" type="text" />

    <Input label="Email" name="email" type="email" />

    <Input
      label="Mot de passe"
      name="password"
      type="password"
      :secure="true"
    />

    <ValidationButton text="S'inscrire" />
    <span v-if="errorMessage" class="text-red-400 text-base mt-2">{{
      errorMessage
    }}</span>
    <div class="text-center mt-4 text-white">
      Déjà un compte ?
      <NuxtLink
        to="/login"
        class="text-tertiary hover:text-tertiary/80 font-semibold ml-1"
      >
        Connectez-vous
      </NuxtLink>
    </div>
  </FormSubmission>
</template>
