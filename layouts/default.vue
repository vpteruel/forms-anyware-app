<script setup lang="ts">
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import AppSidebar from "@/components/AppSidebar.vue";
import { Moon, Sun } from 'lucide-vue-next';
import { ref, watch } from 'vue';

// Create a cookie that persists sidebar state
const sidebarState = useCookie('sidebar_state', {
  maxAge: 60 * 60 * 24 * 365, // Expires after 1 year
  sameSite: 'lax',
  default: () => 'open', // Default value if cookie doesn't exist
});

// Create a reactive reference for sidebar state - initialize directly from cookie
const isOpen = ref(sidebarState.value === 'open');

// Add function to update the cookie when sidebar state changes
const onOpenChange = (open: boolean) => {
  console.log('Sidebar state changed to:', open);
  isOpen.value = open;
  sidebarState.value = open ? 'open' : 'closed';
};

const colorMode = useColorMode();

// Use client-only directive for theme toggle to prevent hydration mismatches
const toggleColorMode = () => {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark';
}
</script>

<template>
  <ClientOnly>
    <div :class="{ 'dark': colorMode.value === 'dark' }">
      <div class="min-h-screen bg-background text-foreground transition-colors duration-300">
        <SidebarProvider 
          :open="isOpen"
          :defaultOpen="isOpen" 
          @update:open="onOpenChange"
        >
          <AppSidebar />
          <main class="flex-1 p-6 bg-primary/5 dark:bg-primary/10 transition-colors duration-300">
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center gap-3">
                <SidebarTrigger />

                <!-- <NuxtLink to="/" class="flex items-center gap-2 font-bold">
                  <img src="assets/images/cube.png" alt="Logo" class="h-6 w-6" />
                  <span>My App</span>
                </NuxtLink> -->
                <!-- <img src="assets/images/cube.png" alt="Logo" class="h-6 w-6" />
                <h1 class="text-2xl font-bold">Forms Anyware</h1> -->
                
              </div>
              <Button variant="ghost" size="icon" @click="toggleColorMode" class="rounded-full">
                <Sun v-if="colorMode.value === 'dark'" class="h-[1.2rem] w-[1.2rem]" />
                <Moon v-else class="h-[1.2rem] w-[1.2rem]" />
                <span class="sr-only">Toggle theme</span>
              </Button>
            </div>
            <NuxtPage />
          </main>
        </SidebarProvider>
      </div>
    </div>
    <template #fallback>
      <!-- Loading placeholder during hydration -->
      <div class="min-h-screen bg-background flex items-center justify-center">
        <div class="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    </template>
  </ClientOnly>
</template>