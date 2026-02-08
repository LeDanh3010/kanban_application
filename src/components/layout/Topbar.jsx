import React, { useState, useEffect, useRef } from "react";
import Button from "../ui/Button.jsx";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import "overlayscrollbars/overlayscrollbars.css";
import { useNavigate } from "react-router-dom";
import { FaLink, FaChevronDown, FaTimes, FaUserPlus } from "react-icons/fa";

const Topbar = ({ title = "Kanban", onBack, onLogout }) => {
  const navigate = useNavigate();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const dropdownRef = useRef(null);
  const accountRef = useRef(null);
  const shareRef = useRef(null);

  // Mock Notifications (same as before...)
  const [notifications, setNotifications] = useState([
    // ... existing notifications
    {
      id: 1,
      user: "Nakata",
      action: "moved a card to Done",
      time: "2 mins ago",
      unread: true,
      avatar: "N",
      color: "bg-indigo-500",
    },
    {
      id: 2,
      user: "Yamada",
      action: "assigned you to a task",
      time: "1 hour ago",
      unread: true,
      avatar: "Y",
      color: "bg-purple-500",
    },
    {
      id: 3,
      user: "Huan",
      action: "added a comment",
      time: "3 hours ago",
      unread: false,
      avatar: "H",
      color: "bg-emerald-500",
    },
    {
      id: 4,
      user: "Huan",
      action: "added a comment",
      time: "3 hours ago",
      unread: false,
      avatar: "H",
      color: "bg-emerald-500",
    },
    {
      id: 5,
      user: "Huan",
      action: "added a comment",
      time: "3 hours ago",
      unread: false,
      avatar: "H",
      color: "bg-emerald-500",
    },
  ]);

  const unreadCount = notifications.filter((n) => n.unread).length;

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsNotificationsOpen(false);
      }
      if (accountRef.current && !accountRef.current.contains(event.target)) {
        setIsAccountOpen(false);
      }
      if (shareRef.current && !shareRef.current.contains(event.target)) {
        setIsShareOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, unread: false })));
  };

  return (
    <header className="flex flex-col gap-4 bg-slate-900/60 backdrop-blur-md border-b border-white/5 p-3 text-slate-100 lg:flex-row lg:items-center lg:justify-between sticky top-0 z-50">
      <div className="flex items-center gap-4">
        {onBack ? (
          <button
            className="grid cursor-pointer h-9 w-9 place-items-center rounded-full border border-slate-700 bg-slate-900 text-slate-200 shadow-[0_8px_18px_rgba(15,16,20,0.35)] hover:border-slate-500 transition-all"
            type="button"
            onClick={onBack}
            aria-label="Back to boards"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
        ) : null}
        <div>
          <p className="text-lg font-bold tracking-tight text-white drop-shadow-sm">
            {title}
          </p>
        </div>
      </div>

      <div className="relative group flex-1 max-w-xl mx-4 lg:mx-8">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="h-4 w-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          className="h-10 w-full rounded-xl border border-white/5 bg-slate-950/40 pl-10 pr-4 text-sm text-slate-200 shadow-inner outline-none placeholder:text-slate-500 focus:border-indigo-500/50 focus:bg-slate-950/60 transition-all"
          type="search"
          placeholder="Quick search cards..."
        />
      </div>

      <div className="flex items-center justify-end gap-3">
        {/* Share Button & Dropdown */}
        <div className="relative hidden sm:block" ref={shareRef}>
          <Button 
            variant="ghost" 
            className={`px-4 py-2 text-sm border transition-all ${isShareOpen ? 'bg-white/10 border-white/20 text-white' : 'border-white/5 hover:bg-white/5'}`}
            onClick={() => setIsShareOpen(!isShareOpen)}
          >
            <FaUserPlus className="mr-2 h-4 w-4" />
            Share
          </Button>

          {isShareOpen && (
             <div className="absolute right-0 mt-3 w-[580px] rounded-xl border border-slate-700 bg-[#282e33] shadow-2xl overflow-hidden animate-scaleIn z-50 origin-top-right">
                {/* Header */}
                <div className="flex items-center justify-between p-4 pb-2">
                  <h2 className="text-lg font-medium text-white">Share board</h2>
                  <button onClick={() => setIsShareOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                    <FaTimes className="h-4 w-4"/>
                  </button>
                </div>
                
                {/* Body */}
                <div className="p-4 pt-2">
                    {/* Input Row */}
                    <div className="flex gap-2 mb-6">
                        <input 
                          className="flex-1 bg-[#22272b] border border-slate-600 rounded-[3px] px-3 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
                          placeholder="Email address or name"
                          autoFocus 
                        />
                        <div className="relative">
                            <button className="flex items-center gap-1 bg-[#22272b] border border-slate-600 rounded-[3px] px-3 py-2 text-sm text-white hover:bg-slate-700 transition-colors">
                              Member <FaChevronDown className="h-3 w-3 ml-1"/>
                            </button>
                        </div>
                        <button className="bg-blue-400 hover:bg-blue-500 text-slate-900 font-medium rounded-[3px] px-4 py-2 text-sm transition-colors">
                          Share
                        </button>
                    </div>

                    {/* Link Share */}
                    <div className="flex items-center gap-4 mb-6">
                        <div className="p-2 bg-slate-700/50 rounded-[3px]"> 
                          <FaLink className="text-slate-400 h-4 w-4"/> 
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <p className="text-sm text-white">Share this board with a link</p>
                            </div>
                            <button className="text-sm text-blue-400 hover:underline">Create link</button>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-6 border-b border-slate-700 mb-4">
                        <button className="text-sm text-blue-400 font-medium border-b-2 border-blue-400 pb-2 flex items-center gap-2">
                          Board members 
                          <span className="bg-slate-700 text-slate-300 rounded px-1.5 py-0.5 text-xs">1</span>
                        </button>
                        <button className="text-sm text-slate-400 font-medium pb-2 hover:text-white transition-colors">
                          Join requests
                        </button>
                    </div>

                    {/* Member List */}
                    <div className="flex items-center justify-between py-2">
                        <div className="flex items-center gap-3">
                             <div className="h-10 w-10 rounded-full bg-emerald-700 flex items-center justify-center text-sm font-bold text-white">JL</div>
                             <div>
                                <p className="text-sm font-bold text-white">Jan Lee (you)</p>
                                <p className="text-xs text-slate-400">@janlee35 • Workspace admin</p>
                             </div>
                        </div>
                        <button className="flex items-center gap-1 bg-[#22272b] border border-slate-600 rounded-[3px] px-3 py-1.5 text-sm text-white hover:bg-slate-700 transition-colors">
                          Admin <FaChevronDown className="h-3 w-3 ml-1"/>
                        </button>
                    </div>
                </div>
             </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Notifications Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <div className="relative">
              <Button
                variant="icon"
                aria-label="Notifications"
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className={isNotificationsOpen ? 'bg-white/10 text-white' : 'text-slate-400'}
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
              </Button>
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-600 text-[10px] font-bold text-white shadow-sm ring-2 ring-slate-900 animate-pulse pointer-events-none">
                  {unreadCount}
                </span>
              )}
            </div>

            {isNotificationsOpen && (
              <div className="absolute right-0 mt-3 w-80 rounded-2xl border border-white/10 bg-slate-900/95 backdrop-blur-xl shadow-2xl p-0 overflow-hidden animate-scaleIn z-50">
                <div className="flex items-center justify-between p-4 border-b border-white/5 bg-white/5">
                  <h3 className="text-sm font-bold text-white">Notifications</h3>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300 transition-colors uppercase tracking-wider cursor-pointer"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>
                
                <OverlayScrollbarsComponent
                  className="max-h-[360px]"
                  options={{ scrollbars: { autoHide: "scroll" } }}
                  defer
                >
                  <div className="flex flex-col">
                    {notifications.length > 0 ? (
                      notifications.map((notif) => (
                        <div key={notif.id} className={`flex gap-3 p-4 hover:bg-white/5 transition-colors cursor-pointer border-b border-white/5 last:border-0 ${notif.unread ? 'bg-indigo-500/5' : ''}`}>
                          <div className={`h-10 w-10 rounded-full ${notif.color} flex items-center justify-center text-sm font-bold text-white shadow-lg shrink-0`}>
                            {notif.avatar}
                          </div>
                          <div className="flex flex-col gap-0.5">
                            <p className="text-sm">
                              <span className="font-bold text-white">{notif.user}</span>{" "}
                              <span className="text-slate-300">{notif.action}</span>
                            </p>
                            <p className="text-[10px] text-slate-500 font-medium">{notif.time}</p>
                          </div>
                          {notif.unread && (
                            <div className="h-2 w-2 rounded-full bg-indigo-500 mt-2 shrink-0 ml-auto" />
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="p-8 text-center text-slate-500 text-sm">No new notifications</div>
                    )}
                  </div>
                </OverlayScrollbarsComponent>
              </div>
            )}
          </div>

          {/* Account Dropdown */}
          <div className="relative" ref={accountRef}>
            <Button 
              variant="icon" 
              aria-label="Account" 
              onClick={() => setIsAccountOpen(!isAccountOpen)}
              className={`bg-gradient-to-br from-indigo-500/20 to-purple-600/20 border transition-all ${isAccountOpen ? 'border-white/40 ring-2 ring-white/10' : 'border-white/5 hover:border-white/20'}`}
            >
              <span className="text-xs font-bold bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text text-transparent">JL</span>
            </Button>

            {isAccountOpen && (
              <div className="absolute right-0 mt-3 w-72 rounded-2xl border border-white/10 bg-slate-900/95 backdrop-blur-xl shadow-2xl p-0 overflow-hidden animate-scaleIn z-50">
                {/* Account Info */}
                <div className="p-4 border-b border-white/5">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Account</p>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-emerald-500 flex items-center justify-center text-sm font-bold text-white shadow-lg">
                      JL
                    </div>
                    <div className="flex flex-col">
                      <p className="text-sm font-bold text-white">Jan Lee</p>
                      <p className="text-[11px] text-slate-400 truncate">nguyenledanh19@gmail.com</p>
                    </div>
                  </div>
                </div>

                {/* Sub Menu 1 */}
                <div className="py-2 border-b border-white/5">
                  <button  onClick={() => {
                      setIsAccountOpen(false);
                      onLogout && onLogout();
                    }}
                     className="w-full flex items-center px-4 py-2.5 text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors cursor-pointer text-left">
                    Switch accounts
                  </button>
                  <button 
                    onClick={() => {
                      setIsAccountOpen(false);
                      navigate("/activity");
                    }}
                    className="w-full flex items-center px-4 py-2 text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors cursor-pointer text-left"
                  >
                    Activity
                  </button>
                  <button 
                    onClick={() => {
                      setIsAccountOpen(false);
                      navigate("/cards");
                    }}
                    className="w-full flex items-center px-4 py-2 text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors cursor-pointer text-left"
                  >
                    Cards
                  </button>
                </div>

                {/* Logout */}
                <div className="py-2">
                  <button 
                    onClick={() => {
                      setIsAccountOpen(false);
                      onLogout && onLogout();
                    }}
                    className="w-full flex items-center px-4 py-2.5 text-sm text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer font-medium"
                  >
                    Log out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
