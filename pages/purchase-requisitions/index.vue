<script setup lang="ts">
import type { PurchaseRequisition } from '~/models/PurchaseRequisition.interface'
import { purchaseRequisitions } from '~/models/PurchaseRequisition.interface'
import { onMounted, ref } from 'vue'
import { columns } from '@/components/purchase-requisitions/columns'
import DataTable from '@/components/purchase-requisitions/DataTable.vue'

definePageMeta({
  layout: 'default',
  middleware: 'auth'
});

const data = ref<PurchaseRequisition[]>([])

async function getData(): Promise<PurchaseRequisition[]> {
  return purchaseRequisitions
}

onMounted(async () => {
  data.value = await getData()
})
</script>

<template>
  <div class="container py-6 mx-auto">
    <DataTable :columns="columns" :data="data" />
  </div>
</template>