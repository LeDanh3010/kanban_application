const BoardMeta = ({ listCount, cardCount }) => {
  return (
    <section className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <div className="rounded-2xl border border-white/60 bg-white/75 p-4 shadow-[0_14px_30px_rgba(48,36,30,0.12)]">
        <p className="text-xs uppercase tracking-[0.2em] text-stone-500">Active lists</p>
        <p className="mt-2 text-lg font-semibold text-stone-900">{listCount}</p>
      </div>
      <div className="rounded-2xl border border-white/60 bg-white/75 p-4 shadow-[0_14px_30px_rgba(48,36,30,0.12)]">
        <p className="text-xs uppercase tracking-[0.2em] text-stone-500">Cards in play</p>
        <p className="mt-2 text-lg font-semibold text-stone-900">{cardCount}</p>
      </div>
      <div className="rounded-2xl border border-white/60 bg-white/75 p-4 shadow-[0_14px_30px_rgba(48,36,30,0.12)]">
        <p className="text-xs uppercase tracking-[0.2em] text-stone-500">Next review</p>
        <p className="mt-2 text-lg font-semibold text-stone-900">Thursday 2 PM</p>
      </div>
      <div className="rounded-2xl border border-orange-200/70 bg-gradient-to-br from-orange-100/90 to-orange-200/60 p-4 shadow-[0_14px_30px_rgba(48,36,30,0.12)]">
        <p className="text-xs uppercase tracking-[0.2em] text-stone-600">Focus mode</p>
        <p className="mt-2 text-lg font-semibold text-stone-900">Keep only 3 cards moving</p>
      </div>
    </section>
  )
}

export default BoardMeta
