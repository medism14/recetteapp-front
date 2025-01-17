<!-- @format -->

<script setup lang="ts">
import { object, string } from "yup";
import FormSubmission from "~/components/ReusableComponents/FormSubmission.vue";
import Input from "~/components/ReusableComponents/Input.vue";
import ValidationButton from "~/components/ReusableComponents/ValidationButton.vue";
import Loading from "~/components/ReusableComponents/Loading.vue";
import { useAuthStore } from "~/stores/useAuthStore";
import { storeToRefs } from "pinia";
import { useLoadingStore } from "~/stores/useLoadingStore";

definePageMeta({
  layout: "auth-layout",
});

const router = useRouter();
const errorMessage = ref("");
const authStore = useAuthStore();
const loadingStore = useLoadingStore();
const { isLoading } = storeToRefs(loadingStore);

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

const handleSubmit = async (values: object) => {
  try {
    loadingStore.startLoading();
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
      console.error("Erreur d'inscription", data);
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
    console.error("Erreur d'inscription:", error);
    errorMessage.value = "Une erreur est survenue lors de l'inscription";
  } finally {
    loadingStore.stopLoading();
  }
};
</script>

<template>
  <div v-if="isLoading">
    <Loading />
  </div>
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
