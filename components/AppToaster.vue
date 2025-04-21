<script setup lang="ts">
import { Toaster as SonnerToaster } from '@/components/ui/sonner'
</script>

<template>
  <SonnerToaster 
    :expand="true" 
    :richColors="true" 
    :closeButton="true"
    theme="system"
    class="toaster-override"
  />
</template>

<style>
.toaster-override {
  --toaster-background: hsl(var(--background));
  --toaster-success: hsl(var(--success));
  --toaster-error: hsl(var(--destructive));
}
</style>