import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Search, ArrowLeft, Upload, Image as ImageIcon } from 'lucide-react';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { useProducts } from '@/contexts/ProductContext';
import { Label } from '@/components/ui/label';

const AdminProducts = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState(null);
  const { toast } = useToast();
  
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openNewProductDialog = () => {
    setEditingProduct(null);
    setProductForm({
      name: '',
      description: '',
      price: '',
      originalPrice: '',
      images: [''],
      category: 'electronics',
      stock: 0,
    });
    setIsDialogOpen(true);
  };

  const openEditProductDialog = (product) => {
    setEditingProduct(product);
    setProductForm({ ...product });
    setIsDialogOpen(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setProductForm(prev => ({ ...prev, [name]: value }));
  };
  
  const handleImageChange = (index, value) => {
      const newImages = [...productForm.images];
      newImages[index] = value;
      setProductForm(prev => ({ ...prev, images: newImages }));
  };
  
  const addImageField = () => {
      setProductForm(prev => ({...prev, images: [...prev.images, '']}))
  };
  
  const removeImageField = (index) => {
      setProductForm(prev => ({...prev, images: prev.images.filter((_, i) => i !== index)}))
  }

  const handleFormSubmit = (e) => {
    e.preventDefault();
    
    const productData = {
      ...productForm,
      price: parseFloat(productForm.price),
      originalPrice: productForm.originalPrice ? parseFloat(productForm.originalPrice) : null,
      stock: parseInt(productForm.stock, 10),
      rating: editingProduct ? editingProduct.rating : Math.round((Math.random() * 2 + 3) * 10) / 10,
      reviews: editingProduct ? editingProduct.reviews : Math.floor(Math.random() * 100),
      images: productForm.images.filter(img => img.trim() !== '')
    };
    
    if (editingProduct) {
      updateProduct({ ...productData, id: editingProduct.id });
      toast({ title: "Product updated!", description: `${productData.name} has been updated.` });
    } else {
      addProduct({ ...productData, id: Date.now().toString() });
      toast({ title: "Product added!", description: `${productData.name} has been added.` });
    }
    
    setIsDialogOpen(false);
    setEditingProduct(null);
  };

  const handleDeleteProduct = (productId, productName) => {
    deleteProduct(productId);
    toast({
      title: "Product deleted",
      description: `${productName} has been removed.`,
      variant: "destructive",
    });
  };

  return (
    <>
      <Helmet>
        <title>Manage Products - Admin - MetaMart</title>
        <meta name="description" content="Manage product inventory with MetaMart admin panel." />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <Header />
        
        <div className="container mx-auto px-4 py-8">
          <Link to="/admin" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>

          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold">Manage Products</h1>
            <Button onClick={openNewProductDialog}>
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </div>

          <div className="mb-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <motion.div key={product.id} layout>
                <Card className="h-full flex flex-col">
                  <CardContent className="p-4 flex-grow flex flex-col">
                    <div className="aspect-square overflow-hidden rounded-lg mb-4 bg-muted flex items-center justify-center">
                      {product.images && product.images[0] ? (
                        <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                      ) : (
                        <ImageIcon className="w-12 h-12 text-muted-foreground" />
                      )}
                    </div>
                    <h3 className="font-semibold text-lg mb-2 line-clamp-2 flex-grow">{product.name}</h3>
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <span className="text-xl font-bold text-primary">₹{product.price.toLocaleString('en-IN')}</span>
                      </div>
                      <span className={`text-sm font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                      </span>
                    </div>
                  </CardContent>
                   <div className="p-4 pt-0 border-t mt-auto">
                    <div className="flex space-x-2 mt-4">
                      <Button variant="outline" size="sm" className="flex-1" onClick={() => openEditProductDialog(product)}>
                        <Edit className="h-4 w-4 mr-1" /> Edit
                      </Button>
                      <Button variant="destructive" size="icon" onClick={() => handleDeleteProduct(product.id, product.name)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
          {filteredProducts.length === 0 && (
            <div className="text-center py-12"><p className="text-muted-foreground text-lg">No products found.</p></div>
          )}
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
            <DialogDescription>
              {editingProduct ? 'Update the details of your product.' : 'Fill in the details for the new product.'}
            </DialogDescription>
          </DialogHeader>
          {productForm && (
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name</Label>
                <Input id="name" name="name" value={productForm.name} onChange={handleFormChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input id="description" name="description" value={productForm.description} onChange={handleFormChange} required />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                 <div className="space-y-2">
                   <Label htmlFor="price">Price (₹)</Label>
                   <Input id="price" name="price" type="number" step="1" value={productForm.price} onChange={handleFormChange} required />
                 </div>
                 <div className="space-y-2">
                   <Label htmlFor="originalPrice">Original Price (₹)</Label>
                   <Input id="originalPrice" name="originalPrice" type="number" step="1" value={productForm.originalPrice} onChange={handleFormChange} />
                 </div>
                 <div className="space-y-2">
                   <Label htmlFor="stock">Stock</Label>
                   <Input id="stock" name="stock" type="number" value={productForm.stock} onChange={handleFormChange} required />
                 </div>
              </div>
              <div className="space-y-2">
                <Label>Images</Label>
                {productForm.images.map((image, index) => (
                    <div key={index} className="flex items-center gap-2">
                        <Input type="url" placeholder="https://example.com/image.png" value={image} onChange={(e) => handleImageChange(index, e.target.value)} />
                        {productForm.images.length > 1 && <Button type="button" variant="destructive" size="icon" onClick={() => removeImageField(index)}><Trash2 className="h-4 w-4"/></Button>}
                    </div>
                ))}
                 <Button type="button" variant="outline" size="sm" onClick={addImageField}>Add another image</Button>
                 <div className="flex items-center gap-2 p-3 bg-secondary rounded-md">
                     <Upload className="h-8 w-8 text-muted-foreground"/>
                     <p className="text-sm text-muted-foreground">Image upload is not available in this demo. Please provide image URLs.</p>
                 </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <select id="category" name="category" value={productForm.category} onChange={handleFormChange} className="w-full p-2 border rounded-md bg-background">
                  <option value="electronics">Electronics</option>
                  <option value="fashion">Fashion</option>
                  <option value="home">Home & Garden</option>
                </select>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                <Button type="submit">{editingProduct ? 'Save Changes' : 'Add Product'}</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AdminProducts;