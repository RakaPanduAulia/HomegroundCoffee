/**
 * Homeground Coffee - Artisanal Home Brewer & Specialty Roasters
 * Interactive Controller Script
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initThemeToggle();
  initMobileDrawer();
  initProductFilter();
  initBrewCalculator();
  initBrewTimer();
  initFaqAccordion();
  initOrderModal();
  initSmoothScroll();
});

/* ----------------------------------------------------
   1. Navbar Scroll & Active State
   ---------------------------------------------------- */
function initNavbar() {
  const header = document.getElementById('siteHeader');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    // Header shadow & background on scroll
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Scroll spy
    let currentId = '';
    const scrollPosition = window.scrollY + 160;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPosition >= top && scrollPosition < top + height) {
        currentId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active');
      }
    });
  });
}

/* ----------------------------------------------------
   2. Theme Switcher (Dark Espresso / Warm Cream)
   ---------------------------------------------------- */
function initThemeToggle() {
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  if (!themeToggleBtn) return;

  const sunIcon = document.getElementById('sunIcon');
  const moonIcon = document.getElementById('moonIcon');

  // Load saved preference
  const savedTheme = localStorage.getItem('hg_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcons(savedTheme);

  themeToggleBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('hg_theme', newTheme);
    updateThemeIcons(newTheme);
  });

  function updateThemeIcons(theme) {
    if (theme === 'light') {
      sunIcon.style.display = 'none';
      moonIcon.style.display = 'block';
      themeToggleBtn.setAttribute('title', 'Ganti ke Espresso Dark Mode');
    } else {
      sunIcon.style.display = 'block';
      moonIcon.style.display = 'none';
      themeToggleBtn.setAttribute('title', 'Ganti ke Warm Cream Mode');
    }
  }
}

/* ----------------------------------------------------
   3. Mobile Drawer Menu
   ---------------------------------------------------- */
function initMobileDrawer() {
  const openBtn = document.getElementById('mobileMenuOpen');
  const closeBtn = document.getElementById('mobileMenuClose');
  const drawer = document.getElementById('mobileDrawer');
  const backdrop = document.getElementById('drawerBackdrop');
  const links = document.querySelectorAll('.mobile-nav-link');

  function openDrawer() {
    drawer.classList.add('open');
    backdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    drawer.classList.remove('open');
    backdrop.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (openBtn) openBtn.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  if (backdrop) backdrop.addEventListener('click', closeDrawer);

  links.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });
}

/* ----------------------------------------------------
   4. Product Filter System
   ---------------------------------------------------- */
function initProductFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const productCards = document.querySelectorAll('.product-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterCategory = btn.getAttribute('data-filter');

      productCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        if (filterCategory === 'all' || cardCategory === filterCategory) {
          card.style.display = 'flex';
          card.style.animation = 'fadeInUp 0.4s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ----------------------------------------------------
   5. Interactive Brew Calculator
   ---------------------------------------------------- */
const BREW_METHODS = {
  v60: {
    name: 'V60 Pour Over',
    defaultRatio: 15,
    minRatio: 14,
    maxRatio: 17,
    temp: '92°C - 94°C',
    grind: 'Medium - Fine (Seperti Garam Meja)',
    time: '2:30 - 3:00 min',
    calculateSteps: (dose, totalWater) => {
      const bloom = Math.round(dose * 3);
      const pour1 = Math.round(totalWater * 0.6);
      return [
        { name: '1. Blooming', detail: `Tuang ${bloom}ml air panas secara memutar. Diamkan 45 detik agar gas CO2 terlepas.` },
        { name: '2. Curahan Pertama', detail: `Tuang spiral perlahan hingga mencapai total ${pour1}ml air pada menit 01:15.` },
        { name: '3. Curahan Akhir', detail: `Lanjutkan menuang lembut hingga tepat ${totalWater}ml. Biarkan menetes tuntas hingga 02:45.` }
      ];
    }
  },
  frenchpress: {
    name: 'French Press',
    defaultRatio: 14,
    minRatio: 12,
    maxRatio: 15,
    temp: '94°C - 96°C',
    grind: 'Coarse (Kasar Seperti Garam Laut)',
    time: '4:00 min',
    calculateSteps: (dose, totalWater) => {
      return [
        { name: '1. Tuang Penuh', detail: `Tuang seluruh ${totalWater}ml air panas sekaligus ke bubuk kopi. Aduk perlahan 5 putaran.` },
        { name: '2. Pasang Plunger & Diamkan', detail: `Tutup French Press, jangan tekan plunger. Biarkan ekstraksi selama 4 menit penuh.` },
        { name: '3. Tekan & Sajikan', detail: `Tekan plunger perlahan dan lembut ke dasar. Tuang segera ke cangkir agar tidak over-extract.` }
      ];
    }
  },
  aeropress: {
    name: 'AeroPress (Inverted)',
    defaultRatio: 13,
    minRatio: 11,
    maxRatio: 14,
    temp: '88°C - 90°C',
    grind: 'Medium (Sedikit lebih halus dari V60)',
    time: '2:00 min',
    calculateSteps: (dose, totalWater) => {
      const bloom = Math.round(dose * 2.5);
      return [
        { name: '1. Inverted Bloom', detail: `Basahi bubuk dengan ${bloom}ml air, aduk 10 detik dan diamkan hingga detik ke-35.` },
        { name: '2. Penuhi Air', detail: `Tuang sisa air hingga ${totalWater}ml. Pasang filter kertas yang telah dibilas.` },
        { name: '3. Balik & Tekan', detail: `Balikkan AeroPress ke atas server pada 01:20, tekan perlahan selama 30-40 detik.` }
      ];
    }
  },
  japaneseiced: {
    name: 'Japanese Iced V60',
    defaultRatio: 15,
    minRatio: 14,
    maxRatio: 16,
    temp: '93°C',
    grind: 'Medium - Fine (Ekstraksi Cepat)',
    time: '2:15 min',
    calculateSteps: (dose, totalWater) => {
      const iceGrams = Math.round(totalWater * 0.4);
      const hotWater = totalWater - iceGrams;
      const bloom = Math.round(dose * 2.5);
      return [
        { name: '1. Siapkan Es Batu', detail: `Taruh ${iceGrams}g es batu kristal langsung di dalam server/carafe kaca.` },
        { name: '2. Blooming Air Panas', detail: `Tuang ${bloom}ml air panas (93°C) selama 40 detik ke bubuk kopi.` },
        { name: '3. Flash Chilling', detail: `Tuang sisa air panas hingga total ${hotWater}ml. Kopi panas langsung membeku segar di es!` }
      ];
    }
  },
  coldbrew: {
    name: 'Cold Brew Jar (Rumahan)',
    defaultRatio: 10,
    minRatio: 8,
    maxRatio: 10,
    temp: 'Air Dingin / Suhu Ruang (20-25°C)',
    grind: 'Extra Coarse (Kasar Berbutir)',
    time: '16 - 18 Jam (Kulkas)',
    calculateSteps: (dose, totalWater) => {
      return [
        { name: '1. Campur Kopi & Air', detail: `Masukkan ${dose}g bubuk kasar ke botol/jar, tuang ${totalWater}ml air mineral dingin.` },
        { name: '2. Tutup & Simpan', detail: `Aduk lembut agar kopi terbasahi merata. Tutup rapat lalu simpan di chiller selama 16-18 jam.` },
        { name: '3. Saring & Sajikan', detail: `Saring menggunakan kain drip atau v60 paper. Sajikan dingin dengan es batu bulat.` }
      ];
    }
  }
};

let currentMethod = 'v60';
let currentDose = 15;
let currentRatio = 15;

function initBrewCalculator() {
  const methodBtns = document.querySelectorAll('.method-btn');
  const doseSlider = document.getElementById('doseSlider');
  const doseDisplay = document.getElementById('doseDisplay');
  const ratioChips = document.querySelectorAll('.ratio-chip');

  const totalWaterEl = document.getElementById('calcTotalWater');
  const tempEl = document.getElementById('calcTemp');
  const grindEl = document.getElementById('calcGrind');
  const timeEl = document.getElementById('calcTime');
  const stepsContainer = document.getElementById('calcStepsList');

  function updateCalculator() {
    const config = BREW_METHODS[currentMethod];
    const totalWater = Math.round(currentDose * currentRatio);

    if (doseDisplay) doseDisplay.textContent = `${currentDose}g`;
    if (totalWaterEl) totalWaterEl.textContent = `${totalWater} ml`;
    if (tempEl) tempEl.textContent = config.temp;
    if (grindEl) grindEl.textContent = config.grind;
    if (timeEl) timeEl.textContent = config.time;

    // Render Steps
    if (stepsContainer) {
      stepsContainer.innerHTML = '';
      const steps = config.calculateSteps(currentDose, totalWater);
      steps.forEach((step, idx) => {
        const stepEl = document.createElement('div');
        stepEl.className = 'step-item';
        stepEl.innerHTML = `
          <div class="step-marker">${idx + 1}</div>
          <div class="step-info">
            <div class="step-name">${step.name}</div>
            <div class="step-detail">${step.detail}</div>
          </div>
        `;
        stepsContainer.appendChild(stepEl);
      });
    }
  }

  // Method selection
  methodBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      methodBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentMethod = btn.getAttribute('data-method');
      currentRatio = BREW_METHODS[currentMethod].defaultRatio;

      // Update ratio chips UI to match
      ratioChips.forEach(chip => {
        chip.classList.toggle('active', parseInt(chip.getAttribute('data-ratio')) === currentRatio);
      });

      updateCalculator();
    });
  });

  // Dose Slider
  if (doseSlider) {
    doseSlider.addEventListener('input', (e) => {
      currentDose = parseInt(e.target.value);
      updateCalculator();
    });
  }

  // Ratio chips
  ratioChips.forEach(chip => {
    chip.addEventListener('click', () => {
      ratioChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      currentRatio = parseInt(chip.getAttribute('data-ratio'));
      updateCalculator();
    });
  });

  // Initial calculation
  updateCalculator();
}

/* ----------------------------------------------------
   6. Interactive Brew Timer
   ---------------------------------------------------- */
function initBrewTimer() {
  const display = document.getElementById('timerDisplay');
  const playBtn = document.getElementById('timerPlayBtn');
  const resetBtn = document.getElementById('timerResetBtn');

  if (!display || !playBtn || !resetBtn) return;

  let timerInterval = null;
  let secondsElapsed = 0;
  let isRunning = false;

  function formatTime(totalSeconds) {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  playBtn.addEventListener('click', () => {
    if (isRunning) {
      // Pause
      clearInterval(timerInterval);
      isRunning = false;
      playBtn.textContent = 'Mulai';
      playBtn.classList.remove('btn-play-pause');
    } else {
      // Start
      isRunning = true;
      playBtn.textContent = 'Jeda';
      playBtn.classList.add('btn-play-pause');
      timerInterval = setInterval(() => {
        secondsElapsed++;
        display.textContent = formatTime(secondsElapsed);
      }, 1000);
    }
  });

  resetBtn.addEventListener('click', () => {
    clearInterval(timerInterval);
    isRunning = false;
    secondsElapsed = 0;
    display.textContent = '00:00';
    playBtn.textContent = 'Mulai';
  });
}

/* ----------------------------------------------------
   7. FAQ Accordion
   ---------------------------------------------------- */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all other items for clean accordion effect
      faqItems.forEach(i => i.classList.remove('active'));

      if (!isActive) {
        item.classList.add('active');
      }
    });
  });
}

/* ----------------------------------------------------
   8. WhatsApp Direct Order Modal
   ---------------------------------------------------- */
function initOrderModal() {
  const modal = document.getElementById('orderModal');
  const openButtons = document.querySelectorAll('[data-open-order]');
  const closeBtn = document.getElementById('orderModalClose');
  const form = document.getElementById('orderForm');
  const itemSelect = document.getElementById('orderItem');

  if (!modal || !form) return;

  function openModal(defaultProduct = '') {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    if (defaultProduct && itemSelect) {
      itemSelect.value = defaultProduct;
    }
  }

  function closeModal() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  openButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const product = btn.getAttribute('data-product') || '';
      openModal(product);
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  // Handle Form Submission -> WhatsApp Link
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('orderName').value.trim();
    const product = document.getElementById('orderItem').value;
    const grind = document.getElementById('orderGrind').value;
    const qty = document.getElementById('orderQty').value;
    const notes = document.getElementById('orderNotes').value.trim();

    // Homeground WhatsApp Number (Bisa diisi nomor bisnis resmi)
    const phoneNumber = '6281289001234';

    let message = `Halo Homeground Coffee! ☕%0A`;
    message += `Saya *${encodeURIComponent(name)}* ingin memesan seduhan / beans:%0A%0A`;
    message += `📦 *Produk:* ${encodeURIComponent(product)}%0A`;
    message += `⚖️ *Gilingan (Grind):* ${encodeURIComponent(grind)}%0A`;
    message += `🔢 *Jumlah:* ${encodeURIComponent(qty)} pack/botol%0A`;
    if (notes) {
      message += `📝 *Catatan:* ${encodeURIComponent(notes)}%0A`;
    }
    message += `%0AMohon info ketersediaan stok & total pembayarannya. Terima kasih!`;

    const waUrl = `https://wa.me/${phoneNumber}?text=${message}`;

    // Open WhatsApp in new tab
    window.open(waUrl, '_blank');
    closeModal();
  });
}

/* ----------------------------------------------------
   9. Smooth Scroll for Anchor Links
   ---------------------------------------------------- */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}
