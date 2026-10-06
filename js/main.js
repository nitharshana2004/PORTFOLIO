/**
* Template Name: iPortfolio
* Template URL: https://bootstrapmade.com/iportfolio-bootstrap-portfolio-websites-template/
* Updated: Jun 29 2024 with Bootstrap v5.3.3
* Author: BootstrapMade.com
* License: https://bootstrapmade.com/license/
*/

(function() {
  "use strict";

  /**
   * Header toggle
   */
  const headerToggleBtn = document.querySelector('.header-toggle');

  function headerToggle() {
    const isOpen = document.querySelector('#header').classList.toggle('header-show');
    headerToggleBtn.classList.toggle('bi-list');
    headerToggleBtn.classList.toggle('bi-x');
    headerToggleBtn.setAttribute('aria-expanded', String(isOpen));
  }
  headerToggleBtn.addEventListener('click', headerToggle);

  /**
   * Hide mobile nav on same-page/hash links
   */
  document.querySelectorAll('#navmenu a').forEach(navmenu => {
    navmenu.addEventListener('click', () => {
      if (document.querySelector('.header-show')) {
        headerToggle();
      }
    });

  });

  /**
   * Toggle mobile nav dropdowns
   */
  document.querySelectorAll('.navmenu .toggle-dropdown').forEach(navmenu => {
    navmenu.addEventListener('click', function(e) {
      e.preventDefault();
      this.parentNode.classList.toggle('active');
      this.parentNode.nextElementSibling.classList.toggle('dropdown-active');
      e.stopImmediatePropagation();
    });
  });

  /**
   * Preloader
   */
  const preloader = document.querySelector('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.remove();
    });
  }

  /**
   * Scroll top button
   */
  let scrollTop = document.querySelector('.scroll-top');

  function toggleScrollTop() {
    if (scrollTop) {
      window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
    }
  }
  scrollTop.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  window.addEventListener('load', toggleScrollTop);
  document.addEventListener('scroll', toggleScrollTop);

  /**
   * Animation on scroll function and init
   */
  function aosInit() {
    AOS.init({
      duration: 600,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }
  window.addEventListener('load', aosInit);

  /**
   * Submit the contact form through Web3Forms.
   */
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    // Replace PASTE_YOUR_KEY_HERE with your real Web3Forms access key (keep the quotes).
    const WEB3FORMS_ACCESS_KEY = "830ace1b-e110-4310-9d45-88f2803f7de8";
    const contactStatus = contactForm.querySelector('.contact-form-status');
    const contactSubmitButton = contactForm.querySelector('button[type="submit"]');
    let contactStatusTimer;

    function showContactStatus(message, isSuccess) {
      window.clearTimeout(contactStatusTimer);
      contactStatus.textContent = message;
      contactStatus.classList.toggle('is-success', Boolean(isSuccess));
      if (message) {
        contactStatusTimer = window.setTimeout(() => {
          contactStatus.textContent = '';
          contactStatus.classList.remove('is-success');
        }, 6000);
      }
    }

    contactForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      if (WEB3FORMS_ACCESS_KEY === 'PASTE_YOUR_KEY_HERE') {
        showContactStatus('Contact form is not configured yet.', false);
        return;
      }

      const formData = new FormData(contactForm);
      const name = String(formData.get('name') || '').trim();
      const email = String(formData.get('email') || '').trim();
      const subject = String(formData.get('subject') || '').trim();
      const message = String(formData.get('message') || '').trim();
      const botcheck = contactForm.querySelector('[name="botcheck"]');
      const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

      if (!name || !validEmail || !subject || !message) {
        showContactStatus('Please enter your name, a valid email, a subject, and a message.', false);
        return;
      }

      const buttonText = contactSubmitButton.querySelector('span');
      contactSubmitButton.disabled = true;
      if (buttonText) buttonText.textContent = 'Sending...';
      showContactStatus('', false);

      let response;
      let apiResult = {};
      try {
        response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            access_key: WEB3FORMS_ACCESS_KEY,
            name,
            email,
            subject,
            message,
            from_name: 'Portfolio Contact Form',
            botcheck: Boolean(botcheck && botcheck.checked)
          })
        });
        apiResult = await response.json();
        if (!response.ok || !apiResult.success) throw new Error('Contact submission failed');

        showContactStatus('Thank you! Your message has been sent.', true);
        contactForm.reset();
      } catch (error) {
        console.error('Web3Forms submission failed.', {
          status: response ? response.status : 'network error',
          message: apiResult.message || error.message || 'No API error message was returned.'
        });
        showContactStatus('Something went wrong. Please try again or email me directly.', false);
      } finally {
        contactSubmitButton.disabled = false;
        if (buttonText) buttonText.textContent = 'Send Message';
      }
    });
  }

  /**
   * Init typed.js
   */
  const selectTyped = document.querySelector('.typed');
  if (selectTyped) {
    let typed_strings = selectTyped.getAttribute('data-typed-items');
    typed_strings = typed_strings.split(',');
    new Typed('.typed', {
      strings: typed_strings,
      loop: true,
      typeSpeed: 100,
      backSpeed: 50,
      backDelay: 2000
    });
  }

  /**
   * Initiate Pure Counter
   */
  new PureCounter();

  /**
   * Initialize the Projects file explorer from the project panels in the HTML.
   */
  const projectExplorer = document.querySelector('.project-explorer');
  if (projectExplorer) {
    const fileList = projectExplorer.querySelector('.project-file-list');
    const detailPanels = Array.from(projectExplorer.querySelectorAll('.project-detail-panel'));
    const filterButtons = Array.from(projectExplorer.querySelectorAll('.project-filter'));
    const detailArea = projectExplorer.querySelector('.project-detail-panel-area');
    const tabs = [];
    let activeFilter = '*';
    let currentIndex = 0;
    let transitionToken = 0;
    let transitionTimer = null;
    let transitionFrame = null;

    const filenameForTitle = title => title.trim().toLowerCase()
      .replace(/[\s-]+/g, '_')
      .replace(/[^a-z0-9_]/g, '') + '.js';

    detailPanels.forEach((panel, index) => {
      const title = panel.querySelector('h4').textContent.trim();
      const filename = filenameForTitle(title);
      const tab = document.createElement('button');
      tab.type = 'button';
      tab.id = `project-tab-${index + 1}`;
      tab.className = 'project-file-tab';
      tab.setAttribute('role', 'tab');
      tab.setAttribute('aria-controls', panel.id);
      tab.setAttribute('aria-selected', 'false');
      tab.tabIndex = -1;
      tab.innerHTML = '<i class="bi bi-file-earmark-code" aria-hidden="true"></i><span></span>';
      tab.querySelector('span').textContent = filename;
      fileList.appendChild(tab);
      tabs.push(tab);

      const detail = panel.querySelector('.project-detail-card');
      const image = detail.querySelector('.portfolio-image');
      const previewLink = image.querySelector('a.glightbox');
      const links = detail.querySelector('.portfolio-links');
      previewLink.classList.add('project-preview-link');
      image.classList.add('project-image-frame');

      const liveLink = links.querySelector('a i.bi-eye')?.closest('a');
      const sourceLink = links.querySelector('a i.bi-github')?.closest('a');
      if (liveLink) {
        liveLink.classList.add('project-action', 'project-live');
        liveLink.insertAdjacentHTML('beforeend', '<span>Live demo</span>');
      }
      if (sourceLink) {
        sourceLink.classList.add('project-action', 'project-source');
        sourceLink.insertAdjacentHTML('beforeend', '<span>Source</span>');
      }
      const categoryClass = Array.from(panel.classList).find(name => /^filter-(animation|logic|data)$/.test(name));
      const category = categoryClass ? categoryClass.slice('filter-'.length) : '';
      const categoryLabel = category ? category[0].toUpperCase() + category.slice(1) : '';
      const info = detail.querySelector('.portfolio-info');
      const breadcrumb = document.createElement('p');
      breadcrumb.className = 'project-breadcrumb';
      breadcrumb.innerHTML = `<span>projects /</span> ${filename}`;
      detail.insertBefore(breadcrumb, image);
      const tags = document.createElement('div');
      tags.className = 'project-tags';
      ['JavaScript', categoryLabel].filter(Boolean).forEach(label => {
        const tag = document.createElement('span');
        tag.className = 'project-tag';
        tag.textContent = label;
        tags.appendChild(tag);
      });
      info.insertBefore(tags, links);

      tab.addEventListener('click', () => selectProject(index, true));
    });

    function visibleTabIndexes() {
      return tabs.map((tab, index) => !tab.hidden ? index : -1).filter(index => index >= 0);
    }

    function cancelProjectTransition() {
      transitionToken += 1;
      if (transitionTimer !== null) window.clearTimeout(transitionTimer);
      if (transitionFrame !== null) window.cancelAnimationFrame(transitionFrame);
      transitionTimer = null;
      transitionFrame = null;
      detailPanels.forEach((panel, index) => {
        panel.classList.remove('is-exiting', 'is-entering', 'is-fading-out', 'is-fading-in');
        panel.hidden = index !== currentIndex;
      });
    }

    function selectProject(index, moveFocus = false, transition = 'directional') {
      if (index < 0 || !tabs[index] || tabs[index].hidden) return;
      const oldIndex = currentIndex;
      const visibleIndexes = visibleTabIndexes();
      const oldPosition = visibleIndexes.indexOf(oldIndex);
      const newPosition = visibleIndexes.indexOf(index);
      const direction = newPosition > oldPosition ? 'forward' : 'backward';

      tabs.forEach((tab, tabIndex) => {
        const selected = tabIndex === index;
        tab.classList.toggle('is-selected', selected);
        tab.setAttribute('aria-selected', String(selected));
        tab.tabIndex = selected ? 0 : -1;
      });
      if (moveFocus) tabs[index].focus();
      if (index === currentIndex) {
        const currentPanel = detailPanels[currentIndex];
        if (transitionTimer !== null || transitionFrame !== null || currentPanel.classList.contains('is-entering') || currentPanel.classList.contains('is-fading-in')) {
          cancelProjectTransition();
        }
        return;
      }

      cancelProjectTransition();
      const token = transitionToken;
      detailArea.dataset.direction = direction;
      const oldPanel = detailPanels[currentIndex];
      const nextPanel = detailPanels[index];
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const exitDuration = reducedMotion ? 120 : (transition === 'directional' ? 180 : 120);
      const enterDuration = reducedMotion ? 120 : (transition === 'directional' ? 700 : 120);

      oldPanel.classList.add(transition === 'directional' ? 'is-exiting' : 'is-fading-out');
      transitionTimer = window.setTimeout(() => {
        if (token !== transitionToken) return;
        oldPanel.classList.remove('is-exiting', 'is-fading-out');
        oldPanel.hidden = true;
        nextPanel.hidden = false;
        currentIndex = index;
        nextPanel.classList.add(transition === 'directional' ? 'is-entering' : 'is-fading-in');
        transitionFrame = window.requestAnimationFrame(() => {
          if (token !== transitionToken) return;
          transitionTimer = window.setTimeout(() => {
            if (token !== transitionToken) return;
            nextPanel.classList.remove('is-entering', 'is-fading-in');
            transitionTimer = null;
            transitionFrame = null;
          }, enterDuration);
          transitionFrame = null;
        });
      }, exitDuration);
    }

    function applyProjectFilter(filter, selectFirst = true) {
      activeFilter = filter;
      tabs.forEach((tab, index) => {
        const matches = filter === '*' || detailPanels[index].classList.contains(filter);
        tab.hidden = !matches;
      });
      filterButtons.forEach(button => {
        const selected = button.dataset.filter === filter;
        button.classList.toggle('is-active', selected);
        button.setAttribute('aria-pressed', String(selected));
      });
      const firstVisible = visibleTabIndexes()[0];
      if (selectFirst && firstVisible !== undefined) selectProject(firstVisible, false, 'fade');
    }

    filterButtons.forEach(button => {
      button.addEventListener('click', () => applyProjectFilter(button.dataset.filter));
    });

    fileList.addEventListener('keydown', event => {
      const currentIndex = tabs.indexOf(document.activeElement);
      const visibleIndexes = visibleTabIndexes();
      const position = visibleIndexes.indexOf(currentIndex);
      let nextIndex;
      if (event.key === 'ArrowDown') nextIndex = visibleIndexes[(position + 1) % visibleIndexes.length];
      else if (event.key === 'ArrowUp') nextIndex = visibleIndexes[(position - 1 + visibleIndexes.length) % visibleIndexes.length];
      else if (event.key === 'Home') nextIndex = visibleIndexes[0];
      else if (event.key === 'End') nextIndex = visibleIndexes[visibleIndexes.length - 1];
      else return;
      event.preventDefault();
      selectProject(nextIndex, true);
    });

    applyProjectFilter(activeFilter, false);
    selectProject(0, false, 'initial');
  }

  /**
   * Initiate glightbox
   */
  const glightbox = GLightbox({
    selector: '.glightbox'
  });

  /**
   * Init isotope layout and filters
   */
  document.querySelectorAll('.isotope-layout').forEach(function(isotopeItem) {
    let layout = isotopeItem.getAttribute('data-layout') ?? 'masonry';
    let filter = isotopeItem.getAttribute('data-default-filter') ?? '*';
    let sort = isotopeItem.getAttribute('data-sort') ?? 'original-order';

    let initIsotope;
    imagesLoaded(isotopeItem.querySelector('.isotope-container'), function() {
      initIsotope = new Isotope(isotopeItem.querySelector('.isotope-container'), {
        itemSelector: '.isotope-item',
        layoutMode: layout,
        filter: filter,
        sortBy: sort
      });
      initIsotope.layout();
    });

    window.addEventListener('resize', function() {
      if (initIsotope) initIsotope.layout();
    }, { passive: true });

    isotopeItem.querySelectorAll('.isotope-filters li').forEach(function(filters) {
      filters.addEventListener('click', function() {
        if (!initIsotope) return;
        isotopeItem.querySelector('.isotope-filters .filter-active').classList.remove('filter-active');
        this.classList.add('filter-active');
        initIsotope.arrange({
          filter: this.getAttribute('data-filter')
        });
        if (typeof aosInit === 'function') {
          aosInit();
        }
      }, false);
    });

  });

  /**
   * Init swiper sliders
   */
  function initSwiper() {
    document.querySelectorAll(".init-swiper").forEach(function(swiperElement) {
      let config = JSON.parse(
        swiperElement.querySelector(".swiper-config").innerHTML.trim()
      );

      if (swiperElement.classList.contains("swiper-tab")) {
        initSwiperWithCustomPagination(swiperElement, config);
      } else {
        new Swiper(swiperElement, config);
      }
    });
  }

  window.addEventListener("load", initSwiper);

  /**
   * Correct scrolling position upon page load for URLs containing hash links.
   */
  window.addEventListener('load', function(e) {
    if (window.location.hash) {
      if (document.querySelector(window.location.hash)) {
        setTimeout(() => {
          let section = document.querySelector(window.location.hash);
          let scrollMarginTop = getComputedStyle(section).scrollMarginTop;
          window.scrollTo({
            top: section.offsetTop - parseInt(scrollMarginTop),
            behavior: 'smooth'
          });
        }, 100);
      }
    }
  });

  /**
   * Navmenu Scrollspy
   */
  let navmenulinks = document.querySelectorAll('.navmenu a');

  function navmenuScrollspy() {
    navmenulinks.forEach(navmenulink => {
      if (!navmenulink.hash) return;
      let section = document.querySelector(navmenulink.hash);
      if (!section) return;
      let position = window.scrollY + 200;
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        document.querySelectorAll('.navmenu a.active').forEach(link => link.classList.remove('active'));
        navmenulink.classList.add('active');
      } else {
        navmenulink.classList.remove('active');
      }
    })
  }
  window.addEventListener('load', navmenuScrollspy);
  document.addEventListener('scroll', navmenuScrollspy);

  /**
   * Block browser zoom shortcuts and Ctrl+wheel on desktop.
   */
  window.addEventListener('keydown', (e) => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches || !(e.ctrlKey || e.metaKey)) return;

    const zoomKeys = ['+', '=', '-', '_', '0'];
    const zoomCodes = ['NumpadAdd', 'NumpadSubtract'];
    if (zoomKeys.includes(e.key) || zoomCodes.includes(e.code)) {
      e.preventDefault();
    }
  }, true);

  window.addEventListener('wheel', (e) => {
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches && e.ctrlKey) e.preventDefault();
  }, { passive: false });

})();

document.addEventListener('DOMContentLoaded', function() {
  if (!window.matchMedia('(hover: hover)').matches || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  document.querySelectorAll('.skill-layer .skill-tile-list').forEach(function(panel) {
    let frame = null;
    let pointerX = 0;
    let pointerY = 0;
    panel.addEventListener('mousemove', function(event) {
      pointerX = event.clientX;
      pointerY = event.clientY;
      if (frame !== null) return;
      frame = window.requestAnimationFrame(function() {
        const rect = panel.getBoundingClientRect();
        panel.style.setProperty('--mx', (pointerX - rect.left) + 'px');
        panel.style.setProperty('--my', (pointerY - rect.top) + 'px');
        frame = null;
      });
    });
  });
});

document.addEventListener('DOMContentLoaded', function() {
  const accordion = document.querySelector('.edu-acc');
  if (!accordion) return;

  const buttons = Array.from(accordion.querySelectorAll('.edu-btn'));
  const hoverMQ = window.matchMedia("(hover: hover) and (pointer: fine)");
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const scoreFrames = new WeakMap();
  const hoverTimers = new WeakMap();

  function setScoreFinal(scoreBlock) {
    const score = Number(scoreBlock.dataset.score);
    const fill = scoreBlock.querySelector('.edu-eq-fill');
    fill.style.width = score + '%';
  }

  function animateScore(item) {
    item.querySelectorAll('.edu-score').forEach(function(scoreBlock) {
      const score = Number(scoreBlock.dataset.score);
      const fill = scoreBlock.querySelector('.edu-eq-fill');
      const previousFrame = scoreFrames.get(scoreBlock);
      if (previousFrame !== undefined) window.cancelAnimationFrame(previousFrame);
      if (reduceMotion) {
        setScoreFinal(scoreBlock);
        return;
      }

      fill.style.transition = 'none';
      fill.style.width = '0%';
      void fill.offsetWidth;
      fill.style.transition = '';
      scoreFrames.set(scoreBlock, window.requestAnimationFrame(function() {
        fill.style.width = score + '%';
        scoreFrames.delete(scoreBlock);
      }));
    });
  }

  function setOpenItem(activeItem) {
    buttons.forEach(function(button) {
      const item = button.closest('.edu-item');
      const isOpen = item === activeItem;
      item.classList.toggle('is-open', isOpen);
      button.setAttribute('aria-expanded', String(isOpen));
    });
  }

  buttons.forEach(function(button, index) {
    const item = button.closest('.edu-item');

    button.addEventListener('click', function(event) {
      const timer = hoverTimers.get(item);
      if (timer !== undefined) {
        window.clearTimeout(timer);
        hoverTimers.delete(item);
      }

      const isOpen = item.classList.contains('is-open');
      if (hoverMQ.matches && event.detail !== 0) {
        if (!isOpen) {
          setOpenItem(item);
          animateScore(item);
        }
      } else if (isOpen) {
        setOpenItem(null);
      } else {
        setOpenItem(item);
        animateScore(item);
      }
    });

    if (hoverMQ.matches) {
      item.addEventListener('mouseenter', function() {
        if (item.classList.contains('is-open')) return;
        const timer = window.setTimeout(function() {
          hoverTimers.delete(item);
          if (item.classList.contains('is-open')) return;
          setOpenItem(item);
          animateScore(item);
        }, 120);
        hoverTimers.set(item, timer);
      });

      item.addEventListener('mouseleave', function() {
        const timer = hoverTimers.get(item);
        if (timer !== undefined) {
          window.clearTimeout(timer);
          hoverTimers.delete(item);
        }
      });
    }

    button.addEventListener('keydown', function(event) {
      let nextIndex;
      if (event.key === 'ArrowDown') nextIndex = (index + 1) % buttons.length;
      else if (event.key === 'ArrowUp') nextIndex = (index - 1 + buttons.length) % buttons.length;
      else if (event.key === 'Home') nextIndex = 0;
      else if (event.key === 'End') nextIndex = buttons.length - 1;
      else return;

      event.preventDefault();
      buttons[nextIndex].focus();
    });
  });

  if (reduceMotion) {
    accordion.querySelectorAll('.edu-score').forEach(setScoreFinal);
  } else {
    const educationSection = accordion.closest('#education');
    const firstItem = accordion.querySelector('.edu-item');
    if (educationSection && firstItem && 'IntersectionObserver' in window) {
      const observer = new IntersectionObserver(function(entries) {
        if (!entries.some(function(entry) { return entry.isIntersecting; })) return;
        observer.disconnect();
        animateScore(firstItem);
      }, { threshold: 0.35 });
      observer.observe(educationSection);
    }
  }
});

document.addEventListener('DOMContentLoaded', function() {
  const aboutSection = document.querySelector('#about');
  if (!aboutSection || !('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const cards = Array.from(aboutSection.querySelectorAll('.about-card'));
  if (!cards.length) return;

  aboutSection.classList.add('about-cards-ready');
  cards.forEach(function(card, index) {
    card.style.setProperty('--about-entry-delay', (index * 90) + 'ms');
  });

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-about-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.15 });

  cards.forEach(function(card) { observer.observe(card); });
});

document.addEventListener('DOMContentLoaded', function() {
  const hero = document.querySelector('#hero');
  if (!hero) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduceMotion) {
    hero.querySelectorAll('.hero-button').forEach(function(button) {
      button.addEventListener('click', function(event) {
        const rect = button.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const diameter = 2 * Math.hypot(Math.max(x, rect.width - x), Math.max(y, rect.height - y));
        const ripple = document.createElement('span');
        ripple.className = 'hero-button-ripple';
        ripple.style.width = diameter + 'px';
        ripple.style.height = diameter + 'px';
        ripple.style.left = (x - diameter / 2) + 'px';
        ripple.style.top = (y - diameter / 2) + 'px';
        button.appendChild(ripple);
        ripple.addEventListener('animationend', function() { ripple.remove(); }, { once: true });
      });
    });

  }
});
