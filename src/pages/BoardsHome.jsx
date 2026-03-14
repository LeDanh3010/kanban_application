import { useState } from "react";
import Topbar from "../components/layout/Topbar.jsx";
import BoardCard from "../components/board/BoardCard.jsx";
import CreateBoardModal from "../components/board/CreateBoardModal.jsx";

const BoardsHome = ({ boards, onOpenBoard, onCreateBoard, onArchiveBoard, user, onLogout, onGoToAdmin }) => {
  const [isCreating, setIsCreating] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const isAdmin = user?.role === "admin";

  const itemsPerPage = 11;
  const totalPages = Math.ceil((boards?.length || 0) / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentBoards = boards ? boards.slice(startIndex, startIndex + itemsPerPage) : [];

  return (
    <div className="h-screen w-screen overflow-hidden bg-slate-950 text-slate-100 flex flex-col">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.16),_rgba(15,23,42,0.2)_35%,_rgba(2,6,23,0.9)_75%)]" />
      <Topbar title="BimCad" onLogout={onLogout} page="home" user={user} />
      <div className="mx-auto flex w-full flex-grow max-w-6xl flex-col px-5 py-6 overflow-y-auto">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-lg font-semibold text-slate-100">
                Your Workspace
              </h1>
              {user && <p className="text-sm text-slate-400">Welcome, {user.username}</p>}
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
          {currentBoards.length > 0 ? currentBoards.map((board) => (
            <BoardCard
              key={board.id}
              board={board}
              onOpen={onOpenBoard}
              onArchive={isAdmin ? onArchiveBoard : null}
            />
          )) : (
            <div className="col-span-full py-12 flex justify-center items-center">
              <p className="text-lg text-slate-400">No boards found</p>
            </div>
          )}
          {isAdmin && (
            <button
              className="flex flex-col cursor-pointer items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-700 bg-slate-900/60 px-4 py-8 text-sm text-slate-300 backdrop-blur hover:border-slate-500 hover:bg-slate-900/80 transition-colors"
              type="button"
              onClick={() => setIsCreating(true)}
            >
              Create new board
            </button>
          )}
        </main>

        {totalPages > 1 && (
          <div className="mt-8 mb-8 flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-slate-300 disabled:opacity-50 hover:bg-slate-700 transition-colors cursor-pointer"
            >
              Previous
            </button>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setCurrentPage(i + 1)}
                  className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                    currentPage === i + 1 
                      ? "bg-indigo-500 text-white" 
                      : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-slate-300 disabled:opacity-50 hover:bg-slate-700 transition-colors cursor-pointer"
            >
              Next
            </button>
          </div>
        )}
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
