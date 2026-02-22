import { useEffect, useRef, useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import "overlayscrollbars/overlayscrollbars.css";
import CardItem from "../card/CardItem.jsx";
import ListMenu from "./ListMenu.jsx";
import Button from "../ui/Button.jsx";

const ListColumn = ({
  list,
  listIndex,
  activeComposer,
  onOpenComposer,
  draftCard,
  onDraftChange,
  onAddCard,
  onCloseComposer,
  isMenuOpen,
  onToggleMenu,
  onCloseMenu,
  onEditTitleList,
  onOpenCard,
  onToggleCard,
  onCopyList,
  onDeleteList,
  onClearList,
  onRenameCard,
  onArchiveCard,
}) => {
  const scrollbarRef = useRef(null);
  const prevCountRef = useRef(list.cards.length);
  const didMountRef = useRef(false);
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef(null);
  const focusRef = useRef(null);

  useEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true;
      prevCountRef.current = list.cards.length;
      return;
    }

    if (list.cards.length > prevCountRef.current) {
      const osInstance = scrollbarRef.current?.osInstance();
      if (osInstance) {
        const { viewport } = osInstance.elements();
        viewport.scrollTo({ top: viewport.scrollHeight, behavior: "smooth" });
      }
    }

    prevCountRef.current = list.cards.length;
  }, [list.cards.length]);

  const autoResize = (el) => {
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  };

  const handleTitleEdit = () => {
    setIsEditing(true);
  };

  const handleCloseTitleEdit = () => {
    const el = inputRef.current;
    const next = el.value.trim();
    setIsEditing(false);
    if (!next) {
      el.value = list.title;
      return;
    }
    if (next !== list.title) {
      onEditTitleList?.(list.id, next);
    }
  };
  const composerRef = useRef(null);

  useEffect(() => {
    if (activeComposer !== list.id) return;
    const onPointerDown = (e) => {
       if (composerRef.current && composerRef.current.contains(e.target)) return;
       
       const content = focusRef.current?.value?.trim();
       if (content) {
         onAddCard(list.id);
       }
       onCloseComposer();
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [activeComposer, list.id, onCloseComposer, onAddCard]);

  useEffect(() => {
    if (activeComposer === list.id) {
       requestAnimationFrame(() => {
          focusRef.current?.focus();
       });
    }
  }, [activeComposer, list.id]);

  useEffect(() => {
    if (!isEditing) return;
    requestAnimationFrame(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
      autoResize(inputRef.current);
    });
    const onPointerDown = (e) => {
      const inputEl = inputRef.current;
      if (!inputEl) return;
      if (e.target !== inputEl && !inputEl.contains(e.target)) {
        handleCloseTitleEdit();
      }
    };
    document.addEventListener("pointerdown", onPointerDown, true);
    return () =>
      document.removeEventListener("pointerdown", onPointerDown, true);
  }, [isEditing]);

  const {
    setNodeRef: setColumnNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: `column-${list.id}`,
    data: { type: "column", listId: list.id },
    transition: {
      duration: 250,
      easing: "cubic-bezier(0.2, 0.7, 0.2, 1)",
    },
  });

  const { setNodeRef: setCardsDropRef, isOver } = useDroppable({
    id: `list-${list.id}`,
    data: { type: "list", listId: list.id },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || "transform 250ms cubic-bezier(0.2, 0.7, 0.2, 1)",
    touchAction: "none",
  };

  return (
    <section
      ref={setColumnNodeRef}
      className={`relative flex h-fit max-h-full w-[280px] shrink-0 flex-col rounded-xl border border-white/10 bg-slate-900/55 text-slate-100 shadow-[0_16px_36px_rgba(4,6,12,0.55)] animate-[list-in_0.5s_ease_both] ${
        isDragging
          ? "opacity-50 scale-105 rotate-1 shadow-[0_24px_48px_rgba(4,6,12,0.75)] z-50"
          : "opacity-100 scale-100 rotate-0"
      } ${isMenuOpen ? "z-40" : "z-0"}`}
      style={{
        animationDelay: `${listIndex * 120}ms`,
        ...style,
      }}
    >
      <div
        className="relative mb-3 pt-3 px-3 flex gap-2 items-center h-auto justify-between"
        {...attributes}
        {...listeners}
      >
        <div
          className="flex w-full min-w-0 items-center gap-2"
          onClick={handleTitleEdit}
        >
          {!isEditing ? (
            <h2 className="min-w-0 text-sm font-semibold text-slate-100 break-words whitespace-normal">
              {list.title}
            </h2>
          ) : (
            <textarea
              ref={inputRef}
              rows={1}
              defaultValue={list.title}
              onInput={(e) => autoResize(e.currentTarget)}
              onPointerDown={(event) => event.stopPropagation()}
              className="w-full resize-none overflow-hidden rounded-sm p-2 font-semibold border border-white/10 bg-white/15 text-sm text-slate-100 outline-none focus:border-white/30 whitespace-pre-wrap wrap-break-word"
            />
          )}
        </div>
        <button
          className="cursor-pointer rounded-xl bg-transparent border-none outline-none px-2.5 py-1 text-sm font-semibold text-slate-300 shadow-[0_8px_18px_rgba(15,16,20,0.35)] hover:bg-white/10 hover:shadow-[0_12px_24px_rgba(15,16,20,0.45)] transition-all duration-200 ease-out"
          type="button"
          aria-label="List options"
          onClick={onToggleMenu}
          onPointerDown={(event) => event.stopPropagation()}
        >
          <svg
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M6 14a2 2 0 1 1 0-4 2 2 0 0 1 0 4Zm6 0a2 2 0 1 1 0-4 2 2 0 0 1 0 4Zm6 0a2 2 0 1 1 0-4 2 2 0 0 1 0 4Z" />
          </svg>
        </button>
      </div>

      {isMenuOpen ? (
        <ListMenu
          onClose={onCloseMenu}
          onAddCard={() => {
             onOpenComposer(list.id);
             onCloseMenu();
          }}
          onCopyList={onCopyList}
          onDeleteList={onDeleteList}
          onClearList={onClearList}
        />
      ) : null}

      <OverlayScrollbarsComponent
        ref={scrollbarRef}
        className="min-h-0 flex-1 px-2.5"
        options={{
          overflow: { y: "scroll", x: "hidden" },
          paddingAbsolute: true,
        }}
        defer
      >
        <div
          className={`space-y-3 overflow-x-hidden rounded-lg transition-colors duration-200 ${
            isOver ? "bg-white/5" : ""
          }`}
          ref={setCardsDropRef}
        >
          <SortableContext
            items={list.cards.map((card) => `card-${card.id}`)}
            strategy={verticalListSortingStrategy}
          >
            {list.cards.map((card, cardIndex) => (
              <CardItem
                card={card}
                cardIndex={cardIndex}
                key={card.id}
                onOpen={(next) => onOpenCard?.(next, list)}
                onToggle={() => onToggleCard?.(list.id, card.id)}
                onRename={(cardId, title) => onRenameCard?.(list.id, cardId, title)}
                onArchive={(cardId) => onArchiveCard?.(list.id, cardId)}
                listId={list.id}
              />
            ))}
          </SortableContext>
        </div>
      </OverlayScrollbarsComponent>

      {activeComposer === list.id ? (
        <div ref={composerRef} className="mt-3 grid gap-2 px-2.5 pb-3">
          <textarea
            ref={focusRef}
            className="min-h-[60px] resize-y rounded-xl border border-white/10 bg-white/15 p-2 text-sm text-slate-100 outline-none focus:border-white/30 placeholder:text-slate-400"
            value={draftCard}
            onChange={(event) => onDraftChange(event.target.value)}
            rows={3}
            placeholder="Write a task title"
            onPointerDown={(event) => event.stopPropagation()}
          />
          <div className="flex gap-2">
            <Button
              variant="solid"
              className="px-3 py-1.5 text-sm"
              type="button"
              onClick={() => {
                onAddCard(list.id);
                requestAnimationFrame(() => {
                   focusRef.current?.focus();
                });
              }}
            >
              Add card
            </Button>
            <Button
              variant="ghost"
              className="px-3 py-1.5 text-sm text-slate-200"
              type="button"
              onClick={onCloseComposer}
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex px-2.5 pb-2.5">
          <button
            className="mt-3 w-full rounded-xl font-semibold cursor-pointer border border-dashed border-white/20 px-3 py-2 text-sm text-slate-300 transition hover:bg-white/10"
            type="button"
            onClick={() => onOpenComposer(list.id)}
            onPointerDown={(event) => event.stopPropagation()}
          >
            + Add a card
          </button>
        </div>
      )}
    </section>
  );
};

export default ListColumn;
