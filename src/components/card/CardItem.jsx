import { useRef, useState, useEffect } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import CardMenu from "./CardMenu.jsx";

const CardItem = ({ card, cardIndex, onOpen, onToggle, onRename, onArchive, listId }) => {
  const isDone = Boolean(card.completed);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuPos, setMenuPos] = useState(null);
  const [isRenaming, setIsRenaming] = useState(false);
  const [draftName, setDraftName] = useState(card.title);
  // Track if rename was requested from menu (needs to open after menu closes)
  const pendingRenameRef = useRef(false);
  const renameInputRef = useRef(null);
  const cardRef = useRef(null);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: `card-${card.id}`,
    data: { type: "card", listId, cardId: card.id },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // After menu closes, check if rename was pending — then open inline editor
  useEffect(() => {
    if (!isMenuOpen && pendingRenameRef.current) {
      pendingRenameRef.current = false;
      setDraftName(card.title);
      setIsRenaming(true);
    }
  }, [isMenuOpen]);

  // Focus textarea once rename mode is active
  useEffect(() => {
    if (isRenaming) {
      requestAnimationFrame(() => {
        renameInputRef.current?.focus();
        renameInputRef.current?.select();
      });
    }
  }, [isRenaming]);

  const handleOpenMenu = (e) => {
    e.stopPropagation();
    const rect = cardRef.current?.getBoundingClientRect();
    if (rect) {
      setMenuPos({
        top: rect.top,
        left: rect.right + 8,
      });
    }
    setIsMenuOpen(true);
  };

  const handleRequestRename = () => {
    // Mark rename as pending — will open after menu fully closes
    pendingRenameRef.current = true;
    setIsMenuOpen(false);
  };

  const handleSaveRename = () => {
    const trimmed = draftName.trim();
    setIsRenaming(false);
    if (trimmed && trimmed !== card.title) {
      onRename?.(card.id, trimmed);
    } else {
      setDraftName(card.title);
    }
  };

  const handleCancelRename = () => {
    setIsRenaming(false);
    setDraftName(card.title);
  };

  const handleRenameKey = (e) => {
    if (e.key === "Enter") { e.preventDefault(); handleSaveRename(); }
    if (e.key === "Escape") { handleCancelRename(); }
  };

  return (
    <article
      ref={(node) => { setNodeRef(node); cardRef.current = node; }}
      className={`${isRenaming ? "" : "group"} relative cursor-pointer rounded-lg border border-white/10 bg-slate-900/50 p-3 text-slate-100 transition-shadow duration-300 hover:shadow-[0_12px_24px_rgba(6,10,20,0.35)] ${
        isDragging ? "opacity-60" : ""
      }`}
      style={{
        animationDelay: `${cardIndex * 80}ms`,
        transition: "transform 220ms cubic-bezier(0.2, 0.7, 0.2, 1)",
        ...style,
      }}
      {...attributes}
      {...(isRenaming ? {} : listeners)}
      onClick={() => !isRenaming && !isMenuOpen && onOpen?.(card)}
    >
      {/* ── Toggle-done circle (left, appears on hover / always if done) ── */}
      <button
        className={`absolute left-3 z-20 cursor-pointer top-3 grid h-5 w-5 place-items-center rounded-full border-2 transition-all duration-500 ease-out ${
          isDone
            ? "border-emerald-400/80 bg-emerald-400/25 text-emerald-200 opacity-100 scale-100"
            : "border-white/40 bg-white/5 text-transparent opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 group-hover:border-white/60 group-hover:bg-white/10"
        } ${isDone ? "" : "pointer-events-none group-hover:pointer-events-auto"} hover:scale-110 active:scale-95`}
        type="button"
        aria-label="Toggle card completion"
        onClick={(e) => { e.stopPropagation(); onToggle?.(); }}
        onPointerDown={(e) => e.stopPropagation()}
      >
        <span className={`text-[10px] font-bold transition-all duration-300 ${isDone ? "scale-100" : "scale-0"}`}>
          ✓
        </span>
      </button>

      {/* ── Edit button (top-right, visible on hover) ── */}
      <button
        className="absolute right-2 top-2 z-20 grid h-6 w-6 place-items-center rounded-md border border-transparent bg-transparent text-transparent opacity-0 scale-75 transition-all duration-200
                   group-hover:opacity-100 group-hover:scale-100 group-hover:text-slate-400 group-hover:border-white/10 group-hover:bg-white/5
                   hover:!text-white hover:!bg-white/15 hover:!border-white/20 active:scale-90 cursor-pointer"
        type="button"
        aria-label="Card options"
        onClick={handleOpenMenu}
        onPointerDown={(e) => e.stopPropagation()}
      >
        <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
        </svg>
      </button>

      {/* Card action panel — portal-based, appears to the right of card */}
      {isMenuOpen && (
        <CardMenu
          position={menuPos}
          onClose={() => setIsMenuOpen(false)}
          onOpen={() => { setIsMenuOpen(false); onOpen?.(card); }}
          onRename={handleRequestRename}
          onArchive={() => { setIsMenuOpen(false); onArchive?.(card.id); }}
        />
      )}

      {/* ── Card title or inline rename textarea ── */}
      {isRenaming ? (
        <div
          onClick={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()}
          className="mt-0.5"
        >
          <textarea
            ref={renameInputRef}
            value={draftName}
            onChange={(e) => setDraftName(e.target.value)}
            onKeyDown={handleRenameKey}
            rows={2}
            className="w-full resize-none rounded-md border border-indigo-400/60 bg-white/10 px-2 py-1 text-sm font-semibold text-slate-100 outline-none placeholder:text-slate-400"
            placeholder="Card title..."
          />
          <div className="flex gap-1.5 mt-1.5">
            <button
              type="button"
              onClick={handleSaveRename}
              onPointerDown={(e) => e.stopPropagation()}
              className="rounded-md bg-indigo-500 hover:bg-indigo-400 px-2.5 py-1 text-xs font-semibold text-white transition-colors cursor-pointer"
            >
              Save
            </button>
            <button
              type="button"
              onClick={handleCancelRename}
              onPointerDown={(e) => e.stopPropagation()}
              className="rounded-md bg-white/10 hover:bg-white/20 px-2.5 py-1 text-xs font-semibold text-slate-300 transition-colors cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <h3
          className={`break-words text-sm font-semibold transition-all duration-500 ease-out pr-5 ${
            isDone
              ? "pl-7 line-through text-slate-400"
              : "pl-0 text-slate-100 group-hover:pl-7"
          }`}
        >
          {card.title}
        </h3>
      )}
    </article>
  );
};

export default CardItem;
