document.addEventListener('DOMContentLoaded', function() {
  // نمایش سال جاری در فوتر
  document.getElementById('year').textContent = new Date().getFullYear();
  
  // مقداردهی اسلایدر محصولات
  const productsSlider = new Swiper('.products-slider', {
    slidesPerView: 1,
    spaceBetween: 20,
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    breakpoints: {
      576: {
        slidesPerView: 2,
        spaceBetween: 20
      },
      992: {
        slidesPerView: 3,
        spaceBetween: 30
      }
    },
    on: {
      init: function() {
        document.querySelector('.products-slider').classList.add('visible');
      }
    }
  });
  
  // انیمیشن اسکرول
  const animateOnScroll = () => {
    const elements = document.querySelectorAll('.feature-card, .products-slider, .poem-box, .signature');
    const windowHeight = window.innerHeight;
    
    elements.forEach(el => {
      const elementPosition = el.getBoundingClientRect().top;
      const elementHeight = el.offsetHeight;
      
      if (elementPosition < windowHeight - elementHeight/3) {
        el.classList.add('visible');
      }
    });
  };
  
  // رویداد اسکرول
  window.addEventListener('scroll', animateOnScroll);
  animateOnScroll(); // اجرای اولیه
  
  // سیستم سبد خرید ساده
  let cartItems = [];
  
  try {
    cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
  } catch (e) {
    console.error('Error accessing localStorage:', e);
    cartItems = [];
  }
  
  document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', function() {
      const productCard = this.closest('.product-card');
      const productName = productCard.querySelector('h3').textContent;
      const productPrice = productCard.querySelector('.product-price').textContent;
      
      cartItems.push({
        name: productName,
        price: productPrice
      });
      
      try {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
      } catch (e) {
        console.error('Error saving to localStorage:', e);
      }
      
      // نمایش اعلان
      showNotification(`${productName} به سبد خرید اضافه شد`);
    });
  });
  
  // تابع نمایش اعلان
  function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.classList.add('show');
    }, 10);
    
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => {
        notification.remove();
      }, 300);
    }, 3000);
  }
  
  // بارگذاری تنبل تصاویر
  if ('loading' in HTMLImageElement.prototype) {
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    lazyImages.forEach(img => {
      img.src = img.dataset.src;
    });
  } else {
    // Fallback برای مرورگرهایی که از loading="lazy" پشتیبانی نمی‌کنند
    const lazyLoadObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          lazyLoadObserver.unobserve(img);
        }
      });
    });
    
    document.querySelectorAll('img[loading="lazy"]').forEach(img => {
      lazyLoadObserver.observe(img);
    });
  }
});
