import { useEffect, useState } from "react";
import { Fade as Hamburger } from "hamburger-react";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import { getUsers, registerUser, updateUserRole, deleteUser } from "../utils/data";
import { ClipLoader } from "react-spinners";


import {
  FaHome,
  FaSignOutAlt,
  FaUsers,
  FaUserShield,
  FaStar,
  FaCheckCircle,
} from "react-icons/fa";
import Button from "../components/ui/Button";

const AdminPage = ({ onLogout, onNavigateHome }) => {
  const [collapsed, setCollapsed] = useState(true);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    const fetchUser = async()=>{
      try{
        setLoading(true);
        const data = await getUsers();
        setUsers(data);
      }catch(e){
        console.error("Error fetching users:", e);
      }finally{
        setLoading(false);
      }
    }
    fetchUser();
  },[])
  
  // Unified User Form Modal state
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [editingUser, setEditingUser] = useState(null);
 const [formData, setFormData] = useState({
    username: "",
    role: "user",
    password: "",
});



   // Delete confirmation modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  useEffect(()=>{
    const handleKeyDown = (e)=>{
      if(e.key === "Escape"){
      setIsDeleteModalOpen(false);
      setIsUserModalOpen(false);
      }
    } 
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  },[isUserModalOpen,isDeleteModalOpen])
  // Handle opening modal for adding new user
  const handleOpenAddModal = () => {
    setModalMode('add');
    setEditingUser(null);
    setFormData({ username: "", role: "user", password: "" });
    setIsUserModalOpen(true);
  };

  // Handle opening modal for editing user
  const handleEditUser = (user) => {
    setModalMode('edit');
    setEditingUser(user);
    setFormData({
      username: user.username,
      role: user.role,
      password: "",
    });
    setIsUserModalOpen(true);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        if (modalMode === 'edit') {
            // Update role via API
            await updateUserRole(editingUser.id, formData.role);
        } else {
            // Register new user via API
            await registerUser(formData.username, formData.password, formData.role);
        }
        // Refresh user list from API
        const data = await getUsers();
        setUsers(data);
    } catch (err) {
        console.error("Failed to save user:", err);
        alert(err.response?.data?.error || "Operation failed");
    }

    // Close modal and reset form
    setIsUserModalOpen(false);
    setEditingUser(null);
    setFormData({ username: "", role: "user", password: "" });
};


  // Handle closing modal
  const handleCloseModal = () => {
    setIsUserModalOpen(false);
    setEditingUser(null);
    setFormData({ username: "", role: "user", password: "" });
  };

  // Handle opening delete confirmation
  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  // Handle confirming delete
  const handleConfirmDelete = async () => {
    try {
        await deleteUser(userToDelete.id);
        const data = await getUsers();
        setUsers(data);
    } catch (err) {
        console.error("Failed to delete user:", err);
        alert(err.response?.data?.error || "Delete failed");
    }
    setIsDeleteModalOpen(false);
    setUserToDelete(null);
};


  // Handle canceling delete
  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setUserToDelete(null);
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100 overflow-hidden">
      {/* ===== SIDEBAR ===== */}
      <Sidebar
        collapsed={collapsed}
        transitionDuration={300}
        backgroundColor="transparent"
        rootStyles={{
          borderRight: "1px solid rgba(255, 255, 255, 0.1)",
        }}
      >
        {/* Header */}
        <div className="flex h-20 items-center gap-1 px-4 bg-slate-900/50 backdrop-blur-xl">
          <div className="flex-shrink-0">
            <Hamburger
              toggled={!collapsed}
              toggle={(open) => setCollapsed(!open)}
              size={20}
              color="#a5b4fc"
            />
          </div>
          {!collapsed && (
            <h1 className="text-xl font-bolder bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent whitespace-nowrap">
              Admin Panel
            </h1>
          )}
        </div>

        {/* Menu */}
        <div className="mt-4 px-2">
          <Menu
            menuItemStyles={{
              button: ({ active }) => ({
                backgroundColor: active ? "rgba(99, 102, 241, 0.1)" : "transparent",
                color: active ? "#a5b4fc" : "#94a3b8",
                borderRadius: "8px",
                margin: "4px 0",
                padding: "11px 12px 11px",
                transition: "all 0.2s",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.05)",
                  color: "#e0e7ff",
                },
              }),
            }}
          >
            <MenuItem className="text-lg"  icon={<FaHome />} onClick={onNavigateHome}>
              Go to Boards
            </MenuItem>
            <MenuItem
              className="text-lg"  
              icon={<FaSignOutAlt />}
              onClick={onLogout}
            >
              Log Out
            </MenuItem>
          </Menu>
        </div>
      </Sidebar>

      {/* ===== MAIN CONTENT ===== */}
      <main className="flex-1 overflow-auto">
        {/* Top Bar */}
        <div className="sticky top-0 z-30 h-20 backdrop-blur-xl flex items-center justify-between px-8">
          <div>
            <h2 className="text-xl font-bold text-white">User Management</h2>
          </div>

          <Button
            onClick={handleOpenAddModal}
            variant="none"
            className="py-2.5 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-lg shadow-lg shadow-indigo-500/20 transition-all hover:shadow-indigo-500/40 flex items-center gap-2"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add New User
          </Button>
        </div>

        {/* Content */}
        <div className="p-8 space-y-8">
          {/* Stats Cards */}
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {/* Total Users */}
            <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900/50 to-slate-800/50 p-6 backdrop-blur-sm shadow-xl hover:shadow-lg transition-all hover:scale-105 hover:border-indigo-500/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-400">Total Users</p>
                  <p className="mt-2 text-3xl font-bold text-white">{users.length}</p>
                  <p className="mt-1 text-xs text-emerald-400">↑ 12% from last month</p>
                </div>
                <div className="rounded-xl bg-indigo-500/10 p-3">
                  <FaUsers className="h-6 w-6 text-indigo-400" />
                </div>
              </div>
            </div>

            {/* Active Now */}
            <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900/50 to-slate-800/50 p-6 backdrop-blur-sm shadow-xl hover:shadow-lg  transition-all hover:scale-105 hover:border-emerald-500/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-400">Active Now</p>
                  <p className="mt-2 text-3xl font-bold text-white">
                    {users.filter((u) => u.status === "Active").length}
                  </p>
                  <p className="mt-1 text-xs text-emerald-400">Currently online</p>
                </div>
                <div className="rounded-xl bg-emerald-500/10 p-3">
                  <FaCheckCircle className="h-6 w-6 text-emerald-400" />
                </div>
              </div>
            </div>

            {/* Admins */}
            <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900/50 to-slate-800/50 p-6 backdrop-blur-sm shadow-xl hover:shadow-lg transition-all hover:scale-105 hover:border-purple-500/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-400">Admins</p>
                  <p className="mt-2 text-3xl font-bold text-white">
                    {users.filter((u) => u.role === "admin").length}
                  </p>
                  <p className="mt-1 text-xs text-slate-400">Full access</p>
                </div>
                <div className="rounded-xl bg-purple-500/10 p-3">
                  <FaUserShield className="h-6 w-6 text-purple-400" />
                </div>
              </div>
            </div>

            {/* Leaders */}
            <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900/50 to-slate-800/50 p-6 backdrop-blur-sm shadow-xl hover:shadow-lg transition-all hover:scale-105 hover:border-amber-500/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-400">Leaders</p>
                  <p className="mt-2 text-3xl font-bold text-white">
                    {users.filter((u) => u.role === "leader").length}
                  </p>
                  <p className="mt-1 text-xs text-slate-400">Team managers</p>
                </div>
                <div className="rounded-xl bg-amber-500/10 p-3">
                  <FaStar className="h-6 w-6 text-amber-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Users Table */}
          <div className="rounded-2xl border border-white/10 bg-slate-900/50 backdrop-blur-sm overflow-hidden shadow-2xl">
            {/* Table Header */}
            <div className="bg-white/5 px-6 py-4 border-b border-white/10">
              <h3 className="text-lg font-semibold text-white">All Users</h3>
            </div>

            <div className="overflow-x-auto">
              {loading ? (
              <div className="flex items-center justify-center py-16">
                <ClipLoader color="#818cf8" size={40} />
              </div>
              ):(
                <table className="w-full text-left text-sm">
                <thead className="bg-white/5 text-xs uppercase tracking-wider text-slate-300 font-bold">
                  <tr>
                    <th className="px-6 py-4">User</th>
                    <th className="px-6 py-4 m-auto">Role</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right pr-8">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {users.map((user) => (
                    <tr key={user.id} className="group hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="relative shrink-0">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-sm font-bold text-white shadow-lg">
                              {(user.username ?? "?").charAt(0)}
                            </div>
                            {user.status === "Active" && (
                              <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-400 border-2 border-slate-900" />
                            )}
                          </div>
                          <div>
                            <div className="font-semibold text-white">{user.username}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                            user.role === "admin"
                              ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                              : user.role === "leader"
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
                          <Button
                            variant="none" 
                            onClick={() => handleEditUser(user)}
                            className="rounded-lg px-3 py-1.5 text-xs font-medium text-slate-400 hover:bg-white/10 hover:text-white transition-all"
                          >
                            Edit
                          </Button>
                          <Button 
                            variant="none"
                            onClick={() => handleDeleteClick(user)}
                            className="rounded-lg px-3 py-1.5 text-xs font-medium text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-all"
                          >
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              )}
              
            </div>
          </div>
        </div>
      </main>

    {/* ===== ADD / EDIT USER MODAL ===== */}
    {isUserModalOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn">
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={handleCloseModal}
        />

        {/* Modal */}
        <div className="relative w-full max-w-md bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl border border-white/10 shadow-2xl overflow-hidden animate-scaleIn">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4 flex items-center justify-between">
            <h3 className="text-xl font-bold text-white">
              {modalMode === "edit" ? "Edit User" : "Add New User"}
            </h3>
            <Button
              variant="ghost"
              onClick={handleCloseModal}
              className="h-8 w-8 p-0 text-white/80 hover:text-white border-0 hover:bg-white/10"
            >
              ✕
            </Button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Name */}
            <div>
              <label className="block text-sm text-slate-300 mb-2">User Name</label>
              <input
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 bg-slate-800 border border-white/10 rounded-lg text-white"
              />
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm text-slate-300 mb-2">Role</label>
              <select className="w-full px-3 py-2 bg-slate-800 border border-white/10 rounded-lg text-white cursor-pointer" name="role" value={formData.role} onChange={handleInputChange}>
                <option value="user">User</option>
                <option value="leader">Leader</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm text-slate-300 mb-2">
                Password
                {modalMode === "edit" && (
                  <span className="text-xs text-slate-500 ml-2">
                    (optional)
                  </span>
                )}
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-slate-800 border border-white/10 rounded-lg text-white"
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="none"
                onClick={handleCloseModal}
                className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-2 rounded-lg transition-colors"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="none"
                className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white py-2 rounded-lg shadow-lg shadow-indigo-500/20 transition-all"
              >
                {modalMode === "edit" ? "Save Changes" : "Add User"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    )}
     

      {/* ===== DELETE CONFIRMATION MODAL ===== */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn">
          {/* Backdrop - No blur */}
          <div 
            className="absolute inset-0 bg-black/40"
            onClick={handleCancelDelete}
          />
          
          {/* Simple Confirmation Dialog */}
          <div className="relative bg-slate-900 rounded-lg border border-white/10 shadow-2xl p-6 max-w-sm w-full animate-scaleIn">
            <p className="text-white text-center mb-6">
              Are you sure you want to delete <span className="font-semibold text-rose-400">{userToDelete?.username}</span>?
            </p>
            
            {/* Yes/No Buttons */}
            <div className="flex gap-3 justify-center">
              <Button
                variant="none"
                onClick={handleCancelDelete}
                className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-all min-w-[80px]"
              >
                No
              </Button>
              <Button
                variant="none"
                onClick={handleConfirmDelete}
                className="px-6 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg font-medium transition-all min-w-[80px]"
              >
                Yes
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;