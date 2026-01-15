import CardItem from "./CardItem.jsx";
import ListMenu from "./ListMenu.jsx";

const accentStyles = {
  sun: "bg-amber-400",
  sky: "bg-sky-400",
  moss: "bg-emerald-400",
  clay: "bg-orange-300",
  rose: "bg-rose-400",
};

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
}) => {
  return (
    <section
      className="relative flex w-[280px] shrink-0 flex-col rounded-2xl border border-white/80 bg-white/80 p-4 shadow-[0_14px_30px_rgba(48,36,30,0.12)] animate-[list-in_0.5s_ease_both]"
      style={{ animationDelay: `${listIndex * 120}ms` }}
    >
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className={`h-2.5 w-2.5 rounded-full ${accentStyles[list.accent]}`}
          />
          <h2 className="text-sm font-semibold text-stone-900">{list.title}</h2>
        </div>
        <button
          className="rounded-full border border-black/5 bg-white/80 px-2.5 py-1 text-sm font-semibold text-stone-600 shadow-[0_8px_18px_rgba(24,20,18,0.08)]"
          type="button"
          aria-label="List options"
          onClick={onToggleMenu}
        >
          ...
        </button>
      </div>

      {isMenuOpen ? <ListMenu onClose={onCloseMenu} /> : null}

      <div className="min-h-0 space-y-3 overflow-y-auto pr-1">
        {list.cards.map((card, cardIndex) => (
          <CardItem card={card} cardIndex={cardIndex} key={card.id} />
        ))}
      </div>

      {activeComposer === list.id ? (
        <div className="mt-3 grid gap-2">
          <textarea
            className="min-h-[80px] resize-y rounded-xl border border-black/10 bg-white/90 p-2 text-sm text-stone-700 outline-none focus:border-stone-400"
            value={draftCard}
            onChange={(event) => onDraftChange(event.target.value)}
            rows={3}
            placeholder="Write a task title"
          />
          <div className="flex gap-2">
            <button
              className="rounded-full bg-stone-900 px-3 py-1.5 text-sm font-semibold text-white"
              type="button"
              onClick={() => onAddCard(list.id)}
            >
              Add card
            </button>
            <button
              className="rounded-full border border-black/10 bg-white/80 px-3 py-1.5 text-sm font-semibold text-stone-700"
              type="button"
              onClick={onCloseComposer}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          className="mt-3 w-full rounded-xl border border-dashed border-black/20 px-3 py-2 text-sm text-stone-500 transition hover:bg-black/5"
          type="button"
          onClick={() => onOpenComposer(list.id)}
        >
          + Add a card
        </button>
      )}
    </section>
  );
};

export default ListColumn;
