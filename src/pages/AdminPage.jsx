import { useState } from "react";
import { Fade as Hamburger } from "hamburger-react";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import {
  FaHome,
  FaSignOutAlt,
  FaUsers,
  FaCog,
  FaUserShield,
  FaStar,
  FaCheckCircle,
} from "react-icons/fa";
import Button from "../components/ui/Button";

const AdminPage = ({ onLogout, onNavigateHome }) => {
  const [activeTab, setActiveTab] = useState("users");
  const [collapsed, setCollapsed] = useState(true);
  const [users, setUsers] = useState([
    { id: 1, name: "Admin User", email: "admin@example.com", role: "Admin", status: "Active" },
    { id: 2, name: "Leader User", email: "leader@example.com", role: "Leader", status: "Active" },
    { id: 3, name: "John Doe", email: "john@example.com", role: "User", status: "Offline" },
    { id: 4, name: "Jane Smith", email: "jane@example.com", role: "User", status: "Active" },
    { id: 5, name: "Mike Johnson", email: "mike@example.com", role: "User", status: "Active" },
  ]);

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100 overflow-hidden">
      {/* ===== SIDEBAR ===== */}
      <Sidebar
        width={collapsed ? "60px" : "220px"}
        collapsed={collapsed}
        transitionDuration={300}
        backgroundColor="transparent"
        rootStyles={{
          borderRight: "1px solid rgba(255, 255, 255, 0.1)",
        }}
      >
        {/* Header */}
        <div className="flex h-20 items-center px-3 bg-slate-900/50 backdrop-blur-xl ">
          <Hamburger
            toggled={!collapsed}
            toggle={(open) => setCollapsed(!open)}
            size={20}
            color="#a5b4fc"
          />
          {!collapsed && (
            <div className="flex items-center">     
              <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                Admin Panel
              </h1>
            </div>
          )}
        </div>

        {/* Menu */}
        <div className="mt-4">
          <Menu
            menuItemStyles={{
              button: ({ active }) => ({
                backgroundColor: active ? "rgba(99, 102, 241, 0.1)" : "transparent",
                color: active ? "#a5b4fc" : "#94a3b8",
                borderRadius: "8px",
                margin: "4px 8px",
                padding: "12px 16px",
                transition: "all 0.2s",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.05)",
                  color: "#e0e7ff",
                },
              }),
            }}
          >

            <MenuItem icon={<FaHome />} onClick={onNavigateHome}>
              Go to Boards
            </MenuItem>
            <MenuItem
              icon={<FaSignOutAlt />}
              onClick={onLogout}
              style={{ color: "#f87171" }}
            >
              Log Out
            </MenuItem>
          </Menu>
        </div>
      </Sidebar>

      {/* ===== MAIN CONTENT ===== */}
      <main className="flex-1 overflow-auto">

        {/* Content */}
        <div className="p-8 space-y-8">
          {/* Stats Cards */}
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {/* Total Users */}
            <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900/50 to-slate-800/50 p-6 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-400">Total Users</p>
                  <p className="mt-2 text-3xl font-bold text-white">{users.length}</p>
                </div>
                <div className="rounded-xl bg-indigo-500/10 p-3">
                  <FaUsers className="h-6 w-6 text-indigo-400" />
                </div>
              </div>
            </div>

            {/* Active Now */}
            <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900/50 to-slate-800/50 p-6 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-400">Active Now</p>
                  <p className="mt-2 text-3xl font-bold text-white">
                    {users.filter((u) => u.status === "Active").length}
                  </p>
                </div>
                <div className="rounded-xl bg-emerald-500/10 p-3">
                  <FaCheckCircle className="h-6 w-6 text-emerald-400" />
                </div>
              </div>
            </div>

            {/* Admins */}
            <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900/50 to-slate-800/50 p-6 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-400">Admins</p>
                  <p className="mt-2 text-3xl font-bold text-white">
                    {users.filter((u) => u.role === "Admin").length}
                  </p>
                </div>
                <div className="rounded-xl bg-purple-500/10 p-3">
                  <FaUserShield className="h-6 w-6 text-purple-400" />
                </div>
              </div>
            </div>

            {/* Leaders */}
            <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900/50 to-slate-800/50 p-6 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-400">Leaders</p>
                  <p className="mt-2 text-3xl font-bold text-white">
                    {users.filter((u) => u.role === "Leader").length}
                  </p>
                </div>
                <div className="rounded-xl bg-amber-500/10 p-3">
                  <FaStar className="h-6 w-6 text-amber-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Users Table */}
          <div className="rounded-2xl border border-white/10 bg-slate-900/50 backdrop-blur-sm overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-white/5 text-xs uppercase tracking-wider text-slate-300 font-bold">
                  <tr>
                    <th className="px-6 py-4">User</th>
                    <th className="px-6 py-4">Role</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {users.map((user) => (
                    <tr key={user.id} className="group hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="relative shrink-0">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-sm font-bold text-white shadow-lg">
                              {user.name.charAt(0)}
                            </div>
                            {user.status === "Active" && (
                              <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-400 border-2 border-slate-900" />
                            )}
                          </div>
                          <div>
                            <div className="font-semibold text-white">{user.name}</div>
                            <div className="text-xs text-slate-400">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                            user.role === "Admin"
                              ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                              : user.role === "Leader"
                              ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                              : "bg-slate-500/20 text-slate-300 border border-slate-500/30"
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-2 text-xs font-medium ${
                            user.status === "Active" ? "text-emerald-400" : "text-slate-500"
                          }`}
                        >
                          <span
                            className={`h-2 w-2 rounded-full ${
                              user.status === "Active"
                                ? "bg-emerald-400 animate-pulse"
                                : "bg-slate-500"
                            }`}
                          />
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button className="rounded-lg px-3 py-1.5 text-xs font-medium text-slate-400 hover:bg-white/10 hover:text-white transition-all">
                            Edit
                          </button>
                          <button className="rounded-lg px-3 py-1.5 text-xs font-medium text-rose-400 hover:bg-rose-500/10 transition-all">
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminPage;
