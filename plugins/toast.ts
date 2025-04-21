import { Toaster } from '@/components/ui/sonner'

export default defineNuxtPlugin(() => {
  return {
    provide: {
      toast: {
        success: (title: string, options?: any) => {
          Toaster.success(title, options);
        },
        error: (title: string, options?: any) => {
          Toaster.error(title, options);
        },
        info: (title: string, options?: any) => {
          Toaster.info(title, options);
        },
        warning: (title: string, options?: any) => {
          Toaster.warning(title, options);
        }
      }
    }
  }
})