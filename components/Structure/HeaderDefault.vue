<!-- @format -->

<script setup lang="ts">
const authStore = useAuthStore();
import { useAuth } from "#build/imports";
const { logout } = useAuth();
const isDropdownOpen = ref(false);
const isMobileMenuOpen = ref(false);

const router = useRouter();

const searchQuery = ref("");
const searchInput = ref<HTMLInputElement | null>(null);

// Gère le clic pour fermer le menu déroulant si l'utilisateur clique en dehors
const handleClick = (event: MouseEvent) => {
  const item = event.target as HTMLElement;
  const dropdown = document.querySelector(".dropdown");

  if (isDropdownOpen.value && dropdown && !dropdown.contains(item)) {
    isDropdownOpen.value = false;
  }
};

// Gère l'entrée de recherche
const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  searchQuery.value = target.value;
};

// Gère la recherche lorsque la touche "Entrée" est pressée
const handleSearch = (event: KeyboardEvent) => {
  if (
    event.key === "Enter" &&
    searchQuery.value.trim().length > 0 &&
    document.activeElement === searchInput.value
  ) {
    router.push({
      path: "/search",
      query: { q: searchQuery.value.trim() },
    });
    searchQuery.value = "";
  }
};

// Gère la recherche lorsque la touche "Entrée" est pressée
const handleSearchWithoutKeydown = () => {
  router.push({
    path: "/search",
    query: { q: searchQuery.value.trim() },
  });
  searchQuery.value = "";
};

onMounted(() => {
  window.addEventListener("click", handleClick);
  window.addEventListener("keydown", handleSearch);
});

onBeforeUnmount(() => {
  window.removeEventListener("click", handleClick);
  window.removeEventListener("keydown", handleSearch);
});
</script>

<template>
  <header class="sticky top-4 z-50 containerExterne">
    <div
      class="flex items-center px-4 md:px-8 rounded-full h-[70px] bg-primary"
    >
      <!-- Logo -->
      <NuxtLink class="w-1/4 md:w-1/3" to="/">
        <NuxtImg
          src="hyarotech.png"
          alt="Logo Hyarotech"
          class="h-[40px] md:h-[60px] w-auto"
        />
      </NuxtLink>

      <!-- Titre -->
      <h1
        class="text-lg md:text-xl lg:text-2xl text-textColor font-bold hover:mb-[5px] text-center transition-all duration-300 w-1/2 md:w-1/3"
      >
        Hyarotech
      </h1>

      <!-- Recherche et Utilisateur -->
      <div class="flex justify-end items-center gap-2 md:gap-4 w-1/4 md:w-1/3">
        <!-- Barre de recherche - Cachée sur mobile -->
        <div class="hidden md:block relative flex-grow max-w-md">
          <input
            type="text"
            placeholder="Rechercher..."
            class="w-full border border-gray-800 rounded py-2 px-4 focus:outline-none focus:ring-2 focus:ring-primary transition duration-300 pr-10"
            v-model="searchQuery"
            @input="handleInput"
            ref="searchInput"
          />
          <Icon
            name="fa6-solid:magnifying-glass"
            class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-800"
          />
        </div>

        <!-- Bouton du menu mobile -->
        <button
          class="md:hidden text-textColor"
          @click="isMobileMenuOpen = !isMobileMenuOpen"
        >
          <Icon name="heroicons:bars-3" class="text-[30px]" />
        </button>

        <!-- Bouton de profil utilisateur -->
        <div class="relative dropdown">
          <div
            class="flex justify-center items-center rounded-full w-[40px] h-[40px] bg-white hover:bg-gray-200 transition duration-300 cursor-pointer select-none"
            @click="isDropdownOpen = !isDropdownOpen"
          >
            <Icon name="fa6-solid:user" class="text-[20px] text-textColor" />
          </div>

          <!-- Menu déroulant utilisateur -->
          <div
            v-if="isDropdownOpen"
            class="absolute right-0 mt-2 w-[230px] bg-white border border-gray-300 rounded-lg shadow-lg z-10 select-none"
          >
            <div class="flex justify-center p-[10px]">
              <p class="text-textColor text-center font-bold text-xl">
                {{ authStore.fullName }}
              </p>
            </div>

            <hr class="w-[80%] mx-auto border-[#000000] border-1 mb-[5px]" />

            <button
              @click="router.push('/my-recipes')"
              class="flex justify-center items-center w-full text-center py-[10px] text-gray-800 hover:bg-gray-200"
            >
              <Icon
                name="fa6-solid:briefcase"
                class="inline mr-2 text-gray-900"
              />
              <p>Mes annonces</p>
            </button>

            <button
              @click="logout()"
              class="flex justify-center items-center w-full text-center py-[10px] text-gray-800 hover:bg-gray-200"
            >
              <Icon name="fa6-solid:door-open" class="inline mr-2" />
              <p>Déconnexion</p>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Menu mobile -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="transform -translate-y-4 opacity-0"
      enter-to-class="transform translate-y-0 opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="transform translate-y-0 opacity-100"
      leave-to-class="transform -translate-y-4 opacity-0"
    >
      <div
        v-if="isMobileMenuOpen"
        class="absolute top-[80px] left-0 right-0 bg-white rounded-lg shadow-lg overflow-hidden md:hidden"
      >
        <!-- Recherche mobile -->
        <div class="p-4 flex flex-row items-center">
          <div class="relative flex-1">
            <input
              type="text"
              placeholder="Rechercher..."
              class="w-full border border-gray-300 rounded py-2 px-4 focus:outline-none focus:ring-2 focus:ring-primary transition duration-300"
              v-model="searchQuery"
              @input="handleInput"
            />
          </div>
          <button class="w-[40px] flex items-center justify-center ml-2" @click="handleSearchWithoutKeydown">
            <Icon
              name="fa6-solid:magnifying-glass"
              class="text-gray-800"
            />
          </button>
        </div>
      </div>
    </Transition>
  </header>
</template>
