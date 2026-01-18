import { accentStyles, getCardCount } from "../../data/boards.js";

const BoardCard = ({ board, onOpen }) => {
  const cardCount = getCardCount(board.lists);
  const coverStyle = board.cover
    ? { backgroundImage: `url(${board.cover})` }
    : null;

  return (
    <button
      className="group flex cursor-pointer h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-slate-900/70 text-left shadow-[0_18px_32px_rgba(12,14,22,0.45)] transition hover:-translate-y-1 hover:shadow-[0_24px_42px_rgba(12,14,22,0.55)]"
      type="button"
      onClick={() => onOpen(board.id)}
    >
      <div
        className="h-24 w-full bg-cover bg-center"
        style={
          coverStyle ?? {
            backgroundImage:
              "linear-gradient(135deg, rgba(251,191,36,0.9), rgba(244,63,94,0.85))",
          }
        }
      />
      <div className="flex flex-1 flex-col gap-3 p-4 backdrop-blur">
        <div className="flex items-center justify-between">
          <span
            className={`h-2.5 w-2.5 rounded-full ${
              accentStyles[board.accent] ?? "bg-slate-500"
            }`}
          />
          <span className="text-xs text-slate-400">
            {board.lists.length} lists
          </span>
        </div>
        <div>
          <h2 className="text-base font-semibold text-slate-100">
            {board.title}
          </h2>
          <p className="mt-1 text-xs text-slate-400">{cardCount} cards</p>
        </div>
      </div>
    </button>
  );
};

export default BoardCard;
