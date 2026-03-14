import { useEffect } from "react";
import { createPortal } from "react-dom";
import Button from "./Button.jsx";

const ConfirmModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title,
  children,
  confirmText = "Yes", 
  cancelText = "No",
  confirmColor = "bg-rose-600 hover:bg-rose-500"
}) => {
  useEffect(() => {
    const onKey = (event) => {
      if (event.key === "Escape") onClose();
    };
    if (isOpen) {
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const modal = (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fadeIn">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />
      
      {/* Dialog */}
      <div className="relative bg-slate-900 rounded-lg border border-white/10 shadow-2xl p-6 max-w-sm w-full animate-scaleIn">
        {title && <h3 className="text-xl font-bold text-white mb-4 text-center">{title}</h3>}
        
        <div className="text-white text-center mb-6">
          {children}
        </div>
        
        {/* Buttons */}
        <div className="flex gap-3 justify-center">
          <Button
            variant="none"
            onClick={onClose}
            className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-all min-w-[80px]"
          >
            {cancelText}
          </Button>
          <Button
            variant="none"
            onClick={onConfirm}
            className={`px-6 py-2 ${confirmColor} text-white rounded-lg font-medium transition-all min-w-[80px]`}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
};

export default ConfirmModal;
