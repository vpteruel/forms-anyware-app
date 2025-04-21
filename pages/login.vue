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

// Client-side only code should be in a conditional
const storedUser = ref(null);
const emailFromStorage = ref('');

// Form state
const email = ref('');
const password = ref('');
const showPassword = ref(false);
const isLoading = ref(false);
const rememberMe = ref(false);

// Toggle password visibility
const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

// Set focus with safety checks
const setFocus = async () => {
  // Wait for next tick to ensure DOM is updated
  await nextTick();
  
  if (emailFromStorage.value) {
    const passwordField = document.getElementById('password');
    if (passwordField) {
      passwordField.focus();
    }
  } else {
    const emailField = document.getElementById('email');
    if (emailField) {
      emailField.focus();
    }
  }
};

// Login form submission
const handleLogin = async () => {
  // Validate inputs
  if (!email.value || !password.value) {
    toast("Login failed", {
      description: "Please enter both email and password",
      action: {
        label: 'Undo',
        onClick: () => console.log('Undo'),
      },
    });
    return;
  }
  
  isLoading.value = true;

  if (rememberMe.value) {
    // Store user session in local storage
    localStorage.setItem('user', JSON.stringify({ email: email.value }));
  } else {
    // Store user session in session storage
    sessionStorage.setItem('user', JSON.stringify({ email: email.value }));
  }
  
  try {
    // Here you would integrate with your authentication service
    // Example: await authenticateUser(email.value, password.value);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (email.value === 'test@test.com' && password.value === '123') {
      // Simulate successful login
      toast("Login successful", {
        description: "Welcome back!"
      });
      return;
    } else {
      throw new Error('Invalid credentials');
    }
    
    // Navigate to home page
    await navigateTo('/');
  } catch (error) {
    toast("Login failed", {
      description: "Invalid email or password. Please try again."
    });
  } finally {
    isLoading.value = false;
    password.value = "";
    setFocus();
  }
};

// Initialize client-side data safely
onMounted(() => {
  // Access localStorage only on client-side
  try {
    const stored = localStorage.getItem('user') || sessionStorage.getItem('user');
    if (stored) {
      storedUser.value = JSON.parse(stored);
      if (storedUser.value && storedUser.value.email) {
        emailFromStorage.value = storedUser.value.email;
        email.value = emailFromStorage.value;
      }
    }
    
    // Use setTimeout to ensure DOM is fully rendered
    setTimeout(setFocus, 100);
  } catch (e) {
    console.error("Error accessing storage:", e);
  }
});
</script>

<template>
  <ClientOnly>
    <div class="flex justify-center items-center min-h-[calc(100vh-190px)]">
      <Card class="w-full max-w-md">
        <CardHeader class="space-y-1">
          <CardTitle class="text-2xl font-bold text-center">Login</CardTitle>
          <CardDescription class="text-center">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form @submit.prevent="handleLogin" class="space-y-4">
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
              <div class="flex items-center justify-between">
                <Label for="password">Password</Label>
                <Button 
                  variant="link" 
                  class="px-0 font-normal h-auto text-xs"
                  type="button"
                  @click="() => navigateTo('/forgot-password')"
                >
                  Forgot password?
                </Button>
              </div>
              <div class="relative">
                <Input 
                  id="password" 
                  v-model="password"
                  :type="showPassword ? 'text' : 'password'" 
                  placeholder="••••••••" 
                  required 
                  autocomplete="current-password"
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
            </div>
            <div class="flex items-center space-x-2">
              <input 
                id="remember-me" 
                v-model="rememberMe"
                type="checkbox" 
                class="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary hover:cursor-pointer"
              />
              <Label for="remember-me" class="text-sm font-medium hover:cursor-pointer">Remember me</Label>
            </div>
            <Button type="submit" class="w-full" :disabled="isLoading">
              <template v-if="isLoading">
                <div class="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-b-transparent"></div>
                Signing In...
              </template>
              <template v-else>Sign In</template>
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          <p class="text-sm text-center w-full text-muted-foreground">
            Don't have an account?
            <Button 
              variant="link" 
              class="px-1 font-normal h-auto"
              @click="() => navigateTo('/register')"
            >
              Sign up
            </Button>
          </p>
        </CardFooter>
      </Card>
    </div>
    <template #fallback>
      <div class="flex justify-center items-center min-h-[calc(100vh-120px)]">
        <Card class="w-full max-w-md p-6">
          <div class="flex justify-center">
            <div class="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          </div>
        </Card>
      </div>
    </template>
  </ClientOnly>
</template>