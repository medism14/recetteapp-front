<!-- @format -->

<script setup lang="ts">
import { object, string } from "yup";
import FormSubmission from "~/components/ReusableComponents/FormSubmission.vue";
import Input from "~/components/ReusableComponents/Input.vue";
import ValidationButton from "~/components/ReusableComponents/ValidationButton.vue";
import { useAuthStore } from "~/stores/useAuthStore";
import Loading from "~/components/ReusableComponents/Loading.vue";

// Définition des métadonnées de la page
definePageMeta({
  layout: "auth-layout",
  middleware: "auth",
});

useSeoMeta({
  title: "Login",
  description: "Page d'authentification - RecetteApp",
  ogTitle: "Login",
  ogDescription: "Page d'authentification - RecetteApp",
  ogImage: "/hyarotech.png",
  twitterTitle: "Login",
  twitterDescription: "Page d'authentification - RecetteApp",
  twitterImage: "/hyarotech.png",
  twitterCard: "summary",
});

// Initialisation des variables
const router = useRouter();
const errorMessage = ref("");
const authStore = useAuthStore();
const loading = ref(false);

// Définition du schéma de validation
const schema = object({
  email: string()
    .required("L'email est requis")
    .email("Format d'email invalide"),
  password: string()
    .required("Le mot de passe est requis")
    .min(6, "Minimum 6 caractères"),
});

// Fonction de soumission du formulaire
const handleSubmit = async (values: object) => {
  loading.value = true;
  try {
    const response = await fetch("http://localhost:3001/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(values),
    });

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 401) {
        errorMessage.value = "Vos identifiants sont incorrects";
      } else if (response.status === 404) {
        errorMessage.value = "L'utilisateur n'existe pas";
      } else {
        errorMessage.value = "Une erreur est survenue lors de la connexion";
      }
      return;
    }

    authStore.setUser(data);
    await router.push("/");
  } catch (error) {
    errorMessage.value = "Une erreur est survenue lors de la connexion";
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div v-if="loading">
    <Loading />
  </div>
  <FormSubmission
    v-else
    name="Connexion"
    :validation-schema="schema"
    :on-submit="handleSubmit"
  >
    <Input label="Email" name="email" type="email" />
    <Input
      label="Mot de passe"
      name="password"
      type="password"
      :secure="true"
    />
    <ValidationButton text="Se connecter" />
    <span v-if="errorMessage" class="text-red-400 text-base mt-2">
      {{ errorMessage }}
    </span>
    <div class="text-center mt-4 text-white">
      Pas encore de compte ? 
      <NuxtLink 
        to="/register" 
        class="text-tertiary hover:text-tertiary/80 font-semibold ml-1"
      >
        Inscrivez-vous
      </NuxtLink>
    </div>
  </FormSubmission>
</template>
