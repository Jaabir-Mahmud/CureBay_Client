import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Calendar, CreditCard, Package, Eye, Download, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { useAuth } from '../../../contexts/AuthContext';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const UserDashboard = () => {
  const { user, profile } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedPayment, setSelectedPayment] = useState(null);

  // Fetch user's payment history
  const { data: paymentsData, isLoading: paymentsLoading, error: paymentsError } = useQuery({
    queryKey: ['userPayments', user?.uid, statusFilter],
    queryFn: async () => {
      if (!user?.uid) return null;
      const response = await fetch(`/api/payments/user/${profile?.id || user.uid}?status=${statusFilter !== 'all' ? statusFilter : ''}`);
      if (!response.ok) throw new Error('Failed to fetch payments');
      return response.json();
    },
    enabled: !!user?.uid
  });

  // Fetch user's orders
  const { data: ordersData, isLoading: ordersLoading } = useQuery({
    queryKey: ['userOrders', user?.uid],
    queryFn: async () => {
      if (!user?.uid) return null;
      const response = await fetch(`/api/orders?userId=${profile?.id || user.uid}`);
      if (!response.ok) throw new Error('Failed to fetch orders');
      return response.json();
    },
    enabled: !!user?.uid
  });

  const payments = paymentsData?.payments || [];
  const orders = ordersData?.orders || [];

  // Filter payments based on search term
  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.transactionId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.amount?.toString().includes(searchTerm);
    return matchesSearch;
  });

  // Calculate statistics
  const totalSpent = payments
    .filter(p => p.status === 'succeeded')
    .reduce((sum, p) => sum + p.amount, 0);

  const pendingAmount = payments
    .filter(p => p.status === 'pending')
    .reduce((sum, p) => sum + p.amount, 0);

  const totalOrders = orders.length;

  const getStatusColor = (status) => {
    switch (status) {
      case 'succeeded':
      case 'paid':
        return 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300';
      case 'failed':
      case 'cancelled':
        return 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900/40 dark:text-gray-300';
    }
  };

  const handleViewPayment = (payment) => {
    setSelectedPayment(payment);
  };

  const handleDownloadInvoice = async (payment) => {
    try {
      toast.success('Invoice download started');
      // This would typically make a request to generate and download a PDF
      console.log('Downloading invoice for payment:', payment.transactionId);
    } catch (error) {
      toast.error('Failed to download invoice');
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-gray-600">Please log in to view your dashboard.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-300">Manage your orders and payment history</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalSpent.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">
                Lifetime purchases
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${pendingAmount.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">
                Awaiting payment
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalOrders}</div>
              <p className="text-xs text-muted-foreground">
                All time orders
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Payment History Section */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <CardTitle>Payment History</CardTitle>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  View all your payment transactions
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <Input
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full sm:w-64"
                />
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-40">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="succeeded">Paid</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {paymentsLoading ? (
              <div className="text-center py-8">
                <p className="text-gray-600 dark:text-gray-300">Loading payments...</p>
              </div>
            ) : filteredPayments.length === 0 ? (
              <div className="text-center py-8">
                <Package className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-gray-600 dark:text-gray-300">
                  {searchTerm || statusFilter !== 'all' ? 'No payments match your criteria' : 'No payments found'}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Transaction ID
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredPayments.map((payment) => (
                      <tr key={payment._id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {payment.transactionId}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 dark:text-white">
                            ${payment.amount.toFixed(2)}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <Badge className={`text-xs ${getStatusColor(payment.status)}`}>
                            {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                          </Badge>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 dark:text-white">
                            {format(new Date(payment.createdAt), 'MMM dd, yyyy')}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewPayment(payment)}
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              View
                            </Button>
                            {payment.status === 'succeeded' && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDownloadInvoice(payment)}
                              >
                                <Download className="w-4 h-4 mr-1" />
                                Invoice
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Payment Details Modal */}
        {selectedPayment && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
              <h3 className="text-lg font-semibold mb-4">Payment Details</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-500">Transaction ID</p>
                  <p className="text-sm">{selectedPayment.transactionId}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Amount</p>
                  <p className="text-sm">${selectedPayment.amount.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Status</p>
                  <Badge className={`text-xs ${getStatusColor(selectedPayment.status)}`}>
                    {selectedPayment.status.charAt(0).toUpperCase() + selectedPayment.status.slice(1)}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Date</p>
                  <p className="text-sm">{format(new Date(selectedPayment.createdAt), 'MMM dd, yyyy HH:mm')}</p>
                </div>
                {selectedPayment.paymentMethod && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Payment Method</p>
                    <p className="text-sm capitalize">{selectedPayment.paymentMethod}</p>
                  </div>
                )}
              </div>
              <div className="flex justify-end space-x-2 mt-6">
                <Button variant="outline" onClick={() => setSelectedPayment(null)}>
                  Close
                </Button>
                {selectedPayment.status === 'succeeded' && (
                  <Button onClick={() => handleDownloadInvoice(selectedPayment)}>
                    <Download className="w-4 h-4 mr-1" />
                    Download Invoice
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;