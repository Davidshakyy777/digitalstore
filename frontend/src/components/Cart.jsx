import React, { useState, useEffect } from 'react';

function Cart({ close, onCartUpdate, user }) {
  const [cartItems, setCartItems] = useState([]);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ 
    address: '', 
    city: '', 
    postalCode: '',
    cardNumber: '', 
    cardExpiry: '', 
    cardCVV: '' 
  });

  useEffect(() => {
    if (user && user.id) fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const res = await fetch(`http://localhost:3000/cart/${user.id}`);
      const data = await res.json();
      setCartItems(data);
    } catch (err) {
      console.error(err);
    }
  };

  const removeItem = async (cartId) => {
    await fetch(`http://localhost:3000/cart/${cartId}`, { method: 'DELETE' });
    const newItems = cartItems.filter(item => item.id !== cartId);
    setCartItems(newItems);
    if (onCartUpdate) onCartUpdate();
  };

  const totalPrice = cartItems.reduce((sum, item) => sum + Number(item.price), 0);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFinalSubmit = async (e) => {
    e.preventDefault();
    if (!formData.address || !formData.city) {
      alert("❌ Please fill all address fields!");
      return;
    }
    if (!formData.cardNumber || formData.cardNumber.length < 10) {
      alert("❌ Please enter a valid card number!");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3000/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          user_id: user.id, 
          total_price: totalPrice, 
          shipping_details: formData 
        })
      });
      const data = await response.json();
      if (response.ok && data.success) {
        alert(`✅ Order placed! Thank you, ${user.first_name}!`);
        setCartItems([]);
        if (onCartUpdate) onCartUpdate();
        close();
      } else {
        alert(`❌ Error: ${data.error || "Something went wrong"}`);
      }
    } catch (error) {
      alert("❌ Network error! Check backend server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='fixed inset-0 bg-black/60 z-[100] flex justify-end'>
      {/* Мобильде толық ен, планшет/десктопта 500px */}
      <div className='bg-white w-full sm:w-[450px] md:w-[500px] h-full p-4 sm:p-6 flex flex-col overflow-y-auto shadow-2xl'>
        
        {/* Header */}
        <div className='flex justify-between items-center border-b pb-3 sm:pb-4 mb-4 sm:mb-5'>
          <h2 className='text-xl sm:text-2xl font-bold text-gray-800'>
            {isCheckingOut ? "📦 Checkout" : `🛒 My Cart (${cartItems.length})`}
          </h2>
          <button 
            onClick={close} 
            className='text-gray-400 hover:text-gray-600 text-2xl transition cursor-pointer w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100'
          >
            ✕
          </button>
        </div>

        {!isCheckingOut ? (
          <>
            {/* Cart Items */}
            <div className='flex-1 overflow-y-auto'>
              {cartItems.length === 0 ? (
                <div className='text-center py-16 text-gray-400'>
                  <span className='text-6xl'>🛒</span>
                  <p className='mt-3 text-lg'>Your cart is empty</p>
                </div>
              ) : (
                cartItems.map((item) => (
                  <div key={item.id} className='flex gap-3 sm:gap-4 mb-3 sm:mb-4 bg-gray-50 p-3 sm:p-4 rounded-xl border border-gray-100'>
                    <img src={item.img} className='w-16 h-16 sm:w-20 sm:h-20 object-contain rounded-lg' alt="" />
                    <div className='flex-1'>
                      <h4 className='font-semibold text-gray-800 text-sm sm:text-base'>{item.item}</h4>
                      <p className='text-blue-600 font-bold mt-1 text-sm sm:text-base'>{Number(item.price).toLocaleString()} ₸</p>
                      <button 
                        onClick={() => removeItem(item.id)} 
                        className='text-xs text-red-500 hover:text-red-700 mt-2 transition cursor-pointer'
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Total & Checkout Button */}
            <div className='border-t pt-4 sm:pt-5 mt-3 sm:mt-4'>
              <div className='flex justify-between items-center mb-4 sm:mb-5'>
                <span className='text-gray-600 text-base sm:text-lg'>Total:</span>
                <span className='text-2xl sm:text-3xl font-bold text-green-600'>{totalPrice.toLocaleString()} ₸</span>
              </div>
              <button 
                onClick={() => setIsCheckingOut(true)} 
                disabled={cartItems.length === 0} 
                className='w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg transition-all shadow-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
              >
                Checkout Now →
              </button>
            </div>
          </>
        ) : (
          /* ========== CHECKOUT FORM - мобильге бейім ========== */
          <form onSubmit={handleFinalSubmit} className='flex-1 flex flex-col gap-3 sm:gap-4'>
            
            {/* Shipping Address Section */}
            <div className='bg-blue-50 p-3 sm:p-4 rounded-xl border border-blue-100'>
              <h3 className='font-bold text-blue-800 mb-2 sm:mb-3 flex items-center gap-2 text-sm sm:text-base'>🚚 Shipping Address</h3>
              <input 
                required 
                name="address" 
                value={formData.address}
                onChange={handleInputChange}
                className='w-full border border-gray-200 rounded-lg p-2 sm:p-3 mb-2 sm:mb-3 text-sm outline-none focus:border-blue-500 transition'
                placeholder='Street, House, Apartment'
              />
              <div className='grid grid-cols-2 gap-2 sm:gap-3'>
                <input 
                  required 
                  name="city" 
                  value={formData.city}
                  onChange={handleInputChange}
                  className='border border-gray-200 rounded-lg p-2 sm:p-3 text-sm outline-none focus:border-blue-500 transition'
                  placeholder='City'
                />
                <input 
                  name="postalCode" 
                  value={formData.postalCode}
                  onChange={handleInputChange}
                  className='border border-gray-200 rounded-lg p-2 sm:p-3 text-sm outline-none focus:border-blue-500 transition'
                  placeholder='Postal Code'
                />
              </div>
            </div>

            {/* Payment Section */}
            <div className='bg-purple-50 p-3 sm:p-4 rounded-xl border border-purple-100'>
              <h3 className='font-bold text-purple-800 mb-2 sm:mb-3 flex items-center gap-2 text-sm sm:text-base'>💳 Payment Information</h3>
              <input 
                required 
                name="cardNumber" 
                value={formData.cardNumber}
                onChange={handleInputChange}
                className='w-full border border-gray-200 rounded-lg p-2 sm:p-3 mb-2 sm:mb-3 text-sm outline-none focus:border-purple-500 transition'
                placeholder='Card Number (16 digits)'
                maxLength="19"
              />
              <div className='grid grid-cols-2 gap-2 sm:gap-3'>
                <input 
                  required 
                  name="cardExpiry" 
                  value={formData.cardExpiry}
                  onChange={handleInputChange}
                  className='border border-gray-200 rounded-lg p-2 sm:p-3 text-sm outline-none focus:border-purple-500 transition'
                  placeholder='MM/YY'
                />
                <input 
                  required 
                  name="cardCVV" 
                  value={formData.cardCVV}
                  onChange={handleInputChange}
                  className='border border-gray-200 rounded-lg p-2 sm:p-3 text-sm outline-none focus:border-purple-500 transition'
                  placeholder='CVV'
                  type="password"
                  maxLength="4"
                />
              </div>
            </div>

            {/* Order Summary */}
            <div className='bg-gray-50 p-3 sm:p-4 rounded-xl border border-gray-200'>
              <div className='flex justify-between items-center'>
                <span className='text-gray-600 text-sm sm:text-base'>Total amount:</span>
                <span className='text-xl sm:text-2xl font-bold text-green-600'>{totalPrice.toLocaleString()} ₸</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className='flex gap-2 sm:gap-3 mt-2'>
              <button 
                type="button" 
                onClick={() => setIsCheckingOut(false)} 
                className='flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 sm:py-3 rounded-xl font-semibold transition cursor-pointer text-sm sm:text-base'
              >
                ← Back
              </button>
              <button 
                type="submit" 
                disabled={loading} 
                className='flex-[2] bg-green-600 hover:bg-green-700 text-white py-2 sm:py-3 rounded-xl font-bold transition shadow-lg shadow-green-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-sm sm:text-base'
              >
                {loading ? "⏳ Processing..." : "✅ Confirm Order"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default Cart;