const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { AuthenticationError, UserInputError } = require('apollo-server-express');

const db = {
  users: [],
  products: [],
  carts: [],
  orders: [],
  healthProfiles: [],
};

// Helper functions
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '30d' }
  );
};

const getUser = (context) => {
  const authHeader = context.req.headers.authorization;
  
  if (!authHeader) {
    throw new AuthenticationError('Authorization header must be provided');
  }
  
  const token = authHeader.replace('Bearer ', '');
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const user = db.users.find(user => user.id === decoded.id);
    
    if (!user) {
      throw new Error('User not found');
    }
    
    return user;
  } catch (err) {
    throw new AuthenticationError('Invalid/Expired token');
  }
};

// Resolvers
const resolvers = {
  Query: {
    // Auth
    me: (_, __, context) => {
      return getUser(context);
    },
    
    // Products
    products: (_, { category, tag, search, sortBy, limit = 10, offset = 0 }) => {
      let filteredProducts = [...db.products];
      
      // Apply filters
      if (category) {
        filteredProducts = filteredProducts.filter(product => 
          product.category.name.toLowerCase() === category.toLowerCase()
        );
      }
      
      if (tag) {
        filteredProducts = filteredProducts.filter(product => 
          product.tags.some(t => t.toLowerCase() === tag.toLowerCase())
        );
      }
      
      if (search) {
        const searchLower = search.toLowerCase();
        filteredProducts = filteredProducts.filter(product => 
          product.name.toLowerCase().includes(searchLower) || 
          product.description.toLowerCase().includes(searchLower)
        );
      }
      
      // Apply sorting
      if (sortBy) {
        switch (sortBy) {
          case 'price_asc':
            filteredProducts.sort((a, b) => a.price - b.price);
            break;
          case 'price_desc':
            filteredProducts.sort((a, b) => b.price - a.price);
            break;
          case 'rating':
            filteredProducts.sort((a, b) => b.rating - a.rating);
            break;
          case 'newest':
            filteredProducts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            break;
        }
      }
      
      // Apply pagination
      return filteredProducts.slice(offset, offset + limit);
    },
    
    product: (_, { id }) => {
      return db.products.find(product => product.id === id);
    },
    
    categories: () => {
      // Get all unique categories from products
      const categoriesMap = db.products.reduce((acc, product) => {
        if (!acc[product.category.id]) {
          acc[product.category.id] = product.category;
        }
        return acc;
      }, {});
      
      return Object.values(categoriesMap);
    },
    
    category: (_, { id }) => {
      // Find category by ID
      const product = db.products.find(p => p.category.id === id);
      return product ? product.category : null;
    },
    
    recommendedProducts: (_, __, context) => {
      const user = getUser(context);
      
      const healthProfile = db.healthProfiles.find(profile => profile.user.id === user.id);
      
      let recommendedProducts = [];
      
      if (healthProfile) {
        recommendedProducts = db.products.filter(product => {
          if (healthProfile.healthGoals.includes('weight_loss') && 
              product.tags.includes('weight loss')) {
            return true;
          }
        
          if (healthProfile.allergies.some(allergy => 
            product.ingredients && product.ingredients.toLowerCase().includes(allergy.toLowerCase())
          )) {
            return false;
          }
        
          return false;
        });
      }
      
      if (recommendedProducts.length < 4) {
        const popularProducts = db.products
          .sort((a, b) => b.rating - a.rating)
          .filter(p => !recommendedProducts.some(rp => rp.id === p.id))
          .slice(0, 4 - recommendedProducts.length);
        
        recommendedProducts = [...recommendedProducts, ...popularProducts];
      }
      
      return { products: recommendedProducts.slice(0, 8) };
    },
    
    // Cart
    cart: (_, __, context) => {
      const user = getUser(context);
      return db.carts.find(cart => cart.user.id === user.id);
    },
    
    // Orders
    orders: (_, __, context) => {
      const user = getUser(context);
      return db.orders.filter(order => order.user.id === user.id);
    },
    
    order: (_, { id }, context) => {
      const user = getUser(context);
      const order = db.orders.find(o => o.id === id);
      
      if (!order) {
        throw new Error('Order not found');
      }
      
      if (order.user.id !== user.id) {
        throw new AuthenticationError('Not authorized to view this order');
      }
      
      return order;
    },
  },
  
  Mutation: {
     // Auth
     signUp: async (_, { input }) => {
        const { email, password } = input;
        
        // Check if user already exists
        if (db.users.some(user => user.email === email)) {
          throw new UserInputError('Email already in use');
        }
        
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Create new user
        const newUser = {
          id: `user_${Date.now()}`,
          email,
          password: hashedPassword,
          profileCompleted: false,
          surveyCompleted: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        db.users.push(newUser);
        
        // Generate token
        const token = generateToken(newUser);
        
        return {
          token,
          user: newUser,
        };
      },
      
      signIn: async (_, { input }) => {
        const { email, password } = input;
        
        // Find user
        const user = db.users.find(u => u.email === email);
        
        if (!user) {
          throw new UserInputError('Invalid email or password');
        }
        
        // Check password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        
        if (!isPasswordValid) {
          throw new UserInputError('Invalid email or password');
        }
        
        // Generate token
        const token = generateToken(user);
        
        return {
          token,
          user,
        };
      },
      
      signOut: () => {
        return true;
      },
      
      // Profile
      updateProfile: (_, { input }, context) => {
        const user = getUser(context);
        const { firstName, lastName, phone, birthDate, address } = input;
        
        // Update user object
        const updatedUser = {
          ...user,
          firstName,
          lastName,
          phone,
          birthDate,
          profileCompleted: true,
          updatedAt: new Date().toISOString(),
        };
        
        // Update address if provided
        if (address) {
          updatedUser.address = {
            id: `address_${Date.now()}`,
            ...address,
          };
        }
        
        // Update user in database
        const userIndex = db.users.findIndex(u => u.id === user.id);
        db.users[userIndex] = updatedUser;
        
        return updatedUser;
      },
      
      // Health Profile
      createHealthProfile: (_, { input }, context) => {
        const user = getUser(context);
        
        const existingProfile = db.healthProfiles.find(
          profile => profile.user.id === user.id
        );
        
        if (existingProfile) {
          throw new Error('User already has a health profile');
        }
        
        const newHealthProfile = {
          id: `health_profile_${Date.now()}`,
          user,
          ...input,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        db.healthProfiles.push(newHealthProfile);
        
        const userIndex = db.users.findIndex(u => u.id === user.id);
        db.users[userIndex] = {
          ...user,
          surveyCompleted: true,
          updatedAt: new Date().toISOString(),
        };
        
        return newHealthProfile;
      },
      
      updateHealthProfile: (_, { input }, context) => {
        const user = getUser(context);
        const profileIndex = db.healthProfiles.findIndex(
          profile => profile.user.id === user.id
        );
        
        if (profileIndex === -1) {
          throw new Error('Health profile not found');
        }
        
        // Update health profile
        const updatedProfile = {
          ...db.healthProfiles[profileIndex],
          ...input,
          updatedAt: new Date().toISOString(),
        };
        
        db.healthProfiles[profileIndex] = updatedProfile;
        
        return updatedProfile;
      },
      
      // Cart
      addToCart: (_, { input }, context) => {
        const user = getUser(context);
        const { productId, quantity } = input;
        
        // Find product
        const product = db.products.find(p => p.id === productId);
        
        if (!product) {
          throw new Error('Product not found');
        }
        
        // Find or create user's cart
        let cart = db.carts.find(c => c.user.id === user.id);
        
        if (!cart) {
          cart = {
            id: `cart_${Date.now()}`,
            user,
            items: [],
            subtotal: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          db.carts.push(cart);
        }
        
        // Check if product already in cart
        const existingItemIndex = cart.items.findIndex(item => item.product.id === productId);
        
        if (existingItemIndex !== -1) {
          // Update existing item
          cart.items[existingItemIndex].quantity += quantity;
        } else {
          // Add new item
          cart.items.push({
            id: `cart_item_${Date.now()}`,
            cart,
            product,
            quantity,
          });
        }
        
        // Update cart subtotal
        cart.subtotal = cart.items.reduce(
          (total, item) => total + (item.product.price * item.quantity),
          0
        );
        
        cart.updatedAt = new Date().toISOString();
        
        return cart;
      },
      
      updateCartItem: (_, { id, quantity }, context) => {
        const user = getUser(context);
        
        // Find user's cart
        const cart = db.carts.find(c => c.user.id === user.id);
        
        if (!cart) {
          throw new Error('Cart not found');
        }
        
        // Find cart item
        const itemIndex = cart.items.findIndex(item => item.id === id);
        
        if (itemIndex === -1) {
          throw new Error('Cart item not found');
        }
        
        if (quantity <= 0) {
          // Remove item if quantity is 0 or less
          cart.items.splice(itemIndex, 1);
        } else {
          // Update quantity
          cart.items[itemIndex].quantity = quantity;
        }
        
        // Update cart subtotal
        cart.subtotal = cart.items.reduce(
          (total, item) => total + (item.product.price * item.quantity),
          0
        );
        
        cart.updatedAt = new Date().toISOString();
        
        return cart;
      },
      
      removeCartItem: (_, { id }, context) => {
        const user = getUser(context);
        
        // Find user's cart
        const cart = db.carts.find(c => c.user.id === user.id);
        
        if (!cart) {
          throw new Error('Cart not found');
        }
        
        // Find and remove cart item
        const itemIndex = cart.items.findIndex(item => item.id === id);
        
        if (itemIndex === -1) {
          throw new Error('Cart item not found');
        }
        
        cart.items.splice(itemIndex, 1);
        
        // Update cart subtotal
        cart.subtotal = cart.items.reduce(
          (total, item) => total + (item.product.price * item.quantity),
          0
        );
        
        cart.updatedAt = new Date().toISOString();
        
        return cart;
      },
      
      clearCart: (_, __, context) => {
        const user = getUser(context);
        
        // Find user's cart
        const cart = db.carts.find(c => c.user.id === user.id);
        
        if (!cart) {
          throw new Error('Cart not found');
        }
        
        // Clear cart items
        cart.items = [];
        cart.subtotal = 0;
        cart.updatedAt = new Date().toISOString();
        
        return cart;
      },
      
      // Checkout
      createOrder: (_, { input }, context) => {
        const user = getUser(context);
        const { cartId, shippingAddressId, paymentMethod } = input;
        
        // Find cart
        const cart = db.carts.find(c => c.id === cartId);
        
        if (!cart) {
          throw new Error('Cart not found');
        }
        
        // Check if cart belongs to user
        if (cart.user.id !== user.id) {
          throw new AuthenticationError('Not authorized to checkout this cart');
        }
        
        // Check if cart has items
        if (cart.items.length === 0) {
          throw new Error('Cannot checkout an empty cart');
        }
        
        // Find shipping address
        const address = user.address;
        
        if (!address) {
          throw new Error('Shipping address not found');
        }
        
        // Create order items
        const orderItems = cart.items.map(cartItem => ({
          id: `order_item_${Date.now()}_${cartItem.id}`,
          product: cartItem.product,
          quantity: cartItem.quantity,
          price: cartItem.product.price,
        }));
        
        // Calculate total
        const subtotal = orderItems.reduce(
          (total, item) => total + (item.price * item.quantity),
          0
        );
        
        const total = subtotal;
        
        // Create order
        const newOrder = {
          id: `order_${Date.now()}`,
          user,
          items: orderItems,
          subtotal,
          total,
          status: 'PROCESSING',
          shippingAddress: address,
          paymentMethod,
          paymentStatus: 'COMPLETED',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        // Link order to order items
        newOrder.items.forEach(item => {
          item.order = newOrder;
        });
        
        db.orders.push(newOrder);
        
        // Clear cart
        cart.items = [];
        cart.subtotal = 0;
        cart.updatedAt = new Date().toISOString();
        
        return newOrder;
      },
      
      // Reviews
      createReview: (_, { productId, rating, title, content }, context) => {
        const user = getUser(context);
        
        // Find product
        const product = db.products.find(p => p.id === productId);
        
        if (!product) {
          throw new Error('Product not found');
        }
        
        // Check if user has already reviewed this product
        if (product.reviews && product.reviews.some(review => review.user.id === user.id)) {
          throw new Error('You have already reviewed this product');
        }
        
        // Create review
        const newReview = {
          id: `review_${Date.now()}`,
          product,
          user,
          rating,
          title,
          content,
          createdAt: new Date().toISOString(),
        };
        
        // Initialize reviews array if it doesn't exist
        if (!product.reviews) {
          product.reviews = [];
        }
        
        product.reviews.push(newReview);
        
        // Update product rating
        const totalRating = product.reviews.reduce((sum, review) => sum + review.rating, 0);
        product.rating = totalRating / product.reviews.length;
        product.reviewCount = product.reviews.length;
        
        return newReview;
      },
    },
    
    Subscription: {
      orderStatusChanged: {
        subscribe: (_, { orderId }, context) => {
          const user = getUser(context);
          
          return {
            async *[Symbol.asyncIterator]() {
              yield {
                orderStatusChanged: {
                  id: orderId,
                  status: 'SHIPPED',
                  updatedAt: new Date().toISOString(),
                },
              };
            },
          };
        },
      },
    },
  };
  
  module.exports = resolvers;