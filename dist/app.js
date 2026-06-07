/**
 * ItzEmoji Portfolio — GitHub API Integration & UI
 * Fetches public repositories and renders them as interactive project cards.
 */

const GITHUB_USERNAME = 'ItzEmoji';
const GITHUB_API = `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=pushed&per_page=100&type=owner`;

// Language color map (matches GitHub's language colors)
const LANGUAGE_COLORS = {
  JavaScript: '#f1e05a',
  TypeScript: '#3178c6',
  Python: '#3572A5',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Lua: '#000080',
  Nix: '#7e7eff',
  Shell: '#89e051',
  Astro: '#ff5a03',
  Go: '#00ADD8',
  Rust: '#dea584',
  Java: '#b07219',
  C: '#555555',
  'C++': '#f34b7d',
  'C#': '#178600',
  Ruby: '#701516',
  PHP: '#4F5D95',
  Dart: '#00B4AB',
  Kotlin: '#A97BFF',
  Swift: '#F05138',
  Vue: '#41b883',
  Svelte: '#ff3e00',
  SCSS: '#c6538c',
  Dockerfile: '#384d54',
  HCL: '#844fba',
};

/**
 * Formats a date string into a human-readable relative time.
 */
function timeAgo(dateStr) {
  const now = new Date();
  const date = new Date(dateStr);
  const seconds = Math.floor((now - date) / 1000);

  const intervals = [
    { label: 'year', seconds: 31536000 },
    { label: 'month', seconds: 2592000 },
    { label: 'week', seconds: 604800 },
    { label: 'day', seconds: 86400 },
    { label: 'hour', seconds: 3600 },
    { label: 'minute', seconds: 60 },
  ];

  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds);
    if (count >= 1) {
      return `${count} ${interval.label}${count !== 1 ? 's' : ''} ago`;
    }
  }
  return 'just now';
}

/**
 * Picks an icon for a repository based on its name or language.
 */
function getRepoIcon(repo) {
  const name = repo.name.toLowerCase();
  if (name.includes('website') || name.includes('webseite') || name.includes('portfolio')) return '🌐';
  if (name.includes('dotfile')) return '⚙️';
  if (name.includes('nvim') || name.includes('neovim') || name.includes('vim')) return '📝';
  if (name.includes('game') || name.includes('tetris')) return '🎮';
  if (name.includes('bot') || name.includes('discord')) return '🤖';
  if (name.includes('api') || name.includes('server')) return '🔌';
  if (name.includes('docker') || name.includes('container')) return '🐳';
  if (name.includes('nslookup') || name.includes('dns') || name.includes('network')) return '🔍';
  if (name.includes('unattended') || name.includes('windows') || name.includes('install')) return '💻';
  if (name.includes('test')) return '🧪';
  if (name.includes('r2') || name.includes('cloud') || name.includes('explorer')) return '☁️';

  const lang = repo.language;
  if (lang === 'Python') return '🐍';
  if (lang === 'JavaScript' || lang === 'TypeScript') return '⚡';
  if (lang === 'Lua') return '🌙';
  if (lang === 'Nix') return '❄️';
  if (lang === 'Rust') return '🦀';
  if (lang === 'Go') return '🐹';

  return '📦';
}

/**
 * Creates a project card HTML element from a repo object.
 */
function createProjectCard(repo) {
  const card = document.createElement('a');
  card.href = repo.html_url;
  card.target = '_blank';
  card.rel = 'noopener noreferrer';
  card.className = 'project-card';
  card.id = `project-${repo.name}`;

  const description = repo.description || 'No description provided.';
  const langColor = LANGUAGE_COLORS[repo.language] || '#8b8ba3';

  card.innerHTML = `
    <div class="project-card-header">
      <div class="project-icon">${getRepoIcon(repo)}</div>
      <div class="project-external-link">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="7" y1="17" x2="17" y2="7"/>
          <polyline points="7 7 17 7 17 17"/>
        </svg>
      </div>
    </div>
    <h3>${escapeHtml(repo.name)}</h3>
    <p>${escapeHtml(description)}</p>
    <div class="project-meta">
      ${repo.language ? `
        <span class="project-language">
          <span class="language-dot" style="background: ${langColor}"></span>
          ${escapeHtml(repo.language)}
        </span>
      ` : ''}
      ${repo.stargazers_count > 0 ? `
        <span class="project-stat">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
          </svg>
          ${repo.stargazers_count}
        </span>
      ` : ''}
      ${repo.forks_count > 0 ? `
        <span class="project-stat">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><circle cx="18" cy="6" r="3"/>
            <path d="M18 9v1a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V9"/><path d="M12 12v3"/>
          </svg>
          ${repo.forks_count}
        </span>
      ` : ''}
      <span class="project-stat" title="Last updated">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
        </svg>
        ${timeAgo(repo.pushed_at)}
      </span>
    </div>
  `;

  return card;
}

/**
 * Escape HTML to prevent XSS.
 */
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

/**
 * Show error state in the projects container.
 */
function showError(container, message) {
  container.innerHTML = `
    <div class="error-state">
      <div class="error-icon">😵</div>
      <h3>Oops, something went wrong</h3>
      <p>${message}</p>
      <button class="btn btn-secondary" onclick="fetchAndRenderRepos()">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
        Try Again
      </button>
    </div>
  `;
}

/**
 * Fetch repos from GitHub and render them.
 */
async function fetchAndRenderRepos() {
  const container = document.getElementById('projects-container');

  // Show loading skeleton
  container.innerHTML = `
    <div class="loading-grid" id="loading-skeleton">
      ${Array(6).fill('').map(() => `
        <div class="skeleton-card">
          <div class="skeleton skeleton-icon"></div>
          <div class="skeleton skeleton-title"></div>
          <div class="skeleton skeleton-text"></div>
          <div class="skeleton skeleton-text-short"></div>
          <div class="skeleton skeleton-meta"></div>
        </div>
      `).join('')}
    </div>
  `;

  try {
    const response = await fetch(GITHUB_API, {
      headers: { Accept: 'application/vnd.github.v3+json' },
    });

    if (!response.ok) {
      if (response.status === 403) {
        throw new Error('GitHub API rate limit exceeded. Please try again in a few minutes.');
      }
      throw new Error(`GitHub API returned status ${response.status}`);
    }

    const repos = await response.json();

    // Filter out forks, sort by pushed_at (most recent first)
    const filteredRepos = repos
      .filter((r) => !r.fork && !r.archived)
      .sort((a, b) => new Date(b.pushed_at) - new Date(a.pushed_at));

    if (filteredRepos.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">📭</div>
          <p>No public repositories found.</p>
        </div>
      `;
      return;
    }

    // Build grid
    const grid = document.createElement('div');
    grid.className = 'projects-grid stagger-children';

    filteredRepos.forEach((repo) => {
      grid.appendChild(createProjectCard(repo));
    });

    container.innerHTML = '';
    container.appendChild(grid);

    // Trigger stagger animation
    requestAnimationFrame(() => {
      grid.classList.add('visible');
    });
  } catch (error) {
    console.error('Failed to fetch repos:', error);
    showError(container, error.message || 'Could not load repositories from GitHub.');
  }
}

/* ===== Navigation ===== */
function initNavigation() {
  const nav = document.getElementById('navbar');
  const toggle = document.getElementById('nav-toggle');
  const links = document.getElementById('nav-links');

  // Scroll handler
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        nav.classList.toggle('scrolled', window.scrollY > 40);
        ticking = false;
      });
      ticking = true;
    }
  });

  // Mobile toggle
  toggle.addEventListener('click', () => {
    toggle.classList.toggle('active');
    links.classList.toggle('active');
    document.body.style.overflow = links.classList.contains('active') ? 'hidden' : '';
  });
}

function closeMobileNav() {
  const toggle = document.getElementById('nav-toggle');
  const links = document.getElementById('nav-links');
  toggle.classList.remove('active');
  links.classList.remove('active');
  document.body.style.overflow = '';
}

/* ===== Scroll-to-top button ===== */
function initScrollTop() {
  const btn = document.getElementById('scroll-top');

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 500);
  });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ===== Intersection Observer for scroll animations ===== */
function initScrollAnimations() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll('.animate-in').forEach((el) => observer.observe(el));
}

/* ===== Initialize ===== */
document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initScrollTop();
  initScrollAnimations();
  fetchAndRenderRepos();
});
