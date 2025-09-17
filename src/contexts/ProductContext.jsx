import React, { createContext, useContext, useState, useEffect } from 'react';

const ProductContext = createContext();

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};

const initialProducts = [
  {
    id: '1',
    name: 'Wireless Bluetooth Headphones',
    description: 'Immersive sound with noise cancellation.',
    longDescription: 'These premium wireless headphones feature state-of-the-art noise cancellation technology, delivering crystal-clear audio quality. With up to 30 hours of battery life and quick charge capability, they are perfect for long listening sessions. The comfortable over-ear design ensures all-day comfort, while the premium materials provide durability and style.',
    price: 8999,
    originalPrice: 12999,
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&h=800&fit=crop'
    ],
    category: 'electronics',
    rating: 4.5,
    reviews: 128,
    stock: 25,
    sales: 150
  },
  {
    id: '2',
    name: 'Smart Fitness Watch',
    description: 'Track your health and fitness seamlessly.',
    longDescription: 'Stay connected and monitor your health with this sleek smartwatch. It tracks your heart rate, sleep, and daily activities. It also syncs with your phone to deliver notifications right to your wrist.',
    price: 15999,
    originalPrice: 22999,
    images: [
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=800&fit=crop',
        'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&h=800&fit=crop'
    ],
    category: 'electronics',
    rating: 4.8,
    reviews: 256,
    stock: 15,
    sales: 220
  },
  {
    id: '3',
    name: 'Organic Cotton T-Shirt',
    description: 'Comfortable and sustainable everyday essential.',
    longDescription: 'Made from 100% GOTS certified organic cotton, this t-shirt is both soft and environmentally friendly. It features a classic fit that is perfect for everyday wear.',
    price: 2499,
    originalPrice: 3499,
    images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=800&fit=crop'],
    category: 'fashion',
    rating: 4.2,
    reviews: 89,
    stock: 50,
    sales: 300
  },
  {
    id: '4',
    name: 'Modern Table Lamp',
    description: 'Stylish LED lamp for any modern room.',
    longDescription: 'Illuminate your space with this minimalist and modern table lamp. It provides a warm, flicker-free light that is easy on the eyes, making it ideal for reading or working.',
    price: 6999,
    originalPrice: 8000,
    images: ['https://images.unsplash.com/photo-1543508282-6319a3e2621f?w=800&h=800&fit=crop'],
    category: 'home',
    rating: 4.6,
    reviews: 45,
    stock: 30,
    sales: 95
  },
   {
    id: '5',
    name: 'Professional DSLR Camera',
    description: 'Capture stunning photos with this professional DSLR.',
    longDescription: 'Unleash your creativity with this full-frame DSLR camera. Featuring a high-resolution sensor, fast autofocus, and 4K video recording, it\'s the perfect tool for both photographers and videographers. Its robust body is weather-sealed for shooting in challenging conditions.',
    price: 149999,
    originalPrice: 179999,
    images: ['https://images.unsplash.com/photo-1512756290469-ec264b7fbf87?w=800&h=800&fit=crop'],
    category: 'electronics',
    rating: 4.9,
    reviews: 312,
    stock: 10,
    sales: 50
  },
  {
    id: '6',
    name: 'Leather Weekend Bag',
    description: 'Travel in style with this genuine leather bag.',
    longDescription: 'This spacious weekend bag is crafted from high-quality full-grain leather that will develop a beautiful patina over time. It features a large main compartment, multiple pockets for organization, and a detachable shoulder strap for comfortable carrying.',
    price: 18999,
    originalPrice: 24999,
    images: ['https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&h=800&fit=crop'],
    category: 'fashion',
    rating: 4.7,
    reviews: 76,
    stock: 22,
    sales: 80
  },
  {
    id: '7',
    name: 'Ergonomic Office Chair',
    description: 'Support your back with this ergonomic chair.',
    longDescription: 'Improve your posture and work in comfort with this ergonomic office chair. It offers adjustable lumbar support, armrests, and seat height. The breathable mesh back keeps you cool throughout the day.',
    price: 24999,
    originalPrice: 32000,
    images: ['https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=800&h=800&fit=crop'],
    category: 'home',
    rating: 4.8,
    reviews: 150,
    stock: 18,
    sales: 120
  },
  {
    id: '8',
    name: 'Gourmet Coffee Beans',
    description: 'Start your day with freshly roasted coffee.',
    longDescription: 'A blend of premium Arabica beans from South America and Africa, this coffee offers rich notes of chocolate and citrus. Roasted in small batches to ensure maximum freshness and flavor.',
    price: 1999,
    originalPrice: 1899,
    images: ['https://images.unsplash.com/photo-1559493132-23423719e543?w=800&h=800&fit=crop'],
    category: 'home',
    rating: 4.6,
    reviews: 95,
    stock: 100,
    sales: 400
  },
];

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState(() => {
    const savedProducts = localStorage.getItem('metamart-products');
    if (savedProducts) {
        try {
            const parsed = JSON.parse(savedProducts);
            if (Array.isArray(parsed) && parsed.length > 0) {
                return parsed;
            }
        } catch (e) {
            console.error("Failed to parse products from localStorage", e);
        }
    }
    return initialProducts;
  });

  useEffect(() => {
    localStorage.setItem('metamart-products', JSON.stringify(products));
  }, [products]);

  const addProduct = (product) => {
    setProducts(prev => [...prev, product]);
  };

  const updateProduct = (updatedProduct) => {
    setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
  };

  const deleteProduct = (productId) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
  };

  const getProductById = (id) => {
    return products.find(p => p.id === id);
  };

  const updateStock = (productId, quantity) => {
    setProducts(prev => prev.map(p => 
      p.id === productId ? { ...p, stock: p.stock - quantity } : p
    ));
  };

  return (
    <ProductContext.Provider value={{
      products,
      addProduct,
      updateProduct,
      deleteProduct,
      getProductById,
      updateStock
    }}>
      {children}
    </ProductContext.Provider>
  );
};