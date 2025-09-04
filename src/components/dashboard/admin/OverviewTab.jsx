import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import { CardBody, CardContainer, CardItem } from '../../ui/3d-card';
import Lottie from 'lottie-react';
import moneyAnim from '../../../assets/money.json';
import usersAnim from '../../../assets/users.json';
import packageAnim from '../../../assets/package.json';
import ordersAnim from '../../../assets/orders.json';

function OverviewTab({ stats, recentUsers, pendingPayments, acceptPayment }) {
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        <CardContainer className="inter-var">
          <CardBody className="relative bg-white/20 dark:bg-white/10 backdrop-blur-md border border-white/30 dark:border-white/20 shadow-lg rounded-2xl p-6 transition-all duration-300 group/card hover:shadow-2xl hover:shadow-cyan-400/20">
            <div className="absolute inset-0 rounded-2xl pointer-events-none border-2 border-transparent group-hover/card:border-cyan-400 group-hover/card:shadow-lg group-hover/card:shadow-cyan-400/30 transition-all duration-300" style={{ zIndex: 1 }} />
            <CardItem translateZ={50} className="text-sm font-bold text-gray-900 dark:text-white relative z-10">
              Total Revenue
            </CardItem>
            <CardItem translateZ={60} className="mt-2 relative z-10">
              <Lottie animationData={moneyAnim} loop={true} style={{ height: 60, width: 60 }} />
            </CardItem>
            <CardItem translateZ={40} className="text-2xl font-bold text-gray-900 dark:text-white mt-2 relative z-10">
              ${stats.totalRevenue?.toLocaleString()}
            </CardItem>
            <CardItem translateZ={20} className="text-xs text-gray-700 dark:text-gray-300 mt-1 relative z-10">
              {stats.revenueGrowth >= 0 ? '+' : ''}{stats.revenueGrowth}% from last month
            </CardItem>
          </CardBody>
        </CardContainer>
        <CardContainer className="inter-var">
          <CardBody className="relative bg-white/20 dark:bg-white/10 backdrop-blur-md border border-white/30 dark:border-white/20 shadow-lg rounded-2xl p-6 transition-all duration-300 group/card hover:shadow-2xl hover:shadow-green-400/20">
            <div className="absolute inset-0 rounded-2xl pointer-events-none border-2 border-transparent group-hover/card:border-green-400 group-hover/card:shadow-lg group-hover/card:shadow-green-400/30 transition-all duration-300" style={{ zIndex: 1 }} />
            <CardItem translateZ={50} className="text-sm font-bold text-gray-900 dark:text-white relative z-10">
              Paid Total
            </CardItem>
            <CardItem translateZ={60} className="mt-2 relative z-10">
              <Lottie animationData={moneyAnim} loop={true} style={{ height: 60, width: 60 }} />
            </CardItem>
            <CardItem translateZ={40} className="text-2xl font-bold text-green-600 dark:text-green-400 mt-2 relative z-10">
              ${stats.paidTotal?.toLocaleString()}
            </CardItem>
            <CardItem translateZ={20} className="text-xs text-gray-700 dark:text-gray-300 mt-1 relative z-10">
              {stats.totalRevenue ? ((stats.paidTotal / stats.totalRevenue) * 100).toFixed(1) : 0}% of total revenue
            </CardItem>
          </CardBody>
        </CardContainer>
        <CardContainer className="inter-var">
          <CardBody className="relative bg-white/20 dark:bg-white/10 backdrop-blur-md border border-white/30 dark:border-white/20 shadow-lg rounded-2xl p-6 transition-all duration-300 group/card hover:shadow-2xl hover:shadow-orange-400/20">
            <div className="absolute inset-0 rounded-2xl pointer-events-none border-2 border-transparent group-hover/card:border-orange-400 group-hover/card:shadow-lg group-hover/card:shadow-orange-400/30 transition-all duration-300" style={{ zIndex: 1 }} />
            <CardItem translateZ={50} className="text-sm font-bold text-gray-900 dark:text-white relative z-10">
              Pending Total
            </CardItem>
            <CardItem translateZ={60} className="mt-2 relative z-10">
              <Lottie animationData={moneyAnim} loop={true} style={{ height: 60, width: 60 }} />
            </CardItem>
            <CardItem translateZ={40} className="text-2xl font-bold text-orange-600 dark:text-orange-400 mt-2 relative z-10">
              ${stats.pendingTotal?.toLocaleString()}
            </CardItem>
            <CardItem translateZ={20} className="text-xs text-gray-700 dark:text-gray-300 mt-1 relative z-10">
              {stats.totalRevenue ? ((stats.pendingTotal / stats.totalRevenue) * 100).toFixed(1) : 0}% of total revenue
            </CardItem>
          </CardBody>
        </CardContainer>
        <CardContainer className="inter-var">
          <CardBody className="relative bg-white/20 dark:bg-white/10 backdrop-blur-md border border-white/30 dark:border-white/20 shadow-lg rounded-2xl p-6 transition-all duration-300 group/card hover:shadow-2xl hover:shadow-cyan-400/20">
            <div className="absolute inset-0 rounded-2xl pointer-events-none border-2 border-transparent group-hover/card:border-cyan-400 group-hover/card:shadow-lg group-hover/card:shadow-cyan-400/30 transition-all duration-300" style={{ zIndex: 1 }} />
            <CardItem translateZ={50} className="text-sm font-bold text-gray-900 dark:text-white relative z-10">
              Total Users
            </CardItem>
            <CardItem translateZ={60} className="mt-2 relative z-10">
              <Lottie animationData={usersAnim} loop={true} style={{ height: 60, width: 60 }} />
            </CardItem>
            <CardItem translateZ={40} className="text-2xl font-bold text-gray-900 dark:text-white mt-2 relative z-10">
              {stats.totalUsers?.toLocaleString()}
            </CardItem>
            <CardItem translateZ={20} className="text-xs text-gray-700 dark:text-gray-300 mt-1 relative z-10">
              {stats.userGrowth >= 0 ? '+' : ''}{stats.userGrowth}% from last month
            </CardItem>
          </CardBody>
        </CardContainer>
        <CardContainer className="inter-var">
          <CardBody className="relative bg-white/20 dark:bg-white/10 backdrop-blur-md border border-white/30 dark:border-white/20 shadow-lg rounded-2xl p-6 transition-all duration-300 group/card hover:shadow-2xl hover:shadow-green-400/20">
            <div className="absolute inset-0 rounded-2xl pointer-events-none border-2 border-transparent group-hover/card:border-green-400 group-hover/card:shadow-lg group-hover/card:shadow-green-400/30 transition-all duration-300" style={{ zIndex: 1 }} />
            <CardItem translateZ={50} className="text-sm font-bold text-gray-900 dark:text-white relative z-10">
              Total Sellers
            </CardItem>
            <CardItem translateZ={60} className="mt-2 relative z-10">
              <Lottie animationData={usersAnim} loop={true} style={{ height: 60, width: 60 }} />
            </CardItem>
            <CardItem translateZ={40} className="text-2xl font-bold text-gray-900 dark:text-white mt-2 relative z-10">
              {stats.totalSellers?.toLocaleString()}
            </CardItem>
          </CardBody>
        </CardContainer>
        <CardContainer className="inter-var">
          <CardBody className="relative bg-white/20 dark:bg-white/10 backdrop-blur-md border border-white/30 dark:border-white/20 shadow-lg rounded-2xl p-6 transition-all duration-300 group/card hover:shadow-2xl hover:shadow-cyan-400/20">
            <div className="absolute inset-0 rounded-2xl pointer-events-none border-2 border-transparent group-hover/card:border-cyan-400 group-hover/card:shadow-lg group-hover/card:shadow-cyan-400/30 transition-all duration-300" style={{ zIndex: 1 }} />
            <CardItem translateZ={50} className="text-sm font-bold text-gray-900 dark:text-white relative z-10">
              Total Medicines
            </CardItem>
            <CardItem translateZ={60} className="mt-2 relative z-10">
              <Lottie animationData={packageAnim} loop={true} style={{ height: 60, width: 60 }} />
            </CardItem>
            <CardItem translateZ={40} className="text-2xl font-bold text-gray-900 dark:text-white mt-2 relative z-10">
              {stats.totalMedicines?.toLocaleString()}
            </CardItem>
          </CardBody>
        </CardContainer>
        <CardContainer className="inter-var">
          <CardBody className="relative bg-white/20 dark:bg-white/10 backdrop-blur-md border border-white/30 dark:border-white/20 shadow-lg rounded-2xl p-6 transition-all duration-300 group/card hover:shadow-2xl hover:shadow-green-400/20">
            <div className="absolute inset-0 rounded-2xl pointer-events-none border-2 border-transparent group-hover/card:border-green-400 group-hover/card:shadow-lg group-hover/card:shadow-green-400/30 transition-all duration-300" style={{ zIndex: 1 }} />
            <CardItem translateZ={50} className="text-sm font-bold text-gray-900 dark:text-white relative z-10">
              Total Orders
            </CardItem>
            <CardItem translateZ={60} className="mt-2 relative z-10">
              <Lottie animationData={ordersAnim} loop={true} style={{ height: 60, width: 60 }} />
            </CardItem>
            <CardItem translateZ={40} className="text-2xl font-bold text-gray-900 dark:text-white mt-2 relative z-10">
              {stats.totalOrders?.toLocaleString()}
            </CardItem>
          </CardBody>
        </CardContainer>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Recent Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 sm:space-y-4">
              {Array.isArray(recentUsers) && recentUsers.map((user) => (
                <div key={user._id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm sm:text-base truncate">{user.name}</p>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate">{user.email}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : ''}</p>
                  </div>
                  <div className="flex items-center space-x-2 flex-shrink-0">
                    <Badge variant={user.role === 'seller' ? 'default' : user.role === 'admin' ? 'destructive' : 'secondary'} className="text-xs">
                      {user.role}
                    </Badge>
                    <Badge variant={user.isActive ? 'default' : 'secondary'} className="text-xs">
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
            <CardTitle className="text-lg sm:text-xl">Pending Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 sm:space-y-4">
              {(!pendingPayments || pendingPayments.length === 0) && (
                <div className="text-gray-400 text-center py-8 text-sm sm:text-base">No pending payments.</div>
              )}
              {Array.isArray(pendingPayments) && pendingPayments.map((payment) => (
                <div key={payment.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm sm:text-base">Order #{payment.id}</p>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate">
                      {payment.customer} ({payment.email})
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">{payment.date ? new Date(payment.date).toLocaleDateString() : ''}</p>
                  </div>
                  <div className="text-left sm:text-right flex-shrink-0">
                    <p className="font-bold text-sm sm:text-base">${payment.amount}</p>
                    <Button size="sm" className="mt-1 w-full sm:w-auto" onClick={() => acceptPayment(payment.id)}>
                      Accept
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default OverviewTab;
