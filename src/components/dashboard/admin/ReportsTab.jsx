import React, { useState } from 'react';
import {
  BarChart3,
  Download,
  FileText,
  Calendar,
  TrendingUp,
  DollarSign,
  ShoppingBag,
  Users
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import toast from 'react-hot-toast';
import { createApiUrl } from '../../../lib/utils';
import { useAuth } from '../../../contexts/AuthContext'; // Import AuthContext

function ReportsTab() {
  const { user } = useAuth(); // Get user from AuthContext
  const [reportDateRange, setReportDateRange] = useState('month'); // week, month, quarter, year, custom
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [reportType, setReportType] = useState('overview'); // overview, medicines, sellers, customers
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [isExportingReport, setIsExportingReport] = useState(false);
  const [reportData, setReportData] = useState(null);

  // Sales Report Functions
  const generateSalesReport = async () => {
    setIsGeneratingReport(true);
    try {
      // Calculate date range
      let startDate, endDate;
      const now = new Date();
      
      switch (reportDateRange) {
        case 'week':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          endDate = now;
          break;
        case 'month':
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          endDate = now;
          break;
        case 'quarter':
          startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
          endDate = now;
          break;
        case 'year':
          startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
          endDate = now;
          break;
        case 'custom':
          startDate = new Date(customStartDate);
          endDate = new Date(customEndDate);
          break;
        default:
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          endDate = now;
      }
      
      // Get user token
      const token = await user.getIdToken();
      
      // In real implementation, this would call the API
      const response = await fetch(createApiUrl(`/api/admin/reports/sales?start=${startDate.toISOString()}&end=${endDate.toISOString()}&type=${reportType}`), {
        headers: { Authorization: `Bearer ${token}` }, // Add Authorization header
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch report: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      setReportData(data);
      toast.success('Report generated successfully!');
      
    } catch (error) {
      console.error('Error generating report:', error);
      toast.error('Failed to generate report. Please try again.');
    } finally {
      setIsGeneratingReport(false);
    }
  };

  const exportReport = async (format) => {
    if (!reportData) {
      toast.error('Please generate a report first.');
      return;
    }
    
    setIsExportingReport(true);
    try {
      // Get user token
      const token = await user.getIdToken();
      
      // In real implementation, this would call the API to generate and download the file
      const response = await fetch(createApiUrl(`/api/admin/reports/export?format=${format}&type=${reportType}`), {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Add Authorization header
        },
        body: JSON.stringify({ reportData, dateRange: reportDateRange })
      });
      
      if (response.ok) {
        // Handle file download
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `sales-report-${reportType}-${new Date().toISOString().split('T')[0]}.${format}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        toast.success('Report exported successfully!');
      } else {
        throw new Error('Failed to export report');
      }
      
    } catch (error) {
      console.error('Error exporting report:', error);
      toast.error('Failed to export report. Please try again.');
    } finally {
      setIsExportingReport(false);
    }
  };

  const getReportPeriodLabel = () => {
    switch (reportDateRange) {
      case 'week': return 'This Week';
      case 'month': return 'This Month';
      case 'quarter': return 'This Quarter';
      case 'year': return 'This Year';
      case 'custom': return `${customStartDate} to ${customEndDate}`;
      default: return 'This Month';
    }
  };

  // Add a helper function to safely access report data
  const getReportOverviewPeriod = () => {
    if (!reportData || !reportData.overview || !reportData.overview.period) {
      return getReportPeriodLabel();
    }
    return reportData.overview.period;
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <BarChart3 className="w-6 h-6" />
            Sales Reports
          </h2>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">Generate comprehensive sales analytics and reports</p>
        </div>
        
        {reportData && (
          <div className="flex gap-2">
            <Button
              onClick={() => exportReport('csv')}
              disabled={isExportingReport}
              variant="outline"
              size="sm"
            >
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
            <Button
              onClick={() => exportReport('pdf')}
              disabled={isExportingReport}
              variant="outline"
              size="sm"
            >
              <FileText className="w-4 h-4 mr-2" />
              Export PDF
            </Button>
          </div>
        )}
      </div>

      {/* Report Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Report Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Report Type */}
            <div>
              <Label>Report Type</Label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="overview">Overview</SelectItem>
                  <SelectItem value="medicines">Medicine Sales</SelectItem>
                  <SelectItem value="sellers">Seller Performance</SelectItem>
                  <SelectItem value="customers">Customer Analytics</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Date Range */}
            <div>
              <Label>Date Range</Label>
              <Select value={reportDateRange} onValueChange={setReportDateRange}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="quarter">This Quarter</SelectItem>
                  <SelectItem value="year">This Year</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Custom Date Range */}
            {reportDateRange === 'custom' && (
              <>
                <div>
                  <Label>Start Date</Label>
                  <Input
                    type="date"
                    value={customStartDate}
                    onChange={(e) => setCustomStartDate(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>End Date</Label>
                  <Input
                    type="date"
                    value={customEndDate}
                    onChange={(e) => setCustomEndDate(e.target.value)}
                    className="mt-1"
                  />
                </div>
              </>
            )}
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              onClick={generateSalesReport}
              disabled={isGeneratingReport || (reportDateRange === 'custom' && (!customStartDate || !customEndDate))}
              className="flex items-center gap-2"
            >
              {isGeneratingReport ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <BarChart3 className="w-4 h-4" />
                  Generate Report
                </>
              )}
            </Button>
            
            {reportData && (
              <Button variant="outline" onClick={() => setReportData(null)}>
                Clear Report
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Report Results */}
      {reportData && (
        <>
          {/* Overview Report */}
          {reportType === 'overview' && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Sales Overview - {getReportPeriodLabel()}</span>
                    {reportData?.overview?.period && (
                      <Badge variant="outline">{reportData.overview.period}</Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-cyan-50 dark:bg-cyan-900/20 p-4 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-cyan-500 dark:text-cyan-400">Total Sales</p>
                          <p className="text-2xl font-bold text-cyan-900 dark:text-cyan-100">
                            ${reportData.overview?.totalSales?.toLocaleString() || 0}
                          </p>
                          <p className="text-xs text-cyan-500 flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" />
                            +{reportData.overview?.growth?.sales || 0}%
                          </p>
                        </div>
                        <DollarSign className="w-8 h-8 text-cyan-500" />
                      </div>
                    </div>
                    
                    <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-green-600 dark:text-green-400">Total Orders</p>
                          <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                            {reportData.overview?.totalOrders?.toLocaleString() || 0}
                          </p>
                          <p className="text-xs text-green-600 flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" />
                            +{reportData.overview?.growth?.orders || 0}%
                          </p>
                        </div>
                        <ShoppingBag className="w-8 h-8 text-green-600" />
                      </div>
                    </div>
                    
                    <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-purple-600 dark:text-purple-400">Total Customers</p>
                          <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                            {reportData.overview?.totalCustomers?.toLocaleString() || 0}
                          </p>
                          <p className="text-xs text-purple-600 flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" />
                            +{reportData.overview?.growth?.customers || 0}%
                          </p>
                        </div>
                        <Users className="w-8 h-8 text-purple-600" />
                      </div>
                    </div>
                    
                    <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-orange-600 dark:text-orange-400">Avg. Order Value</p>
                          <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">
                            ${reportData.overview?.averageOrderValue?.toFixed(2) || '0.00'}
                          </p>
                          <p className="text-xs text-orange-600">
                            Per order
                          </p>
                        </div>
                        <TrendingUp className="w-8 h-8 text-orange-600" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {/* Medicine Sales Report */}
          {reportType === 'medicines' && (
            <Card>
              <CardHeader>
                <CardTitle>Medicine Sales Performance - {getReportPeriodLabel()}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="text-left p-3 font-medium">Medicine</th>
                        <th className="text-left p-3 font-medium">Category</th>
                        <th className="text-left p-3 font-medium">Quantity Sold</th>
                        <th className="text-left p-3 font-medium">Revenue</th>
                        <th className="text-left p-3 font-medium">Avg. Price</th>
                        <th className="text-left p-3 font-medium">Seller</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reportData.medicines?.map((medicine, index) => (
                        <tr key={medicine.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-cyan-500">#{index + 1}</span>
                              <span className="font-medium">{medicine.name || 'Unknown'}</span>
                            </div>
                          </td>
                          <td className="p-3">
                            <Badge variant="outline">{medicine.category || 'N/A'}</Badge>
                          </td>
                          <td className="p-3 font-medium">{medicine.quantitySold || 0}</td>
                          <td className="p-3 font-bold text-green-600">৳{medicine.revenue?.toFixed(2) || '0.00'}</td>
                          <td className="p-3">৳{medicine.avgPrice?.toFixed(2) || '0.00'}</td>
                          <td className="p-3 text-gray-600">{medicine.seller || 'N/A'}</td>
                        </tr>
                      )) || (
                        <tr>
                          <td colSpan="6" className="p-3 text-center text-gray-500">
                            No medicine sales data available
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Seller Performance Report */}
          {reportType === 'sellers' && (
            <Card>
              <CardHeader>
                <CardTitle>Seller Performance - {getReportPeriodLabel()}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="text-left p-3 font-medium">Seller</th>
                        <th className="text-left p-3 font-medium">Total Sales</th>
                        <th className="text-left p-3 font-medium">Orders</th>
                        <th className="text-left p-3 font-medium">Medicines</th>
                        <th className="text-left p-3 font-medium">Avg. Order Value</th>
                        <th className="text-left p-3 font-medium">Commission</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reportData.sellers?.map((seller, index) => (
                        <tr key={seller.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-cyan-500">#{index + 1}</span>
                              <span className="font-medium">{seller.name || 'Unknown Seller'}</span>
                            </div>
                          </td>
                          <td className="p-3 font-bold text-green-600">৳{seller.totalSales?.toFixed(2) || '0.00'}</td>
                          <td className="p-3">{seller.totalOrders || 0}</td>
                          <td className="p-3">{seller.totalMedicines || 0}</td>
                          <td className="p-3">৳{seller.averageOrderValue?.toFixed(2) || '0.00'}</td>
                          <td className="p-3 font-medium text-cyan-500">৳{seller.commission?.toFixed(2) || '0.00'}</td>
                        </tr>
                      )) || (
                        <tr>
                          <td colSpan="6" className="p-3 text-center text-gray-500">
                            No seller performance data available
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Customer Analytics Report */}
          {reportType === 'customers' && (
            <Card>
              <CardHeader>
                <CardTitle>Customer Analytics - {getReportPeriodLabel()}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="text-left p-3 font-medium">Customer</th>
                        <th className="text-left p-3 font-medium">Email</th>
                        <th className="text-left p-3 font-medium">Total Spent</th>
                        <th className="text-left p-3 font-medium">Orders</th>
                        <th className="text-left p-3 font-medium">Avg. Order Value</th>
                        <th className="text-left p-3 font-medium">Last Order</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reportData.customers?.map((customer, index) => (
                        <tr key={customer.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-cyan-500">#{index + 1}</span>
                              <span className="font-medium">{customer.name || 'Unknown Customer'}</span>
                            </div>
                          </td>
                          <td className="p-3 text-gray-600">{customer.email || 'N/A'}</td>
                          <td className="p-3 font-bold text-green-600">৳{customer.totalSpent?.toFixed(2) || '0.00'}</td>
                          <td className="p-3">{customer.totalOrders || 0}</td>
                          <td className="p-3">৳{customer.averageOrderValue?.toFixed(2) || '0.00'}</td>
                          <td className="p-3 text-sm">
                            {customer.lastOrderDate 
                              ? new Date(customer.lastOrderDate).toLocaleDateString()
                              : 'N/A'}
                          </td>
                        </tr>
                      )) || (
                        <tr>
                          <td colSpan="6" className="p-3 text-center text-gray-500">
                            No customer analytics data available
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {/* Empty State */}
      {!reportData && (
        <Card>
          <CardContent className="text-center py-12">
            <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Generate Sales Report
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Select your report parameters above and click "Generate Report" to view comprehensive sales analytics.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-2xl mx-auto text-left">
              <div className="bg-cyan-50 dark:bg-cyan-900/20 p-3 rounded-lg">
                <h4 className="font-medium text-cyan-900 dark:text-cyan-100 mb-1">Overview Reports</h4>
                <p className="text-sm text-cyan-700 dark:text-cyan-300">Sales summary, growth metrics, and KPIs</p>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                <h4 className="font-medium text-green-900 dark:text-green-100 mb-1">Medicine Analytics</h4>
                <p className="text-sm text-green-700 dark:text-green-300">Top-selling medicines and categories</p>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
                <h4 className="font-medium text-purple-900 dark:text-purple-100 mb-1">Seller Performance</h4>
                <p className="text-sm text-purple-700 dark:text-purple-300">Revenue and commission tracking</p>
              </div>
              <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg">
                <h4 className="font-medium text-orange-900 dark:text-orange-100 mb-1">Customer Analytics</h4>
                <p className="text-sm text-orange-700 dark:text-orange-300">Customer spending and behavior</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default ReportsTab;