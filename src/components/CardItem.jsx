const tagStyles = {
  Design: 'bg-amber-200 text-amber-900',
  Research: 'bg-sky-200 text-sky-900',
  Copy: 'bg-yellow-200 text-yellow-900',
  Build: 'bg-emerald-200 text-emerald-900',
  QA: 'bg-fuchsia-200 text-fuchsia-900',
  Marketing: 'bg-rose-200 text-rose-900',
  New: 'bg-indigo-200 text-indigo-900',
}

const CardItem = ({ card, cardIndex }) => {
  const tagClass = (tag) => tagStyles[tag] ?? 'bg-stone-200 text-stone-900'

  return (
    <article
      className="rounded-2xl border border-black/5 bg-white p-3.5 shadow-[0_10px_18px_rgba(24,20,18,0.08)] animate-[card-rise_0.4s_ease_both]"
      style={{ animationDelay: `${cardIndex * 80}ms` }}
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
      <h3 className="mt-2 text-sm font-semibold text-stone-900">{card.title}</h3>
      {card.note ? <p className="mt-1 text-xs text-stone-600">{card.note}</p> : null}
      <div className="mt-3 flex items-center justify-between text-xs text-stone-500">
        <span>{card.due}</span>
        <span className="text-base text-stone-400">-&gt;</span>
      </div>
    </article>
  )
}

export default CardItem
