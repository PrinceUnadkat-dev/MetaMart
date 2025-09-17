import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-secondary/50 border-t mt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <motion.div whileHover={{ scale: 1.05 }} className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                MetaMart
              </motion.div>
            </Link>
            <p className="text-muted-foreground text-sm">Your ultimate shopping destination for the best products online.</p>
          </div>
          
          <div>
            <p className="font-semibold mb-3">Shop</p>
            <ul className="space-y-2 text-sm">
              <li><Link to="/#products-section" className="text-muted-foreground hover:text-primary transition-colors">All Products</Link></li>
              <li><Link to="/#products-section" className="text-muted-foreground hover:text-primary transition-colors">Electronics</Link></li>
              <li><Link to="/#products-section" className="text-muted-foreground hover:text-primary transition-colors">Fashion</Link></li>
              <li><Link to="/#products-section" className="text-muted-foreground hover:text-primary transition-colors">Home Goods</Link></li>
            </ul>
          </div>
          
          <div>
            <p className="font-semibold mb-3">Account</p>
            <ul className="space-y-2 text-sm">
              <li><Link to="/login" className="text-muted-foreground hover:text-primary transition-colors">Login</Link></li>
              <li><Link to="/signup" className="text-muted-foreground hover:text-primary transition-colors">Sign Up</Link></li>
              <li><Link to="/favorites" className="text-muted-foreground hover:text-primary transition-colors">My Favorites</Link></li>
              <li><Link to="/cart" className="text-muted-foreground hover:text-primary transition-colors">My Cart</Link></li>
            </ul>
          </div>
          
          <div>
            <p className="font-semibold mb-3">Legal</p>
            <ul className="space-y-2 text-sm">
              <li><span className="text-muted-foreground cursor-pointer hover:text-primary transition-colors">Privacy Policy</span></li>
              <li><span className="text-muted-foreground cursor-pointer hover:text-primary transition-colors">Terms of Service</span></li>
              <li><span className="text-muted-foreground cursor-pointer hover:text-primary transition-colors">Shipping Policy</span></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t mt-8 pt-6 text-center text-sm text-muted-foreground">
          <p>&copy; {currentYear} MetaMart. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;