"use client";

import { Modal, ModalActions, dangerButton, secondaryButton } from "@/components/ui/Modal";

/** Confirmação de ação destrutiva. O foco começa em "Cancelar", a opção segura. */
export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  onClose,
  onConfirm,
}: {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel: string;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <Modal open={open} onClose={onClose} title={title} description={description}>
      <div className="mt-5">
        <ModalActions>
          <button type="button" onClick={onClose} className={secondaryButton}>
            Cancelar
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={dangerButton}
          >
            {confirmLabel}
          </button>
        </ModalActions>
      </div>
    </Modal>
  );
}
