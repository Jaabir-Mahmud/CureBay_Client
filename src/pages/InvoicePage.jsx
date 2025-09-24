import React, { useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { Download, CheckCircle, ArrowLeft, Printer } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const InvoicePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const invoiceRef = useRef();
  
  const { order, paymentIntent } = location.state || {};

  if (!order || !paymentIntent) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Invoice not found</h2>
          <Button onClick={() => navigate('/')}>Go to Home</Button>
        </div>
      </div>
    );
  }

  const invoiceNumber = `INV-${order._id.slice(-8).toUpperCase()}`;
  const invoiceDate = new Date();

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    try {
      const html2pdf = (await import('html2pdf.js')).default;
      
      const element = invoiceRef.current;
      const opt = {
        margin: 1,
        filename: `CureBay-Invoice-${invoiceNumber}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
      };
      
      await html2pdf().set(opt).from(element).save();
      toast.success('Invoice downloaded successfully!');
    } catch (error) {
      console.error('Error downloading PDF:', error);
      toast.error('Failed to download PDF. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <CheckCircle className="w-16 h-16 text-green-500" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Payment Successful!
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Thank you for your purchase. Your order has been confirmed.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8 justify-center">
          <Button onClick={() => navigate('/')} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Continue Shopping
          </Button>
          <Button onClick={handlePrint} variant="outline">
            <Printer className="w-4 h-4 mr-2" />
            Print Invoice
          </Button>
          <Button onClick={handleDownloadPDF}>
            <Download className="w-4 h-4 mr-2" />
            Download PDF
          </Button>
        </div>

        {/* Invoice Content */}
        <div ref={invoiceRef} className="bg-white dark:bg-gray-800 print:bg-white">
          <Card>
            <CardContent className="p-8">
              {/* Invoice Header */}
              <div className="flex justify-between items-start mb-8">
                <div>
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="w-10 h-10 bg-cyan-500 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-xl">C</span>
                    </div>
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">ureBay</span>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <p>Healthcare E-commerce Platform</p>
                    <p>Email: support@curebay.com</p>
                    <p>Phone: (555) 123-4567</p>
                  </div>
                </div>
                <div className="text-right">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">INVOICE</h2>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <p><strong>Invoice #:</strong> {invoiceNumber}</p>
                    <p><strong>Date:</strong> {format(invoiceDate, 'MMM dd, yyyy')}</p>
                    <p><strong>Payment ID:</strong> {paymentIntent.id}</p>
                  </div>
                </div>
              </div>

              <Separator className="my-6" />

              {/* Customer Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Bill To:</h3>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <p className="font-medium">{profile?.name || user?.displayName || user?.email}</p>
                    <p>{user?.email}</p>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Ship To:</h3>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {order.shippingAddress && (
                      <>
                        <p>{order.shippingAddress.street}</p>
                        <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
                        <p>{order.shippingAddress.country}</p>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="mb-8">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Order Items</h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Item</th>
                        <th className="text-center py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Qty</th>
                        <th className="text-right py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Unit Price</th>
                        <th className="text-right py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.items.map((item, index) => {
                        const medicine = item.medicine;
                        const itemTotal = item.price * item.quantity;
                        
                        return (
                          <tr key={index} className="border-b border-gray-100 dark:border-gray-800">
                            <td className="py-4 px-4">
                              <div>
                                <p className="font-medium text-gray-900 dark:text-white">
                                  {medicine.name}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  {medicine.genericName}
                                </p>
                                {medicine.company && (
                                  <p className="text-xs text-gray-400">
                                    {medicine.company}
                                  </p>
                                )}
                              </div>
                            </td>
                            <td className="py-4 px-4 text-center">
                              {item.quantity}
                            </td>
                            <td className="py-4 px-4 text-right">
                              ৳{typeof item.price === 'number' ? item.price.toFixed(2) : item.price}
                            </td>
                            <td className="py-4 px-4 text-right font-medium">
                              ৳{typeof itemTotal === 'number' ? itemTotal.toFixed(2) : itemTotal}
                            </td>

                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Order Summary */}
              <div className="flex justify-end">
                <div className="w-full max-w-sm">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Subtotal:</span>
                      <span className="text-gray-900 dark:text-white">
                        ৳{(order.totalAmount / 1.08 - (order.totalAmount > 50 ? 0 : 9.99)).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Tax (8%):</span>
                      <span className="text-gray-900 dark:text-white">
                        ৳{(order.totalAmount * 0.08 / 1.08).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Shipping:</span>
                      <span className="text-gray-900 dark:text-white">
                        {order.totalAmount > 50 ? 'Free' : '৳9.99'}
                      </span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-bold text-lg">
                      <span className="text-gray-900 dark:text-white">Total:</span>
                      <span className="text-gray-900 dark:text-white">
                        ৳{order.totalAmount.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <Separator className="my-6" />

              {/* Payment Information */}
              <div className="mb-8">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Payment Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Payment Method:</p>
                    <p className="font-medium text-gray-900 dark:text-white">Credit Card</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Payment Status:</p>
                    <Badge className="bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300">
                      Paid
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Transaction ID:</p>
                    <p className="font-medium text-gray-900 dark:text-white text-xs">
                      {paymentIntent.id}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Payment Date:</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {format(new Date(paymentIntent.created * 1000), 'MMM dd, yyyy HH:mm')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                  <p>Thank you for your business!</p>
                  <p className="mt-2">
                    For questions about this invoice, contact us at support@curebay.com
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Print Styles */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body { -webkit-print-color-adjust: exact; }
          .print\\:bg-white { background-color: white !important; }
          .no-print { display: none !important; }
        }
      `}} />
    </div>
  );
};

export default InvoicePage;