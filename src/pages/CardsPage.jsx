import React from "react";
import { 
  FaHistory, 
  FaCreditCard, 
  FaTimes,
  FaFilter,
  FaCalendar
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import "overlayscrollbars/overlayscrollbars.css";

const CardsPage = ({ user }) => {
  const navigate = useNavigate();

  const sidebarLinks = [  
    { label: "Activity", icon: <FaHistory />, active: false, path: "/activity" },
    { label: "Cards", icon: <FaCreditCard />, active: true, path: "/cards" },
  ];

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-900 text-slate-100">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/5 bg-slate-950/50 p-6 flex flex-col gap-8">
        <div>
          <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-4 px-2">Personal Settings</h2>
          <nav className="flex flex-col gap-1">
            {sidebarLinks.map((link, idx) => (
              <button
                key={idx}
                onClick={() => navigate(link.path)}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  link.active 
                    ? "bg-indigo-500/20 text-indigo-300 ring-1 ring-indigo-500/50" 
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                {link.icon}
                {link.label}
              </button>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {/* Close Button */}
        <button 
          onClick={() => navigate(-1)}
          className="absolute top-6 right-8 p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all z-20 cursor-pointer"
        >
          <FaTimes className="h-5 w-5" />
        </button>

        <div className="flex-1 overflow-y-auto p-12 max-w-6xl mx-auto w-full custom-scrollbar">
          <div className="mb-12">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-2xl font-bold text-white">Cards</h1>
              
              <div className="flex items-center gap-3">
                <div className="relative">
                  <select className="appearance-none bg-slate-800 border border-white/10 rounded-lg px-4 py-2 pr-10 text-sm text-slate-300 hover:bg-slate-700 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500/50">
                    <option>Sort by due date</option>
                    <option>Sort by created date</option>
                    <option>Sort by board</option>
                  </select>
                  <FaCalendar className="absolute right-3 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-500 pointer-events-none" />
                </div>
                
                <button className="flex items-center gap-2 bg-slate-800 border border-white/10 rounded-lg px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 transition-colors cursor-pointer">
                  <FaFilter className="h-3 w-3" />
                  Filter cards
                </button>
                
                <button className="text-sm text-slate-400 hover:text-slate-300 transition-colors cursor-pointer">
                  Clear filters
                </button>
              </div>
            </div>

            {/* Empty State */}
            <div className="flex flex-col items-center justify-center py-20 px-4">
              <div className="w-20 h-20 rounded-full bg-slate-800/50 flex items-center justify-center mb-6">
                <FaCreditCard className="h-10 w-10 text-slate-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-300 mb-2">No visible cards</h3>
              <p className="text-sm text-slate-500 text-center max-w-md">
                You must be added to a card for it to appear here.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CardsPage;
