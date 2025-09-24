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
import { useLanguage } from '../../../contexts/LanguageContext'; // Added LanguageContext import
import { t } from '../../../lib/i18n'; // Added translation import
import { TrendingUp, TrendingDown } from 'lucide-react';

function OverviewTab({ stats, recentUsers, pendingPayments, acceptPayment }) {
  const { language } = useLanguage(); // Use language context

  // Simplified stat cards without 3D effect for better performance and cleaner UI
  const StatCard = ({ title, value, icon, trend, trendValue, color = 'cyan' }) => (
    <Card className="shadow-lg border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">
          {title}
        </CardTitle>
        <div className={`p-2 rounded-lg bg-${color}-100 dark:bg-${color}-900/50`}>
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-gray-900 dark:text-white">{value}</div>
        {trendValue !== undefined && (
          <div className={`flex items-center text-sm mt-1 ${trend === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
            {trend === 'up' ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
            {trendValue}% from last month
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <StatCard 
          title={t('admin.overview.totalRevenue', language)}
          value={`$${stats.totalRevenue?.toLocaleString()}`}
          icon={<Lottie animationData={moneyAnim} loop={true} style={{ height: 30, width: 30 }} />}
          trend={stats.revenueGrowth >= 0 ? 'up' : 'down'}
          trendValue={stats.revenueGrowth}
          color="cyan"
        />
        <StatCard 
          title={t('admin.overview.paidTotal', language)}
          value={`$${stats.paidTotal?.toLocaleString()}`}
          icon={<Lottie animationData={moneyAnim} loop={true} style={{ height: 30, width: 30 }} />}
          trend={stats.paidTotal >= stats.pendingTotal ? 'up' : 'down'}
          trendValue={stats.totalRevenue ? ((stats.paidTotal / stats.totalRevenue) * 100).toFixed(1) : 0}
          color="green"
        />
        <StatCard 
          title={t('admin.overview.pendingTotal', language)}
          value={`$${stats.pendingTotal?.toLocaleString()}`}
          icon={<Lottie animationData={moneyAnim} loop={true} style={{ height: 30, width: 30 }} />}
          trend={stats.pendingTotal <= stats.paidTotal ? 'down' : 'up'}
          trendValue={stats.totalRevenue ? ((stats.pendingTotal / stats.totalRevenue) * 100).toFixed(1) : 0}
          color="orange"
        />
        <StatCard 
          title={t('admin.overview.totalUsers', language)}
          value={stats.totalUsers?.toLocaleString()}
          icon={<Lottie animationData={usersAnim} loop={true} style={{ height: 30, width: 30 }} />}
          trend={stats.userGrowth >= 0 ? 'up' : 'down'}
          trendValue={stats.userGrowth}
          color="blue"
        />
        <StatCard 
          title={t('admin.overview.totalSellers', language)}
          value={stats.totalSellers?.toLocaleString()}
          icon={<Lottie animationData={usersAnim} loop={true} style={{ height: 30, width: 30 }} />}
          color="purple"
        />
        <StatCard 
          title={t('admin.overview.totalMedicines', language)}
          value={stats.totalMedicines?.toLocaleString()}
          icon={<Lottie animationData={packageAnim} loop={true} style={{ height: 30, width: 30 }} />}
          color="pink"
        />
        <StatCard 
          title={t('admin.overview.totalOrders', language)}
          value={stats.totalOrders?.toLocaleString()}
          icon={<Lottie animationData={ordersAnim} loop={true} style={{ height: 30, width: 30 }} />}
          color="yellow"
        />
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-lg border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl">{t('admin.overview.recentUsers', language)}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array.isArray(recentUsers) && recentUsers.slice(0, 5).map((user) => (
                <div key={user._id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-full bg-cyan-500 flex items-center justify-center text-white font-bold">
                      {user.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{user.name}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={user.role === 'seller' ? 'default' : user.role === 'admin' ? 'destructive' : 'secondary'}>
                      {user.role}
                    </Badge>
                    <Badge variant={user.isActive ? 'default' : 'secondary'}>
                      {user.isActive ? t('admin.overview.active', language) : t('admin.overview.inactive', language)}
                    </Badge>
                  </div>
                </div>
              ))}
              {(!recentUsers || recentUsers.length === 0) && (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  {t('admin.overview.noRecentUsers', language) || 'No recent users found'}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl">{t('admin.overview.pendingPayments', language)}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array.isArray(pendingPayments) && pendingPayments.slice(0, 5).map((payment) => (
                <div key={payment.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{t('admin.overview.order', language)} #{payment.id}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {payment.customer} ({payment.email})
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {payment.date ? new Date(payment.date).toLocaleDateString() : ''}
                    </p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <p className="font-bold text-lg text-gray-900 dark:text-white">${payment.amount}</p>
                    </div>
                    <Button size="sm" onClick={() => acceptPayment(payment.id)}>
                      {t('admin.overview.accept', language)}
                    </Button>
                  </div>
                </div>
              ))}
              {(!pendingPayments || pendingPayments.length === 0) && (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  {t('admin.overview.noPendingPayments', language)}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default OverviewTab;