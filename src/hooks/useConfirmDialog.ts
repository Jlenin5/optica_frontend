import { useState, useCallback } from "react";

interface ConfirmDialogState {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
  onConfirm?: () => void;
}

const initialState: ConfirmDialogState = {
  isOpen: false,
  title: '',
  message: '',
  confirmText: 'Confirmar',
  cancelText: 'Cancelar',
  variant: 'danger',
  onConfirm: undefined
};

export const useConfirmDialog = () => {
  const [dialogState, setDialogState] = useState<ConfirmDialogState>(initialState);

  const open = useCallback((options?: Partial<ConfirmDialogState>) => {
    setDialogState({
      ...initialState,
      isOpen: true,
      ...options
    });
  }, []);

  const close = useCallback(() => {
    setDialogState(prev => ({ ...prev, isOpen: false }));
  }, []);

  const confirm = useCallback(() => {
    if (dialogState.onConfirm) {
      dialogState.onConfirm();
    }
    close();
  }, [dialogState.onConfirm, close]);

  return {
    isOpen: dialogState.isOpen,
    title: dialogState.title,
    message: dialogState.message,
    confirmText: dialogState.confirmText,
    cancelText: dialogState.cancelText,
    variant: dialogState.variant,
    open,
    close,
    confirm
  };
};