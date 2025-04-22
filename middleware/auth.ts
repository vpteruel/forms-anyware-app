export default defineNuxtRouteMiddleware((to, from) => {
  // Check if the user is logged in
  const user = useCookie('current_user');

  if (!user.value) {
    // Redirect to the login page if not logged in
    return navigateTo('/login');
  }
});