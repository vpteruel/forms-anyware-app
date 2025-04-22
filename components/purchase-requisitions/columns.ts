import { h } from 'vue'
import type { ColumnDef } from '@tanstack/vue-table'
import type { PurchaseRequisition } from '~/models/PurchaseRequisition.interface'
import { formatDate, formatCurrency } from '@/utils/format'
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'

// Define status badge component
const StatusBadge = (props: { status: string }) => {
  const statusColors = {
    approved: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    rejected: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  };
  
  return h('span', { 
    class: `px-2 py-1 text-xs font-medium rounded-md ${statusColors[props.status]}` 
  }, props.status.charAt(0).toUpperCase() + props.status.slice(1));
}

export const columns: ColumnDef<PurchaseRequisition>[] = [
  {
    accessorKey: 'id',
    header: () => h('div', {}, 'PR#'),
    cell: ({ row }) => h('div', {}, row.getValue('id')),
    enableSorting: true
  },
  {
    accessorKey: 'date',
    header: ({ column }) => {
        const isSorted = column.getIsSorted()
        const isSortedAsc = column.getIsSorted() === 'asc'
        return h(Button, {
            variant: 'ghost',
            onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
        }, () => ['Date', h(!isSorted ? ArrowUpDown : (isSortedAsc ? ArrowUp : ArrowDown), { class: 'ml-2 h-4 w-4' })])
    },
    cell: ({ row }) => {
      const date = row.getValue('date') as string
      return h('div', {}, formatDate(date))
    },
    enableSorting: true
  },
  {
    accessorKey: 'supplier',
    header: () => h('div', {}, 'Suggested Supplier'),
    cell: ({ row }) => h('div', {}, row.getValue('supplier')),
    enableSorting: true
  },
  {
    accessorKey: 'qtyItems',
    header: () => h('div', { class: 'text-center' }, 'Qty Items'),
    cell: ({ row }) => h('div', { class: 'text-center' }, row.getValue('qtyItems')),
    enableSorting: false
  },
  {
    accessorKey: 'totalAmount',
    header: () => h('div', { class: 'text-right' }, 'Total Amount'),
    cell: ({ row }) => {
      const amount = Number.parseFloat(row.getValue('totalAmount'))
      return h('div', { class: 'text-right font-medium' }, formatCurrency(amount))
    },
    enableSorting: false
  },
  {
    accessorKey: 'status',
    header: () => h('div', {}, 'Status'),
    cell: ({ row }) => h(StatusBadge, { status: row.getValue('status') }),
    enableSorting: false
  }
]