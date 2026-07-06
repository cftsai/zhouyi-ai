import { showNotification, formatMarkdown, escapeHtml } from './ui.js';

const API_BASE = 'https://api.deepseek.com/v1';
const API_TIMEOUT = 30000;

let currentApiKey = '';
let isChatting = false;

export function initChat() {
  const apiKeyInput = document.getElementById('api-key');
  if (apiKeyInput) {
    currentApiKey = apiKeyInput.value.trim();
    apiKeyInput.addEventListener('input', () => { currentApiKey = apiKeyInput.value.trim(); });
  }

  const sendBtn = document.getElementById('chat-send-btn');
  const chatInput = document.getElementById('chat-input');

  if (sendBtn) sendBtn.addEventListener('click', sendChatMessage);
  if (chatInput) {
    chatInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendChatMessage();
      }
    });
  }

  const deepAnalysisBtn = document.getElementById('ai-deep-analysis-btn');
  if (deepAnalysisBtn) {
    deepAnalysisBtn.addEventListener('click', askAIDeepAnalysis);
  }
}

export function updateChatWelcome(activeMethod, question) {
  const welcome = document.getElementById('chat-welcome');
  if (!welcome) return;

  const methodNames = {
    zhouyi: '周易64卦',
    liuyao: '六爻占卜',
    bazi: '八字测算'
  };

  let text = `您好！我是您的AI命理师。您刚刚通过「${methodNames[activeMethod] || '占卜'}」`;
  if (question) text += `咨询了「${question}」的问题`;
  text += '。我可以为您详细解读结果，或回答其他命理相关的问题。';
  welcome.textContent = text;
}

export async function sendChatMessage() {
  const input = document.getElementById('chat-input');
  const btn = document.getElementById('chat-send-btn');
  const messages = document.getElementById('chat-messages');
  const question = input.value.trim();

  if (!question) {
    showNotification('请输入您的问题', 'warning');
    return;
  }
  if (!currentApiKey) {
    showNotification('请先输入 DeepSeek API Key', 'warning');
    return;
  }
  if (isChatting) return;

  isChatting = true;
  btn.disabled = true;
  input.value = '';

  appendChatMessage('user', question);

  const typingId = appendTypingIndicator();

  try {
    const contextInfo = buildContextInfo();
    const response = await callDeepSeekAPI(question, contextInfo);
    removeTypingIndicator(typingId);
    appendChatMessage('ai', response);
  } catch (error) {
    removeTypingIndicator(typingId);
    appendChatMessage('ai', `抱歉，AI 解读服务暂时不可用。错误信息：${error.message}`);
    showNotification(error.message, 'error');
  } finally {
    isChatting = false;
    btn.disabled = false;
    input.focus();
  }
}

export function askAIDeepAnalysis() {
  const activeMethod = window._activeMethod || 'zhouyi';
  const question = document.getElementById('question').value.trim();
  const deepAnalysisQuestion = activeMethod === 'bazi'
    ? '请详细分析这个八字命盘，包括：1. 日主强弱分析 2. 格局判断 3. 喜用神分析 4. 大运流年建议 5. 事业财运感情健康建议'
    : `请详细解读这个${activeMethod === 'zhouyi' ? '周易卦象' : '六爻卦象'}，包括：1. 卦象整体含义 2. 针对"${question || '当前问题'}"的具体解读 3. 吉凶判断 4. 行动建议 5. 注意事项`;

  const chatSection = document.getElementById('ai-chat-section');
  chatSection.style.display = 'block';
  document.getElementById('chat-input').value = deepAnalysisQuestion;
  document.getElementById('chat-input').focus();
  showNotification('已为您准备好深度分析问题，点击发送即可', 'success');
}

function appendChatMessage(role, content) {
  const messages = document.getElementById('chat-messages');
  const div = document.createElement('div');
  div.className = `chat-message ${role}`;
  div.innerHTML = `
    <div class="chat-avatar" aria-hidden="true">${role === 'ai' ? '易' : '我'}</div>
    <div class="chat-bubble">${formatMarkdown(content)}</div>
  `;
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
}

function appendTypingIndicator() {
  const messages = document.getElementById('chat-messages');
  const id = 'typing-' + Date.now();
  const div = document.createElement('div');
  div.id = id;
  div.className = 'chat-message ai';
  div.innerHTML = `
    <div class="chat-avatar" aria-hidden="true">易</div>
    <div class="chat-bubble">
      <div class="typing-indicator"><span></span><span></span><span></span></div>
    </div>
  `;
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
  return id;
}

function removeTypingIndicator(id) {
  const el = document.getElementById(id);
  if (el) el.remove();
}

function buildContextInfo() {
  const activeMethod = window._activeMethod || 'zhouyi';
  const question = document.getElementById('question').value.trim();
  let context = `用户通过${activeMethod === 'zhouyi' ? '周易64卦' : activeMethod === 'liuyao' ? '六爻占卜' : '八字测算'}进行占卜。`;
  if (question) context += `用户问题：${question}。`;

  if (activeMethod === 'bazi') {
    const birthdate = document.getElementById('birthdate').value;
    const birthhour = document.getElementById('birthhour').value;
    const gender = document.getElementById('gender').value;
    if (birthdate) context += `出生日期：${birthdate} ${birthhour}时，性别：${gender === 'male' ? '男' : '女'}。`;
  }

  const interp = document.getElementById('interpretation')?.textContent;
  if (interp) context += `卦象解读：${interp.slice(0, 200)}...`;

  return context;
}

async function callDeepSeekAPI(question, contextInfo) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

  try {
    const response = await fetch(`${API_BASE}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${currentApiKey}`,
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: '你是一位精通周易、八字、六爻、风水等传统命理学的AI命理师。你的回答应该专业、准确、有深度，同时保持客观理性，不迷信。请用中文回答。'
          },
          {
            role: 'user',
            content: `${contextInfo}\n\n用户问题：${question}\n\n请从传统命理学角度给出专业解读，结合现代心理学和决策科学，提供有建设性的建议。`
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      if (response.status === 401) throw new Error('API Key 无效，请检查您的 DeepSeek API Key');
      if (response.status === 429) throw new Error('请求过于频繁，请稍后再试');
      if (response.status >= 500) throw new Error('DeepSeek 服务器暂时不可用，请稍后再试');
      throw new Error(`API 请求失败：${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('API 返回数据格式异常');
    }

    return data.choices[0].message.content;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') throw new Error('请求超时，请检查网络连接后重试');
    if (error.message.includes('fetch') || error.message.includes('network')) {
      throw new Error('网络连接失败，请检查网络后重试');
    }
    throw error;
  }
}
