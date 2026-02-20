/**
 * nano-storybook rendering engine
 * Groups stories by category, builds sidebar nav, renders story canvases
 */

import { stories } from './stories.js';

function init() {
  const sidebar = document.querySelector('.sb-sidebar');
  const main = document.querySelector('.sb-main');
  const badge = document.querySelector('.sb-badge');

  // Update story count badge
  badge.textContent = `${stories.length} stories`;

  // Group stories by category
  const groups = new Map();
  for (const story of stories) {
    if (!groups.has(story.category)) {
      groups.set(story.category, []);
    }
    groups.get(story.category).push(story);
  }

  // Build sidebar + main content
  for (const [category, items] of groups) {
    // Sidebar category
    const catEl = document.createElement('div');
    catEl.className = 'sb-category';
    catEl.innerHTML = `<div class="sb-category-title">${category}</div>`;

    for (const story of items) {
      const link = document.createElement('a');
      link.className = 'sb-nav-item';
      link.textContent = story.title;
      link.href = `#story-${story.id}`;
      link.dataset.storyId = story.id;
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.getElementById(`story-${story.id}`);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
        // Update active state
        document.querySelectorAll('.sb-nav-item').forEach((el) => el.classList.remove('active'));
        link.classList.add('active');
      });
      catEl.appendChild(link);
    }

    sidebar.appendChild(catEl);

    // Main area stories
    for (const story of items) {
      const section = document.createElement('section');
      section.id = `story-${story.id}`;
      section.className = 'story';
      section.innerHTML = `
        <h2 class="story-title">${story.title}</h2>
        <p class="story-desc">${story.description}</p>
        <div class="story-canvas"></div>
      `;

      const canvas = section.querySelector('.story-canvas');
      story.render(canvas);

      main.appendChild(section);
    }
  }

  // Intersection observer for active sidebar tracking
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          const id = entry.target.id.replace('story-', '');
          document.querySelectorAll('.sb-nav-item').forEach((el) => {
            el.classList.toggle('active', el.dataset.storyId === id);
          });
        }
      }
    },
    { rootMargin: '-20% 0px -70% 0px' }
  );

  document.querySelectorAll('.story').forEach((el) => observer.observe(el));

  // Wire up copy buttons
  document.querySelectorAll('.btn-copy').forEach((btn) => {
    btn.addEventListener('click', () => {
      const text = btn.getAttribute('data-copy-text');
      if (!text) return;
      navigator.clipboard.writeText(text).then(() => {
        btn.textContent = 'Copied!';
        btn.classList.add('copied');
        setTimeout(() => {
          btn.textContent = 'Copy';
          btn.classList.remove('copied');
        }, 1500);
      }).catch(() => {
        // Fallback
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.cssText = 'position:fixed;opacity:0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        btn.textContent = 'Copied!';
        btn.classList.add('copied');
        setTimeout(() => {
          btn.textContent = 'Copy';
          btn.classList.remove('copied');
        }, 1500);
      });
    });
  });
}

document.addEventListener('DOMContentLoaded', init);
