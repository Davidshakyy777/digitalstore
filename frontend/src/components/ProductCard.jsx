import React from 'react';

function ProductCard({ product, addToCart }) {
  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product);
  };

  return (
    <div className='bg-white border border-gray-100 p-4 rounded-2xl flex flex-col gap-3 shadow-sm hover:shadow-md transition-all group'>
      <div className='w-full h-48 overflow-hidden rounded-xl bg-gray-50 flex items-center justify-center p-2'>
        <img 
          src={product.img} 
          alt={product.item} 
          className='max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-300'
        />
      </div>

      <div>
        <h3 className='font-bold text-gray-800 text-sm truncate'>
          {product.item}
        </h3>
        <p className='text-xs text-gray-400'>{product.brand || 'Original'}</p>
      </div>

      <div className='flex justify-between items-center mt-auto'>
        <span className='font-extrabold text-blue-600 text-lg'>
          {product.price?.toLocaleString()} ₸
        </span>

        <button 
          onClick={handleAddToCart}
          className='bg-blue-600 hover:bg-blue-700 text-white p-2 w-15 cursor-pointer rounded-lg transition'
        >
          +
        </button>
      </div>
    </div>
  );
}

export default ProductCard;