const NewList = ({ title, onTitleChange, onAddList }) => {
  return (
    <section className="w-[280px] shrink-0 self-start rounded-2xl border border-dashed border-orange-200/70 bg-gradient-to-br from-white/80 to-white/40 p-4 shadow-[0_14px_30px_rgba(48,36,30,0.12)]">
      <div className="grid gap-3">
        <div>
          <h2 className="text-sm font-semibold text-stone-900">Create new list</h2>
          <p className="mt-1 text-xs text-stone-600">
            Keep the board moving with a fresh column.
          </p>
        </div>
        <div className="grid gap-2">
          <input
            className="h-10 rounded-xl border border-black/10 bg-white/90 px-3 text-sm text-stone-700 outline-none focus:border-stone-400"
            type="text"
            placeholder="List title"
            value={title}
            onChange={(event) => onTitleChange(event.target.value)}
          />
          <button
            className="rounded-full bg-stone-900 px-3 py-2 text-sm font-semibold text-white"
            type="button"
            onClick={onAddList}
          >
            Add list
          </button>
        </div>
      </div>
    </section>
  )
}

export default NewList
