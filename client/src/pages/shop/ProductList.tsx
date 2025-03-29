import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

// Product interface
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  rating: number;
  reviewCount: number;
  image: string;
  category: string;
  tags: string[];
}

const sampleProducts: Product[] = [
    {
      id: '1',
      name: 'Daily Multivitamin',
      description: 'Comprehensive vitamin and mineral supplement for daily wellness.',
      price: 24.99,
      rating: 4.7,
      reviewCount: 128,
      image: 'https://picsum.photos/seed/vitamin1/300/300',
      category: 'Vitamins',
      tags: ['daily', 'essential', 'immunity'],
    },
    {
      id: '2',
      name: 'Omega-3 Fish Oil',
      description: 'High-quality omega-3 fatty acids for heart and brain health.',
      price: 19.99,
      rating: 4.5,
      reviewCount: 89,
      image: 'https://picsum.photos/seed/omega3/300/300',
      category: 'Supplements',
      tags: ['heart', 'brain', 'essential'],
    },
    {
      id: '3',
      name: 'Protein Powder',
      description: 'Plant-based protein powder for muscle recovery and growth.',
      price: 39.99,
      rating: 4.8,
      reviewCount: 243,
      image: 'https://picsum.photos/seed/protein/300/300',
      category: 'Nutrition',
      tags: ['fitness', 'muscle', 'plant-based'],
    },
    {
      id: '4',
      name: 'Probiotics',
      description: 'Advanced probiotic blend for digestive health and immune support.',
      price: 29.99,
      rating: 4.6,
      reviewCount: 112,
      image: 'https://picsum.photos/seed/probiotic/300/300',
      category: 'Digestive Health',
      tags: ['gut health', 'immunity', 'digestion'],
    },
    {
      id: '5',
      name: 'Vitamin D3',
      description: 'High-potency vitamin D3 for bone health and immune function.',
      price: 15.99,
      rating: 4.9,
      reviewCount: 198,
      image: 'https://picsum.photos/seed/vitamind/300/300',
      category: 'Vitamins',
      tags: ['bone health', 'immunity', 'sunshine vitamin'],
    },
    {
      id: '6',
      name: 'Magnesium Complex',
      description: 'Highly absorbable magnesium for muscle, nerve, and energy support.',
      price: 22.99,
      rating: 4.7,
      reviewCount: 156,
      image: 'https://picsum.photos/seed/magnesium/300/300',
      category: 'Minerals',
      tags: ['sleep', 'muscle', 'stress relief'],
    },
    {
      id: '7',
      name: 'Collagen Peptides',
      description: 'Hydrolyzed collagen powder for skin, hair, nails, and joint health.',
      price: 34.99,
      rating: 4.8,
      reviewCount: 267,
      image: 'https://picsum.photos/seed/collagen/300/300',
      category: 'Beauty',
      tags: ['skin', 'joints', 'anti-aging'],
    },
    {
      id: '8',
      name: 'Sleep Support Formula',
      description: 'Natural blend of melatonin, magnesium, and herbs for better sleep.',
      price: 27.99,
      rating: 4.6,
      reviewCount: 132,
      image: 'https://picsum.photos/seed/sleep/300/300',
      category: 'Sleep',
      tags: ['sleep', 'relaxation', 'melatonin'],
    },
  ];

// Filter options
const categories = ['All', 'Vitamins', 'Supplements', 'Nutrition', 'Digestive Health', 'Minerals', 'Beauty', 'Sleep'];

const ProductList: React.FC = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('recommended');
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch products (simulated)
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      
      try {
        // In a real app, this would be a GraphQL query
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Simulate personalized products based on user survey
        if (user?.surveyCompleted) {
          // In a real app, recommendations would come from the server
          // based on user preferences
          setProducts(sampleProducts);
        } else {
          setProducts(sampleProducts);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProducts();
  }, [user]);
  
  // Filter and sort products
  useEffect(() => {
    let filtered = [...products];
    
    // Apply category filter
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }
    
    // Apply sorting
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'recommended':
      default:
        // For recommended, we would normally have a score from the server
        // Here we'll simulate it with a combination of rating and review count
        filtered.sort((a, b) => (b.rating * Math.log10(b.reviewCount)) - (a.rating * Math.log10(a.reviewCount)));
        break;
    }
    
    setFilteredProducts(filtered);
  }, [products, selectedCategory, sortBy]);
  
  return (
    <div data-cy="product-list-page">
      {/* Header */}
      <div className="border-b border-gray-200 pb-5 sm:flex sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Products</h1>
        {user?.surveyCompleted && (
          <p className="mt-2 text-sm text-gray-500 sm:mt-0">
            Personalized recommendations based on your health profile
          </p>
        )}
      </div>
      
      {/* Filters */}
      <div className="mt-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="mb-4 sm:mb-0">
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              id="category"
              name="category"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              data-cy="category-filter"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="sort-by" className="block text-sm font-medium text-gray-700 mb-1">
              Sort by
            </label>
            <select
              id="sort-by"
              name="sort-by"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              data-cy="sort-filter"
            >
              <option value="recommended">Recommended</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Product grid */}
      {isLoading ? (
        <div className="mt-12 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="group relative animate-pulse">
              <div className="h-80 w-full overflow-hidden rounded-lg bg-gray-200"></div>
              <div className="mt-4 h-4 w-3/4 bg-gray-200 rounded"></div>
              <div className="mt-2 h-4 w-1/2 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {filteredProducts.length === 0 ? (
            <div className="mt-12 text-center py-12 px-4 sm:px-6 lg:px-8">
              <h3 className="mt-2 text-lg font-medium text-gray-900">No products found</h3>
              <p className="mt-1 text-sm text-gray-500">
                Try adjusting your filters or check back later for new products.
              </p>
            </div>
          ) : (
            <div className="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8" data-cy="product-grid">
              {filteredProducts.map((product) => (
                <Link 
                  key={product.id} 
                  to={`/products/${product.id}`} 
                  className="group relative"
                  data-cy={`product-${product.id}`}
                >
                  <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200 group-hover:opacity-75">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-full w-full object-cover object-center"
                    />
                  </div>
                  <div className="mt-4 flex justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">{product.name}</h3>
                      <div className="mt-1 flex items-center">
                        {[0, 1, 2, 3, 4].map((rating) => (
                          <svg
                            key={rating}
                            className={`h-4 w-4 flex-shrink-0 ${
                              product.rating > rating ? 'text-yellow-400' : 'text-gray-200'
                            }`}
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z"
                              clipRule="evenodd"
                            />
                          </svg>
                        ))}
                        <span className="ml-1 text-xs text-gray-500">({product.reviewCount})</span>
                      </div>
                      <p className="mt-1 text-sm text-gray-500">{product.category}</p>
                    </div>
                    <p className="text-sm font-medium text-gray-900">${product.price.toFixed(2)}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProductList;