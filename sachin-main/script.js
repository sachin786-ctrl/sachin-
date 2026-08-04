// ============================================
// Portfolio - Sachin Kumar
// ============================================

// ============================================
// CONFIGURATION - Yahan apni details daalo
// ============================================

// STEP 1: Google Apps Script deploy karne ke baad
//         apna Web App URL yahan paste karo:
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzExE1HIo_YBS8s5J9NaxocKXZMNr_3gIcSHTJUTGMKR059tPI_GDoHRHpCURGmgmV1/exec';
// Example: 'https://script.google.com/macros/s/AKfycb.../exec'
 
// STEP 2: Resume download ke liye password
//         Yeh static password hai - sirf aap jaante ho
const RESUME_PASSWORD = 'SK@2025';

// STEP 3: Resume PDF ka path
const RESUME_PATH = 'assets/SachinResume.pdf';

// ============================================
// Theme Toggle
// ============================================
const themeToggle = document.getElementById('themeToggle');
const body = document.body;

const currentTheme = localStorage.getItem('theme') || 'light';
if (currentTheme === 'dark') {
  body.classList.add('dark-theme');
}

themeToggle.addEventListener('click', () => {
  body.classList.toggle('dark-theme');
  const theme = body.classList.contains('dark-theme') ? 'dark' : 'light';
  localStorage.setItem('theme', theme);
});

// ============================================
// Navigation
// ============================================
const header = document.getElementById('header');
const nav = document.getElementById('navLinks');
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.querySelectorAll('#navLinks a');

window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;
  if (currentScroll > 100) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
  updateActiveNavLink();
});

if (menuToggle) {
  menuToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    nav.classList.toggle('active');
    menuToggle.classList.toggle('open');
  });
}

window.addEventListener('click', (e) => {
  if (!nav.contains(e.target) && !menuToggle.contains(e.target)) {
    nav.classList.remove('active');
    menuToggle.classList.remove('open');
  }
});

nav.addEventListener('click', (e) => e.stopPropagation());

navLinks.forEach(link => {
  link.addEventListener('click', () => {
    nav.classList.remove('active');
    menuToggle.classList.remove('open');
  });
});

function updateActiveNavLink() {
  const sections = document.querySelectorAll('section[id]');
  const scrollY = window.pageYOffset;
  sections.forEach(section => {
    const sectionHeight = section.offsetHeight;
    const sectionTop = section.offsetTop - 150;
    const sectionId = section.getAttribute('id');
    const navLink = document.querySelector('.nav-links a[href="#' + sectionId + '"]');
    if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
      navLinks.forEach(link => link.classList.remove('active'));
      if (navLink) navLink.classList.add('active');
    }
  });
}

// ============================================
// Smooth Scrolling
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const href = this.getAttribute('href');
    const target = document.querySelector(href);
    if (target) {
      const headerHeight = header.offsetHeight;
      const targetPosition = target.offsetTop - headerHeight;
      history.pushState(null, null, href);
      window.scrollTo({ top: targetPosition, behavior: 'smooth' });
    }
  });
});

// ============================================
// Contact Form - Google Apps Script Integration
// ============================================
const contactForm = document.getElementById('contactForm');
const formResponse = document.getElementById('formResponse');
const submitBtn = document.getElementById('submitBtn');

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Validate Google Script URL
    if (GOOGLE_SCRIPT_URL === 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE') {
      showFormResponse('error', '⚠️ Google Apps Script URL set nahi hai! script.js mein GOOGLE_SCRIPT_URL update karo.');
      return;
    }

    const originalHTML = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;

    // Form data collect karo
    const formData = {
      name: contactForm.querySelector('#name').value.trim(),
      email: contactForm.querySelector('#email').value.trim(),
      subject: contactForm.querySelector('#subject').value.trim(),
      message: contactForm.querySelector('#message').value.trim(),
      timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
    };

    try {
      // Google Apps Script ko data bhejo
      const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors', // Google Apps Script ke liye zaruri hai
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      // no-cors mode mein response check nahi hota,
      // isliye success assume karo agar koi error nahi aya
      showFormResponse('success', '✓ Message sent successfully! I\'ll get back to you soon.');
      contactForm.reset();

    } catch (error) {
      console.error('Form submission error:', error);
      showFormResponse('error', '✗ Network error. Please try again or email directly.');
    }

    submitBtn.innerHTML = originalHTML;
    submitBtn.disabled = false;
  });
}

function showFormResponse(type, message) {
  formResponse.textContent = message;
  formResponse.className = type;
  formResponse.style.display = 'block';
  
  setTimeout(() => {
    formResponse.style.display = 'none';
    formResponse.className = '';
    formResponse.textContent = '';
  }, 6000);
}

// ============================================
// Resume Password Modal - Static Password
// ============================================
const downloadCvBtn  = document.getElementById('downloadCvBtn');
const passwordInput  = document.getElementById('passwordInput');
const passwordModal  = document.getElementById('passwordModal');
const submitPassword = document.getElementById('submitPassword');
const cancelPassword = document.getElementById('cancelPassword');
const passwordError  = document.getElementById('passwordError');

// Resume download button click
if (downloadCvBtn) {
  downloadCvBtn.addEventListener('click', (e) => {
    e.preventDefault();
    passwordModal.classList.add('active');
    setTimeout(() => passwordInput.focus(), 100);
  });
}

// Password check karo (static password)
if (submitPassword) {
  submitPassword.addEventListener('click', () => {
    const enteredPassword = passwordInput.value.trim();

    if (!enteredPassword) {
      passwordError.textContent = '✗ Please enter the password.';
      return;
    }

    // Static password check
    if (enteredPassword === RESUME_PASSWORD) {
      // Correct password - Resume download karo
      passwordModal.classList.remove('active');
      passwordInput.value = '';
      passwordError.textContent = '';

      // PDF download trigger karo
      const link = document.createElement('a');
      link.href = RESUME_PATH;
      link.download = 'Sachin_Kumar_Resume.pdf';
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Success toast dikhao
      showToast('✓ Resume downloading...', 'success');

    } else {
      // Wrong password
      passwordError.textContent = '✗ Incorrect password. Please try again.';
      passwordInput.value = '';
      passwordInput.focus();
      
      // Error shake animation
      passwordInput.classList.add('shake');
      setTimeout(() => passwordInput.classList.remove('shake'), 500);
    }
  });
}

// Modal band karo
if (cancelPassword) {
  cancelPassword.addEventListener('click', closeModal);
}

// Escape key se modal band karo
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && passwordModal && passwordModal.classList.contains('active')) {
    closeModal();
  }
});

// Enter key se submit karo
if (passwordInput) {
  passwordInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') submitPassword.click();
  });
}

// Modal background click se band karo
if (passwordModal) {
  passwordModal.addEventListener('click', (e) => {
    if (e.target === passwordModal) closeModal();
  });
}

function closeModal() {
  passwordModal.classList.remove('active');
  passwordInput.value = '';
  passwordError.textContent = '';
}

// ============================================
// Toast Notification
// ============================================
function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => toast.classList.add('show'), 10);
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => document.body.removeChild(toast), 300);
  }, 3000);
}

// ============================================
// Scroll Reveal Animation
// ============================================
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.project-card, .highlight-item, .skill-category, .education-item')
    .forEach((el, index) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'all 0.6s ease ' + (index * 0.1) + 's';
      observer.observe(el);
    });
});

// ============================================
// Page Load Fade In
// ============================================
window.addEventListener('load', () => {
  document.body.style.opacity = '0';
  requestAnimationFrame(() => {
    document.body.style.transition = 'opacity 0.5s ease';
    document.body.style.opacity = '1';
  });
});