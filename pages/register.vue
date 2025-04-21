<script setup lang="ts">
import { ref } from 'vue';
import { toast } from 'vue-sonner'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff } from 'lucide-vue-next';

definePageMeta({
  layout: 'auth'
});

// Form state
const firstName = ref('');
const lastName = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const showPassword = ref(false);
const showConfirmPassword = ref(false);
const isLoading = ref(false);
const agreeTerms = ref(false);

// Toggle password visibility
const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

const toggleConfirmPasswordVisibility = () => {
  showConfirmPassword.value = !showConfirmPassword.value;
};

// Set focus on first input field
const setFocus = async () => {
  await nextTick();
  const firstNameField = document.getElementById('firstName');
  if (firstNameField) {
    firstNameField.focus();
  }
};

// Validate email format
const isValidEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Registration form submission
const handleRegister = async () => {
  // Validate inputs
  if (!firstName.value || !lastName.value || !email.value || !password.value || !confirmPassword.value) {
    toast("Registration failed", {
      description: "Please fill in all required fields",
    });
    return;
  }

  // Validate email format
  if (!isValidEmail(email.value)) {
    toast("Registration failed", {
      description: "Please enter a valid email address",
    });
    return;
  }

  // Validate password length
  if (password.value.length < 8) {
    toast("Registration failed", {
      description: "Password must be at least 8 characters long",
    });
    return;
  }

  // Validate password match
  if (password.value !== confirmPassword.value) {
    toast("Registration failed", {
      description: "Passwords do not match",
    });
    return;
  }

  // Validate terms agreement
  if (!agreeTerms.value) {
    toast("Registration failed", {
      description: "You must agree to the terms and conditions",
    });
    return;
  }
  
  isLoading.value = true;
  
  try {
    // Here you would integrate with your registration service
    // Example: await registerUser(firstName.value, lastName.value, email.value, password.value);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Simulate successful registration
    toast("Registration successful", {
      description: "Your account has been created successfully!",
    });
    
    // Navigate to login page after successful registration
    await navigateTo('/login');
  } catch (error) {
    toast("Registration failed", {
      description: "An error occurred during registration. Please try again.",
    });
  } finally {
    isLoading.value = false;
  }
};

// Initialize client-side data
onMounted(() => {
  setTimeout(setFocus, 100);
});
</script>

<template>
  <ClientOnly>
    <div class="flex justify-center items-center min-h-[calc(100vh-190px)]">
      <Card class="w-full max-w-md">
        <CardHeader class="space-y-1">
          <CardTitle class="text-2xl font-bold text-center">Sign Up</CardTitle>
          <CardDescription class="text-center">
            Create an account to get started
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form @submit.prevent="handleRegister" class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-2">
                <Label for="firstName">First Name</Label>
                <Input 
                  id="firstName" 
                  v-model="firstName" 
                  type="text" 
                  required 
                  autocomplete="given-name"
                />
              </div>
              <div class="space-y-2">
                <Label for="lastName">Last Name</Label>
                <Input 
                  id="lastName" 
                  v-model="lastName" 
                  type="text" 
                  required 
                  autocomplete="family-name"
                />
              </div>
            </div>
            
            <div class="space-y-2">
              <Label for="email">Email</Label>
              <Input 
                id="email" 
                v-model="email" 
                type="email" 
                placeholder="name@example.com" 
                required 
                autocomplete="email"
              />
            </div>
            
            <div class="space-y-2">
              <Label for="password">Password</Label>
              <div class="relative">
                <Input 
                  id="password" 
                  v-model="password"
                  :type="showPassword ? 'text' : 'password'" 
                  placeholder="••••••••" 
                  required 
                  autocomplete="new-password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  class="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8"
                  @click="togglePasswordVisibility"
                >
                  <Eye v-if="!showPassword" class="h-4 w-4" />
                  <EyeOff v-else class="h-4 w-4" />
                  <span class="sr-only">Toggle password visibility</span>
                </Button>
              </div>
              <p class="text-xs text-muted-foreground">
                Password must be at least 8 characters long
              </p>
            </div>
            
            <div class="space-y-2">
              <Label for="confirmPassword">Confirm Password</Label>
              <div class="relative">
                <Input 
                  id="confirmPassword" 
                  v-model="confirmPassword"
                  :type="showConfirmPassword ? 'text' : 'password'" 
                  placeholder="••••••••" 
                  required 
                  autocomplete="new-password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  class="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8"
                  @click="toggleConfirmPasswordVisibility"
                >
                  <Eye v-if="!showConfirmPassword" class="h-4 w-4" />
                  <EyeOff v-else class="h-4 w-4" />
                  <span class="sr-only">Toggle confirm password visibility</span>
                </Button>
              </div>
            </div>
            
            <div class="flex items-center space-x-2">
              <input 
                id="agree-terms" 
                v-model="agreeTerms"
                type="checkbox" 
                class="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary hover:cursor-pointer"
                required
              />
              <Label for="agree-terms" class="text-sm hover:cursor-pointer">
                I agree to the <Button variant="link" class="p-0 h-auto" type="button">Terms of Service</Button> and <Button variant="link" class="p-0 h-auto" type="button">Privacy Policy</Button>
              </Label>
            </div>
            
            <Button type="submit" class="w-full" :disabled="isLoading">
              <template v-if="isLoading">
                <div class="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-b-transparent"></div>
                Creating Account...
              </template>
              <template v-else>Create Account</template>
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          <p class="text-sm text-center w-full text-muted-foreground">
            Already have an account?
            <Button 
              variant="link" 
              class="px-1 font-normal h-auto"
              @click="() => navigateTo('/login')"
            >
              Sign in
            </Button>
          </p>
        </CardFooter>
      </Card>
    </div>
    <template #fallback>
      <div class="flex justify-center items-center min-h-[calc(100vh-190px)]">
        <Card class="w-full max-w-md p-6">
          <div class="flex justify-center">
            <div class="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          </div>
        </Card>
      </div>
    </template>
  </ClientOnly>
</template>