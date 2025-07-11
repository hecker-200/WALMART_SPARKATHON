// ML Service for product suggestions - Connected to Backend
import axios from 'axios';

// Backend API configuration
const BACKEND_URL = 'http://localhost:3001/api/cart/generate';

// Generate random ratings for products (since backend doesn't provide them)
const generateRating = () => (3.8 + Math.random() * 1.4).toFixed(1);

// Generate descriptions based on product name and category
const generateDescription = (name, category) => {
  const descriptions = {
    'Staples': `Essential ${name.toLowerCase()} for your daily cooking needs`,
    'Snacks': `Delicious ${name.toLowerCase()} perfect for snacking anytime`,
    'Beverages': `Refreshing ${name.toLowerCase()} to quench your thirst`,
    'Personal Care': `Quality ${name.toLowerCase()} for your daily care routine`,
    'Kitchen Items': `Useful ${name.toLowerCase()} for your kitchen needs`,
    'Utilities': `Practical ${name.toLowerCase()} for household use`
  };
  
  return descriptions[category] || `Quality ${name.toLowerCase()} for your needs`;
};

// Transform backend product data to frontend format
const transformProduct = (backendProduct) => {
  return {
    id: backendProduct.id,
    name: backendProduct.name,
    price: backendProduct.price,
    description: generateDescription(backendProduct.name, backendProduct.aisle),
    image: "/placeholder.svg",
    rating: backendProduct.rating || parseFloat(generateRating()),
    category: backendProduct.aisle,
    originalPrice: Math.random() > 0.6 ? Math.round(backendProduct.price * 1.2) : null,
    availability: backendProduct.availability,
    tags: backendProduct.tags || []
  };
};

// Main API function - Calls your backend
export const getProductSuggestions = async (goal) => {
  try {
    console.log('🚀 Calling backend with goal:', goal);

    const response = await axios.post(BACKEND_URL, { input: goal });
    console.log('✅ Backend response:', response.data);

    const transformedProducts = response.data.products.map(transformProduct);

    if (transformedProducts.length === 0) {
      throw new Error('No products found matching your criteria. Try adjusting your search.');
    }

    return {
      success: true,
      products: transformedProducts,
      totalFound: transformedProducts.length,
      searchQuery: goal,
      keywords: response.data.keywords || []
    };
  } catch (error) {
    console.error('❌ API Error:', error);

    if (error.response) {
      throw new Error(error.response.data.error || 'Server error occurred');
    } else if (error.request) {
      throw new Error('Unable to connect to server. Please check if backend is running on port 3001.');
    } else {
      throw new Error(error.message || 'Failed to fetch product suggestions');
    }
  }
};

// Alternative endpoint for different ML models (future expansion)
export const getAdvancedSuggestions = async (goal, preferences = {}) => {
  return getProductSuggestions(goal);
};

export default {
  getProductSuggestions,
  getAdvancedSuggestions
};
