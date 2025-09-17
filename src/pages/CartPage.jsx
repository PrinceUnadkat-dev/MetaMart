import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from 'lucide-react';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useCart } from '@/contexts/CartContext';
import { toast } from '@/components/ui/use-toast';
import { useProducts } from '@/contexts/ProductContext';

const CartPage = () => {
  const { items, updateQuantity, removeFromCart, getTotalPrice } = useCart();
  const { products } = useProducts();

  const handleQuantityChange = (productId, newQuantity) => {
    const product = products.find(p => p.id === productId);
    if (newQuantity > product.stock) {
      toast({
        title: "Not enough stock",
        description: `Only ${product.stock} items available for ${product.name}.`,
        variant: "destructive",
      });
      return;
    }

    if (newQuantity <= 0) {
      handleRemoveItem(productId, product.name);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleRemoveItem = (productId, productName) => {
    removeFromCart(productId);
    toast({
      title: "Item removed",
      description: `${productName} has been removed from your cart`
    });
  };

  if (items.length === 0) {
    return (
      <>
        <Helmet><title>Shopping Cart - MetaMart</title></Helmet>
        <div className="min-h-screen bg-background">
          <Header />
          <div className="container mx-auto px-4 py-16 text-center max-w-md">
            <ShoppingBag className="h-24 w-24 text-muted-foreground mx-auto mb-6" />
            <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
            <p className="text-muted-foreground mb-8">Looks like you haven't added any items to your cart yet.</p>
            <Button asChild size="lg"><Link to="/">Continue Shopping</Link></Button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet><title>Shopping Cart - MetaMart</title></Helmet>
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <Button variant="ghost" asChild className="mb-6"><Link to="/"><ArrowLeft className="h-4 w-4 mr-2" />Continue Shopping</Link></Button>
          <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => {
                const productInStock = products.find(p => p.id === item.id);
                const availableStock = productInStock ? productInStock.stock : 0;
                return (
                  <motion.div key={item.id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                    <Card>
                      <CardContent className="p-4 sm:p-6 flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
                        <div className="w-24 h-24 rounded-lg overflow-hidden border flex-shrink-0">
                          <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover"/>
                        </div>
                        <div className="flex-1 w-full">
                          <div className="flex justify-between items-start">
                             <h3 className="font-semibold text-lg mb-1">{item.name}</h3>
                             <Button variant="ghost" size="icon" onClick={() => handleRemoveItem(item.id, item.name)} className="text-red-500 hover:text-red-700 h-8 w-8 -mt-1 -mr-2"><Trash2 className="h-4 w-4" /></Button>
                          </div>
                          <span className="text-xl font-bold text-primary">₹{item.price.toLocaleString('en-IN')}</span>
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center border rounded-lg">
                              <Button variant="ghost" size="icon" onClick={() => handleQuantityChange(item.id, item.quantity - 1)}><Minus className="h-4 w-4" /></Button>
                              <span className="px-4 py-1 font-medium text-center w-12">{item.quantity}</span>
                              <Button variant="ghost" size="icon" onClick={() => handleQuantityChange(item.id, item.quantity + 1)} disabled={item.quantity >= availableStock}><Plus className="h-4 w-4" /></Button>
                            </div>
                            <span className="font-bold text-lg">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              })}
            </div>

            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between">
                      <span>Subtotal ({items.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                      <span>₹{getTotalPrice().toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span className="text-green-600">Free</span>
                    </div>
                    <div className="border-t pt-4">
                      <div className="flex justify-between text-lg font-semibold">
                        <span>Total</span>
                        <span className="text-primary">₹{getTotalPrice().toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  </div>
                  <Button asChild className="w-full" size="lg"><Link to="/checkout">Proceed to Checkout</Link></Button>
                  <div className="mt-4 text-center text-sm text-muted-foreground">
                    <p>Cash on Delivery Available</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CartPage;