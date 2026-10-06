(() => {
  'use strict';

  const body = document.body;
  const menuButton = document.querySelector('.menu-button');
  const navLinks = document.querySelectorAll('.main-nav a');

  menuButton?.addEventListener('click', () => {
    const isOpen = body.classList.toggle('menu-open');
    menuButton.setAttribute('aria-expanded', String(isOpen));
    menuButton.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
  });

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      body.classList.remove('menu-open');
      menuButton?.setAttribute('aria-expanded', 'false');
      menuButton?.setAttribute('aria-label', 'Open navigation');
    });
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && body.classList.contains('menu-open')) {
      body.classList.remove('menu-open');
      menuButton?.setAttribute('aria-expanded', 'false');
      menuButton?.focus();
    }
  });

  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px' });

    revealItems.forEach((item) => revealObserver.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  }

  // Count up animation
  const countElements = document.querySelectorAll('[data-count]');
  if ('IntersectionObserver' in window && countElements.length > 0) {
    const countObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        const target = entry.target;
        const targetValue = parseFloat(target.getAttribute('data-count'));
        const isFloat = target.getAttribute('data-count').includes('.');
        let current = 0;
        const increment = targetValue / 40; // 40 steps

        const updateCount = () => {
          current += increment;
          if (current < targetValue) {
            target.textContent = isFloat ? current.toFixed(1) : Math.ceil(current);
            requestAnimationFrame(updateCount);
          } else {
            target.textContent = isFloat ? targetValue.toFixed(1) : targetValue;
          }
        };

        updateCount();
        observer.unobserve(target);
      });
    }, { threshold: 0.5 });

    countElements.forEach(el => {
      el.textContent = '0'; // Initialize to 0
      countObserver.observe(el);
    });
  }


  const year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());

  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  if (finePointer.matches && !reducedMotion.matches) {
    const cursor = document.querySelector('.cursor');
    const label = document.querySelector('.cursor-label');

    if (cursor && label) {
      let mouseX = -100;
      let mouseY = -100;
      let ringX = -100;
      let ringY = -100;
      let frame = 0;

      const renderCursor = () => {
        ringX += (mouseX - ringX) * 0.16;
        ringY += (mouseY - ringY) * 0.16;
        cursor.style.setProperty('--cursor-x', `${mouseX}px`);
        cursor.style.setProperty('--cursor-y', `${mouseY}px`);
        cursor.style.setProperty('--ring-x', `${ringX}px`);
        cursor.style.setProperty('--ring-y', `${ringY}px`);
        frame = requestAnimationFrame(renderCursor);
      };

      window.addEventListener('pointermove', (event) => {
        mouseX = event.clientX;
        mouseY = event.clientY;
        cursor.classList.add('is-visible');
      }, { passive: true });

      document.documentElement.addEventListener('mouseleave', () => cursor.classList.remove('is-visible'));
      document.documentElement.addEventListener('mouseenter', () => cursor.classList.add('is-visible'));

      document.querySelectorAll('.interactive').forEach((element) => {
        element.addEventListener('pointerenter', () => {
          label.textContent = element.dataset.cursor || 'OPEN';
          cursor.classList.add('is-active');
        });
        element.addEventListener('pointerleave', () => cursor.classList.remove('is-active'));
      });

      window.addEventListener('pointerdown', () => cursor.classList.add('is-clicking'));
      window.addEventListener('pointerup', () => cursor.classList.remove('is-clicking'));
      renderCursor();

      window.addEventListener('beforeunload', () => cancelAnimationFrame(frame));
    }

    document.querySelectorAll('.magnetic').forEach((element) => {
      element.addEventListener('pointermove', (event) => {
        const rect = element.getBoundingClientRect();
        const x = (event.clientX - rect.left - rect.width / 2) * 0.14;
        const y = (event.clientY - rect.top - rect.height / 2) * 0.18;
        element.style.setProperty('--mag-x', `${x}px`);
        element.style.setProperty('--mag-y', `${y}px`);
      });
      element.addEventListener('pointerleave', () => {
        element.style.setProperty('--mag-x', '0px');
        element.style.setProperty('--mag-y', '0px');
      });
    });

    const visual = document.querySelector('[data-parallax]');
    const browser = visual?.querySelector('.browser-mockup');
    if (visual && browser) {
      visual.addEventListener('pointermove', (event) => {
        const rect = visual.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width - 0.5) * 18;
        const y = ((event.clientY - rect.top) / rect.height - 0.5) * 18;
        browser.style.setProperty('--parallax-x', `${x}px`);
        browser.style.setProperty('--parallax-y', `${y}px`);
      });
      visual.addEventListener('pointerleave', () => {
        browser.style.setProperty('--parallax-x', '0px');
        browser.style.setProperty('--parallax-y', '0px');
      });
    }
  }

  // Blob mouse tracking
  const blob = document.querySelector('.blob-bg');
  if (blob) {
    let blobX = window.innerWidth / 2;
    let blobY = window.innerHeight / 2;
    let targetBlobX = window.innerWidth / 2;
    let targetBlobY = window.innerHeight / 2;

    window.addEventListener('pointermove', (e) => {
      targetBlobX = e.clientX;
      targetBlobY = e.clientY;
    }, { passive: true });

    const animateBlob = () => {
      blobX += (targetBlobX - blobX) * 0.05;
      blobY += (targetBlobY - blobY) * 0.05;
      blob.style.setProperty('--blob-x', `${blobX}px`);
      blob.style.setProperty('--blob-y', `${blobY}px`);
      requestAnimationFrame(animateBlob);
    };

    animateBlob();
  }

})();
