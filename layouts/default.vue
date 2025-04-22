<script setup lang="ts">
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import AppSidebar from "@/components/AppSidebar.vue"
import { Moon, Sun, User, Settings, LogOut } from 'lucide-vue-next'
import { ref, watch } from 'vue'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import AppBreadcrumb from '@/components/AppBreadcrumb.vue'

// Create a cookie that persists sidebar state
const sidebarState = useCookie('sidebar_state', {
  maxAge: 60 * 60 * 24 * 365, // Expires after 1 year
  sameSite: 'lax',
  default: () => 'open', // Default value if cookie doesn't exist
})

// Create a reactive reference for sidebar state - initialize directly from cookie
const isOpen = ref(sidebarState.value === 'open')

// Add function to update the cookie when sidebar state changes
const onOpenChange = (open: boolean) => {
  console.log('Sidebar state changed to:', open);
  isOpen.value = open;
  sidebarState.value = open ? 'open' : 'closed';
}

const colorMode = useColorMode();

// Use client-only directive for theme toggle to prevent hydration mismatches
const toggleColorMode = () => {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark';
}

// User info for avatar
const currentUser = ref({
  name: 'Vinicius Teruel',
  email: 'vpteruel@gmail.com',
  initials: 'VT'
})

// Handle logout
const handleLogout = () => {
  // Clear user data from storage
  useCookie('current_user').value = null;
  
  // Navigate to login page
  navigateTo('/login');
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
                <AppBreadcrumb />
              </div>
              <div class="flex items-center gap-2">
                <Button variant="ghost" size="icon" @click="toggleColorMode" class="rounded-full">
                  <Sun v-if="colorMode.value === 'dark'" class="h-[1.2rem] w-[1.2rem]" />
                  <Moon v-else class="h-[1.2rem] w-[1.2rem]" />
                  <span class="sr-only">Toggle theme</span>
                </Button>
                
                <!-- User Avatar Dropdown -->
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" class="rounded-full">
                      <Avatar>
                        <AvatarImage src="" alt={currentUser.name} />
                        <AvatarFallback class="bg-primary text-primary-foreground">
                          {{ currentUser.initials }}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>
                      {{ currentUser.name }}
                      <p class="text-sm text-muted-foreground">
                        {{ currentUser.email }}
                      </p>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem @click="navigateTo('/profile')" class="cursor-pointer">
                      <User class="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem @click="navigateTo('/settings')" class="cursor-pointer">
                      <Settings class="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem @click="handleLogout" class="cursor-pointer">
                      <LogOut class="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
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