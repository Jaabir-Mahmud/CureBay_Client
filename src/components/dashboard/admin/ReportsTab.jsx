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

function ReportsTab() {
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
      
      // In real implementation, this would call the API
      // const response = await fetch(`/api/admin/reports/sales?start=${startDate.toISOString()}&end=${endDate.toISOString()}&type=${reportType}`);
      // const data = await response.json();
      
      // Mock data for demonstration
      const mockData = {
        overview: {
          period: getReportPeriodLabel(),
          totalSales: 125000,
          totalOrders: 1250,
          totalCustomers: 850,
          averageOrderValue: 100.00,
          growth: {
            sales: 12.5,
            orders: 8.3,
            customers: 15.2
          }
        },
        medicines: [
          {
            id: 1,
            name: 'Paracetamol 500mg',
            category: 'Pain Relief',
            quantitySold: 2500,
            revenue: 12500.00,
            avgPrice: 5.00,
            seller: 'MediCorp'
          },
          {
            id: 2,
            name: 'Amoxicillin 250mg',
            category: 'Antibiotics',
            quantitySold: 1800,
            revenue: 9000.00,
            avgPrice: 5.00,
            seller: 'PharmaPlus'
          },
          {
            id: 3,
            name: 'Insulin Pen',
            category: 'Diabetes',
            quantitySold: 1200,
            revenue: 84000.00,
            avgPrice: 70.00,
            seller: 'HealthFirst'
          }
        ],
        sellers: [
          {
            id: 1,
            name: 'MediCorp',
            totalSales: 45000.00,
            totalOrders: 450,
            totalMedicines: 15,
            averageOrderValue: 100.00,
            commission: 4500.00
          },
          {
            id: 2,
            name: 'PharmaPlus',
            totalSales: 38000.00,
            totalOrders: 380,
            totalMedicines: 12,
            averageOrderValue: 100.00,
            commission: 3800.00
          },
          {
            id: 3,
            name: 'HealthFirst',
            totalSales: 42000.00,
            totalOrders: 420,
            totalMedicines: 18,
            averageOrderValue: 100.00,
            commission: 4200.00
          }
        ],
        customers: [
          {
            id: 1,
            name: 'John Smith',
            email: 'john@example.com',
            totalSpent: 2500.00,
            totalOrders: 25,
            averageOrderValue: 100.00,
            lastOrderDate: '2024-01-15'
          },
          {
            id: 2,
            name: 'Sarah Johnson',
            email: 'sarah@example.com',
            totalSpent: 1800.00,
            totalOrders: 18,
            averageOrderValue: 100.00,
            lastOrderDate: '2024-01-14'
          },
          {
            id: 3,
            name: 'Mike Davis',
            email: 'mike@example.com',
            totalSpent: 3200.00,
            totalOrders: 32,
            averageOrderValue: 100.00,
            lastOrderDate: '2024-01-13'
          }
        ]
      };
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setReportData(mockData);
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
      // In real implementation, this would call the API to generate and download the file
      // const response = await fetch(`/api/admin/reports/export?format=${format}&type=${reportType}`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ reportData, dateRange: reportDateRange })
      // });
      
      // Mock implementation - would normally trigger a file download
      const filename = `sales-report-${reportType}-${new Date().toISOString().split('T')[0]}.${format}`;
      
      // Create mock content for demonstration
      let content = '';
      if (format === 'csv') {
        switch (reportType) {
          case 'medicines':
            content = 'Medicine Name,Category,Quantity Sold,Revenue,Average Price,Seller\n';
            reportData.medicines.forEach(medicine => {
              content += `"${medicine.name}","${medicine.category}",${medicine.quantitySold},${medicine.revenue},${medicine.avgPrice},"${medicine.seller}"\n`;
            });
            break;
          case 'sellers':
            content = 'Seller Name,Total Sales,Total Orders,Total Medicines,Average Order Value,Commission\n';
            reportData.sellers.forEach(seller => {
              content += `"${seller.name}",${seller.totalSales},${seller.totalOrders},${seller.totalMedicines},${seller.averageOrderValue},${seller.commission}\n`;
            });
            break;
          case 'customers':
            content = 'Customer Name,Email,Total Spent,Total Orders,Average Order Value,Last Order Date\n';
            reportData.customers.forEach(customer => {
              content += `"${customer.name}","${customer.email}",${customer.totalSpent},${customer.totalOrders},${customer.averageOrderValue},"${customer.lastOrderDate}"\n`;
            });
            break;
          default:
            content = 'Metric,Value\n';
            content += `Total Sales,${reportData.overview.totalSales}\n`;
            content += `Total Orders,${reportData.overview.totalOrders}\n`;
            content += `Total Customers,${reportData.overview.totalCustomers}\n`;
            content += `Average Order Value,${reportData.overview.averageOrderValue}\n`;
        }
      }
      
      // Create and download file
      const blob = new Blob([content], { type: format === 'csv' ? 'text/csv' : 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      toast.success(`${format.toUpperCase()} report exported successfully!`);
      
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
                    <Badge variant="outline">{reportData.overview.period}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-cyan-50 dark:bg-cyan-900/20 p-4 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-cyan-500 dark:text-cyan-400">Total Sales</p>
                          <p className="text-2xl font-bold text-cyan-900 dark:text-cyan-100">
                            ${reportData.overview.totalSales.toLocaleString()}
                          </p>
                          <p className="text-xs text-cyan-500 flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" />
                            +{reportData.overview.growth.sales}%
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
                            {reportData.overview.totalOrders.toLocaleString()}
                          </p>
                          <p className="text-xs text-green-600 flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" />
                            +{reportData.overview.growth.orders}%
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
                            {reportData.overview.totalCustomers.toLocaleString()}
                          </p>
                          <p className="text-xs text-purple-600 flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" />
                            +{reportData.overview.growth.customers}%
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
                            ${reportData.overview.averageOrderValue.toFixed(2)}
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
                      {reportData.medicines.map((medicine, index) => (
                        <tr key={medicine.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-cyan-500">#{index + 1}</span>
                              <span className="font-medium">{medicine.name}</span>
                            </div>
                          </td>
                          <td className="p-3">
                            <Badge variant="outline">{medicine.category}</Badge>
                          </td>
                          <td className="p-3 font-medium">{medicine.quantitySold}</td>
                          <td className="p-3 font-bold text-green-600">৳{medicine.revenue.toFixed(2)}</td>
                          <td className="p-3">৳{medicine.avgPrice.toFixed(2)}</td>
                          <td className="p-3 text-gray-600">{medicine.seller}</td>
                        </tr>
                      ))}
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
                      {reportData.sellers.map((seller, index) => (
                        <tr key={seller.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-cyan-500">#{index + 1}</span>
                              <span className="font-medium">{seller.name}</span>
                            </div>
                          </td>
                          <td className="p-3 font-bold text-green-600">৳{seller.totalSales.toFixed(2)}</td>
                          <td className="p-3">{seller.totalOrders}</td>
                          <td className="p-3">{seller.totalMedicines}</td>
                          <td className="p-3">৳{seller.averageOrderValue.toFixed(2)}</td>
                          <td className="p-3 font-medium text-cyan-500">৳{seller.commission.toFixed(2)}</td>
                        </tr>
                      ))}
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
                      {reportData.customers.map((customer, index) => (
                        <tr key={customer.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-cyan-500">#{index + 1}</span>
                              <span className="font-medium">{customer.name}</span>
                            </div>
                          </td>
                          <td className="p-3 text-gray-600">{customer.email}</td>
                          <td className="p-3 font-bold text-green-600">৳{customer.totalSpent.toFixed(2)}</td>
                          <td className="p-3">{customer.totalOrders}</td>
                          <td className="p-3">৳{customer.averageOrderValue.toFixed(2)}</td>
                          <td className="p-3 text-sm">{new Date(customer.lastOrderDate).toLocaleDateString()}</td>
                        </tr>
                      ))}
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
