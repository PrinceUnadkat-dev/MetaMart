import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Search, ArrowLeft, Eye, Truck, CheckCircle } from 'lucide-react';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    const localOrders = JSON.parse(localStorage.getItem('metamart-orders') || '[]');
    setOrders(localOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
  }, []);
  
  const updateLocalStorage = (updatedOrders) => {
      localStorage.setItem('metamart-orders', JSON.stringify(updatedOrders));
  }

  const filteredOrders = orders.filter(order =>
    order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    `${order.customerInfo.firstName} ${order.customerInfo.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300';
      case 'shipped': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300';
      case 'delivered': return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const handleUpdateStatus = (orderId, newStatus) => {
    const updatedOrders = orders.map(order =>
      order.id === orderId ? { ...order, status: newStatus } : order
    );
    setOrders(updatedOrders);
    updateLocalStorage(updatedOrders);
    toast({
      title: "Order status updated",
      description: `Order ${orderId} is now ${newStatus}`
    });
  };

  return (
    <>
      <Helmet><title>Manage Orders - Admin - MetaMart</title></Helmet>
      <div className="min-h-screen bg-secondary/30">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <Button variant="ghost" asChild><Link to="/admin"><ArrowLeft className="h-4 w-4 mr-2" />Back to Dashboard</Link></Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Manage Orders</CardTitle>
              <CardDescription>View, track, and update customer orders.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <div className="relative max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input type="text" placeholder="Search by Order ID or Customer..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-muted-foreground">
                    <tr className="border-b">
                      <th className="p-4 font-medium">Order ID</th>
                      <th className="p-4 font-medium">Customer</th>
                      <th className="p-4 font-medium">Date</th>
                      <th className="p-4 font-medium">Total</th>
                      <th className="p-4 font-medium">Status</th>
                      <th className="p-4 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((order) => (
                      <motion.tr key={order.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="border-b">
                        <td className="p-4 font-medium">{order.id}</td>
                        <td className="p-4">{order.customerInfo.firstName} {order.customerInfo.lastName}</td>
                        <td className="p-4 text-muted-foreground">{new Date(order.createdAt).toLocaleDateString()}</td>
                        <td className="p-4">₹{order.total.toLocaleString('en-IN')}</td>
                        <td className="p-4"><Badge variant="outline" className={getStatusColor(order.status)}>{order.status}</Badge></td>
                        <td className="p-4 text-right">
                           <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">Actions</Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem onClick={() => toast({title: "Viewing details for " + order.id, description: "This feature is coming soon!"})}>
                                <Eye className="mr-2 h-4 w-4" /> View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleUpdateStatus(order.id, 'shipped')} disabled={order.status !== 'confirmed'}>
                                <Truck className="mr-2 h-4 w-4" /> Mark as Shipped
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleUpdateStatus(order.id, 'delivered')} disabled={order.status !== 'shipped'}>
                                <CheckCircle className="mr-2 h-4 w-4" /> Mark as Delivered
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredOrders.length === 0 && (
                <div className="text-center py-12"><p className="text-muted-foreground text-lg">No orders found.</p></div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </>
  );
};

export default AdminOrders;