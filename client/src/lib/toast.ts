import { toast as sonnerToast } from "sonner";

/**
 * Global toast utility for notifications
 */
export const toast = {
  /**
   * Show a success message
   */
  success: (message: string, description?: string) => {
    return sonnerToast.success(message, {
      description,
    });
  },

  /**
   * Show an error message
   */
  error: (message: string, description?: string) => {
    return sonnerToast.error(message, {
      description,
    });
  },

  /**
   * Show an info message
   */
  info: (message: string, description?: string) => {
    return sonnerToast.info(message, {
      description,
    });
  },

  /**
   * Show a warning message
   */
  warning: (message: string, description?: string) => {
    return sonnerToast.warning(message, {
      description,
    });
  },

  /**
   * Show a custom message
   */
  message: (message: string, description?: string) => {
    return sonnerToast(message, {
      description,
    });
  },

  /**
   * Show a promise toast (auto-updates based on promise state)
   */
  promise: <T,>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: Error) => string);
    }
  ) => {
    return sonnerToast.promise(promise, messages);
  },

  /**
   * Dismiss a specific toast by ID
   */
  dismiss: (toastId?: string | number) => {
    return sonnerToast.dismiss(toastId);
  },

  /**
   * Custom toast with full control
   */
  custom: (message: string, options?: any) => {
    return sonnerToast(message, options);
  },
};

