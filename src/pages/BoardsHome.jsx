  import { useState } from "react";
import Topbar from "../components/layout/Topbar.jsx";
import BoardCard from "../components/board/BoardCard.jsx";
import CreateBoardModal from "../components/board/CreateBoardModal.jsx";

const BoardsHome = ({ boards, onOpenBoard, onCreateBoard, user, onLogout, onGoToAdmin }) => {
  const [isCreating, setIsCreating] = useState(false);

  return (
    <div className="h-screen w-screen overflow-hidden bg-slate-950 text-slate-100">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.16),_rgba(15,23,42,0.2)_35%,_rgba(2,6,23,0.9)_75%)]" />
      <Topbar title="BimCad" onLogout={onLogout} />
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-5 py-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <div>

              <h1 className="text-lg font-semibold text-slate-100">
                Your Workspace
              </h1>
              {user && <p className="text-sm text-slate-400">Welcome, {user.name}</p>}
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {onGoToAdmin && (
              <button
                className="rounded-lg bg-indigo-500/20 px-3 py-1.5 text-sm font-semibold text-indigo-200 hover:bg-indigo-500/30 transition-colors cursor-pointer"
                type="button"
                onClick={onGoToAdmin}
              >
                Admin Dashboard
              </button>
            )}
          </div>
        </div>

        <main className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {boards.map((board) => (
            <BoardCard key={board.id} board={board} onOpen={onOpenBoard} />
          ))}
          <button
            className="flex h-full flex-col cursor-pointer items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-700 bg-slate-900/60 px-4 py-8 text-sm text-slate-300 backdrop-blur"
            type="button"
            onClick={() => setIsCreating(true)}
          >
            Create new board
            <span className="text-xs text-slate-500">5 remaining</span>
          </button>
        </main>
      </div>
      {isCreating ? (
        <CreateBoardModal
          onClose={() => setIsCreating(false)}
          onCreate={(payload) => {
            onCreateBoard?.(payload);
            setIsCreating(false);
          }}
        />
      ) : null}
    </div>
  );
};

export default BoardsHome;
