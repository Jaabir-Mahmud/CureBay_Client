import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Package, 
  DollarSign, 
  TrendingUp, 
  Settings, 
  BarChart3,
  UserCheck,
  ShoppingBag,
  CreditCard,
  FileText,
  Megaphone
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import Lottie from 'lottie-react';
import moneyAnim from '../../../assets/money.json';
import usersAnim from '../../../assets/users.json';
import packageAnim from '../../../assets/package.json';
import ordersAnim from '../../../assets/orders.json';

function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch('/api/users')
      .then(res => res.json())
      .then(data => {
        setUsers(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to fetch users');
        setLoading(false);
      });
  }, []);

  const updateRole = async (id, newRole) => {
    try {
      const res = await fetch(`/api/users/${id}/role`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      });
      if (!res.ok) throw new Error('Failed to update role');
      setUsers(users => users.map(u => (u._id === id ? { ...u, role: newRole } : u)));
    } catch {
      alert('Failed to update role');
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      const res = await fetch(`/api/users/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete user');
      setUsers(users => users.filter(u => u._id !== id));
    } catch {
      alert('Failed to delete user');
    }
  };

  const toggleActive = async (id) => {
    try {
      const res = await fetch(`/api/users/${id}/active`, { method: 'PATCH' });
      if (!res.ok) throw new Error('Failed to update status');
      const data = await res.json();
      setUsers(users => users.map(u => (u._id === id ? { ...u, isActive: data.isActive } : u)));
    } catch {
      alert('Failed to update status');
    }
  };

  const filteredUsers = users.filter(u =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div>Loading users...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div>
      <input
        type="text"
        placeholder="Search by name or email"
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="mb-2 px-3 py-1 border rounded w-full max-w-xs"
      />
      <div className="overflow-x-auto">
        <table className="min-w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border">Name</th>
              <th className="py-2 px-4 border">Email</th>
              <th className="py-2 px-4 border">Role</th>
              <th className="py-2 px-4 border">Active</th>
              <th className="py-2 px-4 border">Registered</th>
              <th className="py-2 px-4 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user._id}>
                <td className="py-2 px-4 border">{user.name}</td>
                <td className="py-2 px-4 border">{user.email}</td>
                <td className="py-2 px-4 border capitalize">{user.role}</td>
                <td className="py-2 px-4 border">
                  <button
                    onClick={() => toggleActive(user._id)}
                    className={`px-2 py-1 rounded ${user.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'}`}
                  >
                    {user.isActive ? 'Active' : 'Inactive'}
                  </button>
                </td>
                <td className="py-2 px-4 border text-xs">{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : ''}</td>
                <td className="py-2 px-4 border">
                  <select
                    value={user.role}
                    onChange={e => updateRole(user._id, e.target.value)}
                    className="border rounded px-2 py-1 mr-2"
                  >
                    <option value="user">User</option>
                    <option value="seller">Seller</option>
                    <option value="admin">Admin</option>
                  </select>
                  <button
                    onClick={() => deleteUser(user._id)}
                    className="ml-2 px-2 py-1 bg-red-100 text-red-700 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [recentUsers, setRecentUsers] = useState([]);
  const [pendingPayments, setPendingPayments] = useState([]);

  useEffect(() => {
    fetch('/api/admin/overview')
      .then(res => res.json())
      .then(data => setStats(data));
    fetch('/api/admin/recent-users')
      .then(res => res.json())
      .then(data => setRecentUsers(data));
    fetch('/api/admin/pending-payments')
      .then(res => res.json())
      .then(data => setPendingPayments(data));
  }, []);

  useEffect(() => {
    const setCardColors = () => {
      if (document.documentElement.classList.contains('dark')) {
        document.documentElement.style.setProperty('--card-1', '#23272f');
        document.documentElement.style.setProperty('--card-2', '#2d323c');
        document.documentElement.style.setProperty('--card-3', '#31363f');
        document.documentElement.style.setProperty('--card-4', '#22343c');
        document.documentElement.style.setProperty('--card-5', '#1e3a34');
        document.documentElement.style.setProperty('--card-6', '#1e293b');
        document.documentElement.style.setProperty('--card-7', '#22343c');
      } else {
        document.documentElement.style.setProperty('--card-1', '#fc9f5b');
        document.documentElement.style.setProperty('--card-2', '#FBD1A2');
        document.documentElement.style.setProperty('--card-3', '#ECE4B7');
        document.documentElement.style.setProperty('--card-4', '#7DCFB6');
        document.documentElement.style.setProperty('--card-5', '#33CA7F');
        document.documentElement.style.setProperty('--card-6', '#33A1FD');
        document.documentElement.style.setProperty('--card-7', '#61E8E1');
      }
    };

    setCardColors();

    // Watch for class changes on <html>
    const observer = new MutationObserver(setCardColors);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    // Also listen for storage events in case dark mode is toggled in another tab
    window.addEventListener('storage', setCardColors);

    return () => {
      observer.disconnect();
      window.removeEventListener('storage', setCardColors);
    };
  }, []);

  const acceptPayment = async (orderId) => {
    try {
      const res = await fetch(`/api/admin/accept-payment/${orderId}`, { method: 'PATCH' });
      if (!res.ok) throw new Error('Failed to accept payment');
      setPendingPayments(payments => payments.filter(p => p.id !== orderId));
      // Optionally, refetch stats to update paid/pending totals
      fetch('/api/admin/overview')
        .then(res => res.json())
        .then(data => setStats(data));
    } catch {
      alert('Failed to accept payment');
    }
  };

  if (!stats) return <div>Loading dashboard...</div>;

  const categories = [
    { id: 1, name: 'Tablets', count: 2450, image: 'tablet-icon.png' },
    { id: 2, name: 'Syrups', count: 1280, image: 'syrup-icon.png' },
    { id: 3, name: 'Capsules', count: 1890, image: 'capsule-icon.png' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-300">Manage your CureBay platform</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="banners">Banners</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="rounded-xl shadow-lg transition-colors duration-300 bg-[var(--card-1)] dark:bg-[var(--card-1)] border border-gray-200 dark:border-gray-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-900 dark:text-white">Total Revenue</CardTitle>
                  <Lottie animationData={moneyAnim} loop={true} style={{ height: 60, width: 60 }} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">${stats.totalRevenue?.toLocaleString()}</div>
                  <p className="text-xs text-gray-700 dark:text-gray-300">
                    {stats.revenueGrowth >= 0 ? '+' : ''}{stats.revenueGrowth}% from last month
                  </p>
                </CardContent>
              </Card>
              <Card className="rounded-xl shadow-lg transition-colors duration-300 bg-[var(--card-2)] dark:bg-[var(--card-2)] border border-gray-200 dark:border-gray-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-900 dark:text-white">Paid Total</CardTitle>
                  <Lottie animationData={moneyAnim} loop={true} style={{ height: 60, width: 60 }} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">${stats.paidTotal?.toLocaleString()}</div>
                  <p className="text-xs text-gray-700 dark:text-gray-300">
                    {stats.totalRevenue ? ((stats.paidTotal / stats.totalRevenue) * 100).toFixed(1) : 0}% of total revenue
                  </p>
                </CardContent>
              </Card>
              <Card className="rounded-xl shadow-lg transition-colors duration-300 bg-[var(--card-3)] dark:bg-[var(--card-3)] border border-gray-200 dark:border-gray-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-900 dark:text-white">Pending Total</CardTitle>
                  <Lottie animationData={moneyAnim} loop={true} style={{ height: 60, width: 60 }} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">${stats.pendingTotal?.toLocaleString()}</div>
                  <p className="text-xs text-gray-700 dark:text-gray-300">
                    {stats.totalRevenue ? ((stats.pendingTotal / stats.totalRevenue) * 100).toFixed(1) : 0}% of total revenue
                  </p>
                </CardContent>
              </Card>
              <Card className="rounded-xl shadow-lg transition-colors duration-300 bg-[var(--card-4)] dark:bg-[var(--card-4)] border border-gray-200 dark:border-gray-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-900 dark:text-white">Total Users</CardTitle>
                  <Lottie animationData={usersAnim} loop={true} style={{ height: 60, width: 60 }} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalUsers?.toLocaleString()}</div>
                  <p className="text-xs text-gray-700 dark:text-gray-300">
                    {stats.userGrowth >= 0 ? '+' : ''}{stats.userGrowth}% from last month
                  </p>
                </CardContent>
              </Card>
              <Card className="rounded-xl shadow-lg transition-colors duration-300 bg-[var(--card-5)] dark:bg-[var(--card-5)] border border-gray-200 dark:border-gray-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-900 dark:text-white">Total Sellers</CardTitle>
                  <Lottie animationData={usersAnim} loop={true} style={{ height: 60, width: 60 }} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalSellers?.toLocaleString()}</div>
                </CardContent>
              </Card>
              <Card className="rounded-xl shadow-lg transition-colors duration-300 bg-[var(--card-6)] dark:bg-[var(--card-6)] border border-gray-200 dark:border-gray-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-900 dark:text-white">Total Medicines</CardTitle>
                  <Lottie animationData={packageAnim} loop={true} style={{ height: 60, width: 60 }} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalMedicines?.toLocaleString()}</div>
                </CardContent>
              </Card>
              <Card className="rounded-xl shadow-lg transition-colors duration-300 bg-[var(--card-7)] dark:bg-[var(--card-7)] border border-gray-200 dark:border-gray-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-900 dark:text-white">Total Orders</CardTitle>
                  <Lottie animationData={ordersAnim} loop={true} style={{ height: 60, width: 60 }} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalOrders?.toLocaleString()}</div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentUsers.map((user) => (
                      <div key={user._id} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-gray-600">{user.email}</p>
                          <p className="text-xs text-gray-400">{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : ''}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant={user.role === 'seller' ? 'default' : user.role === 'admin' ? 'destructive' : 'secondary'}>
                            {user.role}
                          </Badge>
                          <Badge variant={user.isActive ? 'default' : 'secondary'}>
                            {user.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Pending Payments</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {pendingPayments.length === 0 && <div className="text-gray-400">No pending payments.</div>}
                    {pendingPayments.map((payment) => (
                      <div key={payment.id} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Order #{payment.id}</p>
                          <p className="text-sm text-gray-600">{payment.customer} ({payment.email})</p>
                          <p className="text-xs text-gray-400">{payment.date ? new Date(payment.date).toLocaleDateString() : ''}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">${payment.amount}</p>
                          <Button size="sm" className="mt-1" onClick={() => acceptPayment(payment.id)}>
                            Accept
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>Manage Users</CardTitle>
              </CardHeader>
              <CardContent>
                <ManageUsers />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Categories Tab */}
          <TabsContent value="categories">
            <Card>
              <CardHeader>
                <CardTitle>Manage Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Medicine Categories</h3>
                    <Button>Add Category</Button>
                  </div>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categories.map((category) => (
                      <div key={category.id} className="border rounded-lg p-4">
                        <h4 className="font-semibold">{category.name}</h4>
                        <p className="text-sm text-gray-600">{category.count} medicines</p>
                        <div className="flex space-x-2 mt-2">
                          <Button size="sm" variant="outline">Edit</Button>
                          <Button size="sm" variant="outline" className="text-red-600">Delete</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payments Tab */}
          <TabsContent value="payments">
            <Card>
              <CardHeader>
                <CardTitle>Payment Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-gray-600">
                    <p>Manage all payment transactions:</p>
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      <li>View pending and paid transactions</li>
                      <li>Accept or reject pending payments</li>
                      <li>Generate payment reports</li>
                      <li>Handle refunds and disputes</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports">
            <Card>
              <CardHeader>
                <CardTitle>Sales Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-gray-600">
                    <p>Generate comprehensive sales reports:</p>
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      <li>Filter reports by date range</li>
                      <li>Export in PDF, DOC, CSV, or XLSX format</li>
                      <li>View medicine-wise sales data</li>
                      <li>Seller and buyer analytics</li>
                    </ul>
                  </div>
                  <div className="flex space-x-2">
                    <Button>Generate Report</Button>
                    <Button variant="outline">Export Data</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Banners Tab */}
          <TabsContent value="banners">
            <Card>
              <CardHeader>
                <CardTitle>Manage Banner Advertisements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-gray-600">
                    <p>Control homepage slider advertisements:</p>
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      <li>View all advertised medicines</li>
                      <li>Toggle medicines on/off the slider</li>
                      <li>Manage seller advertisement requests</li>
                      <li>Set advertisement priorities</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;

