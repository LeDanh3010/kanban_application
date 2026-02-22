import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

/**
 * CardMenu — rendered via React Portal into document.body.
 * Full-screen backdrop blocks all interactions outside the panel.
 * Panel appears to the RIGHT of the card at `position`.
 */
const CardMenu = ({ onClose, onOpen, onRename, onArchive, position }) => {
  const menuRef = useRef(null);

  // Close on Escape
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  const menu = (
    <>
      {/* ── Backdrop: full-screen, blocks all clicks outside panel ── */}
      <div
        className="fixed inset-0 z-[9998]"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.45)" }}
        onPointerDown={onClose}
      />

      {/* ── Action panel: floats over backdrop at card's right edge ── */}
      <div
        ref={menuRef}
        style={{
          position: "fixed",
          top: position?.top ?? 0,
          left: position?.left ?? 0,
          zIndex: 9999,
        }}
        className="w-[200px] flex flex-col gap-1 animate-[menu-pop_0.18s_ease-out_both] origin-top-left"
      >
        {/* Open card */}
        <button
          className="flex items-center gap-2.5 rounded-md cursor-pointer px-3 py-2 text-left text-sm font-medium text-slate-100 bg-[#282e33] hover:bg-[#333b42] transition-colors duration-150 w-full"
          type="button"
          onClick={() => { onOpen?.(); onClose?.(); }}
        >
          <svg className="h-4 w-4 shrink-0 text-slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="3" width="20" height="14" rx="2" />
            <path d="M8 21h8M12 17v4" />
          </svg>
          Open card
        </button>

        {/* Rename card */}
        <button
          className="flex items-center gap-2.5 rounded-md cursor-pointer px-3 py-2 text-left text-sm font-medium text-slate-100 bg-[#282e33] hover:bg-[#333b42] transition-colors duration-150 w-full"
          type="button"
          onClick={() => { onRename?.(); onClose?.(); }}
        >
          <svg className="h-4 w-4 shrink-0 text-slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
          Rename card
        </button>

        {/* Archive card */}
        <button
          className="flex items-center gap-2.5 rounded-md cursor-pointer px-3 py-2 text-left text-sm font-medium text-slate-100 bg-[#282e33] hover:bg-[#333b42] transition-colors duration-150 w-full"
          type="button"
          onClick={() => { onArchive?.(); onClose?.(); }}
        >
          <svg className="h-4 w-4 shrink-0 text-slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="21 8 21 21 3 21 3 8" />
            <rect x="1" y="3" width="22" height="5" />
            <line x1="10" y1="12" x2="14" y2="12" />
          </svg>
          Archive card
        </button>
      </div>
    </>
  );

  return createPortal(menu, document.body);
};

export default CardMenu;
