<script setup lang="ts">
import { Button } from "@/components/ui/button";

definePageMeta({
  layout: 'default',
  middleware: 'auth'
});
</script>

<template>
  <div>
    <Button>test</Button>
  </div>
</template>