<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { Moon, Sun } from 'lucide-vue-next';

const colorMode = useColorMode();

const toggleColorMode = () => {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark';
};

onMounted(() => {
  // Check if the user is already logged in
  const currentUser = useCookie('current_user').value;
  if (currentUser) {
    navigateTo('/');
  }
});
</script>

<template>
  <ClientOnly>
    <div :class="{ 'dark': colorMode.value === 'dark' }">
      <div class="min-h-screen bg-background text-foreground transition-colors duration-300">
        <header class="border-b w-full">
          <div class="w-full px-4 sm:px-6 flex h-16 items-center">
            <NuxtLink to="/" class="flex items-center gap-2 font-bold">
              <img src="assets/images/cube.png" alt="Logo" class="h-6 w-6" />
              <h1 class="text-2xl font-bold">Forms Anyware</h1>
            </NuxtLink>
            <div class="ml-auto">
              <Button variant="ghost" size="icon" @click="toggleColorMode" class="rounded-full">
                <Sun v-if="colorMode.value === 'dark'" class="h-[1.2rem] w-[1.2rem]" />
                <Moon v-else class="h-[1.2rem] w-[1.2rem]" />
                <span class="sr-only">Toggle theme</span>
              </Button>
            </div>
          </div>
        </header>
        <main class="w-full py-6 px-4 sm:px-6 bg-primary/5 dark:bg-primary/10 transition-colors duration-300">
          <slot />
        </main>
        <footer class="py-6 border-t w-full">
          <div class="px-4 sm:px-6 flex flex-col items-center justify-between gap-4 md:flex-row">
            <p class="text-center text-sm leading-loose text-muted-foreground md:text-left">
              &copy; {{ new Date().getFullYear() }} Forms Anyware. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </div>
    <template #fallback>
      <div class="min-h-screen bg-background flex items-center justify-center">
        <div class="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    </template>
  </ClientOnly>
</template>