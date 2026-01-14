const tabs = [
  { id: "inbox", label: "Inbox" },
  { id: "planner", label: "Planner" },
  { id: "board", label: "Board", active: true },
  { id: "switch", label: "Switch boards" },
];

const icons = {
  inbox: (
    <svg
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 7h16v8a2 2 0 0 1-2 2h-4l-2 2-2-2H6a2 2 0 0 1-2-2V7z" />
      <path d="M4 7l3-4h10l3 4" />
    </svg>
  ),
  planner: (
    <svg
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="4" y="5" width="16" height="15" rx="2" />
      <path d="M8 3v4" />
      <path d="M16 3v4" />
      <path d="M4 10h16" />
    </svg>
  ),
  board: (
    <svg
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="4" y="5" width="16" height="14" rx="2" />
      <path d="M9 5v14" />
      <path d="M15 5v14" />
    </svg>
  ),
  switch: (
    <svg
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="4" y="5" width="16" height="14" rx="2" />
      <path d="M8 9h8" />
      <path d="M8 13h5" />
    </svg>
  ),
};

const BottomTabs = () => {
  return (
    <div className="flex justify-center pb-4 pt-2">
      <div className="flex items-center gap-2 rounded-2xl border border-black/10 bg-white/90 p-2 shadow-[0_18px_36px_rgba(24,20,18,0.18)] backdrop-blur">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`flex items-center gap-2 rounded-xl p-2 text-sm font-semibold cursor-pointer ${
              tab.active
                ? "bg-blue-300 text-blue-600"
                : "text-stone-700 hover:bg-black/5"
            }`}
            type="button"
          >
            <span className="grid h-7 w-7 place-items-center rounded-lg border border-black/10 bg-white text-stone-600">
              {icons[tab.id]}
            </span>
            <span className="whitespace-nowrap">{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default BottomTabs;
