import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Search, Filter, Star, TrendingUp, Package, ShoppingBag, ArrowRight } from 'lucide-react';
import Header from '@/components/Header';
import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useProducts } from '@/contexts/ProductContext';
import { Slider } from "@/components/ui/slider";

const HomePage = () => {
  const { products } = useProducts();
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 200000]);
  const maxPrice = Math.max(...products.map(p => p.price), 200000);

  const location = useLocation();
  
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const query = searchParams.get('search');
    if (query) {
      setSearchTerm(query);
    }
  }, [location.search]);

  useEffect(() => {
    let tempProducts = [...products];

    if (searchTerm) {
      tempProducts = tempProducts.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      tempProducts = tempProducts.filter(product => product.category === selectedCategory);
    }
    
    tempProducts = tempProducts.filter(product => product.price >= priceRange[0] && product.price <= priceRange[1]);

    setFilteredProducts(tempProducts);
  }, [searchTerm, selectedCategory, products, priceRange]);
  
  useEffect(() => {
    setPriceRange([0, maxPrice]);
  }, [maxPrice, products]);

  const categories = [
    { id: 'all', name: 'All' },
    { id: 'electronics', name: 'Electronics' },
    { id: 'fashion', name: 'Fashion' },
    { id: 'home', name: 'Home' }
  ];

  return (
    <>
      <Helmet>
        <title>MetaMart - Your Ultimate Shopping Destination</title>
        <meta name="description" content="Discover amazing products at MetaMart. Shop electronics, fashion, home goods and more with fast delivery and secure payments." />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        
        <section className="relative overflow-hidden hero-gradient pt-24 pb-20 md:pt-32 md:pb-28">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl md:text-6xl font-extrabold mb-4 tracking-tighter">
                Find Your Next Favorite Thing
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Explore thousands of products from top brands. Unbeatable prices, fast delivery, and a seamless shopping experience await.
              </p>
              <div className="flex justify-center gap-4">
                <Button asChild size="lg" className="relative overflow-hidden shine-effect">
                  <Link to="#products-section">Explore Now <ArrowRight className="ml-2 h-5 w-5"/></Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                   <Link to="/signup">Get Started</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="py-16 bg-secondary/50">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              {[
                { icon: Package, title: '10,000+', text: 'Products Available' },
                { icon: Star, title: '4.8/5', text: 'Customer Rating' },
                { icon: ShoppingBag, title: '50,000+', text: 'Happy Customers' }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex flex-col items-center gap-2"
                >
                  <div className="bg-primary/10 p-4 rounded-full">
                    <stat.icon className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold">{stat.title}</h3>
                    <p className="text-muted-foreground">{stat.text}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section id="products-section" className="py-20">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-12">
              <aside className="lg:w-80">
                <Card className="sticky top-24 glass-effect">
                  <CardHeader>
                    <CardTitle className="flex items-center text-xl font-bold">
                      <Filter className="h-5 w-5 mr-2" />
                      Filters
                    </CardTitle>
                    <CardDescription>Refine your search</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-8">
                    <div>
                      <h3 className="font-semibold mb-4 text-base">Category</h3>
                      <div className="flex flex-wrap gap-2">
                        {categories.map((category) => (
                          <Button
                            key={category.id}
                            variant={selectedCategory === category.id ? 'default' : 'secondary'}
                            size="sm"
                            className="rounded-full"
                            onClick={() => setSelectedCategory(category.id)}
                          >
                            {category.name}
                          </Button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-4 text-base">Price Range</h3>
                      <Slider
                        min={0}
                        max={maxPrice}
                        step={100}
                        value={priceRange}
                        onValueChange={setPriceRange}
                      />
                       <div className="flex justify-between text-sm text-muted-foreground mt-2">
                        <span>₹{priceRange[0].toLocaleString('en-IN')}</span>
                        <span>₹{priceRange[1].toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </aside>

              <main className="flex-1">
                <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
                  <h2 className="text-3xl font-bold tracking-tight">
                    {selectedCategory === 'all' ? 'All Products' : categories.find(c => c.id === selectedCategory)?.name}
                  </h2>
                  <p className="text-muted-foreground">
                    {filteredProducts.length} products found
                  </p>
                </div>

                <motion.div
                  layout
                  className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8"
                >
                  {filteredProducts.map((product) => (
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

                {filteredProducts.length === 0 && (
                  <div className="text-center py-20 bg-secondary rounded-lg">
                    <h3 className="text-xl font-semibold">No products found</h3>
                    <p className="text-muted-foreground mt-2">Try adjusting your search or filters.</p>
                  </div>
                )}
              </main>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default HomePage;