import { useEffect } from "react";
import { createPortal } from "react-dom";
import Button from "./Button.jsx";
import { FaExclamationTriangle } from "react-icons/fa";

const ErrorModal = ({ 
  isOpen, 
  onClose, 
  errorMessage, 
  title = "Error"
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
      <div className="relative w-full max-w-sm bg-slate-900 rounded-2xl border border-rose-500/30 shadow-2xl p-6 text-center animate-scaleIn">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-rose-500/10 mb-4">
          <FaExclamationTriangle className="h-8 w-8 text-rose-500" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        <p className="text-slate-300 mb-6">{errorMessage}</p>

        <Button
          variant="none"
          onClick={onClose}
          className="w-full bg-rose-600 hover:bg-rose-500 text-white py-2.5 rounded-xl font-medium transition-all"
        >
          Close
        </Button>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
};

export default ErrorModal;
