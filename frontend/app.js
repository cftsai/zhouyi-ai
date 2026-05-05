import { initTheme, showNotification, showLoading, hideLoading } from './modules/ui.js';
import { initHistoryPanel, saveRecord } from './modules/history.js';
import { renderZhouyiResult, renderLiuyaoResult } from './modules/divination.js';
import { calculateBaZi, analyzeWuxing, analyzeYinyang, renderBaziResults } from './modules/bazi.js';
import { initChat, updateChatWelcome } from './modules/ai-chat.js';

let activeMethod = 'zhouyi';
window._activeMethod = activeMethod;

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initHistoryPanel();
  initChat();
  initMethodSelector();
  initCalcButton();
  initShareButtons();
  initAutoResizeTextarea();
});

function initMethodSelector() {
  const options = document.querySelectorAll('.method-option');
  const baziFields = document.getElementById('bazi-fields');

  options.forEach(opt => {
    opt.addEventListener('click', () => {
      options.forEach(o => {
        o.classList.remove('active');
        o.setAttribute('aria-checked', 'false');
      });
      opt.classList.add('active');
      opt.setAttribute('aria-checked', 'true');
      activeMethod = opt.dataset.method;
      window._activeMethod = activeMethod;

      if (activeMethod === 'bazi') {
        baziFields.style.display = 'block';
        baziFields.setAttribute('aria-hidden', 'false');
      } else {
        baziFields.style.display = 'none';
        baziFields.setAttribute('aria-hidden', 'true');
      }
    });

    opt.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        opt.click();
      }
    });
  });
}

function initCalcButton() {
  const btn = document.getElementById('calc-btn');
  btn.addEventListener('click', doFortune);
}

function initShareButtons() {
  const textBtn = document.getElementById('share-text-btn');
  const imageBtn = document.getElementById('share-image-btn');

  if (textBtn) {
    textBtn.addEventListener('click', () => {
      const name = document.getElementById('hexagram-name')?.textContent || '';
      const interp = document.getElementById('interpretation')?.textContent || '';
      const advice = document.getElementById('advice')?.textContent || '';
      const text = `【周易算命结果】\n\n卦象：${name}\n\n解读：${interp}\n\n建议：${advice}\n\n—— 来自 周易算命`;
      navigator.clipboard.writeText(text).then(() => {
        showNotification('结果已复制到剪贴板', 'success');
      }).catch(() => {
        showNotification('复制失败，请手动复制', 'error');
      });
    });
  }

  if (imageBtn) {
    imageBtn.addEventListener('click', () => {
      showNotification('图片分享功能开发中，请先使用文本分享', 'warning');
    });
  }
}

function initAutoResizeTextarea() {
  const textarea = document.getElementById('chat-input');
  if (!textarea) return;
  textarea.addEventListener('input', () => {
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
  });
}

function doFortune() {
  const question = document.getElementById('question').value.trim();
  const apiKey = document.getElementById('api-key').value.trim();
  const result = document.getElementById('result');

  result.classList.remove('show');
  document.getElementById('ai-chat-section').style.display = 'none';
  document.getElementById('share-actions').style.display = 'none';

  if (activeMethod === 'bazi') {
    const birthdate = document.getElementById('birthdate').value;
    const birthhour = parseInt(document.getElementById('birthhour').value);

    if (!birthdate) {
      showNotification('请选择出生日期', 'warning');
      document.getElementById('birthdate').focus();
      return;
    }

    const [year, month, day] = birthdate.split('-').map(Number);
    const today = new Date();
    const birthDate = new Date(year, month - 1, day);

    if (birthDate > today) {
      showNotification('出生日期不能是未来日期', 'warning');
      return;
    }

    if (year < 1900) {
      showNotification('请选择1900年之后的日期', 'warning');
      return;
    }

    showLoading('八字排盘中...');

    try {
      const baZi = calculateBaZi(year, month, day, birthhour);
      const wuxing = analyzeWuxing(baZi);
      const yinyang = analyzeYinyang(baZi);
      renderBaziResults(baZi, wuxing, yinyang);

      saveRecord({
        method: 'bazi',
        summary: `日主${baZi.day.stem}${baZi.day.branch}，${wuxing.strongest}旺${wuxing.weakest}弱`
      });

      updateChatWelcome('bazi', question);
      if (apiKey) {
        document.getElementById('ai-chat-section').style.display = 'block';
        document.getElementById('share-actions').style.display = 'flex';
      }
    } catch (error) {
      showNotification(error.message, 'error');
    } finally {
      hideLoading();
    }
    return;
  }

  showLoading('起卦中...');

  setTimeout(() => {
    try {
      let record;
      if (activeMethod === 'zhouyi') {
        record = renderZhouyiResult();
      } else {
        record = renderLiuyaoResult();
      }

      document.getElementById('timestamp').textContent = new Date().toLocaleDateString('zh-CN');
      document.getElementById('confidence').textContent = '85%';
      result.classList.add('show');

      saveRecord({
        method: activeMethod,
        summary: record.name + ' - ' + (record.meaning || '')
      });

      updateChatWelcome(activeMethod, question);
      if (apiKey) {
        document.getElementById('ai-chat-section').style.display = 'block';
        document.getElementById('share-actions').style.display = 'flex';
      }
    } catch (error) {
      showNotification('占卜过程出错：' + error.message, 'error');
    } finally {
      hideLoading();
    }
  }, 800);
}
