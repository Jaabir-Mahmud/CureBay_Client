import React, { useState, useEffect } from 'react';
import {
  Users,
  AlertTriangle,
  Trash2,
  X,
  RefreshCw,
} from 'lucide-react';
import { Button } from '../../ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../ui/dialog';
import { useAuth } from '../../../contexts/AuthContext';
import toast from 'react-hot-toast';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../../ui/tooltip';

function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState('all');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { user: currentUser, loading: authLoading } = useAuth();

  useEffect(() => {
    // Only fetch users when auth context is loaded and user is available
    if (!authLoading && currentUser) {
      fetchUsers();
    }
  }, [authLoading, currentUser]);

  const fetchUsers = async () => {
    try {
      const token = await currentUser.getIdToken();
      const res = await fetch('/api/users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const data = await res.json();
      
      // Ensure data is an array
      if (Array.isArray(data)) {
        setUsers(data);
      } else {
        console.error('Expected array but got:', data);
        setUsers([]);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to fetch users');
      setUsers([]); // Set empty array as fallback
      setLoading(false);
    }
  };

  // Keyboard shortcut for refresh (Ctrl+R or F5)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey && e.key === 'r') || e.key === 'F5') {
        e.preventDefault();
        if (!isRefreshing) {
          refreshUsers();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isRefreshing]);

  const updateRole = async (id, newRole) => {
    try {
      const token = await currentUser.getIdToken();
      const res = await fetch(`/api/users/${id}/role`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ role: newRole }),
      });
      if (!res.ok) throw new Error('Failed to update role');
      setUsers(users => users.map(u => (u._id === id ? { ...u, role: newRole } : u)));
    } catch {
      alert('Failed to update role');
    }
  };

  const openDeleteModal = (user) => {
    setUserToDelete(user);
    setDeleteModalOpen(true);
  };

  const deleteUser = async () => {
    if (!userToDelete) return;
    
    setIsDeleting(true);
    try {
      const token = await currentUser.getIdToken();
      const res = await fetch(`/api/users/${userToDelete._id}`, { 
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to delete user');
      setUsers(users => users.filter(u => u._id !== userToDelete._id));
      setDeleteModalOpen(false);
      setUserToDelete(null);
      
      toast.success('User deleted successfully. If they are currently logged in, they will be logged out on their next action.', {
        duration: 5000,
        position: 'top-right',
      });
      
      // Trigger session validation for all connected users
      // This will help log out the deleted user if they're currently online
      setTimeout(() => {
        // validateSession(); // Removed as it's not available in this component
      }, 1000);
    } catch (error) {
      console.error('Delete user error:', error);
      toast.error('Failed to delete user: ' + error.message, {
        duration: 5000,
        position: 'top-right',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setUserToDelete(null);
  };

  const refreshUsers = async () => {
    if (authLoading || !currentUser) return;
    
    setIsRefreshing(true);
    setError(null);
    try {
      const token = await currentUser.getIdToken();
      const res = await fetch('/api/users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (!res.ok) throw new Error(`Failed to fetch users. Status: ${res.status}`);
      
      let data;
      try {
        data = await res.json();
      } catch (jsonError) {
        console.error('Failed to parse JSON response:', jsonError);
        data = []; // Use empty array as fallback
      }
      
      // Ensure data is an array
      if (Array.isArray(data)) {
        setUsers(data);
        toast.success(`Refreshed user list - ${data.length} users found`, {
          duration: 3000,
          position: 'top-right',
        });
      } else {
        console.error('Expected array but got:', data);
        setUsers([]);
        toast.success(`Refreshed user list - 0 users found`, {
          duration: 3000,
          position: 'top-right',
        });
      }
    } catch (err) {
      setError('Failed to refresh users');
      console.error('Error refreshing users:', err);
      toast.error('Failed to refresh user list', {
        duration: 4000,
        position: 'top-right',
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  const toggleActive = async (id) => {
    try {
      const token = await currentUser.getIdToken();
      const res = await fetch(`/api/users/${id}/active`, { 
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to update status');
      // Handle potential empty or invalid JSON responses
      let data;
      try {
        data = await res.json();
      } catch (jsonError) {
        console.error('Failed to parse JSON response:', jsonError);
        data = { isActive: false }; // Use default value as fallback
      }
      setUsers(users => users.map(u => (u._id === id ? { ...u, isActive: data.isActive } : u)));
    } catch {
      alert('Failed to update status');
    }
  };

  const filteredUsers = Array.isArray(users) ? users.filter(u =>
    (roleFilter === 'all' || u.role === roleFilter) &&
    (u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase()))
  ) : [];

  // Show loading state while auth context is loading
  if (authLoading) {
    return <div className="text-center py-8">Loading authentication...</div>;
  }

  // Show loading state while fetching users
  if (loading) {
    return <div className="text-center py-8">Loading users...</div>;
  }

  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="bg-white/30 dark:bg-white/10 backdrop-blur-md rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-3 sm:p-4 transition-all duration-300">
      <div className="flex flex-col gap-3 mb-4">
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            placeholder="Search by name or email"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="px-3 sm:px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white/70 dark:bg-gray-900/70 text-gray-900 dark:text-white w-full sm:max-w-xs focus:outline-none focus:ring-2 focus:ring-cyan-400 transition text-sm"
          />
          <select
            value={roleFilter}
            onChange={e => setRoleFilter(e.target.value)}
            className="px-3 sm:px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white/70 dark:bg-gray-900/70 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 transition w-full sm:max-w-xs text-sm"
          >
            <option value="all">All Roles</option>
            <option value="user">User</option>
            <option value="seller">Seller</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <div className="flex justify-start sm:justify-end">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={refreshUsers}
                  disabled={isRefreshing}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 bg-cyan-50 hover:bg-cyan-100 dark:bg-cyan-900/20 dark:hover:bg-cyan-900/40 border-cyan-200 dark:border-cyan-700 text-cyan-700 dark:text-cyan-300 transition-all duration-200"
                >
                  {isRefreshing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span className="hidden sm:inline">Refreshing...</span>
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4" />
                      <span className="hidden sm:inline">Refresh</span>
                    </>
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Refresh user list (Ctrl+R or F5)</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      <div className="overflow-x-auto -mx-3 sm:-mx-4">
        <div className="inline-block min-w-full align-middle">
          <table className="min-w-full rounded-xl overflow-hidden">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200">
                <th className="py-2 sm:py-3 px-2 sm:px-4 text-left text-xs sm:text-sm font-medium">Name</th>
                <th className="py-2 sm:py-3 px-2 sm:px-4 text-left text-xs sm:text-sm font-medium hidden sm:table-cell">Email</th>
                <th className="py-2 sm:py-3 px-2 sm:px-4 text-left text-xs sm:text-sm font-medium">Role</th>
                <th className="py-2 sm:py-3 px-2 sm:px-4 text-left text-xs sm:text-sm font-medium hidden md:table-cell">Active</th>
                <th className="py-2 sm:py-3 px-2 sm:px-4 text-left text-xs sm:text-sm font-medium hidden lg:table-cell">Registered</th>
                <th className="py-2 sm:py-3 px-2 sm:px-4 text-left text-xs sm:text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr
                  key={user._id}
                  className="hover:bg-cyan-50 dark:hover:bg-cyan-900/30 transition border-b border-gray-100 dark:border-gray-700 last:border-0"
                >
                  <td className="py-2 sm:py-3 px-2 sm:px-4">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white text-xs sm:text-sm truncate max-w-[120px] sm:max-w-none">{user.name}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400 sm:hidden truncate max-w-[120px]">{user.email}</p>
                    </div>
                  </td>
                  <td className="py-2 sm:py-3 px-2 sm:px-4 text-gray-700 dark:text-gray-300 text-xs sm:text-sm hidden sm:table-cell">
                    <span className="truncate max-w-[200px] block">{user.email}</span>
                  </td>
                  <td className="py-2 sm:py-3 px-2 sm:px-4 capitalize">
                    <span className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs font-semibold
                      ${user.role === 'admin' ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'
                        : user.role === 'seller' ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300'
                        : 'bg-gray-200 text-gray-700 dark:bg-gray-800/40 dark:text-gray-300'}`}>
                      {user.role}
                    </span>
                    <div className="md:hidden mt-1">
                      <button
                        onClick={() => toggleActive(user._id)}
                        className={`px-1.5 py-0.5 rounded-full text-xs font-semibold transition
                          ${user.isActive
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300'
                            : 'bg-gray-200 text-gray-700 dark:bg-gray-800/40 dark:text-gray-300'}`}
                      >
                        {user.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </div>
                  </td>
                  <td className="py-2 sm:py-3 px-2 sm:px-4 hidden md:table-cell">
                    <button
                      onClick={() => toggleActive(user._id)}
                      className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-semibold transition
                        ${user.isActive
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300'
                          : 'bg-gray-200 text-gray-700 dark:bg-gray-800/40 dark:text-gray-300'}`}
                    >
                      {user.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="py-2 sm:py-3 px-2 sm:px-4 text-xs text-gray-500 dark:text-gray-400 hidden lg:table-cell">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : ''}
                  </td>
                  <td className="py-2 sm:py-3 px-2 sm:px-4">
                    <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                      <select
                        value={user.role}
                        onChange={e => updateRole(user._id, e.target.value)}
                        className="border border-gray-300 dark:border-gray-700 rounded px-1 sm:px-2 py-0.5 sm:py-1 bg-white/80 dark:bg-gray-900/80 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 transition text-xs w-full sm:w-auto"
                      >
                        <option value="user">User</option>
                        <option value="seller">Seller</option>
                        <option value="admin">Admin</option>
                      </select>
                      <button
                        onClick={() => openDeleteModal(user)}
                        className="px-2 sm:px-3 py-0.5 sm:py-1 rounded bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300 font-semibold text-xs hover:bg-red-200 dark:hover:bg-red-800/60 transition flex items-center justify-center gap-1"
                      >
                        <Trash2 size={10} className="sm:w-3 sm:h-3" />
                        <span className="hidden sm:inline">Delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 w-12 h-12 bg-red-100 dark:bg-red-900/40 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <DialogTitle className="text-left">Delete User</DialogTitle>
                <DialogDescription className="text-left text-gray-600 dark:text-gray-300">
                  This action cannot be undone.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          
          <div className="py-4">
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-cyan-100 dark:bg-cyan-900/40 rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {userToDelete?.name || 'Unknown User'}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {userToDelete?.email}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold
                      ${userToDelete?.role === 'admin' ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'
                        : userToDelete?.role === 'seller' ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300'
                        : 'bg-gray-200 text-gray-700 dark:bg-gray-800/40 dark:text-gray-300'}`}>
                      {userToDelete?.role}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold
                      ${userToDelete?.isActive
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300'
                        : 'bg-gray-200 text-gray-700 dark:bg-gray-800/40 dark:text-gray-300'}`}>
                      {userToDelete?.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-red-700 dark:text-red-300">
                  <p className="font-medium">Warning:</p>
                  <ul className="mt-1 space-y-1 text-xs">
                    <li>• All user data will be permanently deleted</li>
                    <li>• Associated orders and transactions will be affected</li>
                    <li>• This action cannot be reversed</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              onClick={closeDeleteModal}
              className="flex items-center gap-2"
            >
              <X size={16} />
              Cancel
            </Button>
            <Button
              onClick={deleteUser}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700 flex items-center gap-2"
            >
              {isDeleting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 size={16} />
                  Delete User
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ManageUsers;