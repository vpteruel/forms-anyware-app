<script setup lang="ts">
import { ref, computed } from 'vue';
import { z } from 'zod';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import { toast } from 'vue-sonner';

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus, X, Save, ChevronLeft } from 'lucide-vue-next';

definePageMeta({
  layout: 'default',
  middleware: 'auth'
});

// Mock data for dropdowns - replace with actual API calls
const sites = ref([
  { id: 1, name: 'Stratford General Hospital' },
  { id: 2, name: 'Clinton Public Hospital' },
  { id: 3, name: 'St. Marys Memorial Hospital' },
  { id: 4, name: 'Seaforth Community Hospital' },
]);

const prTypes = ref([
  { id: 1, name: 'Standard Purchase' },
  { id: 2, name: 'Capital Purchase' },
  { id: 3, name: 'Emergency Purchase' },
]);

const departments = ref([
  { id: 1, name: 'Information Technology' },
  { id: 2, name: 'Finance' },
  { id: 3, name: 'Human Resources' },
  { id: 4, name: 'Emergency Department' },
]);

const unitMeasures = [
  'Each', 'Box', 'Case', 'Pack', 'Dozen', 'Pair', 'Set',
  'Roll', 'Bag', 'Kit', 'Bottle', 'Meter', 'Liter', 'Gram'
];

// Form validation schema
const formSchema = toTypedSchema(
  z.object({
    site_id: z.number({
      required_error: "Please select a site",
    }),
    type_id: z.number({
      required_error: "Please select a requisition type",
    }),
    department_id: z.number({
      required_error: "Please select a department",
    }),
    request_date: z.string().nonempty("Date is required"),
    tel_ext: z.string().optional(),
    skip_manager_approval: z.boolean().default(false),
    skip_director_approval: z.boolean().default(false),
    skip_vp_department_approval: z.boolean().default(false),
    skip_vp_cfe_approval: z.boolean().default(false),
    skip_ceo_approval: z.boolean().default(false),
    suggested_supplier: z.string().optional(),
    comments: z.string().optional(),
    items: z.array(
      z.object({
        quantity: z.number().min(1, "Quantity must be at least 1"),
        unit_measure: z.string().nonempty("Unit measure is required"),
        unit_price: z.number().min(0, "Unit price must be positive"),
        vendor_catalogue_number: z.string().optional(),
        eoc_cip: z.string().optional(),
        description: z.string().nonempty("Description is required"),
      })
    ).min(1, "At least one item is required"),
  })
);

// Initialize form
const { handleSubmit } = useForm({
  validationSchema: formSchema,
  initialValues: {
    site_id: undefined,
    type_id: undefined,
    department_id: undefined,
    request_date: new Date().toISOString().split('T')[0],
    tel_ext: '',
    skip_manager_approval: false,
    skip_director_approval: false,
    skip_vp_department_approval: false,
    skip_vp_cfe_approval: false,
    skip_ceo_approval: false,
    suggested_supplier: '',
    comments: '',
    items: [
      {
        quantity: 1,
        unit_measure: 'Each',
        unit_price: 0,
        vendor_catalogue_number: '',
        eoc_cip: '',
        description: '',
      }
    ],
  },
});

// Form items management
const items = ref([
  {
    quantity: 1,
    unit_measure: 'Each',
    unit_price: 0,
    vendor_catalogue_number: '',
    eoc_cip: '',
    description: '',
  }
]);

const addItem = () => {
  items.value.push({
    quantity: 1,
    unit_measure: 'Each',
    unit_price: 0,
    vendor_catalogue_number: '',
    eoc_cip: '',
    description: '',
  });
};

const removeItem = (index: number) => {
  if (items.value.length > 1) {
    items.value.splice(index, 1);
  } else {
    toast.error("At least one item is required");
  }
};

// Calculate totals
const itemTotals = computed(() => {
  return items.value.map(item => ({
    total: item.quantity * item.unit_price
  }));
});

const grandTotal = computed(() => {
  return itemTotals.value.reduce((sum, item) => sum + item.total, 0);
});

// Submit form
const onSubmit = handleSubmit(async (values) => {
  try {
    // Calculate totals for each item
    const itemsWithTotals = values.items.map(item => ({
      ...item,
      total: item.quantity * item.unit_price
    }));

    const formData = {
      ...values,
      items: itemsWithTotals,
      status: 'pending', // Default status for new PRs
    };

    console.log('Submitting PR:', formData);
    
    // Here you would call your API to save the PR
    // await savePurchaseRequisition(formData);
    
    toast('', { description: 'Purchase requisition submitted successfully' });
    // Navigate back to the list after successful submission
    navigateTo('/purchase-requisitions');
  } catch (error) {
    console.error('Error submitting PR:', error);
    toast.error('Failed to submit purchase requisition');
  }
});

const goBack = () => {
  navigateTo('/purchase-requisitions');
};
</script>

<template>
  <div class="container py-6 mx-auto">
    <div>
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">New Purchase Requisition</h1>
        <Button variant="outline" @click="goBack">
          <ChevronLeft class="mr-2 h-4 w-4" />
          Back to List
        </Button>
      </div>

      <Form @submit="onSubmit" class="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Requisition Information</CardTitle>
            <CardDescription>
              Basic information about the purchase requisition
            </CardDescription>
          </CardHeader>
          <CardContent class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField name="site_id">
                <FormItem>
                  <FormLabel>Site</FormLabel>
                  <Select name="site_id">
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select site" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem v-for="site in sites" :key="site.id" :value="site.id">
                        {{ site.name }}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              </FormField>

              <FormField name="type_id">
                <FormItem>
                  <FormLabel>Requisition Type</FormLabel>
                  <Select name="type_id">
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem v-for="type in prTypes" :key="type.id" :value="type.id">
                        {{ type.name }}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              </FormField>

              <FormField name="department_id">
                <FormItem>
                  <FormLabel>Department</FormLabel>
                  <Select name="department_id">
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem v-for="dept in departments" :key="dept.id" :value="dept.id">
                        {{ dept.name }}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              </FormField>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField name="request_date">
                <FormItem>
                  <FormLabel>Request Date</FormLabel>
                  <FormControl>
                    <Input type="date" name="request_date" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>

              <FormField name="tel_ext">
                <FormItem>
                  <FormLabel>Telephone/Extension</FormLabel>
                  <FormControl>
                    <Input type="text" name="tel_ext" placeholder="Enter telephone or extension" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>

              <FormField name="suggested_supplier">
                <FormItem>
                  <FormLabel>Suggested Supplier</FormLabel>
                  <FormControl>
                    <Input type="text" name="suggested_supplier" placeholder="Enter suggested supplier" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Approval Options</CardTitle>
            <CardDescription>
              Skip approval steps if applicable
            </CardDescription>
          </CardHeader>
          <CardContent class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField name="skip_manager_approval">
                <FormItem class="flex flex-row items-start space-x-3 space-y-0 p-2">
                  <FormControl>
                    <Checkbox name="skip_manager_approval" />
                  </FormControl>
                  <div class="space-y-1 leading-none">
                    <FormLabel>Skip Manager Approval</FormLabel>
                  </div>
                </FormItem>
              </FormField>

              <FormField name="skip_director_approval">
                <FormItem class="flex flex-row items-start space-x-3 space-y-0 p-2">
                  <FormControl>
                    <Checkbox name="skip_director_approval" />
                  </FormControl>
                  <div class="space-y-1 leading-none">
                    <FormLabel>Skip Director Approval</FormLabel>
                  </div>
                </FormItem>
              </FormField>

              <FormField name="skip_vp_department_approval">
                <FormItem class="flex flex-row items-start space-x-3 space-y-0 p-2">
                  <FormControl>
                    <Checkbox name="skip_vp_department_approval" />
                  </FormControl>
                  <div class="space-y-1 leading-none">
                    <FormLabel>Skip VP Department Approval</FormLabel>
                  </div>
                </FormItem>
              </FormField>

              <FormField name="skip_vp_cfe_approval">
                <FormItem class="flex flex-row items-start space-x-3 space-y-0 p-2">
                  <FormControl>
                    <Checkbox name="skip_vp_cfe_approval" />
                  </FormControl>
                  <div class="space-y-1 leading-none">
                    <FormLabel>Skip VP CFE Approval</FormLabel>
                  </div>
                </FormItem>
              </FormField>

              <FormField name="skip_ceo_approval">
                <FormItem class="flex flex-row items-start space-x-3 space-y-0 p-2">
                  <FormControl>
                    <Checkbox name="skip_ceo_approval" />
                  </FormControl>
                  <div class="space-y-1 leading-none">
                    <FormLabel>Skip CEO Approval</FormLabel>
                  </div>
                </FormItem>
              </FormField>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div class="flex justify-between items-center">
              <div>
                <CardTitle>Items</CardTitle>
                <CardDescription>
                  Add items to your purchase requisition
                </CardDescription>
              </div>
              <Button type="button" variant="outline" size="sm" @click="addItem">
                <Plus class="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div v-for="(item, index) in items" :key="index" class="border rounded-md p-4 mb-4">
              <div class="flex justify-between items-center mb-4">
                <h3 class="text-lg font-medium">Item {{ index + 1 }}</h3>
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm" 
                  @click="removeItem(index)"
                  :disabled="items.length === 1"
                >
                  <X class="h-4 w-4" />
                </Button>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <FormField :name="`items[${index}].description`">
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        :name="`items[${index}].description`"
                        v-model="items[index].description"
                        placeholder="Enter item description"
                        class="resize-none"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>

                <FormField :name="`items[${index}].quantity`">
                  <FormItem>
                    <FormLabel>Quantity</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        :name="`items[${index}].quantity`"
                        v-model.number="items[index].quantity"
                        min="1"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>

                <FormField :name="`items[${index}].unit_measure`">
                  <FormItem>
                    <FormLabel>Unit Measure</FormLabel>
                    <Select :name="`items[${index}].unit_measure`" v-model="items[index].unit_measure">
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select unit" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem v-for="unit in unitMeasures" :key="unit" :value="unit">
                          {{ unit }}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                </FormField>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <FormField :name="`items[${index}].unit_price`">
                  <FormItem>
                    <FormLabel>Unit Price ($)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.01" 
                        :name="`items[${index}].unit_price`"
                        v-model.number="items[index].unit_price"
                        min="0"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>

                <FormField :name="`items[${index}].vendor_catalogue_number`">
                  <FormItem>
                    <FormLabel>Vendor Catalogue #</FormLabel>
                    <FormControl>
                      <Input 
                        type="text" 
                        :name="`items[${index}].vendor_catalogue_number`"
                        v-model="items[index].vendor_catalogue_number"
                        placeholder="Enter vendor catalogue number"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>

                <FormField :name="`items[${index}].eoc_cip`">
                  <FormItem>
                    <FormLabel>EOC/CIP</FormLabel>
                    <FormControl>
                      <Input 
                        type="text" 
                        :name="`items[${index}].eoc_cip`"
                        v-model="items[index].eoc_cip"
                        placeholder="Enter EOC/CIP"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>
              </div>

              <div class="flex justify-end">
                <div class="text-sm font-medium">
                  Item Total: {{ new Intl.NumberFormat('en-US', { style: 'currency', currency: 'CAD' }).format(items[index].quantity * items[index].unit_price) }}
                </div>
              </div>
            </div>

            <div class="flex justify-end border-t pt-4">
              <div class="text-lg font-bold">
                Grand Total: {{ new Intl.NumberFormat('en-US', { style: 'currency', currency: 'CAD' }).format(grandTotal) }}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Additional Information</CardTitle>
          </CardHeader>
          <CardContent>
            <FormField name="comments">
              <FormItem>
                <FormLabel>Comments</FormLabel>
                <FormControl>
                  <Textarea name="comments" placeholder="Enter any additional comments" class="resize-none min-h-[100px]" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
          </CardContent>
          <CardFooter class="flex justify-between">
            <Button type="button" variant="outline" @click="goBack">
              Cancel
            </Button>
            <Button type="submit">
              <Save class="mr-2 h-4 w-4" />
              Submit Purchase Requisition
            </Button>
          </CardFooter>
        </Card>
      </Form>
    </div>
  </div>
</template>