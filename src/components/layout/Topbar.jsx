import React, { useState, useEffect, useRef } from "react";
import Button from "../ui/Button.jsx";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import "overlayscrollbars/overlayscrollbars.css";
import { useNavigate } from "react-router-dom";
import { FaLink, FaChevronDown, FaTimes, FaUserPlus } from "react-icons/fa";
import { searchCards, searchUsers, shareBoard, updateBoardMember, removeBoardMember } from "../../utils/data.js";

const Topbar = ({ board, title = "Kanban", onBack, onLogout, onTitleChange, page, user }) => {
  const navigate = useNavigate();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [draftTitle, setDraftTitle] = useState(title);
  const inputRef = useRef(null);
  const spanRef = useRef(null);
  const dropdownRef = useRef(null);
  const accountRef = useRef(null);
  const shareRef = useRef(null);
  const searchRef = useRef(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchSelectedIndex, setSearchSelectedIndex] = useState(-1);

  // Share Modal States
  const [shareSearchQuery, setShareSearchQuery] = useState("");
  const [userSuggestions, setUserSuggestions] = useState([]);
  const [isSearchingUsers, setIsSearchingUsers] = useState(false);
  const [selectedRole, setSelectedRole] = useState("user");
  const [memList, setMemList] = useState(board?.members || []);
  const [showRoleDropdown, setShowRoleDropdown] = useState(null); // id of member
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    if (board?.members) setMemList(board.members);
  }, [board?.members]);

  const BOARD_ROLES = ["leader", "assistant", "user", "collaborator", "guest"];
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
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Sync draftTitle when the title prop changes (e.g. from parent)
  useEffect(() => {
    setDraftTitle(title);
  }, [title]);

  // Keep a ref to always have latest values in event listeners (avoids stale closure)
  const draftTitleRef = useRef(draftTitle);
  const titleRef = useRef(title);
  const onTitleChangeRef = useRef(onTitleChange);
  useEffect(() => { draftTitleRef.current = draftTitle; }, [draftTitle]);
  useEffect(() => { titleRef.current = title; }, [title]);
  useEffect(() => { onTitleChangeRef.current = onTitleChange; }, [onTitleChange]);

  const handleSaveTitle = () => {
    setIsEditingTitle(false);
    const trimmed = draftTitleRef.current.trim();
    if (trimmed && trimmed !== titleRef.current && onTitleChangeRef.current) {
      onTitleChangeRef.current(trimmed);
    } else {
      setDraftTitle(titleRef.current);
    }
  };

  const handleCancelTitleEdit = () => {
    setIsEditingTitle(false);
    setDraftTitle(titleRef.current);
  };

  // Register keyboard/pointer listeners only when editing starts
  useEffect(() => {
    if (!isEditingTitle) return;
    requestAnimationFrame(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    });
    const handleKey = (e) => {
      if (e.key === 'Enter') { e.preventDefault(); handleSaveTitle(); }
      if (e.key === 'Escape') { e.preventDefault(); handleCancelTitleEdit(); }
    };
    const onPointerDown = (e) => {
      if (inputRef.current && !inputRef.current.contains(e.target)) {
        handleSaveTitle();
      }
    };
    document.addEventListener('keydown', handleKey);
    document.addEventListener('pointerdown', onPointerDown);
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.removeEventListener('pointerdown', onPointerDown);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditingTitle]);


  // Auto-resize input width to match typed content
  useEffect(() => {
    if (!isEditingTitle || !spanRef.current || !inputRef.current) return;
    const spanWidth = spanRef.current.offsetWidth;
    inputRef.current.style.width = Math.max(60, spanWidth) + "px";
  }, [draftTitle, isEditingTitle]);

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, unread: false })));
  };

  // Debounced search
  useEffect(() => {
    const handler = setTimeout(async () => {
      if (searchQuery.trim().length >= 2) {
        setIsSearching(true);
        try {
          const results = await searchCards(searchQuery);
          setSearchResults(results);
          setSearchSelectedIndex(-1);
          setIsSearchOpen(true);
        } catch (err) {
          console.error(err);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
        setIsSearchOpen(false);
        setSearchSelectedIndex(-1);
      }
    }, 300);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Share user search
  useEffect(() => {
    if (!shareSearchQuery.trim()) {
        setUserSuggestions([]);
        return;
    }
    const handler = setTimeout(async () => {
        setIsSearchingUsers(true);
        try {
            const results = await searchUsers(shareSearchQuery);
            // Filter out existing members
            const filtrd = results.filter(u => !memList.some(m => m.userId === u.id));
            setUserSuggestions(filtrd);
        } catch (err) {
            console.error(err);
        } finally {
            setIsSearchingUsers(false);
        }
    }, 400);
    return () => clearTimeout(handler);
  }, [shareSearchQuery, memList]);

  const handleAddMember = async (targetUser) => {
    if (isAdding) return;
    setIsAdding(true);
    try {
        const newMember = await shareBoard(board.id, targetUser.id, selectedRole);
        setMemList([...memList, newMember]);
        setShareSearchQuery("");
        setUserSuggestions([]);
    } catch (err) {
        console.error(err);
        alert(err.response?.data?.error || "Failed to add member");
    } finally {
        setIsAdding(false);
    }
  };

  const handleUpdateRole = async (memberId, newRole) => {
    try {
        const updated = await updateBoardMember(board.id, memberId, newRole);
        setMemList(memList.map(m => m.id === memberId ? updated : m));
        setShowRoleDropdown(null);
    } catch (err) {
        console.error(err);
    }
  };

  const handleRemoveMember = async (memberId) => {
    if (!window.confirm("Are you sure you want to remove this member?")) return;
    try {
        await removeBoardMember(board.id, memberId);
        setMemList(memList.filter(m => m.id !== memberId));
    } catch (err) {
        console.error(err);
    }
  };
  return (
    <header className="grid grid-cols-1 gap-3 bg-slate-900/60 backdrop-blur-md border-b border-white/5 p-3 text-slate-100 lg:grid-cols-[280px_1fr_auto] lg:items-center sticky top-0 z-50">
      {/* LEFT: fixed 280px grid column — input can grow inside but grid keeps searchbar anchored */}
      <div className="flex items-center gap-2 min-w-0 overflow-hidden">
        {onBack ? (
          <button
            className="grid cursor-pointer h-9 w-9 place-items-center rounded-full border border-slate-700 bg-slate-900 text-slate-200 shadow-[0_8px_18px_rgba(15,16,20,0.35)] hover:border-slate-500 transition-all shrink-0"
            type="button"
            onClick={onBack}
            aria-label="Back to boards"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
        ) : null}
        <div className="min-w-0 overflow-hidden max-w-[280px]">
          {/* Hidden span used to measure text width for input auto-resize */}
          {isEditingTitle && (
            <span
              ref={spanRef}
              aria-hidden="true"
              style={{
                position: "fixed",
                top: "-9999px",
                left: "-9999px",
                visibility: "hidden",
                whiteSpace: "pre",
                fontSize: "1.125rem",
                fontWeight: "700",
                letterSpacing: "-0.025em",
                padding: "0.25rem 0.5rem",
              }}
            >
              {draftTitle || " "}
            </span>
          )}

          {page === "viewBoard" ? isEditingTitle ? (
            <input
              ref={inputRef}
              type="text"
              value={draftTitle}
              onChange={(e) => setDraftTitle(e.target.value)}
              className="text-lg font-bold tracking-tight text-white
                     drop-shadow-sm bg-white/10 rounded-md outline-none
                     px-2 py-1"
              style={{ minWidth: "60px", maxWidth: "280px" }}
            />
          ) : (
            <p
              className="text-lg font-bold tracking-tight text-white drop-shadow-sm cursor-pointer hover:bg-white/10 rounded-md px-2 py-1 transition-colors truncate"
              onClick={() => setIsEditingTitle(true)}
              title={title}
            >
              {title}
            </p>
          ) : (
            <p className="text-lg font-bold tracking-tight text-white drop-shadow-sm truncate" title={title}>
              {title}
            </p>
          )}
        </div>
      </div>

      {/* CENTER: 1fr grid cell keeps searchbar anchored; max-w-md caps its visual width */}
      <div className="relative group w-full max-w-lg mx-auto min-w-0" ref={searchRef}>
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="h-4 w-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          className="h-10 w-full rounded-xl border border-white/5 bg-slate-950/40 pl-10 pr-4 text-sm text-slate-200 shadow-inner outline-none placeholder:text-slate-500 focus:border-indigo-500/50 focus:bg-slate-950/60 transition-all"
          type="search"
          placeholder="Search boards & cards..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => { if (searchQuery.length >= 2) setIsSearchOpen(true); }}
          onKeyDown={(e) => {
            if (!isSearchOpen || searchResults.length === 0) return;
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setSearchSelectedIndex((prev) => (prev < searchResults.length - 1 ? prev + 1 : prev));
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              setSearchSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
            } else if (e.key === "Enter") {
              e.preventDefault();
              if (searchSelectedIndex >= 0 && searchSelectedIndex < searchResults.length) {
                const item = searchResults[searchSelectedIndex];
                setIsSearchOpen(false);
                setSearchQuery("");
                navigate(`/board/${item.boardId}`);
              } else if (searchResults.length > 0) {
                const item = searchResults[0];
                setIsSearchOpen(false);
                setSearchQuery("");
                navigate(`/board/${item.boardId}`);
              }
            } else if (e.key === "Escape") {
              e.preventDefault();
              setIsSearchOpen(false);
            }
          }}
        />
        
        {isSearchOpen && (
          <div className="absolute top-full mt-2 w-full rounded-2xl border border-white/10 bg-slate-900/95 backdrop-blur-xl shadow-2xl overflow-hidden z-50 animate-scaleIn">
             {isSearching ? (
               <div className="p-4 text-center text-slate-400 text-sm">Searching...</div>
             ) : searchResults.length > 0 ? (
               <div className="max-h-80 overflow-y-auto">
                 {searchResults.map((item, index) => (
                   <div 
                     key={`${item.type}-${item.id}`} 
                     className={`px-4 py-3 cursor-pointer border-b border-white/5 last:border-0 transition-colors ${searchSelectedIndex === index ? 'bg-white/10' : 'hover:bg-white/5'}`}
                     onClick={() => {
                        setIsSearchOpen(false);
                        setSearchQuery("");
                        navigate(`/board/${item.boardId}`);
                     }}
                   >
                     {item.type === 'board' ? (
                       <p className="text-sm font-semibold text-white truncate flex items-center">
                         <span className="text-indigo-400 mr-2 text-[10px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded bg-indigo-500/10 shrink-0">Board</span>
                         {item.title}
                       </p>
                     ) : (
                       <div>
                         <p className="text-sm font-semibold text-white truncate flex items-center">
                           <span className="text-emerald-400 mr-2 text-[10px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 shrink-0">Card</span>
                           {item.title}
                         </p>
                         <p className="text-xs text-slate-400 mt-1 truncate">in {item.boardName} • {item.listName}</p>
                       </div>
                     )}
                   </div>
                 ))}
               </div>
             ) : (
               <div className="p-4 text-center text-slate-400 text-sm">No results found for "{searchQuery}"</div>
             )}
          </div>
        )}
      </div>

      <div className="flex items-center justify-end gap-3">
        {/* Share Button & Dropdown */}
        {page === "viewBoard" && user.role === "admin" && ( <div className="relative hidden sm:block" ref={shareRef}>
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
                        <div className="flex-1 relative">
                          <input 
                            className="w-full bg-[#22272b] border border-slate-600 rounded-[3px] px-3 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
                            placeholder="Username"
                            value={shareSearchQuery}
                            onChange={(e) => setShareSearchQuery(e.target.value)}
                            autoFocus 
                          />
                          {userSuggestions.length > 0 && (
                            <div className="absolute top-full left-0 w-full mt-1 bg-[#282e33] border border-slate-700 rounded shadow-xl z-50 overflow-hidden">
                              {userSuggestions.map(u => (
                                <button 
                                  key={u.id}
                                  className="w-full text-left px-3 py-2 text-sm text-white hover:bg-slate-700 transition-colors flex items-center justify-between"
                                  onClick={() => handleAddMember(u)}
                                >
                                  <span>{u.username}</span>
                                  <span className="text-[10px] text-slate-400 capitalize">{u.role}</span>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                            <button 
                              className="flex items-center gap-2 bg-[#22272b] border border-slate-600 rounded-[3px] px-3 py-2 text-sm text-white hover:bg-slate-700 hover:border-slate-500 transition-all capitalize"
                              onClick={() => setShowRoleDropdown(showRoleDropdown === 'new' ? null : 'new')}
                            >
                              <span className="font-medium">{selectedRole}</span>
                              <FaChevronDown className={`h-3 w-3 text-slate-400 transition-transform ${showRoleDropdown === 'new' ? 'rotate-180' : ''}`}/>
                            </button>
                            {showRoleDropdown === 'new' && (
                              <div className="absolute top-full right-0 mt-1 bg-[#282e33] border border-slate-700 rounded-md shadow-[0_8px_30px_rgb(0,0,0,0.5)] z-[60] overflow-hidden w-40 animate-scaleIn origin-top-right">
                                <div className="p-1.5">
                                  <p className="px-2 py-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Select role</p>
                                  {BOARD_ROLES.map(r => (
                                    <button 
                                      key={r}
                                      className={`w-full text-left px-2.5 py-2 text-sm rounded transition-colors capitalize ${selectedRole === r ? 'bg-blue-500/10 text-blue-400 font-medium' : 'text-slate-200 hover:bg-white/5'}`}
                                      onClick={() => {
                                        setSelectedRole(r);
                                        setShowRoleDropdown(null);
                                      }}
                                    >
                                      {r}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}
                        {isSearchingUsers && (
                          <div className="flex items-center px-2">
                             <div className="h-4 w-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                          </div>
                        )}
                    </div>

                    {/* Link Share */}
                    {/* <div className="flex items-center gap-4 mb-6">
                        <div className="p-2 bg-slate-700/50 rounded-[3px]"> 
                          <FaLink className="text-slate-400 h-4 w-4"/> 
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <p className="text-sm text-white">Share this board with a link</p>
                            </div>
                            <button className="text-sm text-blue-400 hover:underline">Create link</button>
                        </div>
                    </div> */}

                    {/* Tabs */}
                    <div className="flex gap-6 border-b border-slate-700/50 mb-4">
                        <div className="text-sm text-blue-400 font-semibold border-b-2 border-blue-400 pb-2 flex items-center gap-2">
                          Board members 
                          <span className="bg-blue-400/10 text-blue-400 rounded-full px-2 py-0.5 text-[10px] font-bold">
                            {memList.length}
                          </span>
                        </div>
                    </div>

                    {/* Member List */}
                    <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar pr-1">
                      {memList.map(member => (
                        <div key={member.id} className="flex items-center justify-between py-2 border-b border-slate-700 last:border-0 group/mem">
                            <div className="flex items-center gap-3">
                                 <div className="h-9 w-9 rounded-full bg-indigo-600 flex items-center justify-center text-sm font-bold text-white shadow">
                                   {member.user.username.slice(0, 2).toUpperCase()}
                                 </div>
                                 <div>
                                    <p className="text-sm font-bold text-white flex items-center gap-1.5">
                                      {member.user.username} 
                                      {member.userId === user.id && <span className="text-[10px] bg-slate-700 text-slate-300 px-1.5 py-0.5 rounded uppercase font-bold tracking-tighter">You</span>}
                                    </p>
                                    <p className="text-[11px] text-slate-400 font-medium">{member.user.role === 'admin' ? 'Global Admin' : 'Member'}</p>
                                 </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {member.userId !== user.id && (
                                <button
                                  onClick={() => handleRemoveMember(member.id)}
                                  className="p-1.5 text-slate-500 hover:text-rose-400 opacity-0 group-hover/mem:opacity-100 transition-all cursor-pointer rounded-md hover:bg-rose-500/10"
                                  title="Remove from board"
                                >
                                  <FaTimes className="h-3.5 w-3.5"/>
                                </button>
                              )}
                              <div className="relative">
                                  <button 
                                    className="flex items-center gap-2 bg-transparent hover:bg-white/5 rounded-[3px] px-2.5 py-1.5 text-xs text-slate-300 transition-all capitalize min-w-[90px] justify-between border border-transparent hover:border-slate-700"
                                    onClick={() => setShowRoleDropdown(showRoleDropdown === member.id ? null : member.id)}
                                  >
                                    <span className="font-medium">{member.role}</span>
                                    <FaChevronDown className={`h-2.5 w-2.5 text-slate-500 transition-transform ${showRoleDropdown === member.id ? 'rotate-180' : ''}`}/>
                                  </button>
                                  {showRoleDropdown === member.id && (
                                    <div className="absolute top-full right-0 mt-1 bg-[#282e33] border border-slate-700 rounded-md shadow-[0_8px_30px_rgb(0,0,0,0.6)] z-[100] overflow-hidden w-40 origin-top-right animate-scaleIn">
                                      <div className="p-1.5">
                                        <p className="px-2 py-1 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Board Role</p>
                                        {BOARD_ROLES.map(r => (
                                          <button 
                                            key={r}
                                            className={`w-full text-left px-2.5 py-2 text-sm rounded transition-colors capitalize ${member.role === r ? 'bg-blue-500/10 text-blue-400 font-medium' : 'text-slate-200 hover:bg-white/5'}`}
                                            onClick={() => handleUpdateRole(member.id, r)}
                                          >
                                            {r}
                                          </button>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                              </div>
                            </div>
                        </div>
                      ))}
                    </div>
                </div>
             </div>
          )}
        </div>)}
         

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
              <span className="text-xs font-bold bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text text-transparent">{(user?.username ?? "??").slice(0, 2).toUpperCase()}</span>
            </Button>

            {isAccountOpen && (
              <div className="absolute right-0 mt-3 w-72 rounded-2xl border border-white/10 bg-slate-900/95 backdrop-blur-xl shadow-2xl p-0 overflow-hidden animate-scaleIn z-50">
                {/* Account Info */}
                <div className="p-4 border-b border-white/5">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Account</p>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-emerald-500 flex items-center justify-center text-sm font-bold text-white shadow-lg">
                      {(user?.username ?? "??").slice(0, 2).toUpperCase()}
                    </div>
                    <div className="flex flex-col">
                      <p className="text-sm font-bold text-white">{user?.username}</p>
                      <p className="text-[11px] text-slate-400 truncate">{user?.role}</p>
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
