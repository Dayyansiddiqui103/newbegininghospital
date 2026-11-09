/**
 * New Beginning Hospital - Core Interactive Scripts
 * Provides real-time hospital open status, interactive modals, tabs, lightbox,
 * doctor filtering, accordion FAQs, and WhatsApp/appointment automation.
 */

document.addEventListener('DOMContentLoaded', () => {
  initHospitalStatus();
  initHeaderScroll();
  initMobileDrawer();
  initDepartmentTabs();
  initDoctorFilters();
  initFaqAccordion();
  initGalleryLightbox();
  initAppointmentModal();
  initContactForm();
  initBackToTop();
  initSmoothScroll();
});

/**
 * 1. REAL-TIME HOSPITAL OPERATING HOURS CALCULATION
 * Hospital policy: Open 24 hours Monday – Saturday; Closed on Sundays.
 */
function initHospitalStatus() {
  const statusBadges = document.querySelectorAll('.live-status-pill');
  if (!statusBadges.length) return;

  function updateStatus() {
    const now = new Date();
    const day = now.getDay(); // 0 is Sunday, 1-6 is Monday-Saturday

    statusBadges.forEach(badge => {
      const pulseEl = badge.querySelector('.status-pulse');
      const textEl = badge.querySelector('.status-text');

      if (day === 0) {
        // Sunday: Closed for routine OPD, Emergency on call
        badge.classList.add('closed');
        if (textEl) textEl.textContent = 'Closed Today (Sunday) • Emergency Active';
      } else {
        // Monday to Saturday: Open 24 Hours
        badge.classList.remove('closed');
        if (textEl) textEl.textContent = 'Open 24 Hours Today';
      }
    });
  }

  updateStatus();
  setInterval(updateStatus, 60000); // Check every minute
}

/**
 * 2. STICKY HEADER SCROLL EFFECT
 */
function initHeaderScroll() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

/**
 * 3. MOBILE DRAWER NAVIGATION
 */
function initMobileDrawer() {
  const toggleBtn = document.querySelector('.mobile-toggle');
  const drawer = document.querySelector('.mobile-drawer');
  const backdrop = document.querySelector('.drawer-backdrop');
  const closeBtn = document.querySelector('.drawer-close');
  const drawerLinks = document.querySelectorAll('.drawer-link');

  if (!toggleBtn || !drawer || !backdrop) return;

  function openDrawer() {
    drawer.classList.add('open');
    backdrop.classList.add('active');
    toggleBtn.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    drawer.classList.remove('open');
    backdrop.classList.remove('active');
    toggleBtn.classList.remove('active');
    document.body.style.overflow = '';
  }

  toggleBtn.addEventListener('click', () => {
    if (drawer.classList.contains('open')) {
      closeDrawer();
    } else {
      openDrawer();
    }
  });

  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  backdrop.addEventListener('click', closeDrawer);

  drawerLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });
}

/**
 * 4. DEPARTMENT TABS
 */
function initDepartmentTabs() {
  const tabButtons = document.querySelectorAll('.dept-tab-btn');
  const tabPanels = document.querySelectorAll('.dept-content-panel');

  if (!tabButtons.length || !tabPanels.length) return;

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-tab');

      tabButtons.forEach(b => b.classList.remove('active'));
      tabPanels.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const targetPanel = document.getElementById(targetId);
      if (targetPanel) {
        targetPanel.classList.add('active');
      }
    });
  });
}

/**
 * 5. DOCTORS FILTERING
 */
function initDoctorFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const doctorCards = document.querySelectorAll('.doctor-card');

  if (!filterBtns.length || !doctorCards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const category = btn.getAttribute('data-filter');

      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      doctorCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        if (category === 'all' || cardCategory === category) {
          card.style.display = 'flex';
          card.style.animation = 'fadeIn 0.35s ease';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/**
 * 6. FAQ ACCORDION WITH LIVE SEARCH
 */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  const searchInput = document.getElementById('faqSearchInput');

  // Accordion Expand/Collapse
  faqItems.forEach(item => {
    const header = item.querySelector('.faq-header');
    const body = item.querySelector('.faq-body');

    header.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close other active items
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          const otherBody = otherItem.querySelector('.faq-body');
          if (otherBody) otherBody.style.maxHeight = null;
        }
      });

      if (!isActive) {
        item.classList.add('active');
        body.style.maxHeight = body.scrollHeight + 30 + 'px';
      } else {
        item.classList.remove('active');
        body.style.maxHeight = null;
      }
    });
  });

  // Open the first item by default
  if (faqItems.length > 0) {
    const firstBody = faqItems[0].querySelector('.faq-body');
    faqItems[0].classList.add('active');
    if (firstBody) firstBody.style.maxHeight = firstBody.scrollHeight + 30 + 'px';
  }

  // Live Search filter
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();

      faqItems.forEach(item => {
        const questionText = item.querySelector('.faq-header').textContent.toLowerCase();
        const answerText = item.querySelector('.faq-body').textContent.toLowerCase();

        if (questionText.includes(query) || answerText.includes(query)) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  }
}

/**
 * 7. FACILITY PHOTO GALLERY LIGHTBOX
 */
function initGalleryLightbox() {
  const galleryCards = document.querySelectorAll('.gallery-card, .about-img-box');
  const lightbox = document.getElementById('lightboxModal');
  if (!lightbox) return;

  const lightboxImg = lightbox.querySelector('.lightbox-img-wrap img');
  const lightboxTitle = lightbox.querySelector('.lightbox-title');
  const lightboxDesc = lightbox.querySelector('.lightbox-desc');
  const closeBtn = lightbox.querySelector('.lightbox-close');

  galleryCards.forEach(card => {
    card.addEventListener('click', () => {
      const img = card.querySelector('img');
      const title = card.getAttribute('data-title') || img.getAttribute('alt') || 'Hospital Facility';
      const desc = card.getAttribute('data-desc') || 'State-of-the-art care at New Beginning Hospital';

      if (img && lightboxImg) {
        lightboxImg.src = img.src;
        lightboxImg.alt = title;
        if (lightboxTitle) lightboxTitle.textContent = title;
        if (lightboxDesc) lightboxDesc.textContent = desc;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
      closeLightbox();
    }
  });
}

/**
 * 8. APPOINTMENT BOOKING MODAL
 */
function initAppointmentModal() {
  const modal = document.getElementById('appointmentModal');
  const openButtons = document.querySelectorAll('.open-appointment-modal');
  const closeButtons = document.querySelectorAll('.close-appointment-modal');
  const form = document.getElementById('appointmentForm');
  const doctorSelect = document.getElementById('modalDoctorSelect');

  if (!modal) return;

  function openModal(preselectedDoctor = '') {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';

    if (preselectedDoctor && doctorSelect) {
      doctorSelect.value = preselectedDoctor;
    }
  }

  function closeModal() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  openButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const doctor = btn.getAttribute('data-doctor') || '';
      openModal(doctor);
    });
  });

  closeButtons.forEach(btn => {
    btn.addEventListener('click', closeModal);
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeModal();
    }
  });

  // Handle Form Submission
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('apptName').value;
      const phone = document.getElementById('apptPhone').value;
      const dept = document.getElementById('modalDeptSelect').value;
      const doctor = document.getElementById('modalDoctorSelect').value;
      const date = document.getElementById('apptDate').value;

      const refCode = 'NBH-' + Math.floor(100000 + Math.random() * 900000);

      closeModal();
      form.reset();

      showToast(
        'Appointment Request Received!',
        `Thank you ${name}. Your reference number is ${refCode}. Our coordinator will call you at ${phone} to confirm.`
      );

      // Offer immediate WhatsApp direct booking confirmation
      const waConfirm = confirm(
        `Your appointment request has been prepared! (Ref: ${refCode})\n\nWould you like to send this confirmation directly to New Beginning Hospital's official WhatsApp (+92 301 0840101)?`
      );

      if (waConfirm) {
        const text = encodeURIComponent(
          `*New Appointment Request [Ref: ${refCode}]*\n` +
          `• Name: ${name}\n` +
          `• Phone: ${phone}\n` +
          `• Department: ${dept}\n` +
          `• Doctor: ${doctor}\n` +
          `• Preferred Date: ${date}\n` +
          `Please confirm my booking. Thank you!`
        );
        window.open(`https://wa.me/923010840101?text=${text}`, '_blank');
      }
    });
  }
}

/**
 * 9. CONTACT FORM HANDLING
 */
function initContactForm() {
  const form = document.getElementById('contactHospitalForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('contactName').value;
    const phone = document.getElementById('contactPhone').value;
    const msg = document.getElementById('contactMessage').value;

    form.reset();

    showToast(
      'Message Sent Successfully',
      `Thank you ${name}. Our clinical support desk will contact you at ${phone} promptly.`
    );
  });
}

/**
 * 10. TOAST NOTIFICATION UTILITY
 */
function showToast(title, message) {
  let toast = document.querySelector('.toast-notice');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast-notice';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `
    <div class="toast-icon">✓</div>
    <div>
      <div class="toast-title">${title}</div>
      <div class="toast-msg">${message}</div>
    </div>
  `;

  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 6500);
}

/**
 * 11. BACK TO TOP BUTTON
 */
function initBackToTop() {
  const backBtn = document.querySelector('.fab-back-top');
  if (!backBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      backBtn.classList.add('visible');
    } else {
      backBtn.classList.remove('visible');
    }
  });

  backBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/**
 * 12. SMOOTH SCROLLING FOR ALL ANCHOR LINKS
 */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || !targetId.startsWith('#')) return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const headerOffset = 90;
        const elementPosition = targetEl.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}
