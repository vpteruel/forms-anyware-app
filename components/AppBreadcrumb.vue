<script setup lang="ts">
import { computed } from 'vue';
import { ChevronRight } from 'lucide-vue-next';

const route = useRoute();

// Format route name for display (convert kebab-case to Title Case)
const formatName = (name: string) => {
  if (!name) return '';
  return name
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// Generate breadcrumb items based on current route
const breadcrumbs = computed(() => {
  const pathParts = route.path.split('/').filter(Boolean);
  
  // If we're at root, use "Dashboard"
  if (pathParts.length === 0) {
    return [{ name: 'Dashboard', path: '/', active: true }];
  }
  
  // Build breadcrumb trail
  const items = [];
  let currentPath = '';
  
  // Always include Home/Dashboard at the beginning
  items.push({ name: 'Dashboard', path: '/', active: false });
  
  // Add other path segments
  pathParts.forEach((part, index) => {
    currentPath += `/${part}`;
    const active = index === pathParts.length - 1;
    
    // For the last item, use route.name if available
    const name = active && route.meta.breadcrumb 
      ? route.meta.breadcrumb 
      : formatName(part);
    
    items.push({
      name,
      path: currentPath,
      active
    });
  });
  
  return items;
});
</script>

<template>
  <nav class="flex items-center text-sm text-muted-foreground">
    <ol class="flex items-center space-x-2">
      <li v-for="(item, index) in breadcrumbs" :key="index" class="flex items-center">
        <NuxtLink 
          v-if="!item.active" 
          :to="item.path"
          class="hover:text-foreground transition-colors duration-200"
        >
          {{ item.name }}
        </NuxtLink>
        <span v-else class="font-medium text-foreground">
          {{ item.name }}
        </span>
        
        <ChevronRight v-if="index < breadcrumbs.length - 1" class="mx-2 h-4 w-4" />
      </li>
    </ol>
  </nav>
</template>