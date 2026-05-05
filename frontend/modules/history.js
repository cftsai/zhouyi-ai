const STORAGE_KEY = 'zhouyi-history';
const MAX_ITEMS = 50;

export function getHistory() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveRecord(record) {
  const history = getHistory();
  history.unshift({
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    timestamp: Date.now(),
    ...record
  });
  if (history.length > MAX_ITEMS) history.length = MAX_ITEMS;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  renderHistoryList();
}

export function deleteRecord(id) {
  const history = getHistory().filter(h => h.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  renderHistoryList();
}

export function clearHistory() {
  localStorage.removeItem(STORAGE_KEY);
  renderHistoryList();
}

export function initHistoryPanel() {
  const panel = document.getElementById('history-panel');
  const btn = document.getElementById('history-btn');
  const close = document.getElementById('history-close');

  btn.addEventListener('click', () => {
    panel.classList.add('open');
    renderHistoryList();
  });

  close.addEventListener('click', () => panel.classList.remove('open'));

  document.addEventListener('click', (e) => {
    if (panel.classList.contains('open') && !panel.contains(e.target) && e.target !== btn) {
      panel.classList.remove('open');
    }
  });

  renderHistoryList();
}

function renderHistoryList() {
  const container = document.getElementById('history-list');
  const history = getHistory();

  if (history.length === 0) {
    container.innerHTML = '<div class="history-empty">暂无占卜记录</div>';
    return;
  }

  const methodNames = {
    zhouyi: '周易64卦',
    liuyao: '六爻占卜',
    bazi: '八字测算'
  };

  container.innerHTML = history.map(item => {
    const date = new Date(item.timestamp);
    const timeStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
    return `
      <div class="history-item" data-id="${item.id}">
        <div class="time">${timeStr}</div>
        <div class="method">${methodNames[item.method] || item.method}</div>
        <div class="summary">${escapeHtml(item.summary || '无概要')}</div>
        <div class="actions">
          <button class="history-load" data-id="${item.id}">查看</button>
          <button class="history-delete" data-id="${item.id}">删除</button>
        </div>
      </div>
    `;
  }).join('');

  container.querySelectorAll('.history-delete').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      deleteRecord(btn.dataset.id);
    });
  });

  if (history.length > 0) {
    const clearBtn = document.createElement('button');
    clearBtn.className = 'btn btn-outline';
    clearBtn.style.cssText = 'width: 100%; margin-top: 16px; font-size: 13px;';
    clearBtn.textContent = '清空全部记录';
    clearBtn.addEventListener('click', () => {
      if (confirm('确定要清空所有占卜历史吗？')) clearHistory();
    });
    container.appendChild(clearBtn);
  }
}

function escapeHtml(text) {
  if (typeof text !== 'string') return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
