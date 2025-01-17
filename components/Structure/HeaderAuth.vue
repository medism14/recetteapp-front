<!-- @format -->

<script setup lang="ts">
const currentRoute = useRoute();
const isCurrentPath = (path: string) => currentRoute.path === path;
</script>

<template>
  <header
    class="containerExterne flex items-center my-[20px] px-[30px] rounded-full h-[70px] bg-primary"
  >
    <NuxtLink class="w-1/3" to="/login">
      <NuxtImg
        src="hyarotech.png"
        alt="Logo Hyarotech"
        class="h-[60px] w-auto"
      />
    </NuxtLink>

    <h1
      class="text-[20px] text-textColor font-bold hover:mb-[5px] text-center transition-all duration-300 w-1/3"
    >
      Hyarotech
    </h1>

    <div class="flex justify-end h-[45px] w-1/3">
      <div class="flex">
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
  </header>
</template>
