<!-- @format -->

<script setup lang="ts">

const authStore = useAuthStore();
import { useAuth } from "#build/imports";
const { logout } = useAuth();
const isDropdownOpen = ref(false);

const router = useRouter();

const handleClick = (event: MouseEvent) => {
  const item = event.target as HTMLElement;
  const dropdown = document.querySelector('.dropdown');

  if (isDropdownOpen.value && dropdown && !dropdown.contains(item)) {
    isDropdownOpen.value = false;
  }
}

onMounted(() => {
  window.addEventListener("click", handleClick);
});

onBeforeUnmount(() => {
  window.removeEventListener("click", handleClick);
});
</script>

<template>
  <header
    class="containerExterne flex items-center my-[20px] px-[30px] rounded-full h-[70px] bg-primary sticky top-[10px] z-50"
  >
    <NuxtLink class="w-1/3" to="/">
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

    <div class="flex justify-end gap-[15px] w-1/3">
      <div class="relative">
        <input
          type="text"
          placeholder="Rechercher..."
          class="border border-gray-800 rounded py-2 px-4 focus:outline-none focus:ring-2 focus:ring-primary transition duration-300 pr-10"
        />
        <Icon
          name="fa6-solid:magnifying-glass"
          class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-800"
        />
      </div>

      <div class="relative dropdown">
        <div
          class="flex justify-center items-center rounded-full w-[40px] h-[40px] bg-white hover:bg-gray-200 transition duration-300 cursor-pointer select-none"
          @click="isDropdownOpen = !isDropdownOpen"
        >
          <Icon name="fa6-solid:user" class="text-[20px] text-textColor" />
        </div>
        <div
          v-if="isDropdownOpen"
          class="absolute right-0 mt-2 w-[230px] bg-white border border-gray-300 rounded-lg shadow-lg z-10 select-none"
        >
          <div class="flex justify-center p-[10px]">
            <p class="text-textColor font-bold text-xl">
              {{ authStore.fullName }}
            </p>
          </div>

          <hr class="w-[80%] mx-auto border-[#000000] border-1 mb-[5px]" />

          <button
            @click="router.push('/my-recipes')"
            class="flex justify-center items-center w-full text-center py-[10px] text-gray-800 hover:bg-gray-200"
          >
            <Icon name="fa6-solid:briefcase" class="inline mr-2 text-gray-900" />
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
  </header>
</template>
