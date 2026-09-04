import { Button } from "./Button";

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  isSubmitting?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  description,
  confirmText = "Hapus Permanen",
  cancelText = "Batal",
  isSubmitting = false,
  onClose,
  onConfirm,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn font-mono">
      <div className="w-full max-w-md bg-zinc-950 border border-red-900/60 rounded-lg p-5 shadow-2xl space-y-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-red-950/60 border border-red-800/80 rounded text-red-500 font-bold text-lg">
            ⚠️
          </div>
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              {title}
            </h3>
            <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
              {description}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-900">
          <Button
            variant="secondary"
            size="sm"
            onClick={onClose}
            disabled={isSubmitting}
          >
            {cancelText}
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={onConfirm}
            loading={isSubmitting}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
};
