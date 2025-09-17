import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Package, ShoppingCart, Users, DollarSign, TrendingUp, AlertTriangle } from 'lucide-react';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useProducts } from '@/contexts/ProductContext';
import { Badge } from '@/components/ui/badge';

const AdminDashboard = () => {
  const { products } = useProducts();
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalCustomers: 0,
    totalRevenue: 0,
    recentOrders: []
  });

  useEffect(() => {
    const localOrders = JSON.parse(localStorage.getItem('metamart-orders') || '[]');
    
    const revenue = localOrders.reduce((sum, order) => sum + order.total, 0);

    const mockStats = {
      totalOrders: 1247 + localOrders.length,
      totalCustomers: 892 + localOrders.length, // approximation
      totalRevenue: 4567890 + revenue,
      recentOrders: localOrders.slice(-5).reverse()
    };

    setStats(mockStats);
  }, []);

  const lowStockProducts = products.filter(p => p.stock > 0 && p.stock <= 10).sort((a,b) => a.stock - b.stock);
  const outOfStockProducts = products.filter(p => p.stock === 0);

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300';
      case 'shipped': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300';
      case 'delivered': return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const statCards = [
    { title: 'Total Revenue', value: `₹${stats.totalRevenue.toLocaleString('en-IN')}`, icon: DollarSign, color: 'text-green-500' },
    { title: 'Total Orders', value: stats.totalOrders.toLocaleString('en-IN'), icon: ShoppingCart, color: 'text-blue-500' },
    { title: 'Total Products', value: products.length.toLocaleString('en-IN'), icon: Package, color: 'text-purple-500' },
    { title: 'Total Customers', value: stats.totalCustomers.toLocaleString('en-IN'), icon: Users, color: 'text-yellow-500' }
  ];

  return (
    <>
      <Helmet><title>Admin Dashboard - MetaMart</title></Helmet>
      <div className="min-h-screen bg-secondary/30">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
              <div>
                <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                <p className="text-muted-foreground">Welcome back, Admin! Here's what's happening.</p>
              </div>
              <div className="flex space-x-2">
                <Button asChild><Link to="/admin/products"><Package className="h-4 w-4 mr-2" />Manage Products</Link></Button>
                <Button asChild variant="outline"><Link to="/admin/orders"><ShoppingCart className="h-4 w-4 mr-2" />View All Orders</Link></Button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {statCards.map((stat, index) => (
                <motion.div key={stat.title} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: index * 0.1 }}>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                      <stat.icon className={`h-5 w-5 ${stat.color}`} />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stat.value}</div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Recent Orders</CardTitle>
                  <CardDescription>The latest 5 orders placed by customers.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {stats.recentOrders.length > 0 ? stats.recentOrders.map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                        <div>
                          <p className="font-semibold">{order.id}</p>
                          <p className="text-sm text-muted-foreground">{order.customerInfo.firstName} {order.customerInfo.lastName} - ₹{order.total.toLocaleString('en-IN')}</p>
                        </div>
                        <Badge variant="outline" className={getStatusColor(order.status)}>{order.status}</Badge>
                      </div>
                    )) : <p className="text-muted-foreground text-center py-4">No recent orders.</p>}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center"><AlertTriangle className="h-5 w-5 mr-2 text-red-500" />Inventory Alerts</CardTitle>
                  <CardDescription>Products that are low on stock or sold out.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <h4 className="font-semibold text-amber-600">Low Stock ({lowStockProducts.length})</h4>
                    <div className="max-h-32 overflow-y-auto space-y-2 pr-2">
                        {lowStockProducts.length > 0 ? lowStockProducts.map(p => (
                            <div key={p.id} className="flex justify-between items-center text-sm">
                                <span className="truncate">{p.name}</span>
                                <Badge variant="secondary">{p.stock} left</Badge>
                            </div>
                        )) : <p className="text-sm text-muted-foreground">No products are low on stock.</p>}
                    </div>
                    
                    <h4 className="font-semibold text-red-600 border-t pt-4">Out of Stock ({outOfStockProducts.length})</h4>
                    <div className="max-h-32 overflow-y-auto space-y-2 pr-2">
                        {outOfStockProducts.length > 0 ? outOfStockProducts.map(p => (
                            <div key={p.id} className="flex justify-between items-center text-sm">
                                <span className="truncate">{p.name}</span>
                                <Badge variant="destructive">Sold Out</Badge>
                            </div>
                        )) : <p className="text-sm text-muted-foreground">No products are out of stock.</p>}
                    </div>
                    <Button asChild className="w-full mt-4"><Link to="/admin/products">Manage Inventory</Link></Button>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </main>
      </div>
    </>
  );
};

export default AdminDashboard;