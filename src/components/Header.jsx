import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, User, Sun, Moon, Search, Menu, X, Heart } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { toast } from '@/components/ui/use-toast';

const Header = ({ searchTerm, setSearchTerm }) => {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const { getTotalItems } = useCart();
  const { wishlist } = useWishlist();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast({ title: "Logged out successfully", description: "See you again soon!" });
    navigate('/');
  };
  
  const handleSearchChange = (e) => setSearchTerm && setSearchTerm(e.target.value);
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (window.location.pathname !== '/') navigate(`/?search=${searchTerm}`);
    const productsSection = document.getElementById('products-section');
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-lg"
    >
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <motion.div whileHover={{ scale: 1.05 }} className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            MetaMart
          </motion.div>
        </Link>

        {setSearchTerm !== undefined && (
          <div className="hidden md:flex items-center flex-1 max-w-lg mx-8">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <Input type="text" placeholder="Search for products..." className="w-full pl-10 pr-4 py-2 h-11 rounded-full bg-secondary focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary" value={searchTerm} onChange={handleSearchChange}/>
            </form>
          </div>
        )}

        <div className="hidden md:flex items-center space-x-1">
          <Button variant="ghost" size="icon" className="rounded-full" onClick={toggleTheme} aria-label="Toggle theme">
             <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
             <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>

          {user && (
            <>
              <Link to="/favorites">
                <Button variant="ghost" size="icon" className="relative rounded-full" aria-label="Open favorites">
                  <Heart className="h-5 w-5" />
                  {wishlist.length > 0 && (
                    <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-1 -right-1 bg-primary text-primary-foreground rounded-full text-xs w-5 h-5 flex items-center justify-center">
                      {wishlist.length}
                    </motion.span>
                  )}
                </Button>
              </Link>
              <Link to="/cart">
                <Button variant="ghost" size="icon" className="relative rounded-full" aria-label="Open cart">
                  <ShoppingCart className="h-5 w-5" />
                  {getTotalItems() > 0 && (
                    <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-1 -right-1 bg-primary text-primary-foreground rounded-full text-xs w-5 h-5 flex items-center justify-center">
                      {getTotalItems()}
                    </motion.span>
                  )}
                </Button>
              </Link>
            </>
          )}

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full" aria-label="User menu"><User className="h-5 w-5" /></Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem className="font-medium flex flex-col items-start p-2">
                  <span>Signed in as</span>
                  <span className="text-muted-foreground text-sm">{user.email}</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {user.isAdmin && <DropdownMenuItem onClick={() => navigate('/admin')}>Admin Dashboard</DropdownMenuItem>}
                <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center space-x-1">
              <Button asChild variant="ghost"><Link to="/login">Login</Link></Button>
              <Button asChild><Link to="/signup">Sign Up</Link></Button>
            </div>
          )}
        </div>
        
        <div className="md:hidden flex items-center gap-2">
          <Link to="/cart">
            <Button variant="ghost" size="icon" className="relative rounded-full" aria-label="Open cart">
              <ShoppingCart className="h-5 w-5" />
              {getTotalItems() > 0 && (
                <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-1 -right-1 bg-primary text-primary-foreground rounded-full text-xs w-5 h-5 flex items-center justify-center">
                  {getTotalItems()}
                </motion.span>
              )}
            </Button>
          </Link>
          <Button variant="ghost" size="icon" className="rounded-full" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>{isMobileMenuOpen ? <X/> : <Menu/>}</Button>
        </div>
      </div>
       {isMobileMenuOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="md:hidden border-t">
            <div className="flex flex-col space-y-2 p-4">
                 {setSearchTerm !== undefined && (
                  <div className="flex items-center flex-1">
                     <form onSubmit={handleSearchSubmit} className="relative w-full">
                       <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                       <Input type="text" placeholder="Search products..." className="w-full pl-10 pr-4 py-2 border rounded-full bg-secondary focus:outline-none focus:ring-2 focus:ring-primary" value={searchTerm} onChange={handleSearchChange}/>
                     </form>
                  </div>
                 )}
                 <div className="flex justify-between items-center py-2">
                    <span className="font-medium">Toggle Theme</span>
                    <Button variant="ghost" size="icon" className="rounded-full" onClick={toggleTheme} aria-label="Toggle theme">
                         <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                         <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    </Button>
                 </div>
                 {user ? (
                    <>
                       {user.isAdmin && <Link to="/admin" onClick={()=> setIsMobileMenuOpen(false)}><Button variant="ghost" className="w-full justify-start">Admin Dashboard</Button></Link>}
                       <Link to="/favorites" onClick={()=> setIsMobileMenuOpen(false)}><Button variant="ghost" className="w-full justify-start">Favorites</Button></Link>
                       <Button variant="ghost" className="w-full justify-start" onClick={handleLogout}>Logout</Button>
                    </>
                 ) : (
                    <>
                        <Link to="/login" onClick={()=> setIsMobileMenuOpen(false)}><Button variant="ghost" className="w-full justify-start">Login</Button></Link>
                        <Link to="/signup" onClick={()=> setIsMobileMenuOpen(false)}><Button className="w-full justify-start">Sign up</Button></Link>
                    </>
                 )}
            </div>
          </motion.div>
       )}
    </motion.header>
  );
};

export default Header;