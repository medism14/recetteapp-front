/** @format */

export const useAuth = () => {
  const router = useRouter();
  const authStore = useAuthStore();

  const checkAuth = async () => {
    authStore.startAuthLoading();
    
    try {
      const response = await fetch("http://localhost:3001/users", {
        method: "GET",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const data = await response.json();
      
      if (data.id) {
        authStore.setUser(data);
        return true;
      }

      authStore.clearUser();
      return false;
    } catch (error) {
      authStore.clearUser();
      return false;
    } finally {
      authStore.stopAuthLoading();
    }
  };

  const requireAuth = async () => {
    try {
      const isAuth = await checkAuth();
      if (!isAuth) {
        router.push("/login");
      }
    } catch (error) {
    }
  };

  const requireNotAuth = async () => {
    try {
      const isAuth = await checkAuth();
      if (isAuth) {
        router.push("/");
      }
    } catch (error) {
      
    }
  };

  const logout = async () => {
    try {
      authStore.startAuthLoading();
      await fetch("http://localhost:3001/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      authStore.clearUser();
      router.push("/login");
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
    } finally {
      authStore.stopAuthLoading();
    }
  };

  return {
    checkAuth,
    requireAuth,
    requireNotAuth,
    logout
  };
};
