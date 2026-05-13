import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { texts } from '../i18n';

function Header({ user, cartCount, setIsCartOpen, setIsAuthOpen, onUserChange, search, setSearch, category, setCategory }) {
  const { language, setLanguage } = useLanguage();
  const t = texts[language];
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('user');
    if (onUserChange) onUserChange(null);
  };

  const toggleLanguage = () => {
    setLanguage(language === 'kk' ? 'en' : 'kk');
  };

  return (
    <header className='text-white'>
      {/* ========== ДЕСКТОП НҰСҚАСЫ ========== */}
      <div className='bg-[#131921] hidden lg:block' style={{ paddingTop: '45px', paddingBottom: '45px' }}>
        <div className='container mx-auto' style={{ paddingLeft: '60px', paddingRight: '60px' }}>
          <div className='flex items-center justify-between gap-6'>
            {/* Logo */}
            <div className='flex items-center gap-3 flex-shrink-0 min-w-[180px] hover:border-white hover:border rounded-sm p-2 transition cursor-pointer'>
              <div className='w-12 h-12 bg-gradient-to-r from-[#FEBD69] to-[#F3A847] rounded-lg flex items-center justify-center shadow-md'>
                <span className='text-[#131921] font-black text-2xl'>DS</span>
              </div>
              <span className='font-black text-2xl tracking-tight'>DigitalStore</span>
            </div>

            {/* Delivery location */}
            <div className='hidden lg:flex flex-col leading-tight text-sm flex-shrink-0 min-w-[100px] px-3 py-2 hover:border-white hover:border rounded-sm cursor-pointer'>
              <span className='text-xs text-gray-400'>{t.delivery}</span>
              <span className='font-bold text-base'>{t.kazakhstan}</span>
            </div>

            {/* Іздеу */}
            <div className='flex-1 max-w-xl min-w-[300px]'>
              <div className='relative flex'>
                <div className='hidden sm:flex items-center bg-gray-200 rounded-l-md px-4 text-sm text-black font-medium border-r border-gray-300 cursor-pointer hover:bg-gray-300 py-3.5'>
                  <span className='whitespace-nowrap'>{t.all}</span>
                  <span className='ml-2 text-xs'>▼</span>
                </div>
                <input type="text" placeholder={t.placeholder} className='w-full px-5 py-3.5 text-gray-800 bg-white border-none focus:outline-none text-base' value={search} onChange={(e) => setSearch(e.target.value)} />
                <button className='bg-[#FEBD69] hover:bg-[#F3A847] px-8 rounded-r-md transition cursor-pointer'>
                  <span className='text-[#131921] text-2xl'>🔍</span>
                </button>
              </div>
            </div>

            {/* Оң жақ */}
            <div className='flex items-center gap-3 flex-shrink-0'>
              <button onClick={toggleLanguage} className='flex items-center justify-center gap-2 min-w-[80px] px-3 py-2 hover:border-white hover:border rounded-sm text-base cursor-pointer'>
                <span className='text-xl'>🌐</span>
                <span className='font-bold'>{t.language}</span>
              </button>
              {user ? (
                <div className='flex flex-col leading-tight min-w-[50px] px-3 py-2 hover:border-white hover:border rounded-sm cursor-pointer'>
                  <span className='text-xs text-gray-400'>{t.hello}</span>
                  <span className='font-bold text-base truncate max-w-[90px]'>{user.first_name}</span>
                </div>
              ) : (
                <button onClick={() => setIsAuthOpen(true)} className='flex flex-col leading-tight min-w-[80px] px-3 py-2 hover:border-white hover:border rounded-sm text-left cursor-pointer'>
                  <span className='text-xs text-gray-400'>{t.hello}</span>
                  <span className='font-bold text-base'>{t.signIn}</span>
                </button>
              )}
              <div onClick={() => alert("📦 Returns & Orders")} className='hidden lg:flex flex-col leading-tight min-w-[85px] px-3 py-2 hover:border-white hover:border rounded-sm cursor-pointer'>
                <span className='text-xs text-gray-400'>{t.returns}</span>
                <span className='font-bold text-base whitespace-nowrap'>{t.orders}</span>
              </div>
              <button onClick={() => setIsCartOpen(true)} className='relative flex items-center gap-2 min-w-[70px] px-3 py-2 hover:border-white hover:border rounded-sm cursor-pointer'>
                <span className='text-4xl'>🛒</span>
                <span className='font-bold text-base hidden lg:inline'>{t.cart}</span>
                {cartCount > 0 && <span className='absolute -top-1 left-6 bg-[#FEBD69] text-[#131921] text-xs font-bold min-w-[24px] h-[24px] rounded-full flex items-center justify-center shadow-lg'>{cartCount}</span>}
              </button>
              {user && <button onClick={handleLogout} className='bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md font-bold text-sm min-w-[70px] cursor-pointer'>{t.logout}</button>}
            </div>
          </div>
        </div>
      </div>

      {/* ========== МОБИЛЬДІ НҰСҚА ========== */}
      <div className='bg-[#131921] lg:hidden' style={{ paddingTop: '12px', paddingBottom: '12px' }}>
        <div className='container mx-auto' style={{ paddingLeft: '12px', paddingRight: '12px' }}>
          <div className='flex items-center justify-between gap-2'>
            <div className='flex items-center gap-2'>
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className='text-white text-2xl p-1 hover:bg-white/10 rounded-md transition cursor-pointer'>☰</button>
              <div className='flex items-center gap-2 cursor-pointer'>
                <div className='w-8 h-8 bg-gradient-to-r from-[#FEBD69] to-[#F3A847] rounded-lg flex items-center justify-center shadow-md'><span className='text-[#131921] font-black text-sm'>DS</span></div>
                <span className='font-black text-base tracking-tight hidden sm:inline-block'>DigitalStore</span>
                <span className='font-black text-base tracking-tight sm:hidden'>DS</span>
              </div>
            </div>
            <div className='flex items-center gap-1'>
              <button onClick={toggleLanguage} className='text-base p-1 hover:bg-white/10 rounded-md cursor-pointer'>🌐</button>
              <button onClick={() => setIsCartOpen(true)} className='relative p-1'><span className='text-2xl'>🛒</span>{cartCount > 0 && <span className='absolute -top-1 -right-1 bg-[#FEBD69] text-[#131921] text-xs font-bold min-w-[16px] h-[16px] rounded-full flex items-center justify-center'>{cartCount}</span>}</button>
              {user && <button onClick={handleLogout} className='bg-red-600 px-2 py-1 rounded-md text-xs'>🚪</button>}
            </div>
          </div>
          <div className='mt-2'><input type="text" placeholder={t.placeholder} className='w-full px-3 py-2 text-gray-800 bg-white rounded-md focus:outline-none text-sm' value={search} onChange={(e) => setSearch(e.target.value)} /></div>
          {mobileMenuOpen && (<div className='mt-3 pt-3 border-t border-gray-700 flex flex-col gap-2 text-sm'>
            {!user && <button onClick={() => { setIsAuthOpen(true); setMobileMenuOpen(false); }} className='text-left py-1 hover:text-blue-300 cursor-pointer'>🔑 {t.signIn}</button>}
            <button onClick={() => { setIsCartOpen(true); setMobileMenuOpen(false); }} className='text-left py-1 hover:text-blue-300 cursor-pointer'>🛒 {t.cart}</button>
            <button onClick={() => alert("📦 Returns & Orders")} className='text-left py-1 hover:text-blue-300 cursor-pointer'>📦 {t.returns} & {t.orders}</button>
            {user && <button onClick={handleLogout} className='text-left py-1 text-red-400 hover:text-red-300 cursor-pointer'>🚪 {t.logout}</button>}
          </div>)}
        </div>
      </div>

      {/* ========== КАТЕГОРИЯЛАР (БІР РЕТ ҚАНА) ========== */}
      <div className='bg-[#232F3E] px-2 md:px-4' style={{ paddingTop: '10px', paddingBottom: '10px' }}>
        <div className='container mx-auto'>
          <div className='flex justify-start md:justify-center items-center gap-1 md:gap-3 overflow-x-auto whitespace-nowrap'>
            <button onClick={() => setCategory('all')} className={`px-2 md:px-3 py-1 text-xs md:text-sm rounded-sm cursor-pointer ${category === 'all' ? 'bg-white/10 border border-white' : ''}`}>☰ {t.all}</button>
            <button onClick={() => setCategory('laptop')} className={`px-2 md:px-3 py-1 text-xs md:text-sm cursor-pointer ${category === 'laptop' ? 'bg-white/10 border border-white' : ''}`}> {t.laptops}</button>
            <button onClick={() => setCategory('phone')} className={`px-2 md:px-3 py-1 text-xs md:text-sm cursor-pointer ${category === 'phone' ? 'bg-white/10 border border-white' : ''}`}> {t.phones}</button>
            <button onClick={() => setCategory('audio')} className={`px-2 md:px-3 py-1 text-xs md:text-sm cursor-pointer ${category === 'audio' ? 'bg-white/10 border border-white' : ''}`}> {t.audio}</button>
            <button onClick={() => setCategory('gaming')} className={`px-2 md:px-3 py-1 text-xs md:text-sm cursor-pointer ${category === 'gaming' ? 'bg-white/10 border border-white' : ''}`}> {t.gaming}</button>
            <button onClick={() => setCategory('tablet')} className={`px-2 md:px-3 py-1 text-xs md:text-sm cursor-pointer ${category === 'tablet' ? 'bg-white/10 border border-white' : ''}`}> {t.tablets}</button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;