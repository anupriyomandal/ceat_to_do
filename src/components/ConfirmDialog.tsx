import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning';
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger',
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title=""
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>{cancelLabel}</Button>
          <Button
            variant={variant === 'danger' ? 'danger' : 'accent'}
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            {confirmLabel}
          </Button>
        </>
      }
    >
      <div className="flex flex-col items-center text-center py-4">
        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${
            variant === 'danger' ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'
          }`}
        >
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-semibold text-black mb-2">{title}</h3>
        <p className="text-sm text-gray-600 max-w-sm">{message}</p>
      </div>
    </Modal>
  );
};
