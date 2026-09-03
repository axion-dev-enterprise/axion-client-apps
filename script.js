/**
 * Psicóloga Edna Mara Grahl - Interatividade & Motion System
 * CRP 07/32844
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Atualizar ano no rodapé
  const yearSpan = document.getElementById('year-span');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // 2. Reading Progress Bar & Header Scroll Effect
  const progressBar = document.getElementById('reading-progress');
  const header = document.getElementById('header');

  window.addEventListener('scroll', () => {
    const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    
    if (progressBar && height > 0) {
      const scrolled = (winScroll / height) * 100;
      progressBar.style.width = `${Math.min(scrolled, 100)}%`;
    }

    if (header) {
      if (winScroll > 30) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }
  }, { passive: true });

  // 3. Scroll Reveal com IntersectionObserver
  const revealElements = document.querySelectorAll('.reveal');
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -40px 0px',
    threshold: 0.12
  };

  const revealObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        obs.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach(el => revealObserver.observe(el));

  // 4. Mobile Navigation Drawer
  const menuOpenBtn = document.getElementById('menu-open-btn');
  const menuCloseBtn = document.getElementById('menu-close-btn');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const drawerBackdrop = document.getElementById('drawer-backdrop');
  const drawerLinks = document.querySelectorAll('.drawer-link');

  function openDrawer() {
    if (!mobileDrawer) return;
    mobileDrawer.classList.add('open');
    if (drawerBackdrop) drawerBackdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    if (!mobileDrawer) return;
    mobileDrawer.classList.remove('open');
    if (drawerBackdrop) drawerBackdrop.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (menuOpenBtn) menuOpenBtn.addEventListener('click', openDrawer);
  if (menuCloseBtn) menuCloseBtn.addEventListener('click', closeDrawer);
  if (drawerBackdrop) drawerBackdrop.addEventListener('click', closeDrawer);

  drawerLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  // 5. Testimonials Carousel Slider
  const slidesContainer = document.getElementById('testimonial-slides');
  const prevBtn = document.getElementById('slider-prev');
  const nextBtn = document.getElementById('slider-next');
  const dots = document.querySelectorAll('.slider-dot');
  const sliderBox = document.querySelector('.testimonial-slider-container');

  let currentSlide = 0;
  const totalSlides = dots.length;
  let autoplayInterval = null;

  function updateSlider(index) {
    if (totalSlides === 0) return;
    currentSlide = (index + totalSlides) % totalSlides;
    if (slidesContainer) {
      slidesContainer.style.transform = `translateX(-${currentSlide * 100}%)`;
    }
    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === currentSlide);
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      updateSlider(currentSlide - 1);
      resetAutoplay();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      updateSlider(currentSlide + 1);
      resetAutoplay();
    });
  }

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const slideIndex = parseInt(dot.getAttribute('data-slide'), 10);
      updateSlider(slideIndex);
      resetAutoplay();
    });
  });

  // Touch Swipe Support for Mobile
  let touchStartX = 0;
  let touchEndX = 0;

  if (slidesContainer) {
    slidesContainer.addEventListener('touchstart', e => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    slidesContainer.addEventListener('touchend', e => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, { passive: true });
  }

  function handleSwipe() {
    const swipeThreshold = 50;
    if (touchEndX < touchStartX - swipeThreshold) {
      updateSlider(currentSlide + 1);
      resetAutoplay();
    } else if (touchEndX > touchStartX + swipeThreshold) {
      updateSlider(currentSlide - 1);
      resetAutoplay();
    }
  }

  function startAutoplay() {
    autoplayInterval = setInterval(() => {
      updateSlider(currentSlide + 1);
    }, 7000);
  }

  function resetAutoplay() {
    clearInterval(autoplayInterval);
    startAutoplay();
  }

  if (sliderBox) {
    sliderBox.addEventListener('mouseenter', () => clearInterval(autoplayInterval));
    sliderBox.addEventListener('mouseleave', startAutoplay);
  }

  startAutoplay();

  // 6. FAQ Accordion com Transições Suaves
  const faqCards = document.querySelectorAll('.faq-card');

  faqCards.forEach(card => {
    const btn = card.querySelector('.faq-btn');
    const body = card.querySelector('.faq-body');

    if (btn && body) {
      btn.addEventListener('click', () => {
        const isActive = card.classList.contains('active');

        // Close all cards
        faqCards.forEach(otherCard => {
          otherCard.classList.remove('active');
          const otherBtn = otherCard.querySelector('.faq-btn');
          const otherBody = otherCard.querySelector('.faq-body');
          if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
          if (otherBody) otherBody.style.maxHeight = null;
        });

        // Toggle clicked card
        if (!isActive) {
          card.classList.add('active');
          btn.setAttribute('aria-expanded', 'true');
          body.style.maxHeight = body.scrollHeight + 24 + 'px';
        }
      });
    }
  });

  // Initialize first FAQ item
  const activeFaq = document.querySelector('.faq-card.active');
  if (activeFaq) {
    const activeBody = activeFaq.querySelector('.faq-body');
    if (activeBody) {
      activeBody.style.maxHeight = activeBody.scrollHeight + 24 + 'px';
    }
  }
});
