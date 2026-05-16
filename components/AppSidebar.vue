<script setup lang="ts">
import { Calendar, Home, ShoppingCart, Search, Settings, LogIn } from "lucide-vue-next"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar"

// Get the current route
const route = useRoute()

// Function to check if a menu item is active
const isActive = (url: string) => {
  // For home page, check if it's exactly the root path
  if (url === '/' && route.path === '/') return true
  
  // For other pages, check if the current path starts with the URL
  // This handles both exact matches and child routes
  return url !== '/' && route.path.startsWith(url)
}

// Menu items.
const items = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Purchase Requisitions",
    url: "/purchase-requisitions",
    icon: ShoppingCart,
  },
  {
    title: "Calendar",
    url: "#",
    icon: Calendar,
  },
  {
    title: "Search",
    url: "#",
    icon: Search,
  },
  {
    title: "Login",
    url: "/login",
    icon: LogIn,
  },
];
</script>

<template>
  <Sidebar>
    <SidebarHeader class="flex items-center justify-between pt-6">
      <div class="flex items-center gap-2">
        <img src="assets/images/cube.png" alt="Logo" class="h-6 w-6" />
        <h1 class="text-2xl font-bold">DataHub</h1>
      </div>
    </SidebarHeader>
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>Application</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
              <SidebarMenuItem v-for="item in items" :key="item.title">
                <SidebarMenuButton :isActive="isActive(item.url)" asChild>
                  <NuxtLink :to="item.url">
                    <component :is="item.icon" />
                    <span>{{item.title}}</span>
                  </NuxtLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
    <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <User2 /> Username
                  <ChevronUp class="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                class="w-[--reka-popper-anchor-width]"
              >
                <DropdownMenuItem>
                  <span>Account</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span>Billing</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
  </Sidebar>
</template>