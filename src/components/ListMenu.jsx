import { useEffect, useRef } from "react";

const ListMenu = ({ onClose }) => {
  const menuRef = useRef(null);

  useEffect(() => {
    const onPointerDown = (event) => {
      const menuEl = menuRef.current;
      if (!menuEl) return;
      if (!menuEl.contains(event.target)) {
        onClose?.();
      }
    };
    document.addEventListener("pointerdown", onPointerDown, true);
    return () => document.removeEventListener("pointerdown", onPointerDown, true);
  }, [onClose]);

  return (
    <div
      ref={menuRef}
      className="absolute left-9/12 top-12 z-30 ml-4 w-[250px] rounded-xl border border-white/10 bg-slate-900/95 p-3 text-slate-100 shadow-[0_20px_40px_rgba(4,6,12,0.6)]"
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
        >
          Add card
        </button>
        <button
          className="rounded-lg cursor-pointer px-2 py-1 text-left transition-all duration-200 ease-out hover:bg-white/10"
          type="button"
        >
          Copy list
        </button>
        <button
          className="rounded-lg cursor-pointer px-2 py-1 text-left transition-all duration-200 ease-out hover:bg-white/10"
          type="button"
        >
          Move list
        </button>
        <button
          className="rounded-lg cursor-pointer px-2 py-1 text-left transition-all duration-200 ease-out hover:bg-white/10"
          type="button"
        >
          Move all cards in this list
        </button>
      </div>
    </div>
  );
};

export default ListMenu;
