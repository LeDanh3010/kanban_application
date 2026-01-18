import React from "react";

const Topbar = ({ title = "Kanban", onBack }) => {
  return (
    <header
      className={
        "flex flex-col gap-4 bg-slate-900 p-3 text-slate-100 lg:flex-row lg:items-center lg:justify-between"
      }
    >
      <div className="flex items-center gap-4">
        {onBack ? (
          <button
            className="grid h-9 w-9 place-items-center rounded-full border border-slate-700 bg-slate-900 text-slate-200 shadow-[0_8px_18px_rgba(15,16,20,0.35)]"
            type="button"
            onClick={onBack}
            aria-label="Back to boards"
          >
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
        ) : null}
        <div>
          <p className="text-lg font-semibold tracking-wide text-slate-100">
            {title}
          </p>
        </div>
      </div>
      <div>
        <input
          className="h-10 w-full rounded-full border border-slate-800 bg-slate-900 px-4 text-sm text-slate-200 shadow-[0_8px_18px_rgba(15,16,20,0.35)] outline-none placeholder:text-slate-500 focus:border-slate-600 sm:w-120"
          type="search"
          placeholder="Search cards"
        />
      </div>
      <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center lg:w-auto">
        <button
          className="flex w-full items-center justify-center gap-2 rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-semibold text-slate-100 shadow-[0_8px_18px_rgba(15,16,20,0.35)] sm:w-auto cursor-pointer"
          type="button"
        >
          <svg
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7" />
            <path d="M12 16V4" />
            <path d="m8 8 4-4 4 4" />
          </svg>
          Share
        </button>
        <div className="flex items-center justify-end gap-2 sm:ml-2">
          <button
            className="grid h-10 w-10 place-items-center rounded-full border border-slate-700 bg-slate-900 text-slate-300 shadow-[0_8px_18px_rgba(15,16,20,0.35)] cursor-pointer"
            type="button"
            aria-label="Filter"
          >
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 5h16" />
              <path d="M7 12h10" />
              <path d="M10 19h4" />
            </svg>
          </button>
          <button
            className="grid h-10 w-10 place-items-center rounded-full border border-slate-700 bg-slate-900 text-slate-300 shadow-[0_8px_18px_rgba(15,16,20,0.35)] cursor-pointer"
            type="button"
            aria-label="Notifications"
          >
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M15 17H6c-1.1 0-2-.9-2-2 1.4-1.2 2-2.9 2-5a6 6 0 1 1 12 0c0 2.1.6 3.8 2 5 0 1.1-.9 2-2 2h-3" />
              <path d="M9 17a3 3 0 0 0 6 0" />
            </svg>
          </button>
          <button
            className="grid h-10 w-10 place-items-center rounded-full border border-slate-700 bg-slate-900 text-slate-200 shadow-[0_8px_18px_rgba(15,16,20,0.35)] cursor-pointer"
            type="button"
            aria-label="Account"
          >
            <span className="text-sm font-semibold">JL</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
