import { useEffect, useRef, useState } from "react";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import "overlayscrollbars/overlayscrollbars.css";
import CardItem from "./CardItem.jsx";
import ListMenu from "./ListMenu.jsx";

// const accentStyles = {
//   sun: "bg-amber-400",
//   sky: "bg-sky-400",
//   moss: "bg-emerald-400",
//   clay: "bg-orange-300",
//   rose: "bg-rose-400",
// };

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
}) => {
  const listBodyRef = useRef(null);
  const prevCountRef = useRef(list.cards.length);
  const didMountRef = useRef(false);
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef(null);
  useEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true;
      prevCountRef.current = list.cards.length;
      return;
    }

    if (list.cards.length > prevCountRef.current) {
      const listBody = listBodyRef.current;
      if (listBody) {
        listBody.scrollTo({ top: listBody.scrollHeight, behavior: "smooth" });
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
  return (
    <section
      className="relative flex h-fit max-h-full w-[280px] shrink-0 flex-col rounded-xl border border-white/10 bg-slate-900/55 text-slate-100 shadow-[0_16px_36px_rgba(4,6,12,0.55)] animate-[list-in_0.5s_ease_both]"
      style={{ animationDelay: `${listIndex * 120}ms` }}
    >
      <div className="relative mb-3 pt-3 px-3 flex gap-2 items-center h-auto justify-between">
        <div className="flex w-full min-w-0 " onClick={handleTitleEdit}>
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
              className="w-full resize-none overflow-hidden rounded-sm p-2 font-semibold border border-white/10 bg-white/15 text-sm text-slate-100 outline-none focus:border-white/30 whitespace-pre-wrap wrap-break-word"
            />
          )}
        </div>
        <button
          className=" cursor-pointer rounded-xl bg-transparent border-none outline-none
    px-2.5 py-1 text-sm font-semibold text-slate-300
    shadow-[0_8px_18px_rgba(15,16,20,0.35)]
    hover:bg-white/10 hover:shadow-[0_12px_24px_rgba(15,16,20,0.45)]
    transition-all duration-200 ease-out"
          type="button"
          aria-label="List options"
          onClick={onToggleMenu}
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

      {isMenuOpen ? <ListMenu onClose={onCloseMenu} /> : null}

      <OverlayScrollbarsComponent
        className="min-h-0 flex-1 px-2.5"
        options={{
          overflow: { y: "scroll", x: "hidden" },
          paddingAbsolute: true,
        }}
        defer
      >
        <div className="space-y-3 overflow-x-hidden" ref={listBodyRef}>
          {list.cards.map((card, cardIndex) => (
            <CardItem
              card={card}
              cardIndex={cardIndex}
              key={card.id}
              onOpen={(next) => onOpenCard?.(next, list)}
            />
          ))}
        </div>
      </OverlayScrollbarsComponent>

      {activeComposer === list.id ? (
        <div className="mt-3 grid gap-2 px-2.5 pb-3">
          <textarea
            className="min-h-[60px] resize-y rounded-xl border border-white/10 bg-white/15 p-2 text-sm text-slate-100 outline-none focus:border-white/30 placeholder:text-slate-400"
            value={draftCard}
            onChange={(event) => onDraftChange(event.target.value)}
            rows={3}
            placeholder="Write a task title"
          />
          <div className="flex gap-2">
            <button
              className="rounded-full cursor-pointer bg-slate-100 px-3 py-1.5 text-sm font-semibold text-slate-900"
              type="button"
              onClick={() => onAddCard(list.id)}
            >
              Add card
            </button>
            <button
              className="rounded-full border cursor-pointer border-white/10 bg-white/10 px-3 py-1.5 text-sm font-semibold text-slate-200"
              type="button"
              onClick={onCloseComposer}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="flex px-2.5 pb-2.5">
          <button
            className="mt-3 w-full rounded-xl font-semibold cursor-pointer border border-dashed border-white/20 px-3 py-2 text-sm text-slate-300 transition hover:bg-white/10"
            type="button"
            onClick={() => onOpenComposer(list.id)}
          >
            + Add a card
          </button>
        </div>
      )}
    </section>
  );
};

export default ListColumn;
