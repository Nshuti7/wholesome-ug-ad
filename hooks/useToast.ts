// hooks/useToast.ts
import { toast as sonnerToast } from "sonner";

export interface ToastOptions {
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const useToast = () => {
  const toast = {
    success: (message: string, options?: ToastOptions) => {
      return sonnerToast.success(message, {
        duration: options?.duration,
        action: options?.action,
      });
    },

    error: (message: string, options?: ToastOptions) => {
      return sonnerToast.error(message, {
        duration: options?.duration,
        action: options?.action,
      });
    },

    info: (message: string, options?: ToastOptions) => {
      return sonnerToast.info(message, {
        duration: options?.duration,
        action: options?.action,
      });
    },

    warning: (message: string, options?: ToastOptions) => {
      return sonnerToast.warning(message, {
        duration: options?.duration,
        action: options?.action,
      });
    },

    loading: (message: string) => {
      return sonnerToast.loading(message);
    },

    dismiss: (toastId?: string | number) => {
      return sonnerToast.dismiss(toastId);
    },
  };

  return { toast };
};
