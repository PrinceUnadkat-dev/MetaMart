import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ShoppingCart, Heart, Share2, Minus, Plus, ArrowLeft, ChevronLeft, ChevronRight, ShieldCheck } from 'lucide-react';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useProducts } from '@/contexts/ProductContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { toast } from '@/components/ui/use-toast';
import { Badge } from '@/components/ui/badge';

const ProductPage = () => {
  const { id } = useParams();
  const { products, getProductById } = useProducts();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    setProduct(getProductById(id));
  }, [id, getProductById, products]);
  
  const isFavorited = product ? isInWishlist(product.id) : false;

  const handleAddToCart = () => {
    if (!user) {
      toast({ title: "Please login first", description: "You need to be logged in to add items to cart", variant: "destructive" });
      return;
    }
    const added = addToCart(product, quantity);
    if(added) {
      toast({ title: "Added to cart!", description: `${quantity} x ${product.name} added to your cart` });
    } else {
      toast({ title: "Not enough stock!", description: `Only ${product.stock} items available.`, variant: "destructive" });
    }
  };

  const handleWishlistToggle = () => {
    if (!user) {
      toast({ title: "Please login first", description: "You need to be logged in to add items to your wishlist.", variant: "destructive" });
      return;
    }
    toggleWishlist(product);
    toast({
      title: isFavorited ? "Removed from favorites" : "Added to favorites!",
      description: isFavorited ? `${product.name} has been removed from your favorites.` : `${product.name} has been added to your favorites.`
    });
  };

  const handleShare = () => toast({ title: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀" });
  const nextImage = () => setSelectedImage((prev) => (prev + 1) % product.images.length);
  const prevImage = () => setSelectedImage((prev) => (prev - 1 + product.images.length) % product.images.length);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background"><div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div></div>
    );
  }

  const currentProductStock = products.find(p => p.id === product.id)?.stock || 0;

  return (
    <>
      <Helmet><title>{product.name} - MetaMart</title><meta name="description" content={product.description} /></Helmet>
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <Button variant="ghost" asChild><Link to="/"><ArrowLeft className="h-4 w-4 mr-2" />Back to Products</Link></Button>
          </div>
          <Card>
            <CardContent className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="grid grid-cols-1 gap-4 items-start">
                  <div className="relative">
                    <div className="relative aspect-square overflow-hidden rounded-lg border">
                      <AnimatePresence initial={false}>
                        <motion.img
                          key={selectedImage}
                          src={product.images[selectedImage]}
                          alt={product.name}
                          className="w-full h-full object-cover"
                          initial={{ x: 30, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          exit={{ x: -30, opacity: 0 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                        />
                      </AnimatePresence>
                    </div>
                     {product.images.length > 1 && (
                        <>
                           <Button variant="ghost" size="icon" className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/50 hover:bg-background/80" onClick={prevImage}><ChevronLeft className="h-6 w-6" /></Button>
                           <Button variant="ghost" size="icon" className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/50 hover:bg-background/80" onClick={nextImage}><ChevronRight className="h-6 w-6" /></Button>
                        </>
                     )}
                  </div>
                
                {product.images.length > 1 && (
                  <div className="flex space-x-2">
                    {product.images.map((image, index) => (
                      <button key={index} onClick={() => setSelectedImage(index)} className={`w-20 h-20 rounded-lg border-2 overflow-hidden transition-all ${selectedImage === index ? 'border-primary scale-105' : 'border-transparent hover:border-muted-foreground/50'}`}>
                        <img src={image} alt={`${product.name} thumbnail ${index + 1}`} className="w-full h-full object-cover"/>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-6">
                <div>
                  <Badge variant="outline" className="mb-2">{product.category}</Badge>
                  <h1 className="text-3xl lg:text-4xl font-bold mb-2">{product.name}</h1>
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (<Star key={i} className={`h-5 w-5 ${ i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300' }`} />))}
                    </div>
                    <span className="text-muted-foreground">{product.rating} ({product.reviews} reviews)</span>
                  </div>
                  <div className="flex items-baseline gap-4 mb-6">
                    <span className="text-4xl font-bold text-primary">₹{product.price.toLocaleString('en-IN')}</span>
                    {product.originalPrice && <span className="text-xl text-muted-foreground line-through">₹{product.originalPrice.toLocaleString('en-IN')}</span>}
                  </div>
                </div>

                <p className="text-muted-foreground text-lg leading-relaxed">{product.description}</p>
                
                <Card className="bg-secondary/50">
                    <CardContent className="p-6 space-y-4">
                      <div className="flex items-center space-x-4">
                        <span className="font-medium">Quantity:</span>
                        <div className="flex items-center border rounded-lg bg-background">
                          <Button variant="ghost" size="icon" onClick={() => setQuantity(Math.max(1, quantity - 1))} disabled={quantity <= 1}><Minus className="h-4 w-4" /></Button>
                          <span className="px-4 py-2 font-medium w-16 text-center">{quantity}</span>
                          <Button variant="ghost" size="icon" onClick={() => setQuantity(Math.min(currentProductStock, quantity + 1))} disabled={quantity >= currentProductStock}><Plus className="h-4 w-4" /></Button>
                        </div>
                        {currentProductStock > 0 ? (
                           <Badge variant={currentProductStock <= 10 ? 'destructive' : 'secondary'}>{currentProductStock} in stock</Badge>
                        ): (
                           <Badge variant="destructive">Out of stock</Badge>
                        )}
                      </div>
                      <div className="flex flex-col sm:flex-row gap-4">
                        <Button onClick={handleAddToCart} className="flex-1" size="lg" disabled={currentProductStock === 0}><ShoppingCart className="h-5 w-5 mr-2" />{currentProductStock === 0 ? "Out of Stock" : "Add to Cart" }</Button>
                        <div className="flex gap-4">
                            <Button variant="outline" size="lg" onClick={handleWishlistToggle} className="flex-1 sm:flex-none">
                              <Heart className={`h-5 w-5 ${isFavorited ? 'fill-red-500 text-red-500' : ''}`} />
                            </Button>
                            <Button variant="outline" size="lg" onClick={handleShare} className="flex-1 sm:flex-none"><Share2 className="h-5 w-5" /></Button>
                        </div>
                      </div>
                    </CardContent>
                </Card>
                 <div className="flex items-center text-sm text-muted-foreground gap-2"><ShieldCheck className="h-5 w-5 text-green-500" /><span>Secure payments & 100% authentic products</span></div>
              </div>
            </CardContent>
          </Card>

          <div className="mt-16">
              <Card>
                <CardHeader><CardTitle>Product Details</CardTitle></CardHeader>
                <CardContent><p className="text-muted-foreground leading-relaxed">{product.longDescription}</p></CardContent>
              </Card>
          </div>
        </main>
      </div>
    </>
  );
};

export default ProductPage;