(() => {
  const html = document.documentElement;
  const themeToggle = document.getElementById('theme-toggle');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');

  // Theme preference is stored locally when supported.
  try {
    const savedTheme = localStorage.getItem('prabhat-portfolio-theme');
    if (savedTheme === 'light' || savedTheme === 'dark') html.dataset.theme = savedTheme;
  } catch (_) {}

  themeToggle?.addEventListener('click', () => {
    html.dataset.theme = html.dataset.theme === 'dark' ? 'light' : 'dark';
    try { localStorage.setItem('prabhat-portfolio-theme', html.dataset.theme); } catch (_) {}
  });

  hamburger?.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', String(open));
    hamburger.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
  });

  navLinks?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger?.setAttribute('aria-expanded', 'false');
  }));

  document.getElementById('year').textContent = new Date().getFullYear();

  // Typing effect, matching the original template's rotating-role animation.
  const typingTarget = document.getElementById('typing-text');
  const roles = ['IT Engineering Student', 'Aspiring Software Developer', 'AI/ML Enthusiast', 'Cloud Computing Learner'];
  let roleIndex = 0, charIndex = 0, deleting = false;
  function typeRole() {
    if (!typingTarget) return;
    const role = roles[roleIndex];
    typingTarget.textContent = role.slice(0, charIndex);
    if (!deleting && charIndex < role.length) {
      charIndex++;
      setTimeout(typeRole, 85);
    } else if (!deleting) {
      deleting = true;
      setTimeout(typeRole, 1250);
    } else if (charIndex > 0) {
      charIndex--;
      setTimeout(typeRole, 38);
    } else {
      deleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      setTimeout(typeRole, 250);
    }
  }
  typeRole();

  // Scroll reveal and skill bars.
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      entry.target.querySelectorAll?.('.skill-fill').forEach(fill => fill.style.width = `${fill.dataset.width || 0}%`);
      if (entry.target.classList.contains('skill-card')) {
        const fill = entry.target.querySelector('.skill-fill');
        if (fill) fill.style.width = `${fill.dataset.width || 0}%`;
      }
      obs.unobserve(entry.target);
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal, .skill-card').forEach(el => observer.observe(el));

  // Highlight the current navigation section.
  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      navLinks?.querySelectorAll('.nav-link').forEach(link => {
        link.classList.toggle('active', link.dataset.section === entry.target.id);
      });
    });
  }, { rootMargin: '-35% 0px -55% 0px' });
  document.querySelectorAll('main section[id]').forEach(section => sectionObserver.observe(section));

  // Netlify Forms work only after publishing to Netlify; avoid a false local submission.
  const form = document.querySelector('.contact-form');
  if (form && location.protocol === 'file:') {
    form.addEventListener('submit', event => {
      event.preventDefault();
      alert('The contact form will work after this website is deployed on Netlify.');
    });
  }
})();