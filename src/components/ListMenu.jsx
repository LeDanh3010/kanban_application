const ListMenu = ({ onClose }) => {
  return (
    <div className="absolute left-full top-12 z-30 ml-3 w-[280px] rounded-2xl border border-black/10 bg-white p-4 shadow-[0_20px_40px_rgba(24,20,18,0.18)]">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-stone-800">List actions</p>
        <button
          className="rounded-full border border-stone-300 px-3 py-1 text-sm font-semibold text-stone-700"
          type="button"
          aria-label="Close list actions"
          onClick={onClose}
        >
          x
        </button>
      </div>
      <div className="mt-3 grid gap-2 text-sm text-stone-700">
        <button className="rounded-lg px-2 py-1 text-left hover:bg-stone-100" type="button">
          Add card
        </button>
        <button className="rounded-lg px-2 py-1 text-left hover:bg-stone-100" type="button">
          Copy list
        </button>
        <button className="rounded-lg px-2 py-1 text-left hover:bg-stone-100" type="button">
          Move list
        </button>
        <button className="rounded-lg px-2 py-1 text-left hover:bg-stone-100" type="button">
          Move all cards in this list
        </button>
      </div>
    </div>
  )
}

export default ListMenu
