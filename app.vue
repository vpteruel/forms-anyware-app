<script setup lang="ts">
import { Toaster } from '@/components/ui/sonner'
</script>

<template>
  <NuxtLayout>
    <ClientOnly>
      <Toaster position="bottom-right" richColors closeButton />
    </ClientOnly>
    <!-- <Toaster position="top-right" richColors closeButton /> -->
    <NuxtPage />
  </NuxtLayout>
</template>
