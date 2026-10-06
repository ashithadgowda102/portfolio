/**
 * ASHITHA D. GOWDA - PROFESSIONAL DEVELOPER PORTFOLIO
 * Core JavaScript: Interactive particle canvas, theme toggle, dynamic typing,
 * scrollspy, modals, category filters, animated counters, copy utilities, form handling.
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // =========================================================================
  // 1. THEME SWITCHER (Dark / Light Mode)
  // =========================================================================
  const themeToggleBtn = document.getElementById('themeToggle');
  const rootElement = document.documentElement;

  // Retrieve saved theme or default to dark
  const savedTheme = localStorage.getItem('ashitha_theme') || 'dark';
  rootElement.setAttribute('data-theme', savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = rootElement.getAttribute('data-theme');
      const targetTheme = currentTheme === 'dark' ? 'light' : 'dark';

      rootElement.setAttribute('data-theme', targetTheme);
      localStorage.setItem('ashitha_theme', targetTheme);
      showToast(`Switched to ${targetTheme === 'dark' ? 'Dark' : 'Light'} Mode`, 'info');
    });
  }

  // =========================================================================
  // 2. INTERACTIVE DEVELOPER PARTICLE CANVAS
  // =========================================================================
  const canvas = document.getElementById('bg-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let particles = [];
    const particleCount = Math.min(Math.floor(window.innerWidth / 20), 65);
    const mouse = { x: null, y: null, radius: 120 };

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    window.addEventListener('mousemove', (e) => {
      mouse.x = e.x;
      mouse.y = e.y;
    });

    window.addEventListener('mouseout', () => {
      mouse.x = null;
      mouse.y = null;
    });

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 2 + 1;
        this.baseX = this.x;
        this.baseY = this.y;
        this.speedX = (Math.random() - 0.5) * 0.7;
        this.speedY = (Math.random() - 0.5) * 0.7;
      }

      draw() {
        const isDark = rootElement.getAttribute('data-theme') === 'dark';
        ctx.fillStyle = isDark ? 'rgba(16, 185, 129, 0.4)' : 'rgba(5, 150, 105, 0.3)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Bounce from walls
        if (this.x < 0 || this.x > width) this.speedX = -this.speedX;
        if (this.y < 0 || this.y > height) this.speedY = -this.speedY;

        // Mouse hover interaction
        if (mouse.x != null && mouse.y != null) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < mouse.radius) {
            const forceDirectionX = dx / distance;
            const forceDirectionY = dy / distance;
            const force = (mouse.radius - distance) / mouse.radius;
            this.x -= forceDirectionX * force * 2;
            this.y -= forceDirectionY * force * 2;
          }
        }
      }
    }

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    function animateParticles() {
      ctx.clearRect(0, 0, width, height);

      const isDark = rootElement.getAttribute('data-theme') === 'dark';
      const lineColor = isDark ? 'rgba(16, 185, 129,' : 'rgba(5, 150, 105,';

      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();

        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 110) {
            const opacity = 1 - distance / 110;
            ctx.strokeStyle = `${lineColor} ${opacity * 0.18})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(animateParticles);
    }
    animateParticles();
  }

  // =========================================================================
  // 3. DYNAMIC HERO TYPING EFFECT
  // =========================================================================
  const typingElement = document.getElementById('typingText');
  if (typingElement) {
    const roles = [
      'Java Full Stack Developer',
      'Flutter Mobile Developer',
      'Technical Trainer & Mentor',
      'Python & Problem Solver',
      'Electronics & Comm. Engineer'
    ];

    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typingSpeed = 90;
    const deletingSpeed = 45;
    const pauseDelay = 1800;

    function typeLoop() {
      const currentRole = roles[roleIndex];

      if (isDeleting) {
        typingElement.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;
      } else {
        typingElement.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
      }

      let speed = isDeleting ? deletingSpeed : typingSpeed;

      if (!isDeleting && charIndex === currentRole.length) {
        speed = pauseDelay;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        speed = 400;
      }

      setTimeout(typeLoop, speed);
    }

    typeLoop();
  }

  // =========================================================================
  // 4. NAVIGATION & MOBILE DRAWER
  // =========================================================================
  const navbar = document.getElementById('navbar');
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const navMenu = document.getElementById('navMenu');
  const drawerBackdrop = document.getElementById('drawerBackdrop');
  const navLinks = document.querySelectorAll('.nav-link');

  // Sticky Navbar Blur On Scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Mobile Drawer Toggle
  function toggleMobileMenu() {
    const isOpen = navMenu.classList.contains('active');
    if (isOpen) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  }

  function openMobileMenu() {
    navMenu.classList.add('active');
    hamburgerBtn.classList.add('active');
    drawerBackdrop.classList.add('active');
    hamburgerBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    navMenu.classList.remove('active');
    hamburgerBtn.classList.remove('active');
    drawerBackdrop.classList.remove('active');
    hamburgerBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  if (hamburgerBtn) {
    hamburgerBtn.addEventListener('click', toggleMobileMenu);
  }

  if (drawerBackdrop) {
    drawerBackdrop.addEventListener('click', closeMobileMenu);
  }

  // Close mobile menu when clicking nav link
  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      closeMobileMenu();
    });
  });

  // =========================================================================
  // 5. SCROLLSPY (Highlight active section)
  // =========================================================================
  const sections = document.querySelectorAll('section[id]');

  function updateActiveNavLink() {
    const scrollY = window.pageYOffset;

    sections.forEach((current) => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');
      const matchingLink = document.querySelector(`.nav-link[href*="${sectionId}"]`);

      if (matchingLink) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          navLinks.forEach((l) => l.classList.remove('active'));
          matchingLink.classList.add('active');
        }
      }
    });
  }

  window.addEventListener('scroll', updateActiveNavLink);

  // =========================================================================
  // 6. ANIMATED NUMERICAL COUNTERS (Stats Section)
  // =========================================================================
  const statNumbers = document.querySelectorAll('.stat-number');
  let statsCounted = false;

  const statsObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !statsCounted) {
          statsCounted = true;
          statNumbers.forEach((stat) => {
            const target = parseFloat(stat.getAttribute('data-target'));
            const suffix = stat.getAttribute('data-suffix') || '';
            const decimals = parseInt(stat.getAttribute('data-decimal') || '0', 10);
            const duration = 1800; // ms
            const startTime = performance.now();

            function countUp(currentTime) {
              const elapsed = currentTime - startTime;
              const progress = Math.min(elapsed / duration, 1);
              // easeOutQuart
              const ease = 1 - Math.pow(1 - progress, 4);
              const currentVal = ease * target;

              stat.textContent = currentVal.toFixed(decimals) + suffix;

              if (progress < 1) {
                requestAnimationFrame(countUp);
              } else {
                stat.textContent = target.toFixed(decimals) + suffix;
              }
            }
            requestAnimationFrame(countUp);
          });
          observer.disconnect();
        }
      });
    },
    { threshold: 0.3 }
  );

  const statsSection = document.querySelector('.stats-section');
  if (statsSection) {
    statsObserver.observe(statsSection);
  }

  // =========================================================================
  // 7. SKILL CATEGORY FILTERING & ANIMATED PROGRESS BARS
  // =========================================================================
  const filterTabs = document.querySelectorAll('.filter-tab');
  const skillCards = document.querySelectorAll('.skill-card');

  filterTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      filterTabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');

      const filterValue = tab.getAttribute('data-filter');

      skillCards.forEach((card) => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  // Animated Progress Bars when scrolled into view
  const progressBars = document.querySelectorAll('.progress-bar-fill');
  const skillsObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const fill = entry.target;
          const targetWidth = fill.getAttribute('data-progress');
          fill.style.width = `${targetWidth}%`;
        }
      });
    },
    { threshold: 0.25 }
  );

  progressBars.forEach((bar) => skillsObserver.observe(bar));

  // =========================================================================
  // 8. PROJECTS FILTERING & INTERACTIVE DETAIL MODAL
  // =========================================================================
  const projTabs = document.querySelectorAll('.proj-tab');
  const projectCards = document.querySelectorAll('.project-card');

  projTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      projTabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.getAttribute('data-proj-filter');

      projectCards.forEach((card) => {
        const category = card.getAttribute('data-proj-category');
        if (filter === 'all' || category === filter) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  // Project Details Database for Interactive Modal
  const projectDatabase = {
    edusphere: {
      category: 'Java Full Stack & Spring Boot',
      title: 'EduSphere - Smart Academic & Campus Management Portal',
      desc: 'An end-to-end enterprise academic system architected to streamline university administrative pipelines, student grading, and faculty collaboration.',
      features: [
        'Role-Based Access Control (RBAC) supporting Admin, Faculty, and Student tiers with Spring Security.',
        'RESTful API endpoints engineered with Spring Boot, validated with Hibernate Validator.',
        'MySQL relational schema design with automated indexing, stored procedures, and audit logs.',
        'Interactive administrative web dashboards styled with responsive HTML5, modern CSS3 & JavaScript.',
        'Automated semester grade report generation and PDF exports for faculty.'
      ],
      tech: ['Java 17', 'Spring Boot', 'Spring Data JPA', 'MySQL', 'REST APIs', 'HTML5', 'CSS3', 'JavaScript']
    },
    habitpulse: {
      category: 'Flutter & Dart Cross-Platform',
      title: 'HabitPulse - Cross-Platform Habit & Wellness Tracker',
      desc: 'A consumer-grade mobile habit formation app built with Flutter and Dart, focused on streak tracking, micro-interactions, and offline sync.',
      features: [
        'Engineered responsive layouts for both iOS and Android from a single performant codebase.',
        'Implemented Provider state management for real-time streak computation and habit state changes.',
        'Local SQLite database integration for lightning-fast offline persistence and backup.',
        'Custom interactive animated charts displaying weekly and monthly habit consistency.',
        'Scheduled push reminders and dark/light adaptive color theming.'
      ],
      tech: ['Flutter 3.x', 'Dart', 'Provider', 'SQLite', 'Material Design 3', 'Charts Flutter']
    },
    telemetry: {
      category: 'Python & Engineering Academic Project',
      title: 'Smart Engineering Telemetry & Analysis System',
      desc: 'Practical engineering academic project applying Python programming and core electronics concepts to formulate real-time sensor telemetry processing.',
      features: [
        'Formulated logical algorithms for real-time sensor data ingest, noise filtering, and signal analysis.',
        'Applied Python OOP design principles for modular hardware sensor abstraction and test harness.',
        'Automated threshold breach validation with instant alert generation and event logging.',
        'Exported telemetry datasets to CSV and visual plots for empirical verification.',
        'Conducted academic presentation with strong faculty appreciation and 8.1 CGPA evaluation.'
      ],
      tech: ['Python 3', 'Data Structures', 'Signal Processing', 'File I/O', 'OOPs', 'Sensors']
    },
    codecraft: {
      category: 'Web Application & Training Sandbox',
      title: 'CodeCraft - Interactive Coding Assessment Sandbox',
      desc: 'An educational technical training web application developed to host live coding workshops and evaluate programming challenges in real time.',
      features: [
        'Browser-based coding editor supporting syntax highlighting and instant snippet evaluation.',
        'Custom curriculum management allowing trainers to assign targeted Java and Python algorithmic drills.',
        'Instant test-case evaluation returning time-complexity hints and edge-case diagnostics.',
        'Live student scoreboard for gamifying technical problem-solving sessions.'
      ],
      tech: ['HTML5', 'CSS3', 'JavaScript', 'Java Backend', 'Technical Pedagogy']
    },
    spendsync: {
      category: 'Flutter & Mobile FinTech',
      title: 'SpendSync - Smart Expense & Budget Manager',
      desc: 'A cross-platform mobile application providing intuitive expense tracking, budget thresholds, and multi-currency support.',
      features: [
        'Intuitive gesture-based transaction logging and category tagging.',
        'Encrypted local storage leveraging Hive DB for private financial records.',
        'Visual spend breakdowns by category with interactive animated donut charts.',
        'Monthly budget limit breach alerts and recurring subscription tracking.'
      ],
      tech: ['Flutter', 'Dart', 'Hive DB', 'State Management', 'Material 3']
    },
    pygrader: {
      category: 'Python Automation Pipeline',
      title: 'PyGrader - Automated Code Evaluation Pipeline',
      desc: 'A robust Python script automation pipeline built to benchmark and grade programming assignments submitted during technical training workshops.',
      features: [
        'Sandboxed execution environment utilizing Python subprocess module to prevent unsafe execution.',
        'Timeout enforcement to catch infinite loops and inefficient solutions automatically.',
        'Automated comparison of stdout against anticipated test fixtures with detailed diff outputs.',
        'Bulk student report generation in Markdown and clean tabular terminal logs.'
      ],
      tech: ['Python', 'Subprocess', 'Unit Testing', 'File Processing', 'CLI']
    }
  };

  const projectModal = document.getElementById('projectModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalCategory = document.getElementById('modalCategory');
  const modalTitle = document.getElementById('modalTitle');
  const modalDesc = document.getElementById('modalDesc');
  const modalFeatures = document.getElementById('modalFeatures');
  const modalTech = document.getElementById('modalTech');
  const detailButtons = document.querySelectorAll('.btn-proj-detail');

  function openProjectModal(projectId) {
    const data = projectDatabase[projectId];
    if (!data) return;

    modalCategory.textContent = data.category;
    modalTitle.textContent = data.title;
    modalDesc.textContent = data.desc;

    // Populate features list
    modalFeatures.innerHTML = '';
    data.features.forEach((feat) => {
      const li = document.createElement('li');
      li.textContent = feat;
      modalFeatures.appendChild(li);
    });

    // Populate tech pills
    modalTech.innerHTML = '';
    data.tech.forEach((tech) => {
      const span = document.createElement('span');
      span.textContent = tech;
      modalTech.appendChild(span);
    });

    projectModal.classList.add('active');
    projectModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeProjectModal() {
    projectModal.classList.remove('active');
    projectModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  detailButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const projId = btn.getAttribute('data-project');
      openProjectModal(projId);
    });
  });

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeProjectModal);
  }

  if (projectModal) {
    projectModal.addEventListener('click', (e) => {
      if (e.target === projectModal) {
        closeProjectModal();
      }
    });
  }

  // Escape key to close modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && projectModal && projectModal.classList.contains('active')) {
      closeProjectModal();
    }
  });

  // =========================================================================
  // 9. COPY-TO-CLIPBOARD UTILITIES
  // =========================================================================
  const copyPillButtons = document.querySelectorAll('.copy-pill-btn');
  copyPillButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const textToCopy = btn.getAttribute('data-copy');
      if (textToCopy) {
        navigator.clipboard.writeText(textToCopy).then(() => {
          showToast(`Copied to clipboard: ${textToCopy}`, 'success');
          const originalHTML = btn.innerHTML;
          btn.innerHTML = `<i class="fa-solid fa-check"></i> <span>Copied!</span>`;
          setTimeout(() => {
            btn.innerHTML = originalHTML;
          }, 2000);
        });
      }
    });
  });

  // Copy code snippet in About section
  const copyCodeBtn = document.getElementById('copyCodeBtn');
  if (copyCodeBtn) {
    copyCodeBtn.addEventListener('click', () => {
      const codeElement = document.querySelector('.terminal-code code');
      if (codeElement) {
        navigator.clipboard.writeText(codeElement.innerText).then(() => {
          showToast('Profile code copied to clipboard!', 'success');
          copyCodeBtn.innerHTML = `<i class="fa-solid fa-check"></i> <span>Copied!</span>`;
          setTimeout(() => {
            copyCodeBtn.innerHTML = `<i class="fa-regular fa-copy"></i> <span>Copy</span>`;
          }, 2000);
        });
      }
    });
  }

  // =========================================================================
  // 10. RESUME DOWNLOAD FEEDBACK
  // =========================================================================
  const resumeButtons = [
    document.getElementById('navResumeBtn'),
    document.getElementById('heroResumeBtn'),
    document.getElementById('bannerResumeBtn')
  ];

  resumeButtons.forEach((btn) => {
    if (btn) {
      btn.addEventListener('click', () => {
        showToast("Downloading Ashitha D. Gowda's Official Resume...", 'info');
      });
    }
  });

  // =========================================================================
  // 11. CONTACT FORM VALIDATION & TRANSMISSION
  // =========================================================================
  const contactForm = document.getElementById('contactForm');
  const userNameInput = document.getElementById('userName');
  const userEmailInput = document.getElementById('userEmail');
  const userRoleSelect = document.getElementById('userRole');
  const userMessageInput = document.getElementById('userMessage');
  const submitBtn = document.getElementById('submitBtn');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      // Reset errors
      document.querySelectorAll('.form-group').forEach((g) => g.classList.remove('has-error'));

      // Validate Name
      if (!userNameInput.value.trim()) {
        userNameInput.closest('.form-group').classList.add('has-error');
        isValid = false;
      }

      // Validate Email
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(userEmailInput.value.trim())) {
        userEmailInput.closest('.form-group').classList.add('has-error');
        isValid = false;
      }

      // Validate Message (min 10 chars)
      if (userMessageInput.value.trim().length < 10) {
        userMessageInput.closest('.form-group').classList.add('has-error');
        isValid = false;
      }

      if (!isValid) {
        showToast('Please rectify the highlighted fields.', 'warning');
        return;
      }

      // Simulate transmission
      const originalBtnHTML = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<i class="fa-solid fa-circle-notch fa-spin"></i> <span>Transmitting Message...</span>`;

      setTimeout(() => {
        const senderName = userNameInput.value.trim();
        const senderEmail = userEmailInput.value.trim();
        const senderRole = userRoleSelect.value;
        const senderMsg = userMessageInput.value.trim();

        // Show success toast
        showToast(`Thank you, ${senderName}! Your message has been prepared for Ashitha.`, 'success');

        // Formulate prefilled mailto link as direct fall-through
        const mailtoSubject = encodeURIComponent(`Portfolio Inquiry [${senderRole}] from ${senderName}`);
        const mailtoBody = encodeURIComponent(
          `Hi Ashitha,\n\nMy Name: ${senderName}\nEmail: ${senderEmail}\nInquiry Type: ${senderRole}\n\nMessage:\n${senderMsg}\n\nSent via your portfolio website.`
        );
        const mailtoLink = `mailto:ashithadgowda102@gmail.com?subject=${mailtoSubject}&body=${mailtoBody}`;

        // Reset Form
        contactForm.reset();
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnHTML;

        // Prompt user to open direct email client if desired
        setTimeout(() => {
          if (confirm('Would you like to open your email client to send this message directly to Ashitha?')) {
            window.location.href = mailtoLink;
          }
        }, 600);
      }, 1000);
    });
  }

  // =========================================================================
  // 12. SCROLL TO TOP WITH CIRCULAR PROGRESS INDICATOR
  // =========================================================================
  const scrollToTopBtn = document.getElementById('scrollToTopBtn');
  const progressCircle = document.getElementById('progressRingCircle');
  const circumference = 2 * Math.PI * 20; // r=20 -> ~125.66

  if (progressCircle) {
    progressCircle.style.strokeDasharray = `${circumference} ${circumference}`;
    progressCircle.style.strokeDashoffset = `${circumference}`;
  }

  function handleScrollProgress() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollPercentage = scrollHeight > 0 ? scrollTop / scrollHeight : 0;

    if (progressCircle) {
      const offset = circumference - scrollPercentage * circumference;
      progressCircle.style.strokeDashoffset = `${offset}`;
    }

    if (scrollToTopBtn) {
      if (scrollTop > 350) {
        scrollToTopBtn.classList.add('visible');
      } else {
        scrollToTopBtn.classList.remove('visible');
      }
    }
  }

  window.addEventListener('scroll', handleScrollProgress);

  if (scrollToTopBtn) {
    scrollToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // =========================================================================
  // 13. TOAST NOTIFICATION ENGINE
  // =========================================================================
  function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    let iconClass = 'fa-solid fa-circle-info';
    if (type === 'success') iconClass = 'fa-solid fa-circle-check';
    if (type === 'warning') iconClass = 'fa-solid fa-triangle-exclamation';

    toast.innerHTML = `
      <i class="${iconClass} toast-icon"></i>
      <span class="toast-message">${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 300);
    }, 3800);
  }

  // =========================================================================
  // 14. FOOTER CURRENT YEAR
  // =========================================================================
  const yearElement = document.getElementById('currentYear');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
});
