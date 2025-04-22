<script setup lang="ts" generic="TData, TValue">
import { ref, h } from 'vue'
import { 
  FlexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useVueTable,
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState 
} from '@tanstack/vue-table'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight, 
  ArrowUp, 
  ArrowDown
} from 'lucide-vue-next'

const props = defineProps<{
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}>()

// Sorting state
const sorting = ref<SortingState>([])
const columnFilters = ref<ColumnFiltersState>([])

// Handle row click
const viewPurchaseRequisition = (id) => {
  navigateTo(`/purchase-requisitions/${id}`);
};

// Table instance
const table = useVueTable({
  get data() { return props.data },
  get columns() { return props.columns },
  getCoreRowModel: getCoreRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  onSortingChange: (updater) => {
    sorting.value = updater(sorting.value);
  },
  onColumnFiltersChange: (updater) => {
    columnFilters.value = updater(columnFilters.value);
  },
  state: {
    get sorting() { return sorting.value },
    get columnFilters() { return columnFilters.value },
  },
})
</script>

<template>
    <div>
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">Purchase Requisitions</h1>
        <Input class="max-w-sm" placeholder="Filter suppliers..."
          :model-value="table.getColumn('supplier')?.getFilterValue() as string"
          @update:model-value=" table.getColumn('supplier')?.setFilterValue($event)" />
        <Button @click="navigateTo('/purchase-requisitions/create')">
          Create New
        </Button>
      </div>
      
      <div class="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
              <TableHead 
                v-for="header in headerGroup.headers" 
                :key="header.id"
                :class="{ 'cursor-pointer select-none': header.column.getCanSort() }"
                @click="header.column.getToggleSortingHandler()"
              >
                <div class="flex items-center">
                  <FlexRender
                    v-if="!header.isPlaceholder"
                    :render="header.column.columnDef.header"
                    :props="header.getContext()"
                  />
                  <span v-if="header.column.getCanSort()" class="ml-1">
                    <template v-if="header.column.getIsSorted() === 'asc'">
                      <ArrowUp class="h-4 w-4" />
                    </template>
                    <template v-else-if="header.column.getIsSorted() === 'desc'">
                      <ArrowDown class="h-4 w-4" />
                    </template>
                    <template v-else>
                      <div class="h-4 w-4 opacity-30">⇅</div>
                    </template>
                  </span>
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <template v-if="table.getRowModel().rows?.length">
              <TableRow 
                v-for="row in table.getRowModel().rows" 
                :key="row.id"
                class="hover:bg-muted/50 cursor-pointer"
                @click="viewPurchaseRequisition(row.original.id)"
              >
                <TableCell v-for="cell in row.getVisibleCells()" :key="cell.id">
                  <FlexRender
                    :render="cell.column.columnDef.cell"
                    :props="cell.getContext()"
                  />
                </TableCell>
              </TableRow>
            </template>
            <template v-else>
            <TableRow>
              <TableCell :colspan="columns.length" class="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          </template>
          </TableBody>
        </Table>
      </div>
  
      <!-- Pagination -->
      <div class="flex items-center justify-between px-2 mt-4">
        <div class="flex-1 text-sm text-muted-foreground">
          Showing {{ table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1 }} 
          to {{ Math.min((table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize, data.length) }} 
          of {{ data.length }} entries
        </div>
        <div class="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            @click="table.setPageIndex(0)"
            :disabled="!table.getCanPreviousPage()"
          >
            <span class="sr-only">Go to first page</span>
            <ChevronsLeft class="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            @click="table.previousPage()"
            :disabled="!table.getCanPreviousPage()"
          >
            <span class="sr-only">Go to previous page</span>
            <ChevronLeft class="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            @click="table.nextPage()"
            :disabled="!table.getCanNextPage()"
          >
            <span class="sr-only">Go to next page</span>
            <ChevronRight class="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            @click="table.setPageIndex(table.getPageCount() - 1)"
            :disabled="!table.getCanNextPage()"
          >
            <span class="sr-only">Go to last page</span>
            <ChevronsRight class="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  </template>