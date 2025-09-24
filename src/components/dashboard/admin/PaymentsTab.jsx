import React, { useState } from 'react';
import {
  CreditCard,
  Search,
  Clock,
  DollarSign,
  X,
  AlertTriangle,
  Eye,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Textarea } from '../../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../ui/dialog';
import toast from 'react-hot-toast';

function PaymentsTab({ 
  payments, 
  setPayments, 
  stats, 
  setStats 
}) {
  const [paymentSearch, setPaymentSearch] = useState('');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('all'); // all, pending, accepted, rejected
  const [paymentDateFilter, setPaymentDateFilter] = useState('all'); // all, today, week, month
  const [selectedPayments, setSelectedPayments] = useState(new Set());
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [paymentAction, setPaymentAction] = useState(''); // accept, reject
  const [rejectReason, setRejectReason] = useState('');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Payment Management Functions
  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.customerName.toLowerCase().includes(paymentSearch.toLowerCase()) ||
                         payment.customerEmail.toLowerCase().includes(paymentSearch.toLowerCase()) ||
                         payment.orderId.toLowerCase().includes(paymentSearch.toLowerCase());
    
    const matchesStatus = paymentStatusFilter === 'all' || payment.status === paymentStatusFilter;
    
    let matchesDate = true;
    if (paymentDateFilter !== 'all') {
      const paymentDate = new Date(payment.createdAt);
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      switch (paymentDateFilter) {
        case 'today':
          matchesDate = paymentDate >= today;
          break;
        case 'week':
          const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
          matchesDate = paymentDate >= weekAgo;
          break;
        case 'month':
          const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
          matchesDate = paymentDate >= monthAgo;
          break;
        default:
          matchesDate = true;
      }
    }
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  const openPaymentModal = (payment, action) => {
    setSelectedPayment(payment);
    setPaymentAction(action);
    setRejectReason('');
    setPaymentModalOpen(true);
  };

  const processPayment = async () => {
    if (!selectedPayment) return;
    
    setIsProcessingPayment(true);
    try {
      // Update order payment status
      const endpoint = `/api/orders/${selectedPayment.id}`;
      const requestBody = JSON.stringify({
        paymentStatus: paymentAction === 'accept' ? 'paid' : 'failed'
      });
      
      const res = await fetch(endpoint, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: requestBody
      });
      
      if (!res.ok) throw new Error(`Failed to ${paymentAction} payment`);
      
      // Update local state
      const updatedPayments = payments.map(payment => 
        payment.id === selectedPayment.id 
          ? { 
              ...payment, 
              status: paymentAction === 'accept' ? 'paid' : 'failed',
              [`${paymentAction}edAt`]: new Date().toISOString()
            }
          : payment
      );
      setPayments(updatedPayments);
      
      // Update stats if necessary
      if (paymentAction === 'accept') {
        setStats(prevStats => ({
          ...prevStats,
          paidTotal: prevStats.paidTotal + selectedPayment.amount,
          pendingTotal: prevStats.pendingTotal - selectedPayment.amount
        }));
      }
      
      toast.success(`Payment ${paymentAction}ed successfully!`);
      setPaymentModalOpen(false);
      
    } catch (error) {
      console.error(`Error ${paymentAction}ing payment:`, error);
      toast.error(`Failed to ${paymentAction} payment. Please try again.`);
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handleBulkPaymentAction = async (action) => {
    if (selectedPayments.size === 0) {
      toast.error('Please select payments to process.');
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to ${action} ${selectedPayments.size} selected payment(s)?`
    );
    
    if (!confirmed) return;
    
    setIsProcessingPayment(true);
    try {
      const promises = Array.from(selectedPayments).map(paymentId => {
        const endpoint = `/api/orders/${paymentId}`;
        const requestBody = JSON.stringify({
          paymentStatus: action === 'accept' ? 'paid' : 'failed'
        });
        return fetch(endpoint, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: requestBody
        });
      });
      
      await Promise.all(promises);
      
      // Update local state
      const updatedPayments = payments.map(payment => 
        selectedPayments.has(payment.id)
          ? { 
              ...payment, 
              status: action === 'accept' ? 'paid' : 'failed',
              [`${action}edAt`]: new Date().toISOString()
            }
          : payment
      );
      setPayments(updatedPayments);
      setSelectedPayments(new Set());
      
      toast.success(`${selectedPayments.size} payments ${action}ed successfully!`);
      
    } catch (error) {
      console.error(`Error ${action}ing payments:`, error);
      toast.error(`Failed to ${action} payments. Please try again.`);
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const togglePaymentSelection = (paymentId) => {
    setSelectedPayments(prev => {
      const newSet = new Set(prev);
      if (newSet.has(paymentId)) {
        newSet.delete(paymentId);
      } else {
        newSet.add(paymentId);
      }
      return newSet;
    });
  };

  const selectAllPayments = () => {
    const pendingPaymentIds = filteredPayments
      .filter(p => p.status === 'pending')
      .map(p => p.id);
    setSelectedPayments(new Set(pendingPaymentIds));
  };

  const clearPaymentSelection = () => {
    setSelectedPayments(new Set());
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'accepted':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  const getPaymentMethodIcon = (method) => {
    switch (method.toLowerCase()) {
      case 'credit card':
        return <CreditCard className="w-4 h-4" />;
      case 'debit card':
        return <CreditCard className="w-4 h-4" />;
      case 'bank transfer':
        return <DollarSign className="w-4 h-4" />;
      case 'paypal':
        return <DollarSign className="w-4 h-4" />;
      default:
        return <DollarSign className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <CreditCard className="w-6 h-6" />
            Payment Management
          </h2>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">Monitor and manage payment transactions</p>
        </div>
        
        {/* Bulk Actions */}
        {selectedPayments.size > 0 && (
          <div className="flex gap-2">
            <Button
              onClick={() => handleBulkPaymentAction('accept')}
              disabled={isProcessingPayment}
              className="bg-green-600 hover:bg-green-700"
              size="sm"
            >
              Accept ({selectedPayments.size})
            </Button>
            <Button
              onClick={() => handleBulkPaymentAction('reject')}
              disabled={isProcessingPayment}
              variant="destructive"
              size="sm"
            >
              Reject ({selectedPayments.size})
            </Button>
            <Button
              onClick={clearPaymentSelection}
              variant="outline"
              size="sm"
            >
              Clear
            </Button>
          </div>
        )}
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search payments..."
                value={paymentSearch}
                onChange={(e) => setPaymentSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            
            {/* Status Filter */}
            <Select value={paymentStatusFilter} onValueChange={setPaymentStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="accepted">Accepted</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            
            {/* Date Filter */}
            <Select value={paymentDateFilter} onValueChange={setPaymentDateFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
              </SelectContent>
            </Select>
            
            {/* Quick Actions */}
            <div className="flex gap-2">
              <Button
                onClick={selectAllPayments}
                variant="outline"
                size="sm"
                className="flex-1"
              >
                Select Pending
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Pending Payments</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {filteredPayments.filter(p => p.status === 'pending').length}
                </p>
              </div>
              <div className="p-3 bg-yellow-100 dark:bg-yellow-900/20 rounded-full">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Accepted Payments</p>
                <p className="text-2xl font-bold text-green-600">
                  {filteredPayments.filter(p => p.status === 'accepted').length}
                </p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-full">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Rejected Payments</p>
                <p className="text-2xl font-bold text-red-600">
                  {filteredPayments.filter(p => p.status === 'rejected').length}
                </p>
              </div>
              <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-full">
                <X className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payments Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Payments ({filteredPayments.length})</span>
            {selectedPayments.size > 0 && (
              <span className="text-sm font-normal text-gray-500">
                {selectedPayments.size} selected
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left p-4">
                    <input
                      type="checkbox"
                      checked={selectedPayments.size === filteredPayments.filter(p => p.status === 'pending').length && filteredPayments.filter(p => p.status === 'pending').length > 0}
                      onChange={selectedPayments.size > 0 ? clearPaymentSelection : selectAllPayments}
                      className="rounded border-gray-300"
                    />
                  </th>
                  <th className="text-left p-4 font-medium text-gray-900 dark:text-white">Payment Details</th>
                  <th className="text-left p-4 font-medium text-gray-900 dark:text-white">Customer</th>
                  <th className="text-left p-4 font-medium text-gray-900 dark:text-white">Amount</th>
                  <th className="text-left p-4 font-medium text-gray-900 dark:text-white">Method</th>
                  <th className="text-left p-4 font-medium text-gray-900 dark:text-white">Status</th>
                  <th className="text-left p-4 font-medium text-gray-900 dark:text-white">Date</th>
                  <th className="text-left p-4 font-medium text-gray-900 dark:text-white">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPayments.map((payment) => (
                  <tr key={payment.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="p-4">
                      <input
                        type="checkbox"
                        checked={selectedPayments.has(payment.id)}
                        onChange={() => togglePaymentSelection(payment.id)}
                        disabled={payment.status !== 'pending'}
                        className="rounded border-gray-300"
                      />
                    </td>
                    <td className="p-4">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{payment.id}</p>
                        <p className="text-sm text-gray-500">Order: {payment.orderId}</p>
                        {payment.paymentDetails.transactionId && (
                          <p className="text-xs text-gray-400">TXN: {payment.paymentDetails.transactionId}</p>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{payment.customerName}</p>
                        <p className="text-sm text-gray-500">{payment.customerEmail}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <div>
                        <p className="font-bold text-lg text-cyan-500">${payment.amount.toFixed(2)}</p>
                        <p className="text-xs text-gray-500">
                          {payment.medicines.length} item{payment.medicines.length !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {getPaymentMethodIcon(payment.paymentMethod)}
                        <span className="text-sm">{payment.paymentMethod}</span>
                      </div>
                      {payment.paymentDetails.cardLast4 && (
                        <p className="text-xs text-gray-400">****{payment.paymentDetails.cardLast4}</p>
                      )}
                    </td>
                    <td className="p-4">
                      <Badge className={getStatusColor(payment.status)}>
                        {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                      </Badge>
                      {payment.status === 'rejected' && payment.rejectReason && (
                        <p className="text-xs text-red-600 mt-1 max-w-32 truncate" title={payment.rejectReason}>
                          {payment.rejectReason}
                        </p>
                      )}
                    </td>
                    <td className="p-4">
                      <div>
                        <p className="text-sm">{new Date(payment.createdAt).toLocaleDateString()}</p>
                        <p className="text-xs text-gray-500">{new Date(payment.createdAt).toLocaleTimeString()}</p>
                        {payment.acceptedAt && (
                          <p className="text-xs text-green-600">Accepted: {new Date(payment.acceptedAt).toLocaleDateString()}</p>
                        )}
                        {payment.rejectedAt && (
                          <p className="text-xs text-red-600">Rejected: {new Date(payment.rejectedAt).toLocaleDateString()}</p>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        {payment.status === 'pending' && (
                          <>
                            <Button
                              onClick={() => openPaymentModal(payment, 'accept')}
                              size="sm"
                              className="bg-green-600 hover:bg-green-700 text-white"
                            >
                              Accept
                            </Button>
                            <Button
                              onClick={() => openPaymentModal(payment, 'reject')}
                              size="sm"
                              variant="destructive"
                            >
                              Reject
                            </Button>
                          </>
                        )}
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm" variant="outline">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Payment Details - {payment.id}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label className="text-sm font-medium">Customer Information</Label>
                                  <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg mt-1">
                                    <p className="font-medium">{payment.customerName}</p>
                                    <p className="text-sm text-gray-600">{payment.customerEmail}</p>
                                  </div>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium">Payment Information</Label>
                                  <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg mt-1">
                                    <p className="font-medium">৳{payment.amount.toFixed(2)}</p>
                                    <p className="text-sm text-gray-600">{payment.paymentMethod}</p>
                                    <Badge className={getStatusColor(payment.status)}>
                                      {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                              
                              <div>
                                <Label className="text-sm font-medium">Medicines Ordered</Label>
                                <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg mt-1 space-y-2">
                                  {payment.medicines.map((medicine, index) => (
                                    <div key={index} className="flex justify-between items-center">
                                      <div>
                                        <p className="font-medium">{medicine.name}</p>
                                        <p className="text-sm text-gray-600">Quantity: {medicine.quantity}</p>
                                      </div>
                                      <p className="font-medium">৳{(medicine.price * medicine.quantity).toFixed(2)}</p>
                                    </div>
                                  ))}
                                  <div className="border-t pt-2 mt-2">
                                    <div className="flex justify-between items-center font-bold">
                                      <span>Total</span>
                                      <span>৳{payment.amount.toFixed(2)}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              
                              {payment.rejectReason && (
                                <div>
                                  <Label className="text-sm font-medium text-red-600">Rejection Reason</Label>
                                  <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg mt-1">
                                    <p className="text-red-700 dark:text-red-300">{payment.rejectReason}</p>
                                  </div>
                                </div>
                              )}
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredPayments.length === 0 && (
            <div className="text-center py-12">
              <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No payments found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {paymentSearch || paymentStatusFilter !== 'all' || paymentDateFilter !== 'all'
                  ? 'Try adjusting your search and filters.'
                  : 'Payments will appear here when customers make purchases.'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment Action Modal */}
      <Dialog open={paymentModalOpen} onOpenChange={setPaymentModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {paymentAction === 'accept' ? 'Accept Payment' : 'Reject Payment'}
            </DialogTitle>
            <DialogDescription>
              {selectedPayment && (
                <span>
                  Payment ID: {selectedPayment.id} - ৳{selectedPayment.amount.toFixed(2)}
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {selectedPayment && (
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-cyan-100 dark:bg-cyan-900/40 rounded-full">
                    <CreditCard className="w-5 h-5 text-cyan-500 dark:text-cyan-400" />
                  </div>
                  <div>
                    <p className="font-medium">{selectedPayment.customerName}</p>
                    <p className="text-sm text-gray-600">{selectedPayment.customerEmail}</p>
                    <p className="text-xs text-gray-500">Order: {selectedPayment.orderId}</p>
                  </div>
                </div>
              </div>
            )}
            
            {paymentAction === 'reject' && (
              <div>
                <Label htmlFor="reject-reason">Rejection Reason</Label>
                <Textarea
                  id="reject-reason"
                  placeholder="Please provide a reason for rejecting this payment..."
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  rows={3}
                  className="mt-1"
                />
              </div>
            )}
            
            <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-yellow-700 dark:text-yellow-300">
                  <p className="font-medium">Confirm Action</p>
                  <p>
                    {paymentAction === 'accept'
                      ? 'This will approve the payment and notify the customer.'
                      : 'This will reject the payment and notify the customer with the reason provided.'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setPaymentModalOpen(false)}
              disabled={isProcessingPayment}
            >
              Cancel
            </Button>
            <Button
              onClick={processPayment}
              disabled={isProcessingPayment || (paymentAction === 'reject' && !rejectReason.trim())}
              className={paymentAction === 'accept' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}
            >
              {isProcessingPayment ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Processing...
                </>
              ) : (
                paymentAction === 'accept' ? 'Accept Payment' : 'Reject Payment'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default PaymentsTab;
