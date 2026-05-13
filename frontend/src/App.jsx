import { useState, useEffect } from 'react'
import ProductCard from './components/ProductCard'
import Auth from './components/Auth'
import Cart from './components/Cart'
import Header from './components/Header'
import Footer from './components/Footer'

function App() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');

  useEffect(() => {
    fetch('http://localhost:3000/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setFilteredProducts(data);
      });
      
    const saved = localStorage.getItem('user');
    if (saved) {
      const userData = JSON.parse(saved);
      setUser(userData);
      fetchCartCount(userData.id);
    }
  }, []);

  useEffect(() => {
    let filtered = products;
    if (category !== 'all') {
      filtered = filtered.filter(p => p.category === category);
    }
    if (search) {
      filtered = filtered.filter(p => 
        p.item.toLowerCase().includes(search.toLowerCase())
      );
    }
    setFilteredProducts(filtered);
  }, [search, category, products]);

  const fetchCartCount = async (userId) => {
    if (!userId) return;
    try {
      const res = await fetch(`http://localhost:3000/cart/${userId}`);
      const data = await res.json();
      setCartCount(data.length);
    } catch (err) {
      console.error(err);
    }
  };

  const addToCart = async (product) => {
    if (!user) {
      setIsAuthOpen(true);
      return;
    }
    try {
      await fetch('http://localhost:3000/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.id, product_id: product.id })
      });
      alert(`${product.item} added to cart!`);
      setCartCount(prev => prev + 1);
    } catch (err) {
      alert("Server error");
    }
  };

  const handleUserChange = (newUser) => {
    setUser(newUser);
    if (newUser) fetchCartCount(newUser.id);
    else setCartCount(0);
  };

  return (
    <div className='min-h-screen bg-gray-100 flex flex-col'>
      <Header 
        user={user} 
        cartCount={cartCount}
        setIsCartOpen={setIsCartOpen}
        setIsAuthOpen={setIsAuthOpen}
        onUserChange={handleUserChange}
        search={search}
        setSearch={setSearch}
        category={category}
        setCategory={setCategory}
      />

      <main className='flex-1 container mx-auto px-4 sm:px-6 py-4 sm:py-8 flex flex-col'>
        {selectedProduct ? (
          <div className='bg-white rounded-2xl shadow-lg p-6 sm:p-8 flex-1'>
            <button 
              onClick={() => setSelectedProduct(null)} 
              className='text-blue-600 font-bold hover:underline cursor-pointer mb-8 sm:mb-10'
            >
              ← Back to Products
            </button>
            <div className='flex flex-col md:flex-row gap-6 sm:gap-12'>
              <div className='md:w-1/2 bg-gray-50 rounded-2xl p-6 sm:p-8 flex justify-center'>
                <img 
                  src={selectedProduct.img} 
                  className='max-h-64 sm:max-h-96 object-contain' 
                  alt={selectedProduct.item} 
                />
              </div>
              <div className='md:w-1/2'>
                <h1 className='text-2xl sm:text-3xl font-black mb-4 sm:mb-6'>{selectedProduct.item}</h1>
                <p className='text-gray-500 mb-4 sm:mb-6'>{selectedProduct.brand}</p>
                <div className='mb-4 sm:mb-6'>
                  <span className='inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold'>
                    {selectedProduct.category}
                  </span>
                </div>
                <p className='text-green-600 font-bold text-3xl sm:text-4xl mb-6 sm:mb-8'>
                  {selectedProduct.price?.toLocaleString()} ₸
                </p>
                <div className='p-4 bg-gray-50 rounded-xl border border-gray-200 mb-6 sm:mb-8'>
                  <h3 className='font-bold text-base sm:text-lg mb-2 sm:mb-3 flex items-center gap-2'>
                    📋 About this item
                  </h3>
                  <p className='text-gray-700 leading-relaxed text-sm sm:text-base'>
                    {selectedProduct.description || 'This product is brand new and comes with full warranty. Premium quality guaranteed.'}
                  </p>
                </div>
                <button 
                  onClick={() => addToCart(selectedProduct)} 
                  className='w-full bg-blue-600 hover:bg-blue-700 text-white py-3 sm:py-4 rounded-xl font-bold transition shadow-lg cursor-pointer'
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ) : (
          <>
            {filteredProducts.length === 0 ? (
              <div className='text-center py-20 bg-white rounded-2xl'>
                <p className='text-gray-400 text-xl'>No products found 😢</p>
              </div>
            ) : (
              <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6'>
                {filteredProducts.map(p => (
                  <div 
                    key={p.id} 
                    onClick={() => setSelectedProduct(p)} 
                    className='cursor-pointer transform hover:-translate-y-1 transition'
                  >
                    <ProductCard product={p} addToCart={addToCart} />
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>

      <Footer />

      {isAuthOpen && <Auth close={() => setIsAuthOpen(false)} onUserChange={handleUserChange} />}
      {isCartOpen && <Cart close={() => setIsCartOpen(false)} onCartUpdate={() => fetchCartCount(user?.id)} user={user} />}
    </div>
  )
}

export default App;