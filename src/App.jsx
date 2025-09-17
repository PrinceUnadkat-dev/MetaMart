import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { CartProvider } from '@/contexts/CartContext';
import { ProductProvider } from '@/contexts/ProductContext';
import { WishlistProvider } from '@/contexts/WishlistContext';
import { Toaster } from '@/components/ui/toaster';
import HomePage from '@/pages/HomePage';
import LoginPage from '@/pages/LoginPage';
import SignupPage from '@/pages/SignupPage';
import ProductPage from '@/pages/ProductPage';
import CartPage from '@/pages/CartPage';
import CheckoutPage from '@/pages/CheckoutPage';
import AdminDashboard from '@/pages/AdminDashboard';
import AdminProducts from '@/pages/AdminProducts';
import AdminOrders from '@/pages/AdminOrders';
import ProtectedRoute from '@/components/ProtectedRoute';
import FavoritesPage from '@/pages/FavoritesPage';
import Footer from '@/components/Footer';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ProductProvider>
          <WishlistProvider>
            <CartProvider>
              <Router>
                <Helmet>
                  <title>MetaMart - Your Ultimate Shopping Destination</title>
                  <meta name="description" content="Discover amazing products at MetaMart. Shop electronics, fashion, home goods and more with fast delivery and secure payments." />
                </Helmet>
                <div className="min-h-screen bg-background text-foreground flex flex-col">
                  <div className="flex-grow">
                    <Routes>
                      <Route path="/" element={<HomePage />} />
                      <Route path="/login" element={<LoginPage />} />
                      <Route path="/signup" element={<SignupPage />} />
                      <Route path="/product/:id" element={<ProductPage />} />
                      <Route path="/favorites" element={
                        <ProtectedRoute>
                          <FavoritesPage />
                        </ProtectedRoute>
                      } />
                      <Route path="/cart" element={
                        <ProtectedRoute>
                          <CartPage />
                        </ProtectedRoute>
                      } />
                      <Route path="/checkout" element={
                        <ProtectedRoute>
                          <CheckoutPage />
                        </ProtectedRoute>
                      } />
                      <Route path="/admin" element={
                        <ProtectedRoute adminOnly>
                          <AdminDashboard />
                        </ProtectedRoute>
                      } />
                      <Route path="/admin/products" element={
                        <ProtectedRoute adminOnly>
                          <AdminProducts />
                        </ProtectedRoute>
                      } />
                      <Route path="/admin/orders" element={
                        <ProtectedRoute adminOnly>
                          <AdminOrders />
                        </ProtectedRoute>
                      } />
                    </Routes>
                  </div>
                  <Footer />
                  <Toaster />
                </div>
              </Router>
            </CartProvider>
          </WishlistProvider>
        </ProductProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;