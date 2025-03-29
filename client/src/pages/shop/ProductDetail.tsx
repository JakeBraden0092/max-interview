import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';

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
  ingredients?: string;
  usage?: string;
  benefits?: string[];
}

// Sample product data (in a real app, this would come from the GraphQL API)
const sampleProducts: Record<string, Product> = {
  '1': {
    id: '1',
    name: 'Daily Multivitamin',
    description: 'A comprehensive vitamin and mineral supplement designed to support overall health and fill nutritional gaps in your daily diet. Our formula contains essential nutrients in their most bioavailable forms for optimal absorption.',
    price: 24.99,
    rating: 4.7,
    reviewCount: 128,
    image: 'https://picsum.photos/seed/sleep/500/500',
    category: 'Vitamins',
    tags: ['daily', 'essential', 'immunity'],
    ingredients: 'Vitamin A (as beta-carotene), Vitamin C (as ascorbic acid), Vitamin D3 (as cholecalciferol), Vitamin E (as d-alpha tocopheryl), Vitamin K (as phytonadione), Thiamin (as thiamin mononitrate), Riboflavin, Niacin (as niacinamide), Vitamin B6 (as pyridoxine HCl), Folate (as methylfolate), Vitamin B12 (as methylcobalamin), Biotin, Pantothenic acid (as d-calcium pantothenate), Calcium (as calcium carbonate), Iron (as ferrous fumarate), Magnesium (as magnesium oxide), Zinc (as zinc citrate), Selenium (as selenomethionine), Copper (as copper gluconate), Manganese (as manganese gluconate), Chromium (as chromium picolinate), Molybdenum (as sodium molybdate), Potassium (as potassium chloride)',
    usage: 'Take 2 capsules daily with food or as directed by your healthcare professional.',
    benefits: [
      'Supports overall health and wellness',
      'Helps fill nutritional gaps in your diet',
      'Contains essential vitamins and minerals in their most bioavailable forms',
      'Promotes immune system function',
      'Supports energy production and reduces fatigue'
    ]
  },
  '2': {
    id: '2',
    name: 'Omega-3 Fish Oil',
    description: 'High-quality omega-3 fatty acids sourced from sustainable wild fish. Our molecular distillation process ensures purity and removes heavy metals, PCBs, and other contaminants.',
    price: 19.99,
    rating: 4.5,
    reviewCount: 89,
    image: 'https://picsum.photos/seed/sleep/500/500',
    category: 'Supplements',
    tags: ['heart', 'brain', 'essential'],
    ingredients: 'Fish oil concentrate (from sustainable wild fish), EPA (eicosapentaenoic acid), DHA (docosahexaenoic acid), gelatin capsule, glycerin, purified water, natural lemon flavor, mixed tocopherols (as preservative).',
    usage: 'Take 1-2 softgels daily with food or as directed by your healthcare professional.',
    benefits: [
      'Supports cardiovascular health',
      'Promotes brain function and cognitive health',
      'Helps reduce inflammation',
      'Supports joint health and flexibility',
      'Promotes eye health'
    ]
  },
  '3': {
    id: '3',
    name: 'Protein Powder',
    description: 'A premium plant-based protein powder blend featuring pea, rice, and hemp proteins for a complete amino acid profile. Our formula is designed to support muscle recovery, growth, and overall health.',
    price: 39.99,
    rating: 4.8,
    reviewCount: 243,
    image: 'https://picsum.photos/seed/sleep/500/500',
    category: 'Nutrition',
    tags: ['fitness', 'muscle', 'plant-based'],
    ingredients: 'Pea protein isolate, brown rice protein, hemp protein, coconut milk powder (coconut milk, maltodextrin, sodium caseinate), natural flavors, sea salt, stevia leaf extract, xanthan gum.',
    usage: 'Mix 1 scoop (30g) with 8-10 oz of water, almond milk, or your preferred beverage. Consume post-workout or as needed throughout the day to meet protein requirements.',
    benefits: [
      'Provides 25g of complete plant-based protein per serving',
      'Supports muscle recovery and growth',
      'Easy to digest and absorb',
      'Free from common allergens like dairy, soy, and gluten',
      'Great taste with no artificial sweeteners or flavors'
    ]
  },
  '4': {
    id: '4',
    name: 'Probiotics',
    description: 'Advanced probiotic blend featuring 50 billion CFU and 12 clinically studied strains for comprehensive digestive health and immune system support.',
    price: 29.99,
    rating: 4.6,
    reviewCount: 112,
    image: 'https://picsum.photos/seed/sleep/500/500',
    category: 'Digestive Health',
    tags: ['gut health', 'immunity', 'digestion'],
    ingredients: 'Probiotic blend (50 billion CFU): Lactobacillus acidophilus, Lactobacillus plantarum, Lactobacillus paracasei, Lactobacillus casei, Lactobacillus rhamnosus, Lactobacillus bulgaricus, Bifidobacterium lactis, Bifidobacterium bifidum, Bifidobacterium longum, Bifidobacterium breve, Streptococcus thermophilus, Saccharomyces boulardii; Vegetable capsule (hydroxypropyl methylcellulose), microcrystalline cellulose, vegetable magnesium stearate.',
    usage: 'Take 1 capsule daily with or without food. For enhanced digestive support, take 1 capsule twice daily.',
    benefits: [
      'Supports digestive health and regularity',
      'Helps balance gut microbiome',
      'Promotes immune system function',
      'Assists with nutrient absorption',
      'Shelf-stable formula - no refrigeration required'
    ]
  },
  '5': {
    id: '5',
    name: 'Vitamin D3',
    description: 'High-potency vitamin D3 (cholecalciferol) in an easy-to-absorb liquid softgel form. Supports bone health, immune function, muscle health, and overall wellness.',
    price: 15.99,
    rating: 4.9,
    reviewCount: 198,
    image: 'https://picsum.photos/seed/sleep/500/500',
    category: 'Vitamins',
    tags: ['bone health', 'immunity', 'sunshine vitamin'],
    ingredients: 'Vitamin D3 (as cholecalciferol), extra virgin olive oil, gelatin capsule, glycerin, purified water.',
    usage: 'Take 1 softgel daily with food or as directed by your healthcare professional.',
    benefits: [
      'Supports bone health and calcium absorption',
      'Promotes immune system function',
      'Assists with muscle function and strength',
      'Supports mood and cognitive health',
      'High potency 5000 IU (125mcg) formula'
    ]
  },
  '6': {
    id: '6',
    name: 'Magnesium Complex',
    description: 'Comprehensive magnesium formula featuring three highly absorbable forms of magnesium for optimal bioavailability. Supports muscle function, nerve health, energy production, and sleep quality.',
    price: 22.99,
    rating: 4.7,
    reviewCount: 156,
    image: 'https://picsum.photos/seed/sleep/500/500',
    category: 'Minerals',
    tags: ['sleep', 'muscle', 'stress relief'],
    ingredients: 'Magnesium (as magnesium glycinate, magnesium citrate, and magnesium malate), vegetable capsule (hydroxypropyl methylcellulose), microcrystalline cellulose.',
    usage: 'Take 2 capsules daily with food, preferably in the evening, or as directed by your healthcare professional.',
    benefits: [
      'Supports muscle relaxation and recovery',
      'Promotes healthy nerve function',
      'Assists with energy production and metabolism',
      'Supports restful sleep and stress management',
      'Promotes cardiovascular health'
    ]
  },
  '7': {
    id: '7',
    name: 'Collagen Peptides',
    description: 'Premium hydrolyzed collagen peptides sourced from grass-fed, pasture-raised bovine. Unflavored and dissolves easily in hot or cold liquids to support skin, hair, nails, joints, and gut health.',
    price: 34.99,
    rating: 4.8,
    reviewCount: 267,
    image: 'https://picsum.photos/seed/sleep/500/500',
    category: 'Beauty',
    tags: ['skin', 'joints', 'anti-aging'],
    ingredients: 'Hydrolyzed bovine collagen peptides (from grass-fed, pasture-raised cattle).',
    usage: 'Mix 1-2 scoops (10-20g) into coffee, tea, smoothies, soups, or any hot or cold beverage. Can also be added to foods like oatmeal, yogurt, or baked goods.',
    benefits: [
      'Supports skin elasticity and hydration',
      'Promotes hair and nail strength and growth',
      'Supports joint health and mobility',
      'Assists with gut lining integrity',
      'Mixes easily with no taste or texture'
    ]
  },
  '8': {
    id: '8',
    name: 'Sleep Support Formula',
    description: 'Comprehensive sleep support formula featuring melatonin, magnesium, and calming herbs to help you fall asleep faster, stay asleep longer, and wake up refreshed without morning grogginess.',
    price: 27.99,
    rating: 4.6,
    reviewCount: 132,
    image: 'https://picsum.photos/seed/sleep/500/500',
    category: 'Sleep',
    tags: ['sleep', 'relaxation', 'melatonin'],
    ingredients: 'Magnesium (as magnesium glycinate), Valerian root extract, Passionflower extract, Chamomile flower extract, L-theanine, GABA (gamma-aminobutyric acid), Melatonin, vegetable capsule (hydroxypropyl methylcellulose), microcrystalline cellulose.',
    usage: 'Take 1-2 capsules 30-60 minutes before bedtime or as directed by your healthcare professional.',
    benefits: [
      'Helps you fall asleep faster',
      'Promotes longer, deeper sleep cycles',
      'Reduces nighttime awakenings',
      'Calms mind and reduces stress',
      'Non-habit forming formula'
    ]
  },
};

// Related products component
const RelatedProducts: React.FC<{ currentProductId: string; category: string }> = ({ currentProductId, category }) => {
  // Get products in the same category
  const relatedProducts = Object.values(sampleProducts)
    .filter(product => product.id !== currentProductId && product.category === category)
    .slice(0, 4);
  
  if (relatedProducts.length === 0) return null;
  
  return (
    <div className="mt-16">
      <h2 className="text-2xl font-bold tracking-tight text-gray-900">Customers also purchased</h2>
      
      <div className="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
        {relatedProducts.map((product) => (
          <Link 
            key={product.id} 
            to={`/products/${product.id}`} 
            className="group relative"
            data-cy={`related-product-${product.id}`}
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
                <p className="mt-1 text-sm text-gray-500">{product.category}</p>
              </div>
              <p className="text-sm font-medium text-gray-900">${product.price.toFixed(2)}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { addItem } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  
  // Fetch product (simulated)
  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);
      
      try {
        // In a real app, this would be a GraphQL query
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Get product by ID
        if (id && sampleProducts[id]) {
          setProduct(sampleProducts[id]);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProduct();
  }, [id]);
  
  // Handle quantity change
  const handleQuantityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setQuantity(parseInt(e.target.value));
  };
  
  // Handle add to cart
  const handleAddToCart = async () => {
    if (!product) return;
    
    setAddingToCart(true);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 600));
      
      // Add item to cart
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: quantity,
        image: product.image,
      });
      
      // Show success message or redirect to cart
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setAddingToCart(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="animate-pulse" data-cy="product-loading">
        <div className="md:grid md:grid-cols-2 md:gap-8">
          <div className="h-96 bg-gray-200 rounded-lg"></div>
          <div className="mt-4 md:mt-0">
            <div className="h-8 bg-gray-200 rounded w-2/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-10 bg-gray-200 rounded mb-4"></div>
          </div>
        </div>
      </div>
    );
  }
  
  if (!product) {
    return (
      <div className="text-center py-12" data-cy="product-not-found">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Product not found</h2>
        <p className="mt-4 text-gray-500">The product you're looking for doesn't exist or has been removed.</p>
        <div className="mt-6">
          <Link
            to="/products"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            data-cy="back-to-products"
          >
            Back to Products
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white" data-cy="product-detail-page">
      <div className="pt-6">
        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb">
          <ol role="list" className="mx-auto flex items-center space-x-2 px-4 sm:px-6 lg:px-0">
            <li>
              <div className="flex items-center">
                <Link to="/products" className="mr-2 text-sm font-medium text-gray-900">
                  Products
                </Link>
                <svg
                  width={16}
                  height={20}
                  viewBox="0 0 16 20"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                  className="h-5 w-4 text-gray-300"
                >
                  <path d="M5.697 4.34L8.98 16.532h1.327L7.025 4.341H5.697z" />
                </svg>
              </div>
            </li>
            <li className="text-sm">
              <Link to={`/products?category=${product.category}`} className="font-medium text-gray-500 hover:text-gray-600">
                {product.category}
              </Link>
            </li>
          </ol>
        </nav>

        {/* Product */}
        <div className="mx-auto mt-6 max-w-2xl sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
          {/* Product image */}
          <div className="aspect-w-4 aspect-h-3 overflow-hidden rounded-lg lg:block">
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-cover object-center"
              data-cy="product-image"
            />
          </div>
          
          {/* Product details */}
          <div className="mx-auto mt-4 max-w-2xl px-4 sm:px-6 lg:px-0">
            <div className="lg:col-span-2 lg:pr-8">
              <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl" data-cy="product-name">
                {product.name}
              </h1>
              
              {/* Reviews */}
              <div className="mt-2">
                <div className="flex items-center">
                  <div className="flex items-center">
                    {[0, 1, 2, 3, 4].map((rating) => (
                      <svg
                        key={rating}
                        className={`h-5 w-5 flex-shrink-0 ${
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
                  </div>
                  <p className="ml-3 text-sm text-gray-700">
                    {product.rating.toFixed(1)} ({product.reviewCount} reviews)
                  </p>
                </div>
              </div>
              
              {/* Price */}
              <div className="mt-4">
                <p className="text-3xl tracking-tight text-gray-900" data-cy="product-price">
                  ${product.price.toFixed(2)}
                </p>
              </div>
              
              {/* Tabs */}
              <div className="mt-8 border-b border-gray-200">
                <div className="-mb-px flex space-x-8" aria-orientation="horizontal" role="tablist">
                  <button
                    id="tab-description"
                    className={`${
                      activeTab === 'description'
                        ? 'border-primary-600 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } whitespace-nowrap border-b-2 py-2 px-1 text-sm font-medium`}
                    onClick={() => setActiveTab('description')}
                    role="tab"
                    aria-controls="tab-panel-description"
                    aria-selected={activeTab === 'description'}
                    data-cy="tab-description"
                  >
                    Description
                  </button>
                  <button
                    id="tab-details"
                    className={`${
                      activeTab === 'details'
                        ? 'border-primary-600 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } whitespace-nowrap border-b-2 py-2 px-1 text-sm font-medium`}
                    onClick={() => setActiveTab('details')}
                    role="tab"
                    aria-controls="tab-panel-details"
                    aria-selected={activeTab === 'details'}
                    data-cy="tab-details"
                  >
                    Details
                  </button>
                  <button
                    id="tab-benefits"
                    className={`${
                      activeTab === 'benefits'
                        ? 'border-primary-600 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } whitespace-nowrap border-b-2 py-2 px-1 text-sm font-medium`}
                    onClick={() => setActiveTab('benefits')}
                    role="tab"
                    aria-controls="tab-panel-benefits"
                    aria-selected={activeTab === 'benefits'}
                    data-cy="tab-benefits"
                  >
                    Benefits
                  </button>
                </div>
              </div>
              
              {/* Tab content */}
              <div className="mt-6">
                {/* Description tab */}
                <div
                  id="tab-panel-description"
                  className={activeTab === 'description' ? 'block' : 'hidden'}
                  role="tabpanel"
                  aria-labelledby="tab-description"
                >
                  <p className="text-base text-gray-900" data-cy="product-description">
                    {product.description}
                  </p>
                </div>
                
                {/* Details tab */}
                <div
                  id="tab-panel-details"
                  className={activeTab === 'details' ? 'block' : 'hidden'}
                  role="tabpanel"
                  aria-labelledby="tab-details"
                >
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Ingredients</h3>
                      <p className="mt-2 text-sm text-gray-600" data-cy="product-ingredients">
                        {product.ingredients}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Recommended Usage</h3>
                      <p className="mt-2 text-sm text-gray-600" data-cy="product-usage">
                        {product.usage}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Category</h3>
                      <p className="mt-2 text-sm text-gray-600">{product.category}</p>
                    </div>
                  </div>
                </div>
                
                {/* Benefits tab */}
                <div
                  id="tab-panel-benefits"
                  className={activeTab === 'benefits' ? 'block' : 'hidden'}
                  role="tabpanel"
                  aria-labelledby="tab-benefits"
                  data-cy="product-benefits"
                >
                  <ul className="list-disc pl-5 space-y-2 text-sm text-gray-600">
                    {product.benefits?.map((benefit, index) => (
                      <li key={index}>{benefit}</li>
                    ))}
                  </ul>
                </div>
              </div>
              
              {/* Add to cart */}
              <div className="mt-8">
                <div className="flex items-center">
                  <label htmlFor="quantity" className="mr-4 text-sm font-medium text-gray-700">
                    Quantity
                  </label>
                  <select
                    id="quantity"
                    name="quantity"
                    className="block max-w-full rounded-md border border-gray-300 py-1.5 text-left text-base font-medium leading-5 text-gray-700 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 sm:text-sm"
                    value={quantity}
                    onChange={handleQuantityChange}
                    data-cy="quantity-select"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((value) => (
                      <option key={value} value={value}>
                        {value}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="mt-4 flex">
                  <button
                    type="button"
                    className="flex w-full items-center justify-center rounded-md border border-transparent bg-primary-600 py-3 px-8 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50"
                    onClick={handleAddToCart}
                    disabled={addingToCart}
                    data-cy="add-to-cart-button"
                  >
                    {addingToCart ? (
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : (
                      'Add to cart'
                    )}
                  </button>
                </div>
                
                {/* Tags */}
                <div className="mt-6">
                  <div className="flex items-center space-x-2">
                    {product.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center rounded-full bg-primary-100 px-2.5 py-0.5 text-xs font-medium text-primary-800"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Related products */}
        <RelatedProducts currentProductId={product.id} category={product.category} />
      </div>
    </div>
  );
};

export default ProductDetail;