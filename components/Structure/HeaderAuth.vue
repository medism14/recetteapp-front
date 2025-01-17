<!-- @format -->

<script setup lang="ts">
// Récupère la route actuelle
const currentRoute = useRoute();
// Vérifie si le chemin actuel correspond à celui donné
const isCurrentPath = (path: string) => currentRoute.path === path;
// État pour gérer l'ouverture du menu mobile
const isMobileMenuOpen = ref(false);
</script>

<template>
  <header class="sticky top-4 z-50 containerExterne">
    <div class="flex items-center px-4 md:px-8 rounded-full h-[70px] bg-primary">
      <!-- Logo -->
      <NuxtLink class="w-1/4 md:w-1/3" to="/login">
        <NuxtImg
          src="hyarotech.png"
          alt="Logo Hyarotech"
          class="h-[40px] md:h-[60px] w-auto"
        />
      </NuxtLink>

      <!-- Titre -->
      <h1 class="text-lg md:text-xl lg:text-2xl text-textColor font-bold hover:mb-[5px] text-center transition-all duration-300 w-1/2 md:w-1/3">
        Hyarotech
      </h1>

      <!-- Navigation -->
      <div class="flex justify-end h-[45px] w-1/4 md:w-1/3">
        <!-- Bouton du menu mobile -->
        <button 
          class="md:hidden flex items-center"
          @click="isMobileMenuOpen = !isMobileMenuOpen"
        >
          <Icon name="heroicons:bars-3" class="text-[30px]" />
        </button>

        <!-- Menu de bureau -->
        <div class="hidden md:flex">
          <NuxtLink
            to="/login"
            :class="[
              isCurrentPath('/login')
                ? 'bg-gray-900 hover:bg-gray-800 border-gray-200 text-white'
                : 'bg-white hover:bg-gray-200 border-secondary text-secondary',
              'transition duration-300 w-[120px] h-full flex items-center justify-center border-[1px] border-r-0 rounded-l cursor-pointer',
            ]"
          >
            Connexion
          </NuxtLink>

          <NuxtLink
            to="/register"
            :class="[
              isCurrentPath('/register')
                ? 'bg-gray-900 hover:bg-gray-800 border-gray-200 text-white'
                : 'bg-white hover:bg-gray-200 border-secondary text-secondary',
              'transition duration-300 w-[120px] h-full flex items-center justify-center border-[1px] border-l-0 rounded-r cursor-pointer',
            ]"
          >
            Inscription
          </NuxtLink>
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
        <NuxtLink
          to="/login"
          class="block px-4 py-3 text-secondary hover:bg-gray-100"
          :class="{ 'bg-gray-100': isCurrentPath('/login') }"
          @click="isMobileMenuOpen = false"
        >
          Connexion
        </NuxtLink>
        <NuxtLink
          to="/register"
          class="block px-4 py-3 text-secondary hover:bg-gray-100"
          :class="{ 'bg-gray-100': isCurrentPath('/register') }"
          @click="isMobileMenuOpen = false"
        >
          Inscription
        </NuxtLink>
      </div>
    </Transition>
  </header>
</template>
