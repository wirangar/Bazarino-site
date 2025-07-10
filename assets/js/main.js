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
    }
  });
  
  // انیمیشن اسکرول
  const animateOnScroll = () => {
    const elements = document.querySelectorAll('.feature-card, .products-slider, .poem-box, .signature');
    
    elements.forEach(el => {
      const elementPosition = el.getBoundingClientRect().top;
      const screenPosition = window.innerHeight / 1.2;
      
      if (elementPosition < screenPosition) {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }
    });
  };
  
  // مقداردهی اولیه برای انیمیشن‌ها
  document.querySelectorAll('.feature-card, .products-slider, .poem-box, .signature').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  });
  
  // رویداد اسکرول
  window.addEventListener('scroll', animateOnScroll);
  animateOnScroll(); // اجرای اولیه
  
  // سیستم سبد خرید ساده
  const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
  
  document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', function() {
      const productCard = this.closest('.product-card');
      const productName = productCard.querySelector('h3').textContent;
      const productPrice = productCard.querySelector('.product-price').textContent;
      
      cartItems.push({
        name: productName,
        price: productPrice
      });
      
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
      
      // نمایش اعلان
      const notification = document.createElement('div');
      notification.className = 'notification';
      notification.textContent = `${productName} به سبد خرید اضافه شد`;
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
    });
  });
});
