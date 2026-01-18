import { useEffect, useMemo, useState } from "react";
import { boardCovers } from "../../data/boards.js";

const accentOptions = ["sun", "sky", "moss", "clay", "rose"];

const CreateBoardModal = ({ onClose, onCreate }) => {
  const [title, setTitle] = useState("");
  const [cover, setCover] = useState(boardCovers[0]);
  const [touched, setTouched] = useState(false);

  const accent = useMemo(() => {
    const index = Math.abs(title.trim().length) % accentOptions.length;
    return accentOptions[index];
  }, [title]);

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const handleSubmit = () => {
    setTouched(true);
    const nextTitle = title.trim();
    if (!nextTitle) return;
    onCreate({ title: nextTitle, cover, accent });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <button
        className="absolute inset-0 bg-black/60"
        type="button"
        aria-label="Close create board"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-sm rounded-2xl border border-white/10 bg-slate-900/95 p-5 text-slate-100 shadow-[0_20px_50px_rgba(4,6,12,0.7)]">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-200">Create board</h2>
          <button
            className="grid h-8 w-8 place-items-center rounded-full border border-white/10 text-slate-300 hover:bg-white/10"
            type="button"
            onClick={onClose}
            aria-label="Close"
          >
            <span className="text-base">x</span>
          </button>
        </div>

        <div className="mt-4 overflow-hidden rounded-xl border border-white/10">
          <div
            className="h-28 bg-cover bg-center"
            style={{ backgroundImage: `url(${cover})` }}
          />
        </div>

        <div className="mt-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            Background
          </p>
          <div className="mt-3 grid grid-cols-6 gap-2">
            {boardCovers.map((item) => (
              <button
                key={item}
                className={`h-12 rounded-lg border ${
                  cover === item ? "border-slate-100" : "border-white/10"
                } bg-cover bg-center`}
                type="button"
                style={{ backgroundImage: `url(${item})` }}
                onClick={() => setCover(item)}
                aria-label="Select background"
              />
            ))}
            <button
              className="flex h-12 items-center justify-center rounded-lg border border-white/10 text-sm text-slate-300"
              type="button"
              aria-label="More backgrounds"
            >
              ...
            </button>
          </div>
        </div>

        <div className="mt-5">
          <label className="text-xs font-semibold text-slate-300">
            Board title<span className="text-rose-400"> *</span>
          </label>
          <input
            className={`mt-2 h-10 w-full rounded-lg border bg-slate-950/80 px-3 text-sm text-slate-100 outline-none ${
              touched && !title.trim()
                ? "border-rose-400"
                : "border-white/10 focus:border-white/30"
            }`}
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Enter board title"
          />
          {touched && !title.trim() ? (
            <p className="mt-2 text-xs text-rose-300">
              Board title is required
            </p>
          ) : null}
        </div>

        <button
          className="mt-5 w-full rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-900"
          type="button"
          onClick={handleSubmit}
        >
          Create board
        </button>
      </div>
    </div>
  );
};

export default CreateBoardModal;
