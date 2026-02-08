import React from "react";
import { 
  FaUserCircle, 
  FaHistory, 
  FaCreditCard, 
  FaCog, 
  FaUsers, 
  FaCrown, 
  FaClipboardList, 
  FaTimes 
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import "overlayscrollbars/overlayscrollbars.css";

const ActivityPage = ({ user, onBack }) => {
  const navigate = useNavigate();

  const activities = [
    { id: 1, user: "Jan Lee", action: "added", target: "frdsafdsa", location: "sdafdsafdsa", board: "修正図面", time: "1 hour ago" },
    { id: 2, user: "Jan Lee", action: "added list", target: "sdafdsafdsa", location: "", board: "修正図面", time: "1 hour ago" },
    { id: 3, user: "Jan Lee", action: "added", target: "fdsfasf", location: "図面の作成", board: "test", time: "Feb 6, 2026, 2:56 PM" },
    { id: 4, user: "Jan Lee", action: "added", target: "fdssfa", location: "図面の作成", board: "test", time: "Feb 6, 2026, 2:56 PM" },
    { id: 5, user: "Jan Lee", action: "added", target: "sdfafds", location: "図面の作成", board: "test", time: "Feb 6, 2026, 2:56 PM" },
    { id: 6, user: "Jan Lee", action: "moved", target: "修正", location: "図面の作成 to dsfgsdgds", board: "test", time: "Feb 6, 2026, 2:55 PM" },
    { id: 7, user: "Jan Lee", action: "added", target: "adsa", location: "dsfgsdgds", board: "test", time: "Feb 6, 2026, 2:54 PM" },
    { id: 8, user: "Jan Lee", action: "added", target: "da", location: "dsfgsdgds", board: "test", time: "Feb 6, 2026, 2:49 PM" },
    { id: 9, user: "Jan Lee", action: "added", target: "da", location: "dsfgsdgds", board: "test", time: "Feb 6, 2026, 2:49 PM" },
    { id: 10, user: "Jan Lee", action: "added", target: "ada", location: "dsfgsdgds", board: "test", time: "Feb 6, 2026, 2:48 PM" },
  ];

  const sidebarLinks = [  
    { label: "Activity", icon: <FaHistory />, active: true, path: "/activity" },
    { label: "Cards", icon: <FaCreditCard />, active: false, path: "/cards" },
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
          onClick={onBack}
          className="absolute top-6 right-8 p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all z-20 cursor-pointer"
        >
          <FaTimes className="h-5 w-5" />
        </button>

        <OverlayScrollbarsComponent 
          className="flex-1 p-12 max-w-4xl mx-auto w-full"
          options={{ scrollbars: { autoHide: "scroll" } }}
          defer
        >
          <div className="mb-12">
            <h1 className="text-2xl font-bold text-white mb-8">Activity</h1>
            <div>            
              <div className="flex flex-col gap-6 pl-2">
                {activities.map((item) => (
                  <div key={item.id} className="flex gap-4 group">
                    <div className="h-8 w-8 rounded-full bg-emerald-500 flex items-center justify-center text-xs font-bold text-white shadow-lg shrink-0 mt-1">
                      JL
                    </div>
                    <div className="flex flex-col gap-1">
                      <p className="text-sm text-slate-300 leading-relaxed">
                        <span className="font-bold text-white hover:underline cursor-pointer">{item.user}</span>
                        {" "}{item.action}{" "}
                        <span className="text-indigo-400 font-medium hover:underline cursor-pointer">{item.target}</span>
                        {item.location && <> to <span className="text-slate-200">{item.location}</span></>}
                      </p>
                      <div className="flex items-center gap-2 text-[11px] text-slate-500">
                        <span className="hover:underline cursor-pointer">{item.time}</span>
                        <span className="h-1 w-1 rounded-full bg-slate-700" />
                        <span className="flex items-center gap-1 group-hover:text-slate-400 transition-colors cursor-pointer">
                          on board <span className="underline font-medium text-slate-400">{item.board}</span>
                          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.172 13.828a4 4 0 015.656 0l4 4a4 4 0 01-5.656 5.656l-1.102-1.101" />
                          </svg>
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </OverlayScrollbarsComponent>
      </main>
    </div>
  );
};

export default ActivityPage;
