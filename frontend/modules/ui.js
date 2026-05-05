export function initTheme() {
  const saved = localStorage.getItem('zhouyi-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = saved || (prefersDark ? 'dark' : 'light');
  setTheme(theme);

  document.getElementById('theme-toggle').addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    setTheme(current === 'dark' ? 'light' : 'dark');
  });
}

function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('zhouyi-theme', theme);
  const icon = document.getElementById('theme-icon');
  if (icon) icon.textContent = theme === 'dark' ? '\u263E' : '\u2600';
}

export function showNotification(message, type = 'warning', duration = 3000) {
  const existing = document.querySelector('.notification');
  if (existing) existing.remove();

  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.textContent = message;
  notification.setAttribute('role', 'alert');
  notification.setAttribute('aria-live', 'polite');

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease forwards';
    setTimeout(() => notification.remove(), 300);
  }, duration);
}

export function showLoading(text = '推演中...') {
  const overlay = document.getElementById('loading-overlay');
  const label = overlay.querySelector('.loading-text');
  if (label) label.textContent = text;
  overlay.classList.add('active');
}

export function hideLoading() {
  document.getElementById('loading-overlay').classList.remove('active');
}

export function escapeHtml(text) {
  if (typeof text !== 'string') return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

const ALLOWED_TAGS = new Set(['strong', 'em', 'code', 'br', 'ul', 'ol', 'li', 'blockquote', 'p']);

export function formatMarkdown(text) {
  if (typeof text !== 'string') return '';
  const safe = escapeHtml(text);
  return safe
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code>$1</code>')
    .replace(/\n/g, '<br>');
}

export function sanitizeHtml(html) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const walker = document.createTreeWalker(doc.body, NodeFilter.SHOW_ELEMENT);
  const toRemove = [];
  let node;
  while ((node = walker.nextNode())) {
    const tag = node.tagName.toLowerCase();
    if (!ALLOWED_TAGS.has(tag)) {
      toRemove.push(node);
    } else {
      for (const attr of Array.from(node.attributes)) {
        if (attr.name.startsWith('on')) node.removeAttribute(attr.name);
      }
    }
  }
  toRemove.forEach(n => n.remove());
  return doc.body.innerHTML;
}
