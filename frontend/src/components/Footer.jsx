import React from 'react';

function Footer() {
  return (
    <footer className='bg-gray-900 text-gray-300 mt-16 pt-16 pb-12'>
      <div className='container mx-auto px-12'>
        <div className='grid grid-cols-12 gap-8'>
          
          {/* Company секциясы - Ортада */}
          <div className='col-span-4 col-start-2'>
            <h4 className='text-white font-bold text-xl mb-5 border-b-2 border-gray-700 inline-block pb-2'>Company</h4>
            <ul className='text-base space-y-3 mt-4'>
              <li><a href='#' className='hover:text-blue-400 transition-colors duration-200'>About Us</a></li>
              <li><a href='#' className='hover:text-blue-400 transition-colors duration-200'>Careers</a></li>
              <li><a href='#' className='hover:text-blue-400 transition-colors duration-200'>Blog</a></li>
              <li><a href='#' className='hover:text-blue-400 transition-colors duration-200'>Press</a></li>
            </ul>
          </div>

          {/* Follow Us секциясы - Келесі бағанда */}
          <div className='col-span-4'>
            <h4 className='text-white font-bold text-xl mb-5 border-b-2 border-gray-700 inline-block pb-2'>Follow Us</h4>
            <ul className='text-base space-y-3 mt-4'>
              <li><a href='#' className='hover:text-blue-400 transition-colors duration-200 flex items-center gap-3'>📘 Facebook</a></li>
              <li><a href='#' className='hover:text-blue-400 transition-colors duration-200 flex items-center gap-3'>📷 Instagram</a></li>
              <li><a href='#' className='hover:text-blue-400 transition-colors duration-200 flex items-center gap-3'>🐦 Twitter (X)</a></li>
              <li><a href='#' className='hover:text-blue-400 transition-colors duration-200 flex items-center gap-3'>💬 Telegram</a></li>
            </ul>
          </div>

          {/* Contact секциясы - Оң жақта */}
          <div className='col-span-3'>
            <h4 className='text-white font-bold text-xl mb-5 border-b-2 border-gray-700 inline-block pb-2'>Contact</h4>
            <ul className='text-base space-y-3 mt-4'>
              <li className='flex items-center gap-3'>📧 support@digitalstore.com</li>
              <li className='flex items-center gap-3'>📞 +7 (777) 123-45-67</li>
              <li className='flex items-center gap-3'>📍 Almaty, Kazakhstan</li>
            </ul>
          </div>
        </div>

        {/* Нижний колонтитул */}
        <div className='border-t border-gray-800 mt-14 pt-8 text-center text-sm text-gray-500'>
          <p>&copy; 2026 DigitalStore. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;