import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Heart, ArrowLeft, ShoppingBag } from 'lucide-react';
import Header from '@/components/Header';
import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { useWishlist } from '@/contexts/WishlistContext';

const FavoritesPage = () => {
  const { wishlist } = useWishlist();

  return (
    <>
      <Helmet>
        <title>My Favorites - MetaMart</title>
        <meta name="description" content="View and manage your favorite products on MetaMart." />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <Header />
        
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <Button variant="ghost" asChild>
              <Link to="/"><ArrowLeft className="h-4 w-4 mr-2" />Back to Shopping</Link>
            </Button>
          </div>
          
          <div className="flex items-center gap-4 mb-8">
            <Heart className="h-8 w-8 text-primary"/>
            <h1 className="text-3xl font-bold">My Favorites</h1>
          </div>

          {wishlist.length === 0 ? (
            <div className="text-center py-20">
              <ShoppingBag className="h-24 w-24 text-muted-foreground mx-auto mb-6" />
              <h2 className="text-2xl font-bold mb-4">Your wishlist is empty</h2>
              <p className="text-muted-foreground mb-8">
                Add your favorite products here to keep track of them.
              </p>
              <Button asChild size="lg">
                <Link to="/">Explore Products</Link>
              </Button>
            </div>
          ) : (
            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
            >
              {wishlist.map((product) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
};

export default FavoritesPage;