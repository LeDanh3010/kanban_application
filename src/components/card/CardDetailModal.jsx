import Button from "../ui/Button.jsx";

const CardDetailModal = ({ card, listTitle, onClose }) => {
  if (!card) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-6 py-10">
      <button
        className="absolute inset-0 bg-black/65"
        type="button"
        aria-label="Close card detail"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-5xl overflow-hidden rounded-2xl border border-white/10 bg-slate-900/95 text-slate-100 shadow-[0_30px_80px_rgba(4,6,12,0.7)]">
        <header className="flex items-center justify-between border-b border-white/10 bg-slate-950/80 px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-xs text-slate-300">
              {listTitle}
            </span>
            <h2 className="text-lg font-semibold">{card.title}</h2>
          </div>
          <Button
            variant="ghost"
            className="h-9 w-9 border-white/10 text-slate-300"
            type="button"
            onClick={onClose}
            aria-label="Close"
          >
            <span className="text-base">✕</span>
          </Button>
        </header>

        <div className="grid gap-6 px-6 py-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <section className="space-y-5">
            <div className="flex flex-wrap gap-2">
              <Button
                variant="ghost"
                className="rounded-lg border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-200 hover:bg-white/10"
                type="button"
              >
                + Add
              </Button>
              <Button
                variant="ghost"
                className="rounded-lg border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-200 hover:bg-white/10"
                type="button"
              >
                Labels
              </Button>
              <Button
                variant="ghost"
                className="rounded-lg border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-200 hover:bg-white/10"
                type="button"
              >
                Dates
              </Button>
              <Button
                variant="ghost"
                className="rounded-lg border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-200 hover:bg-white/10"
                type="button"
              >
                Checklist
              </Button>
              <Button
                variant="ghost"
                className="rounded-lg border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-200 hover:bg-white/10"
                type="button"
              >
                Members
              </Button>
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-200">
                Description
              </p>
              <textarea
                className="mt-2 min-h-[120px] w-full rounded-xl border border-white/10 bg-slate-950/70 p-3 text-sm text-slate-200 outline-none placeholder:text-slate-500 focus:border-white/30"
                placeholder="Add a more detailed description..."
                defaultValue={card.note ?? ""}
              />
            </div>
          </section>

          <aside className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-200">
                Comments and activity
              </p>
              <Button
                variant="ghost"
                className="rounded-lg border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-200 hover:bg-white/10"
                type="button"
              >
                Show details
              </Button>
            </div>
            <input
              className="h-10 w-full rounded-lg border border-white/10 bg-slate-950/70 px-3 text-sm text-slate-200 outline-none placeholder:text-slate-500 focus:border-white/30"
              type="text"
              placeholder="Write a comment..."
            />
            <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-slate-300">
              <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-semibold text-slate-950">
                JL
              </span>
              Added this card to {listTitle}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default CardDetailModal;
