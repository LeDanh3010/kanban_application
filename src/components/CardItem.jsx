const tagStyles = {
  Design: "bg-amber-300/80 text-amber-950",
  Research: "bg-sky-300/80 text-sky-950",
  Copy: "bg-yellow-300/80 text-yellow-950",
  Build: "bg-emerald-300/80 text-emerald-950",
  QA: "bg-fuchsia-300/80 text-fuchsia-950",
  Marketing: "bg-rose-300/80 text-rose-950",
  New: "bg-indigo-300/80 text-indigo-950",
};

const CardItem = ({ card, cardIndex, onOpen }) => {
  const tagClass = (tag) => tagStyles[tag] ?? "bg-stone-200 text-stone-900";

  return (
    <article
      className="cursor-pointer rounded-lg border border-white/10 bg-slate-900/50 p-3.5 text-slate-100"
      style={{ animationDelay: `${cardIndex * 80}ms` }}
      onClick={() => onOpen?.(card)}
    >
      <div className="flex flex-wrap gap-1.5">
        {card.tags.map((tag) => (
          <span
            className={`inline-flex items-center rounded-full px-2 py-1 text-[11px] font-semibold ${tagClass(tag)}`}
            key={`${card.id}-${tag}`}
          >
            {tag}
          </span>
        ))}
      </div>
      <h3 className="mt-2 break-words text-sm font-semibold text-slate-100">
        {card.title}
      </h3>
      {card.note ? (
        <p className="mt-1 break-words text-xs text-slate-300">{card.note}</p>
      ) : null}
      <div className="mt-3 flex items-center justify-between text-xs text-slate-300">
        <span>{card.due}</span>
        <span className="text-base text-slate-400">-&gt;</span>
      </div>
    </article>
  );
};

export default CardItem;
