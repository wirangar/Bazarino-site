document.addEventListener('DOMContentLoaded', () => {
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
        spaceBetween: 20,
      },
      992: {
        slidesPerView: 3,
        spaceBetween: 30,
      },
    },
    on: {
      init: function () {
        document.querySelector('.products-slider').classList.add('visible');
      },
    },
  });

  // انیمیشن اسکرول
  const animateOnScroll = () => {
    const elements = document.querySelectorAll('.feature-card, .products-slider, .poem-box, .signature, .newsletter');
    const windowHeight = window.innerHeight;

    elements.forEach((el) => {
      const elementPosition = el.getBoundingClientRect().top;
      const elementHeight = el.offsetHeight;

      if (elementPosition < windowHeight - elementHeight / 3) {
        el.classList.add('visible');
      }
    });
  };

  window.addEventListener('scroll', animateOnScroll);
  animateOnScroll(); // اجرای اولیه

  // دکمه بازگشت به بالا
  const scrollToTopButton = document.querySelector('.scroll-to-top');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      scrollToTopButton.classList.add('show');
    } else {
      scrollToTopButton.classList.remove('show');
    }
  });

  scrollToTopButton.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // سیستم سبد خرید
  let cartItems = [];

  const loadCart = () => {
    try {
      cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    } catch (e) {
      console.error('Error accessing localStorage:', e);
      showNotification('خطایی در بارگذاری سبد خرید رخ داد.');
    }
  };

  const saveToCart = (item) => {
    try {
      cartItems.push(item);
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
      showNotification(`${item.name} به سبد خرید اضافه شد`);
    } catch (e) {
      console.error('Error saving to localStorage:', e);
      showNotification('خطایی در ذخیره‌سازی سبد خرید رخ داد.');
    }
  };

  document.querySelectorAll('.add-to-cart').forEach((button) => {
    button.addEventListener('click', () => {
      const productCard = button.closest('.product-card');
      const productName = productCard.querySelector('h3').textContent;
      const productPrice = productCard.querySelector('.product-price').textContent;

      saveToCart({
        name: productName,
        price: productPrice,
      });
    });
  });

  loadCart();

  // جستجوی محصولات
  const searchForm = document.querySelector('.search-form');
  searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const query = document.getElementById('search-input').value.trim().toLowerCase();
    if (!query) {
      showNotification('لطفاً عبارت جستجو را وارد کنید.');
      return;
    }

    const products = document.querySelectorAll('.product-card');
    products.forEach((product) => {
      const name = product.querySelector('h3').textContent.toLowerCase();
      product.style.display = name.includes(query) ? 'block' : 'none';
    });
  });

  // فرم خبرنامه
  const newsletterForm = document.querySelector('.newsletter-form');
  newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = newsletterForm.querySelector('input[type="email"]').value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      showNotification('لطفاً یک ایمیل معتبر وارد کنید.');
      return;
    }

    showNotification('با موفقیت در خبرنامه ثبت‌نام شدید!');
    newsletterForm.reset();
    // اینجا می‌توانید درخواست به سرور برای ذخیره ایمیل ارسال کنید
  });

  // تابع نمایش اعلان
  const showNotification = (message) => {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.classList.add('show');
    }, 10);

    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout notification.remove();
    }, 3000);
  };

  // بارگذاری تنبل تصاویر
  if ('loading' in HTMLImageElement.prototype) {
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    lazyImages.forEach((img) => {
      img.src = img.dataset.src || img.src;
    });
  } else {
    const lazyLoadObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src || img.src;
          lazyLoadObserver.unobserve(img);
        }
      });
    });

    document.querySelectorAll('img[loading="lazy"]').forEach((img) => {
      lazyLoadObserver.observe(img);
    });
  }
});
