const revealNodes = document.querySelectorAll('.reveal');

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.18,
    rootMargin: '0px 0px -40px 0px',
  }
);

revealNodes.forEach((node, index) => {
  node.style.transitionDelay = `${Math.min(index * 80, 260)}ms`;
  observer.observe(node);
});

const yearNode = document.getElementById('year');
if (yearNode) {
  yearNode.textContent = new Date().getFullYear();
}

const tabPanels = document.querySelectorAll('.tab-panel');
const navTabLinks = document.querySelectorAll('.nav-links a[href^="#"], .brand[href^="#"]');
const allTabLinks = document.querySelectorAll('a[href^="#"]');
const copyEmailButton = document.querySelector('.contact-item-copy');
let activeTabId = 'about';
let tabSwitchTimeout;
let tabEnterCleanupTimeout;

function showTab(tabId) {
  if (!tabId || tabId === activeTabId) {
    return;
  }

  const nextPanel = document.getElementById(tabId);
  const currentPanel = document.getElementById(activeTabId);

  if (!nextPanel) {
    return;
  }

  clearTimeout(tabSwitchTimeout);
  clearTimeout(tabEnterCleanupTimeout);

  tabPanels.forEach((panel) => {
    panel.classList.remove('is-entering');
  });

  navTabLinks.forEach((link) => {
    link.classList.toggle('active', link.getAttribute('href') === `#${tabId}`);
  });

  if (!currentPanel) {
    nextPanel.classList.add('is-active', 'visible', 'is-entering');
    tabEnterCleanupTimeout = setTimeout(() => {
      nextPanel.classList.remove('is-entering');
    }, 320);
    activeTabId = tabId;
    return;
  }

  currentPanel.classList.remove('is-entering');
  currentPanel.classList.add('is-leaving');

  tabSwitchTimeout = setTimeout(() => {
    currentPanel.classList.remove('is-active', 'is-leaving');
    nextPanel.classList.add('is-active', 'visible', 'is-entering');

    tabEnterCleanupTimeout = setTimeout(() => {
      nextPanel.classList.remove('is-entering');
    }, 320);
  }, 170);

  activeTabId = tabId;
}

if (tabPanels.length && navTabLinks.length) {
  allTabLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      const href = link.getAttribute('href');
      const tabId = href ? href.slice(1) : '';
      const targetPanel = tabId ? document.getElementById(tabId) : null;

      if (!targetPanel) {
        return;
      }

      event.preventDefault();
      showTab(tabId);
    });
  });

  const aboutPanel = document.getElementById('about');
  if (aboutPanel) {
    aboutPanel.classList.add('is-active', 'visible');
  }

  navTabLinks.forEach((link) => {
    link.classList.toggle('active', link.getAttribute('href') === '#about');
  });
}

if (copyEmailButton) {
  const emailUser = copyEmailButton.dataset.emailUser || '';
  const emailDomain = copyEmailButton.dataset.emailDomain || '';
  const email = emailUser && emailDomain ? `${emailUser}@${emailDomain}` : '';
  const emailLabel = copyEmailButton.querySelector('.contact-item-label');

  if (email && emailLabel) {
    emailLabel.textContent = `\u2014 ${email}`;
  }

  copyEmailButton.addEventListener('click', async () => {
    if (!email) {
      return;
    }

    try {
      await navigator.clipboard.writeText(email);
      const originalLabel = emailLabel ? emailLabel.textContent : '';
      if (emailLabel) {
        emailLabel.textContent = '\u2014 copied email';
        setTimeout(() => {
          emailLabel.textContent = originalLabel;
        }, 1200);
      }
    } catch {
      if (emailLabel) {
        emailLabel.textContent = `\u2014 ${email}`;
      }
    }
  });
}
