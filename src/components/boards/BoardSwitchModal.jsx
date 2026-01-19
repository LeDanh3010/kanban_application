import { useMemo, useState } from "react";
import Button from "../ui/Button.jsx";

const BoardSwitchModal = ({ boards, activeBoardId, onClose, onSelect }) => {
  const [query, setQuery] = useState("");

  const filteredBoards = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return boards;
    return boards.filter((board) =>
      board.title.toLowerCase().includes(needle),
    );
  }, [boards, query]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <button
        className="absolute inset-0 bg-black/60"
        type="button"
        aria-label="Close board switcher"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-3xl rounded-2xl border border-white/10 bg-slate-900/95 p-5 text-slate-100 shadow-[0_24px_60px_rgba(4,6,12,0.75)]">
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-1 items-center gap-2 rounded-xl border border-white/10 bg-slate-950/70 px-3 py-2">
            <svg
              className="h-4 w-4 text-slate-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="M21 21l-4.3-4.3" />
            </svg>
            <input
              className="w-full bg-transparent text-sm text-slate-100 outline-none placeholder:text-slate-500"
              type="search"
              placeholder="Search your boards"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
          <Button
            variant="ghost"
            className="h-9 w-9 rounded-lg border-white/10 text-slate-300"
            type="button"
            onClick={onClose}
            aria-label="Close"
          >
            <span className="text-base">x</span>
          </Button>
        </div>

        <div className="mt-5">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            Recent
          </p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {filteredBoards.map((board) => (
              <button
                key={board.id}
                className={`group overflow-hidden rounded-xl border text-left transition ${
                  board.id === activeBoardId
                    ? "border-slate-100"
                    : "border-white/10 hover:border-white/30"
                }`}
                type="button"
                onClick={() => onSelect(board.id)}
              >
                <div
                  className="h-20 w-full bg-cover bg-center"
                  style={{
                    backgroundImage: board.cover
                      ? `url(${board.cover})`
                      : "linear-gradient(135deg, rgba(148,163,184,0.6), rgba(30,41,59,0.8))",
                  }}
                />
                <div className="bg-slate-950/60 px-3 py-2">
                  <p className="text-sm font-semibold text-slate-100">
                    {board.title}
                  </p>
                </div>
              </button>
            ))}
            {filteredBoards.length === 0 ? (
              <div className="col-span-full rounded-xl border border-dashed border-white/10 px-4 py-6 text-center text-sm text-slate-400">
                No boards found.
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoardSwitchModal;
