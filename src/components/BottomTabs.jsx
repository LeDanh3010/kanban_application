import { useState } from "react";
import BoardSwitchModal from "./boards/BoardSwitchModal.jsx";
import Button from "./ui/Button.jsx";
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

const BottomTabs = ({ boards, activeBoardId, onSwitchBoard }) => {
  const [activeTab, setActiveTab] = useState("");
  const [isSwitchOpen, setIsSwitchOpen] = useState(false);
  const tabs = [
    // { id: "inbox", label: "Inbox" },
    { id: "planner", label: "Planner" },
    { id: "board", label: "Board" },
    { id: "switch", label: "Switch boards" },
  ];
  return (
    <>
      {isSwitchOpen ? (
        <BoardSwitchModal
          boards={boards}
          activeBoardId={activeBoardId}
          onClose={() => setIsSwitchOpen(false)}
          onSelect={(id) => {
            onSwitchBoard?.(id);
            setIsSwitchOpen(false);
          }}
        />
      ) : null}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2">
        <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-slate-900/80 p-2 text-slate-100 shadow-[0_18px_36px_rgba(10,12,20,0.5)]">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <Button
                key={tab.id}
                variant="tab"
                className={`flex items-center gap-2 font-semibold transition-all duration-300 ease-in-out ${
                  isActive
                    ? "bg-white/10 text-slate-200 scale-105"
                    : "text-slate-200 hover:bg-white/10 hover:scale-102"
                }`}
                type="button"
                onClick={() => {
                  if (tab.id === "switch") {
                    setIsSwitchOpen(true);
                    setActiveTab(tab.id);
                    return;
                  }
                  setActiveTab((prev) => (prev === tab.id ? null : tab.id));
                }}
              >
                <span className="grid h-7 w-7 place-items-center rounded-lg border border-white/10 bg-white/10 text-slate-200 transition-transform duration-300 ease-in-out group-hover:rotate-6">
                  {icons[tab.id]}
                </span>
                <span className="whitespace-nowrap transition-opacity duration-300">
                  {tab.label}
                </span>
              </Button>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default BottomTabs;
