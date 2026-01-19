import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const CardItem = ({ card, cardIndex, onOpen, onToggle, listId }) => {
  const isDone = Boolean(card.completed);
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

  return (
    <article
      ref={setNodeRef}
      className={`group relative cursor-pointer rounded-lg border border-white/10 bg-slate-900/50 p-3 text-slate-100 transition-shadow duration-300 hover:shadow-[0_12px_24px_rgba(6,10,20,0.35)] ${
        isDragging ? "opacity-60" : ""
      }`}
      style={{
        animationDelay: `${cardIndex * 80}ms`,
        transition: "transform 220ms cubic-bezier(0.2, 0.7, 0.2, 1)",
        ...style,
      }}
      {...attributes}
      {...listeners}
      onClick={() => onOpen?.(card)}
    >
      <button
        className={`absolute left-3 cursor-pointer top-3 grid h-5 w-5 place-items-center rounded-full border-2 transition-all duration-500 ease-out ${
          isDone
            ? "border-emerald-400/80 bg-emerald-400/25 text-emerald-200 opacity-100 scale-100"
            : "border-white/40 bg-white/5 text-transparent opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 group-hover:border-white/60 group-hover:bg-white/10"
        } ${isDone ? "" : "pointer-events-none group-hover:pointer-events-auto"} hover:scale-110 active:scale-95`}
        type="button"
        aria-label="Toggle card completion"
        onClick={(event) => {
          event.stopPropagation();
          onToggle?.();
        }}
      >
        <span
          className={`text-[10px] font-bold transition-all duration-300 ${isDone ? "scale-100" : "scale-0 group-hover:scale-0"}`}
        >
          ✓
        </span>
      </button>
      <h3
        className={`break-words text-sm font-semibold transition-all duration-500 ease-out ${
          isDone
            ? "pl-7 line-through text-slate-400"
            : "pl-0 text-slate-100 group-hover:pl-7"
        }`}
      >
        {card.title}
      </h3>
    </article>
  );
};

export default CardItem;
