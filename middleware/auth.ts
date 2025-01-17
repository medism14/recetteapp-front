/** @format */

import { useAuth } from "~/composables/useAuth";

export default defineNuxtRouteMiddleware(async (to) => {
  if (process.server) return;
  const { checkAuth } = useAuth();

  try {
    const isAuth = await checkAuth();

    const publicRoutes = ["/login", "/register"];
    const isPublicRoute = publicRoutes.includes(to.path);

    if (isAuth && isPublicRoute) {
      return navigateTo("/");
    }

    if (!isAuth && !isPublicRoute) {
      return navigateTo("/login");
    }
  } catch (error) {
    console.error(error);
  }
});
