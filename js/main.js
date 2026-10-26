/**
 * SDM RAJAJI PORTFOLIO - CORE APPLICATION LOGIC
 * Navigation, Typewriter, Skill Filters, Project Modal, AI Evaluation Lab, & Interactions
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. SCROLL PROGRESS BAR
  const progressBar = document.getElementById('scroll-progress');
  const nav = document.querySelector('.site-nav');

  window.addEventListener('scroll', () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = totalHeight > 0 ? (window.scrollY / totalHeight) * 100 : 0;
    if (progressBar) {
      progressBar.style.width = `${progress}%`;
    }

    // Sticky nav blur on scroll
    if (nav) {
      if (window.scrollY > 40) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    }
  });

  // 2. MOBILE HAMBURGER MENU
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-item a');

  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      navMenu.classList.toggle('open');
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navMenu.classList.remove('open');
      });
    });
  }

  // 3. SCROLL SPY ACTIVE NAV LINK
  const sections = document.querySelectorAll('section[id]');
  function highlightNavOnScroll() {
    const scrollY = window.pageYOffset + 120;
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 50;
      const sectionId = current.getAttribute('id');
      const navLink = document.querySelector(`.nav-menu a[href*="${sectionId}"]`);

      if (navLink) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          navLink.classList.add('active');
        } else {
          navLink.classList.remove('active');
        }
      }
    });
  }
  window.addEventListener('scroll', highlightNavOnScroll);

  // 4. HERO ROLE TYPEWRITER EFFECT
  const typewriterElem = document.getElementById('typewriter-text');
  const roles = [
    'AI Training & Evaluation Specialist',
    'Software Developer',
    'Flutter Developer',
    'AI & Data Science Enthusiast'
  ];

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingDelay = 90;

  function typeEffect() {
    if (!typewriterElem) return;

    const currentRole = roles[roleIndex];

    if (isDeleting) {
      typewriterElem.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
      typingDelay = 45;
    } else {
      typewriterElem.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
      typingDelay = 95;
    }

    if (!isDeleting && charIndex === currentRole.length) {
      // Pause at full word
      typingDelay = 1800;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      typingDelay = 400;
    }

    setTimeout(typeEffect, typingDelay);
  }
  typeEffect();

  // 5. TECHNICAL SKILLS CATEGORY FILTER
  const tabBtns = document.querySelectorAll('.tab-btn');
  const categoryGroups = document.querySelectorAll('.skills-category-group');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      categoryGroups.forEach(group => {
        const category = group.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          group.classList.remove('hidden');
        } else {
          group.classList.add('hidden');
        }
      });
    });
  });

  // 6. INTERACTIVE AI TRAINING & EVALUATION LAB
  const evalScenarios = {
    code: {
      prompt: "Write a high-performance Python database query function to fetch user profiles by username while handling potential null values and database security.",
      modelA: {
        title: "Model Output A",
        status: "FAIL",
        statusClass: "fail",
        text: `<code>def get_user(username):<br>&nbsp;&nbsp;query = f"SELECT * FROM users WHERE name = '{username}'"<br>&nbsp;&nbsp;cursor.execute(query)<br>&nbsp;&nbsp;return cursor.fetchone()</code><br><br><span style="color:#f87171;">Critical Defect: Direct string interpolation exposes SQL Injection risk. Missing connection error handling and parameterized inputs.</span>`
      },
      modelB: {
        title: "Model Output B (Preferred)",
        status: "PASS",
        statusClass: "pass",
        text: `<code>def get_user(db_pool, username: str) -> Optional[dict]:<br>&nbsp;&nbsp;with db_pool.connection() as conn:<br>&nbsp;&nbsp;&nbsp;&nbsp;with conn.cursor() as cur:<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;cur.execute("SELECT id, name, email FROM users WHERE name = %s", (username,))<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;return cur.fetchone()</code><br><br><span style="color:#34d399;">Proper parameterization prevents injection; uses context manager for safe pool release.</span>`
      },
      assessment: `<strong>Evaluation Specialist Critique:</strong> Model A failed on critical security standards (OWASP A03 SQL Injection) despite answering concisely. Model B strictly followed safety constraints, utilized type annotations, explicit column selections, and context managers. <em>Scorecard: Factuality: 5/5, Security: 5/5, Instruction Following: 5/5. Preferred: Model B.</em>`
    },
    factuality: {
      prompt: "Explain how Flutter handles background task execution on iOS and Android with persistent local storage.",
      modelA: {
        title: "Model Output A",
        status: "FAIL",
        statusClass: "fail",
        text: `Flutter apps can run infinite background loops seamlessly on both Android and iOS simply using Dart's standard <code>Timer.periodic</code>, even when the user completely terminates the application from the app switcher.<br><br><span style="color:#f87171;">Hallucination: Incorrectly asserts Dart timers survive app termination. Fails to account for iOS BGTaskScheduler limits.</span>`
      },
      modelB: {
        title: "Model Output B (Preferred)",
        status: "PASS",
        statusClass: "pass",
        text: `True background execution requires platform-native dispatchers. On Android, Flutter integrates with <code>WorkManager</code>; on iOS, it relies on <code>BGTaskScheduler</code>. Dart isolates do not run continuously in terminated states without native foreground services or OS-scheduled wakeups.<br><br><span style="color:#34d399;">Accurate technical architecture respecting mobile OS lifecycle constraints.</span>`
      },
      assessment: `<strong>Evaluation Specialist Critique:</strong> Model A generated a dangerous hallucination regarding mobile OS memory management that would cause runtime termination in production. Model B demonstrated deep architectural precision regarding platform channels, OS background restrictions, and native isolate spawning. <em>Preferred: Model B.</em>`
    },
    constraints: {
      prompt: "Provide a JSON object containing exactly 3 key-value pairs representing an AI model audit score (accuracy, latency_ms, align_rating). Do NOT wrap in markdown code blocks.",
      modelA: {
        title: "Model Output A",
        status: "FAIL",
        statusClass: "fail",
        text: `Sure! Here is the JSON object you requested:<br><br><code>{\n  "accuracy": 0.98,\n  "latency_ms": 142,\n  "align_rating": "A+",\n  "audit_date": "2025-05-12"\n}</code><br><br><span style="color:#f87171;">Constraint Violations: Included conversational filler, returned 4 keys instead of exactly 3, and violated the negative constraint prohibiting markdown backticks.</span>`
      },
      modelB: {
        title: "Model Output B (Preferred)",
        status: "PASS",
        statusClass: "pass",
        text: `{"accuracy": 0.98, "latency_ms": 142, "align_rating": "A+"}<br><br><span style="color:#34d399;">100% adherence: Exactly 3 keys, zero preambles, raw JSON string output.</span>`
      },
      assessment: `<strong>Evaluation Specialist Critique:</strong> Crucial negative constraint ("Do NOT wrap in markdown") and quantitative constraint ("exactly 3 pairs") were broken by Model A. Model B achieved zero token waste and absolute precision suitable for automated API pipelines. <em>Preferred: Model B.</em>`
    }
  };

  const scenarioBtns = document.querySelectorAll('.eval-scenario-btn');
  const promptText = document.getElementById('eval-prompt-text');
  const colA = document.getElementById('eval-model-a');
  const colB = document.getElementById('eval-model-b');
  const assessmentBody = document.getElementById('eval-assessment-body');

  function updateEvalLab(scenarioKey) {
    const data = evalScenarios[scenarioKey];
    if (!data) return;

    if (promptText) promptText.textContent = data.prompt;
    if (colA) {
      colA.querySelector('.model-label').textContent = data.modelA.title;
      const badge = colA.querySelector('.model-badge-status');
      badge.textContent = data.modelA.status;
      badge.className = `model-badge-status ${data.modelA.statusClass}`;
      colA.querySelector('.model-response-content').innerHTML = data.modelA.text;
    }
    if (colB) {
      colB.querySelector('.model-label').textContent = data.modelB.title;
      const badge = colB.querySelector('.model-badge-status');
      badge.textContent = data.modelB.status;
      badge.className = `model-badge-status ${data.modelB.statusClass}`;
      colB.querySelector('.model-response-content').innerHTML = data.modelB.text;
    }
    if (assessmentBody) {
      assessmentBody.innerHTML = data.assessment;
    }
  }

  scenarioBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      scenarioBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const scenario = btn.getAttribute('data-scenario');
      updateEvalLab(scenario);
    });
  });

  // 7. PROJECT DETAILS MODAL DATA
  const projectDetails = {
    'my-diary': {
      title: "My Diary – Personal Mobile Application",
      category: "Personal Productivity | Mobile Application",
      timeline: "2024 – Present",
      tech: ["Flutter", "Dart", "Local Storage", "App Security", "Biometrics", "Clean Architecture"],
      description: "A private, distraction-free journaling application engineered with an offline-first paradigm. It allows users to write daily journals, track life reflections, and protect personal thoughts with military-grade privacy.",
      highlights: [
        "Biometric Authentication: Native fingerprint and facial recognition unlocking.",
        "Security & App Lock: PIN lock, pattern authentication, and zero-cloud local database storage.",
        "Rich Journaling: Daily mood categorization, search, tags, and structured reminders.",
        "Export & Backup: Encrypted JSON/PDF backup and export capabilities.",
        "Modern Architecture: Built with Flutter Material 3, modular repository pattern, and clean state management."
      ]
    },
    'gym-fitness': {
      title: "Gym & Fitness Platform",
      category: "Fitness Technology | Mobile Application & Backend",
      timeline: "2024 – Present",
      tech: ["Flutter", "Node.js", "PostgreSQL", "REST APIs", "State Management", "Data Analytics"],
      description: "A high-performance cross-platform fitness management ecosystem designed for gym owners, coaches, and members to seamlessly monitor progress and streamline daily gym operations.",
      highlights: [
        "Member Management: Dynamic member rosters, membership tiers, and attendance tracking.",
        "Progress Tracking: Weight tracking, body metric logs, and visual historical charts.",
        "Workout & Diet Schedules: Customizable workout routines and exercise library.",
        "Coach Monitoring Dashboard: Trainer portals to review member consistency and form.",
        "Scalable Architecture: Node.js REST API with optimized PostgreSQL relational queries."
      ]
    },
    'career-seek': {
      title: "CareerSeek – Job Platform Concept",
      category: "Recruitment & Career | Full Stack Concept",
      timeline: "2024 – Present",
      tech: ["Flutter", "Node.js", "PostgreSQL", "REST APIs", "Search Filters"],
      description: "An intuitive job search and talent recruitment portal tailored for IT and non-IT sectors. Built to bridge qualified candidates with matching employers without intermediary clutter.",
      highlights: [
        "Advanced Job Discovery: Location-based search, salary filters, and sector categorizations.",
        "Candidate Profiles: Dynamic digital resume management and portfolio link integration.",
        "Employer Dashboard: Job posting management, applicant status pipeline, and candidate reviews.",
        "Responsive Flow: Unified mobile-first experience with scalable PostgreSQL backend."
      ]
    },
    'api-key-saver': {
      title: "API Key Saver – Utility Tool",
      category: "Developer Utility | Security Application",
      timeline: "2024 – Present",
      tech: ["Flutter", "Local Storage", "AES Encryption", "Offline-First", "App Security"],
      description: "A lightweight, secure utility application created for developers to safely organize, encrypt, and retrieve API credentials locally without risking exposure to cloud servers.",
      highlights: [
        "Offline-First Security: Zero external network requests; all tokens remain strictly local.",
        "Local Encryption: AES encrypted storage for sensitive keys, tokens, and client secrets.",
        "Category Organization: Tagging by project (OpenAI, AWS, GitHub, Stripe, Supabase).",
        "Quick Access: One-tap copy to clipboard with auto-clear security timer."
      ]
    }
  };

  const projectModal = document.getElementById('project-modal');
  const modalCloseBtn = document.querySelector('.modal-close-btn');
  const modalTitle = document.getElementById('modal-project-title');
  const modalCategory = document.getElementById('modal-project-category');
  const modalDesc = document.getElementById('modal-project-desc');
  const modalTech = document.getElementById('modal-project-tech');
  const modalFeatures = document.getElementById('modal-project-features');

  function openProjectModal(key) {
    const data = projectDetails[key];
    if (!data || !projectModal) return;

    modalTitle.textContent = data.title;
    modalCategory.textContent = `${data.category} • ${data.timeline}`;
    modalDesc.textContent = data.description;

    modalTech.innerHTML = data.tech
      .map(t => `<span class="tech-tag" style="border-color:var(--border-cyan);color:var(--accent-cyan);">${t}</span>`)
      .join('');

    modalFeatures.innerHTML = data.highlights
      .map(f => `
        <li style="display:flex;align-items:flex-start;gap:10px;margin-bottom:10px;font-size:0.9rem;color:#cbd5e1;">
          <svg style="color:var(--accent-cyan);width:18px;height:18px;flex-shrink:0;margin-top:2px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
          <span>${f}</span>
        </li>
      `)
      .join('');

    projectModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeProjectModal() {
    if (projectModal) {
      projectModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  document.querySelectorAll('.open-modal-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      const projectKey = btn.getAttribute('data-project');
      openProjectModal(projectKey);
    });
  });

  document.querySelectorAll('.modal-close-btn').forEach(btn => {
    btn.addEventListener('click', closeProjectModal);
  });

  if (projectModal) {
    projectModal.addEventListener('click', e => {
      if (e.target === projectModal) {
        closeProjectModal();
      }
    });
  }

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && projectModal && projectModal.classList.contains('active')) {
      closeProjectModal();
    }
  });

  // 8. TOAST NOTIFICATION UTILITY
  const toast = document.getElementById('toast-notice');
  const toastMsg = document.getElementById('toast-message');

  function showToast(message) {
    if (!toast || !toastMsg) return;
    toastMsg.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3200);
  }

  // 9. COPY EMAIL TO CLIPBOARD
  const copyEmailBtn = document.getElementById('copy-email-btn');
  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', () => {
      const email = 'rajajikpsofficial1@gmail.com';
      navigator.clipboard.writeText(email).then(() => {
        showToast('Email address copied to clipboard!');
      }).catch(() => {
        // Fallback
        const tempInput = document.createElement('input');
        tempInput.value = email;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
        showToast('Email address copied to clipboard!');
      });
    });
  }

  // 10. CONTACT FORM HANDLER
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', e => {
      e.preventDefault();

      const name = document.getElementById('form-name').value.trim();
      const email = document.getElementById('form-email').value.trim();
      const subject = document.getElementById('form-subject').value.trim();
      const message = document.getElementById('form-message').value.trim();

      if (!name || !email || !message) {
        showToast('Please fill in all required fields.');
        return;
      }

      // Generate mailto link
      const mailtoUrl = `mailto:rajajikpsofficial1@gmail.com?subject=${encodeURIComponent(subject || 'Portfolio Inquiry from ' + name)}&body=${encodeURIComponent("Sender Name: " + name + "\nSender Email: " + email + "\n\nMessage:\n" + message)}`;

      showToast('Opening your email client to send message...');
      setTimeout(() => {
        window.location.href = mailtoUrl;
      }, 700);

      contactForm.reset();
    });
  }

  // 11. SMOOTH SCROLL FOR ALL ANCHOR LINKS
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const headerOffset = 70;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // 12. AUTOMATIC COPYRIGHT YEAR
  const yearElem = document.getElementById('copyright-year');
  if (yearElem) {
    yearElem.textContent = new Date().getFullYear();
  }
});
