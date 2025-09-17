import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, Star, Image as ImageIcon, Heart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { toast } from '@/components/ui/use-toast';
import { Badge } from '@/components/ui/badge';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (!user) {
      toast({ title: "Please login first", description: "You need to be logged in to add items to cart.", variant: "destructive" });
      return;
    }
    const added = addToCart(product);
    if(added) {
      toast({ title: "Added to cart!", description: `${product.name} has been added to your cart.` });
    } else {
      toast({ title: "Out of stock!", description: "This item is currently not available.", variant: "destructive" });
    }
  };
  
  const handleWishlistToggle = (e) => {
    e.preventDefault();
    if (!user) {
      toast({ title: "Please login first", description: "You need to be logged in to manage your wishlist.", variant: "destructive" });
      return;
    }
    toggleWishlist(product);
    toast({
      title: !isInWishlist(product.id) ? "Added to favorites!" : "Removed from favorites",
      description: !isInWishlist(product.id) ? `${product.name} has been added to your favorites.` : `${product.name} has been removed from your favorites.`
    });
  };
  
  const isFavorited = isInWishlist(product.id);

  return (
    <motion.div whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300 }} className="h-full">
      <Link to={`/product/${product.id}`} className="h-full flex flex-col group">
        <Card className="h-full overflow-hidden transition-all duration-300 flex flex-col glass-effect hover:shadow-primary/20 hover:shadow-lg">
          <div className="relative aspect-square overflow-hidden">
            {product.images && product.images[0] ? (
              <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"/>
            ) : ( <div className="w-full h-full bg-secondary flex items-center justify-center"><ImageIcon className="w-16 h-16 text-muted-foreground" /></div> )}
             <Button variant="secondary" size="icon" className="absolute top-3 right-3 rounded-full h-9 w-9 bg-background/50 backdrop-blur-sm" onClick={handleWishlistToggle}>
              <Heart className={`h-5 w-5 transition-all ${isFavorited ? 'fill-red-500 text-red-500' : 'text-foreground'}`} />
            </Button>
            {product.stock <= 10 && product.stock > 0 && <Badge className="absolute top-3 left-3" variant="destructive">Low Stock</Badge>}
            {product.stock === 0 && <Badge className="absolute top-3 left-3" variant="destructive">Sold Out</Badge>}
          </div>
          <CardContent className="p-4 flex-grow flex flex-col">
            <p className="text-sm text-muted-foreground mb-1">{product.category}</p>
            <h3 className="font-semibold text-base mb-2 line-clamp-2 flex-grow">{product.name}</h3>
            <div className="flex items-center mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => ( <Star key={i} className={`h-4 w-4 ${ i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-400 dark:text-gray-600' }`} /> ))}
              </div>
              <span className="text-xs text-muted-foreground ml-2">({product.reviews} reviews)</span>
            </div>
            <div className="flex items-center justify-between mt-auto">
              <div>
                <span className="text-xl font-bold text-primary">₹{product.price.toLocaleString('en-IN')}</span>
                {product.originalPrice && product.originalPrice > product.price && ( <span className="text-sm text-muted-foreground line-through ml-2">₹{product.originalPrice.toLocaleString('en-IN')}</span> )}
              </div>
               <Button onClick={handleAddToCart} size="icon" className="h-9 w-9 flex-shrink-0" disabled={product.stock === 0}>
                <ShoppingCart className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
};

export default ProductCard;