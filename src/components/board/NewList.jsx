import Button from "../ui/Button.jsx";

const NewList = ({ title, onTitleChange, onAddList }) => {
  return (
    <section className="w-[280px] shrink-0 self-start rounded-xl border border-dashed border-white/15 bg-slate-900/55 p-4 text-slate-100 shadow-[0_16px_36px_rgba(4,6,12,0.55)] backdrop-blur-md">
      <div className="grid gap-3">
        <div>
          <h2 className="text-sm font-semibold text-slate-200">
            Create new list
          </h2>
        </div>
        <div className="grid gap-2">
          <input
            className="h-10 rounded-xl border border-white/10 bg-white/15 px-3 text-sm text-slate-100 outline-none placeholder:text-slate-400 focus:border-white/30"
            type="text"
            placeholder="List title"
            value={title}
            onChange={(event) => onTitleChange(event.target.value)}
          />
          <Button
            variant="solid"
            className="px-3 py-2 text-sm"
            type="button"
            onClick={onAddList}
          >
            Add list
          </Button>
        </div>
      </div>
    </section>
  );
};

export default NewList;
