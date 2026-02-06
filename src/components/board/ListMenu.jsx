import { useEffect, useRef } from "react";

const ListMenu = ({ onClose, onAddCard, onCopyList, onDeleteList, onClearList }) => {
  const menuRef = useRef(null);

  useEffect(() => {
    const onPointerDown = (event) => {
      const menuEl = menuRef.current;
      if (!menuEl) return;
      if (!menuEl.contains(event.target)) {
        onClose?.();
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [onClose]);

  return (
    <div
      ref={menuRef}
      className="absolute left-[calc(100%-52px)] top-11 z-30 w-[240px] rounded-xl border border-white/10 bg-slate-900/95 p-3 text-slate-100 shadow-[0_20px_40px_rgba(4,6,12,0.6)] animate-[menu-pop_0.2s_ease-out_both] origin-top-left"
    >
      <div className="relative flex items-center justify-center">
        <p className="text-sm font-semibold text-slate-100">List actions</p>
        <button
          className="absolute rounded-xl right-0 border-none outline-none cursor-pointer mr-1 text-sm font-bold"
          type="button"
          aria-label="Close list actions"
          onClick={onClose}
        >
          ✕
        </button>
      </div>
      <div className="mt-3 grid gap-2 text-sm font-semibold text-slate-200">
        <button
          className="rounded-lg cursor-pointer px-2 py-1 text-left transition-all duration-200 ease-out hover:bg-white/10"
          type="button"
          onClick={onAddCard}
        >
          Add card...
        </button>
        <button
          className="rounded-lg cursor-pointer px-2 py-1 text-left transition-all duration-200 ease-out hover:bg-white/10"
          type="button"
          onClick={onCopyList}
        >
          Copy list...
        </button>
        <button
          className="rounded-lg cursor-pointer px-2 py-1 text-left transition-all duration-200 ease-out hover:bg-white/10 text-rose-400 hover:text-rose-300"
          type="button"
          onClick={onDeleteList}
        >
          Delete list
        </button>
        <div className="my-1 border-t border-white/10" />
        <button
          className="rounded-lg cursor-pointer px-2 py-1 text-left transition-all duration-200 ease-out hover:bg-white/10"
          type="button"
          onClick={onClearList}
        >
          Archive all cards
        </button>
      </div>
    </div>
  );
};

export default ListMenu;
