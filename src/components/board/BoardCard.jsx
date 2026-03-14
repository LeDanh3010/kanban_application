import { useState } from "react";
import { accentStyles, getCardCount } from "../../data/boards.js";
import ConfirmModal from "../ui/ConfirmModal.jsx";

const BoardCard = ({ board, onOpen, onArchive }) => {
  const [isArchiveModalOpen, setIsArchiveModalOpen] = useState(false);
  const cardCount = getCardCount(board.lists || []);
  const coverStyle = board.coverUrl
    ? { backgroundImage: `url(${board.coverUrl})` }
    : null;

  return (
    <div className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-slate-900/70 text-left shadow-[0_18px_32px_rgba(12,14,22,0.45)] transition hover:-translate-y-1 hover:shadow-[0_24px_42px_rgba(12,14,22,0.55)]">
      <button
        className="flex flex-1 cursor-pointer flex-col text-left"
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
              {(board.lists || []).length} lists
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

      {onArchive && (
        <>
          <button
            type="button"
            className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-lg bg-black/50 text-slate-300 opacity-0 backdrop-blur transition-opacity hover:bg-rose-500/80 hover:text-white group-hover:opacity-100 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              setIsArchiveModalOpen(true);
            }}
            aria-label="Archive board"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
              <path d="M2 3a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1H2Z" />
              <path fillRule="evenodd" d="M2 7.5h16l-.811 7.71a2 2 0 0 1-1.99 1.79H4.802a2 2 0 0 1-1.99-1.79L2 7.5ZM7 11a1 1 0 0 1 1-1h4a1 1 0 1 1 0 2H8a1 1 0 0 1-1-1Z" clipRule="evenodd" />
            </svg>
          </button>
          
          <ConfirmModal
            isOpen={isArchiveModalOpen}
            onClose={() => setIsArchiveModalOpen(false)}
            onConfirm={() => {
              onArchive(board.id);
              setIsArchiveModalOpen(false);
            }}
            confirmText="Archive"
            cancelText="Cancel"
          >
            <p>
              Are you sure you want to archive the board{" "}
              <span className="font-semibold text-rose-400">
                {board.title}
              </span>
              ?
            </p>
          </ConfirmModal>
        </>
      )}
    </div>
  );
};

export default BoardCard;
