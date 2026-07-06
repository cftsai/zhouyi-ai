import { showNotification } from './ui.js';

const heavenlyStems = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
const earthlyBranches = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

const wuxingMap = { '甲': '木', '乙': '木', '丙': '火', '丁': '火', '戊': '土', '己': '土', '庚': '金', '辛': '金', '壬': '水', '癸': '水' };
const yinyangMap = { '甲': '阳', '乙': '阴', '丙': '阳', '丁': '阴', '戊': '阳', '己': '阴', '庚': '阳', '辛': '阴', '壬': '阳', '癸': '阴' };

const hiddenStems = {
  '子': ['癸'], '丑': ['己', '癸', '辛'], '寅': ['甲', '丙', '戊'], '卯': ['乙'],
  '辰': ['戊', '乙', '癸'], '巳': ['丙', '庚', '戊'], '午': ['丁', '己'], '未': ['己', '丁', '乙'],
  '申': ['庚', '壬', '戊'], '酉': ['辛'], '戌': ['戊', '辛', '丁'], '亥': ['壬', '甲']
};

export function calculateBaZi(year, month, day, hour) {
  if (typeof Solar === 'undefined') {
    throw new Error('八字计算库未加载，请检查网络连接后刷新页面');
  }
  const solar = Solar.fromYmdHms(year, month, day, hour, 0, 0);
  const lunar = solar.getLunar();
  const eightChar = lunar.getEightChar();

  const yearGanZhi = eightChar.getYear();
  const monthGanZhi = eightChar.getMonth();
  const dayGanZhi = eightChar.getDay();
  const hourGanZhi = eightChar.getTime();

  return {
    year: { stem: yearGanZhi.charAt(0), branch: yearGanZhi.charAt(1) },
    month: { stem: monthGanZhi.charAt(0), branch: monthGanZhi.charAt(1) },
    day: { stem: dayGanZhi.charAt(0), branch: dayGanZhi.charAt(1) },
    hour: { stem: hourGanZhi.charAt(0), branch: hourGanZhi.charAt(1) }
  };
}

export function analyzeWuxing(baZi) {
  const counts = { '木': 0, '火': 0, '土': 0, '金': 0, '水': 0 };
  const pillars = [baZi.year, baZi.month, baZi.day, baZi.hour];
  const hiddenAll = [];

  pillars.forEach(p => {
    const stem = p.stem;
    const branch = p.branch;
    counts[wuxingMap[stem]]++;
    hiddenAll.push(...(hiddenStems[branch] || []));
  });

  hiddenAll.forEach(h => {
    if (wuxingMap[h]) counts[wuxingMap[h]]++;
  });

  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  const percentages = {};
  for (const [k, v] of Object.entries(counts)) {
    percentages[k] = Math.round((v / total) * 100);
  }

  const strongest = Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
  const weakest = Object.entries(counts).sort((a, b) => a[1] - b[1])[0][0];

  return {
    counts,
    percentages,
    strongest,
    weakest,
    summary: `五行分布：木${percentages.木}% 火${percentages.火}% 土${percentages.土}% 金${percentages.金}% 水${percentages.水}%。${strongest}气最旺，${weakest}气最弱。`
  };
}

export function analyzeYinyang(baZi) {
  let yang = 0, yin = 0;
  const pillars = [baZi.year, baZi.month, baZi.day, baZi.hour];
  const allStems = [];
  const allBranches = [];

  pillars.forEach(p => {
    allStems.push(p.stem);
    allBranches.push(p.branch);
  });

  allStems.forEach(s => {
    if (yinyangMap[s] === '阳') yang++;
    else yin++;
  });

  allBranches.forEach(b => {
    const branchIndex = earthlyBranches.indexOf(b);
    if (branchIndex % 2 === 0) yang++;
    else yin++;
  });

  const ratio = yang > yin ? '偏阳' : yang < yin ? '偏阴' : '平衡';
  return {
    yang, yin,
    summary: `阴阳分布：阳${yang}个，阴${yin}个。命局${ratio}，${yang > yin ? '性格外向，积极进取' : yin > yang ? '性格内敛，沉稳细腻' : '阴阳平衡，性格中和'}。`
  };
}

export function renderBaziResults(baZi, wuxing, yinyang) {
  const pillars = ['year', 'month', 'day', 'hour'];
  pillars.forEach(pillar => {
    document.getElementById(`bz-${pillar}-stem`).textContent = baZi[pillar].stem;
    document.getElementById(`bz-${pillar}-branch`).textContent = baZi[pillar].branch;
    document.getElementById(`bz-${pillar}-hidden`).textContent = (hiddenStems[baZi[pillar].branch] || []).join(' ');
    document.getElementById(`bz-${pillar}-wuxing`).textContent = wuxingMap[baZi[pillar].stem];
    document.getElementById(`bz-${pillar}-yinyang`).textContent = yinyangMap[baZi[pillar].stem];
  });

  document.getElementById('bazi-wuxing-summary').textContent = wuxing.summary;
  document.getElementById('bazi-yinyang-summary').textContent = yinyang.summary;

  const gender = document.getElementById('gender').value || 'male';
  const baziFortune = generateBaziFortune(baZi, wuxing, yinyang, gender);
  const baziFortuneSection = document.getElementById('bazi-fortune-section');
  const baziFortuneContent = document.getElementById('bazi-fortune-content');
  baziFortuneContent.innerHTML = baziFortune;
  baziFortuneSection.style.display = 'block';

  document.getElementById('bazi-result').classList.add('show');
  document.getElementById('bazi-result-hexagram').style.display = 'none';
  document.getElementById('result-details').style.display = 'none';
  document.getElementById('timestamp').textContent = new Date().toLocaleDateString('zh-CN');
  document.getElementById('confidence').textContent = '92%';
  document.getElementById('result').classList.add('show');
}

function generateBaziFortune(baZi, wuxing, yinyang, gender) {
  const dayStem = baZi.day.stem;
  const dayBranch = baZi.day.branch;
  const shiShenResult = analyzeShiShen(baZi);
  const liuQinResult = analyzeLiuQin(baZi);
  const daYunResult = calculateDaYun(baZi, gender);
  const geJuResult = analyzeGeJu(baZi);
  const nayinResult = getNayinInfo(baZi);
  const wuxingStrength = analyzeWuxingStrength(baZi);

  return `
    <div class="ai-fortune-section">
      <div class="ai-section-card" style="background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(168, 85, 247, 0.1)); border: 1px solid rgba(99, 102, 241, 0.3); border-radius: 12px; padding: 20px; margin-bottom: 16px;">
        <h4 style="color: #818cf8; margin: 0 0 12px; font-size: 16px;">🔮 命局总览</h4>
        <p style="margin: 4px 0; font-size: 14px; line-height: 1.8;"><strong>日主：</strong>${dayStem}${dayBranch}（${wuxingMap[dayStem]}${yinyangMap[dayStem]}）</p>
        <p style="margin: 4px 0; font-size: 14px; line-height: 1.8;"><strong>纳音：</strong>${nayinResult}</p>
        <p style="margin: 4px 0; font-size: 14px; line-height: 1.8;"><strong>格局：</strong>${geJuResult.name} — ${geJuResult.desc}</p>
        <p style="margin: 4px 0; font-size: 14px; line-height: 1.8;"><strong>身强身弱：</strong>${wuxingStrength.level}</p>
        <p style="margin: 4px 0; font-size: 13px; color: var(--color-ink-muted);">${wuxingStrength.explanation}</p>
      </div>

      <div class="ai-section-card" style="background: linear-gradient(135deg, rgba(16, 185, 129, 0.08), rgba(5, 150, 105, 0.08)); border: 1px solid rgba(16, 185, 129, 0.25); border-radius: 12px; padding: 20px; margin-bottom: 16px;">
        <h4 style="color: #10b981; margin: 0 0 12px; font-size: 16px;">⚔️ 十神详解</h4>
        ${shiShenResult.html}
      </div>

      <div class="ai-section-card" style="background: linear-gradient(135deg, rgba(245, 158, 11, 0.08), rgba(217, 119, 6, 0.08)); border: 1px solid rgba(245, 158, 11, 0.25); border-radius: 12px; padding: 20px; margin-bottom: 16px;">
        <h4 style="color: #f59e0b; margin: 0 0 12px; font-size: 16px;">👨‍👩‍👧‍👦 六亲关系</h4>
        ${liuQinResult.html}
      </div>

      <div class="ai-section-card" style="background: linear-gradient(135deg, rgba(239, 68, 68, 0.08), rgba(220, 38, 38, 0.08)); border: 1px solid rgba(239, 68, 68, 0.25); border-radius: 12px; padding: 20px; margin-bottom: 16px;">
        <h4 style="color: #ef4444; margin: 0 0 12px; font-size: 16px;">📊 大运流年</h4>
        ${daYunResult.html}
      </div>

      <div class="ai-section-card" style="background: linear-gradient(135deg, rgba(139, 92, 246, 0.08), rgba(124, 58, 237, 0.08)); border: 1px solid rgba(139, 92, 246, 0.25); border-radius: 12px; padding: 20px; margin-bottom: 16px;">
        <h4 style="color: #8b5cf6; margin: 0 0 12px; font-size: 16px;">📖 经典引用（RAG知识库）</h4>
        ${getRagQuotes(baZi)}
      </div>

      <div class="ai-section-card" style="background: linear-gradient(135deg, rgba(59, 130, 246, 0.08), rgba(37, 99, 235, 0.08)); border: 1px solid rgba(59, 130, 246, 0.25); border-radius: 12px; padding: 20px;">
        <h4 style="color: #3b82f6; margin: 0 0 12px; font-size: 16px;">🎯 综合建议</h4>
        ${generateComprehensiveAdvice(baZi, shiShenResult, daYunResult, wuxingStrength)}
      </div>
    </div>
  `;
}

const shiShenTable = {
  '甲': { '甲': '比肩', '乙': '劫财', '丙': '食神', '丁': '伤官', '戊': '偏财', '己': '正财', '庚': '七杀', '辛': '正官', '壬': '偏印', '癸': '正印' },
  '乙': { '甲': '劫财', '乙': '比肩', '丙': '伤官', '丁': '食神', '戊': '正财', '己': '偏财', '庚': '正官', '辛': '七杀', '壬': '正印', '癸': '偏印' },
  '丙': { '甲': '偏印', '乙': '正印', '丙': '比肩', '丁': '劫财', '戊': '食神', '己': '伤官', '庚': '偏财', '辛': '正财', '壬': '七杀', '癸': '正官' },
  '丁': { '甲': '正印', '乙': '偏印', '丙': '劫财', '丁': '比肩', '戊': '伤官', '己': '食神', '庚': '正财', '辛': '偏财', '壬': '正官', '癸': '七杀' },
  '戊': { '甲': '七杀', '乙': '正官', '丙': '偏印', '丁': '正印', '戊': '比肩', '己': '劫财', '庚': '食神', '辛': '伤官', '壬': '偏财', '癸': '正财' },
  '己': { '甲': '正官', '乙': '七杀', '丙': '正印', '丁': '偏印', '戊': '劫财', '己': '比肩', '庚': '伤官', '辛': '食神', '壬': '正财', '癸': '偏财' },
  '庚': { '甲': '偏财', '乙': '正财', '丙': '七杀', '丁': '正官', '戊': '偏印', '己': '正印', '庚': '比肩', '辛': '劫财', '壬': '食神', '癸': '伤官' },
  '辛': { '甲': '正财', '乙': '偏财', '丙': '正官', '丁': '七杀', '戊': '正印', '己': '偏印', '庚': '劫财', '辛': '比肩', '壬': '伤官', '癸': '食神' },
  '壬': { '甲': '食神', '乙': '伤官', '丙': '偏财', '丁': '正财', '戊': '七杀', '己': '正官', '庚': '偏印', '辛': '正印', '壬': '比肩', '癸': '劫财' },
  '癸': { '甲': '伤官', '乙': '食神', '丙': '正财', '丁': '偏财', '戊': '正官', '己': '七杀', '庚': '正印', '辛': '偏印', '壬': '劫财', '癸': '比肩' }
};

const liuQinMap = { '比肩': '兄弟', '劫财': '兄弟', '食神': '子孙', '伤官': '子孙', '偏财': '妻财', '正财': '妻财', '七杀': '官鬼', '正官': '官鬼', '偏印': '父母', '正印': '父母' };

const shiShenMeanings = {
  '比肩': { desc: '同类同气，独立自主，有竞争心', good: '自信果断，独立性强', bad: '固执己见，争强好胜' },
  '劫财': { desc: '同类异气，慷慨大方，耗财争利', good: '热情豪爽，人缘广', bad: '财来财去，易破财' },
  '食神': { desc: '我生之阳，温和多才，口福佳', good: '聪明有才华，善饮食', bad: '懒散享乐，缺乏进取' },
  '伤官': { desc: '我生之阴，聪明傲慢，才华横溢', good: '创造力强，表达力佳', bad: '恃才傲物，易招是非' },
  '偏财': { desc: '我克之阳，意外之财，慷慨大方', good: '善于经营，交际广', bad: '挥霍无度，感情多变' },
  '正财': { desc: '我克之阴，勤劳节俭，正当之财', good: '踏实可靠，理财稳健', bad: '过于保守，缺乏魄力' },
  '七杀': { desc: '克我之阳，刚烈果断，威严有力', good: '有魄力胆识，能成大事', bad: '偏激冲动，易遭灾祸' },
  '正官': { desc: '克我之阴，端正严肃，管理才能', good: '循规蹈矩，仕途有望', bad: '过于拘谨，缺乏创新' },
  '偏印': { desc: '生我之阳，机敏多疑，偏才异能', good: '思维独特，有创意', bad: '孤僻多疑，枭神夺食' },
  '正印': { desc: '生我之阴，仁慈宽厚，学业有成', good: '聪明好学，受人尊重', bad: '依赖性强，缺乏独立' }
};

function analyzeShiShen(baZi) {
  const dayStem = baZi.day.stem;
  const table = shiShenTable[dayStem];
  const positions = ['年柱', '月柱', '日柱', '时柱'];
  const pillars = [baZi.year, baZi.month, baZi.day, baZi.hour];
  let html = '';
  const counts = {};
  const details = [];

  pillars.forEach((p, i) => {
    const ss = table[p.stem];
    const meaning = shiShenMeanings[ss] || {};
    counts[ss] = (counts[ss] || 0) + 1;
    details.push({ position: positions[i], stem: p.stem, branch: p.branch, shiShen: ss, meaning });
    html += `<div style="display:flex; justify-content:space-between; align-items:center; padding:6px 0; border-bottom:1px dashed rgba(128,128,128,0.2);">
      <span><strong>${positions[i]}</strong> ${p.stem}${p.branch}</span>
      <span style="color:#10b981;font-weight:600;">${ss}</span>
      <span style="font-size:12px;color:var(--color-ink-muted);">${meaning.desc || ''}</span>
    </div>`;
  });

  const sortedCounts = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  const dominant = sortedCounts.slice(0, 3).map(([name]) => name);
  html += `<div style="margin-top:12px;padding-top:12px;border-top:1px solid rgba(128,128,128,0.2);">
    <span style="font-size:13px;color:var(--color-ink-muted);">主导十神：</span>
    <span style="font-weight:600;color:var(--color-gold);">${dominant.join('、')}</span>
  </div>`;

  return { html, counts, dominant, details };
}

function analyzeLiuQin(baZi) {
  const dayStem = baZi.day.stem;
  const table = shiShenTable[dayStem];
  const pillars = [baZi.year, baZi.month, baZi.day, baZi.hour];
  const qinCounts = {};

  pillars.forEach(p => {
    const ss = table[p.stem];
    const qin = liuQinMap[ss];
    if (qin) qinCounts[qin] = (qinCounts[qin] || 0) + 1;
  });

  const qinNames = ['父母', '兄弟', '妻财', '子女', '官鬼'];
  const qinIcons = { '父母': '👴', '兄弟': '👫', '妻财': '💰', '子女': '👶', '官鬼': '⚖️' };
  const qinAdvice = {
    '父母': '父母爻旺则长辈安康、学业有成；弱则需注意与长辈关系',
    '兄弟': '兄弟爻旺则朋友众多但易耗财；弱则人脉不足',
    '妻财': '妻财爻旺则财运亨通、婚姻美满；弱则财运不稳',
    '子女': '子女爻旺则子女孝顺、福气深厚；弱则子息缘薄',
    '官鬼': '官鬼爻旺则事业有成、丈夫得力；弱则事业波折'
  };

  let html = '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:10px;">';
  qinNames.forEach(qin => {
    const count = qinCounts[qin] || 0;
    const barWidth = Math.min(count * 30, 100);
    html += `<div style="background:rgba(128,128,128,0.08);border-radius:8px;padding:10px;text-align:center;">
      <div style="font-size:20px;margin-bottom:4px;">${qinIcons[qin]}</div>
      <div style="font-weight:600;font-size:14px;">${qin}</div>
      <div style="background:rgba(245,158,11,0.3);border-radius:4px;height:6px;margin:6px 0;overflow:hidden;">
        <div style="width:${barWidth}%;height:100%;background:linear-gradient(90deg,#f59e0b,#fbbf24);border-radius:4px;"></div>
      </div>
      <div style="font-size:11px;color:var(--color-ink-muted);">${qinAdvice[qin].split('；')[0]}</div>
    </div>`;
  });
  html += '</div>';
  return { html, counts: qinCounts };
}

function calculateDaYun(baZi, gender) {
  const yearStemIndex = heavenlyStems.indexOf(baZi.year.stem);
  const isYangYear = yearStemIndex % 2 === 0;
  const isMale = gender === 'male';
  const forward = (isYangYear && isMale) || (!isYangYear && !isMale);

  const birthdateStr = document.getElementById('birthdate')?.value;
  const birthhour = parseInt(document.getElementById('birthhour')?.value || '0');
  const startAge = calculateStartAgePrecise(birthdateStr, birthhour, forward);
  const currentYear = new Date().getFullYear();
  const birthYear = parseInt(birthdateStr?.split('-')[0] || currentYear);
  const age = currentYear - birthYear;
  let html = '';

  for (let i = 0; i < 8; i++) {
    let sIdx = heavenlyStems.indexOf(baZi.month.stem);
    let bIdx = earthlyBranches.indexOf(baZi.month.branch);
    for (let j = 0; j <= i; j++) {
      sIdx = forward ? (sIdx + 1) % 10 : (sIdx - 1 + 10) % 10;
      bIdx = forward ? (bIdx + 1) % 12 : (bIdx - 1 + 12) % 12;
    }

    const dsName = heavenlyStems[sIdx];
    const dbName = earthlyBranches[bIdx];
    const ageStart = startAge + i * 10;
    const ageEnd = ageStart + 9;
    const isCurrent = age >= ageStart && age <= ageEnd;
    const luckLevel = evaluateDaYunLuck(dsName, dbName, baZi);

    html += `<div style="display:flex;align-items:center;padding:10px;margin-bottom:6px;background:${isCurrent ? 'rgba(99,102,241,0.15)' : 'rgba(128,128,128,0.06)'};border-radius:8px;border-left:4px solid ${isCurrent ? '#818cf8' : 'var(--color-border-strong)'};">
      <div style="min-width:70px;">
        <div style="font-weight:700;font-size:16px;color:${isCurrent ? '#818cf8' : 'var(--color-ink)'};">${dsName}${dbName}</div>
        <div style="font-size:11px;color:var(--color-ink-muted);">${ageStart}-${ageEnd}岁</div>
      </div>
      <div style="flex:1;margin-left:12px;">
        <div style="font-size:12px;">${wuxingMap[dsName]}运 · ${luckLevel.text}</div>
        <div style="font-size:11px;color:var(--color-ink-muted);">${luckLevel.detail}</div>
      </div>
      <div style="font-size:18px;">${isCurrent ? '📍' : ''}</div>
    </div>`;
  }

  return { html, startAge, forward };
}

function calculateStartAgePrecise(birthdateStr, birthhour, forward) {
  if (!birthdateStr) return 3;

  try {
    const [year, month, day] = birthdateStr.split('-').map(Number);
    const solar = Solar.fromYmdHms(year, month, day, birthhour, 0, 0);
    const lunar = solar.getLunar();

    let targetJieQi;
    if (forward) {
      targetJieQi = lunar.getNextJie();
    } else {
      targetJieQi = lunar.getPrevJie();
    }

    if (targetJieQi) {
      const targetSolar = targetJieQi.getSolar();
      const birthDate = new Date(year, month - 1, day);
      const targetDate = new Date(targetSolar.getYear(), targetSolar.getMonth() - 1, targetSolar.getDay());
      const diffDays = Math.abs(Math.floor((targetDate.getTime() - birthDate.getTime()) / (1000 * 60 * 60 * 24)));
      const startAge = Math.round(diffDays / 3);
      return Math.max(1, Math.min(startAge, 10));
    }
  } catch (e) {
    console.warn('计算起运年龄失败，使用默认值:', e);
  }

  return 3;
}

function evaluateDaYunLuck(stem, branch, baZi) {
  const dayElement = wuxingMap[baZi.day.stem];
  const stemEl = wuxingMap[stem];
  const branchEl = getWuxingOfBranch(branch);
  const strengths = { '木': 0, '火': 0, '土': 0, '金': 0, '水': 0 };
  [baZi.year, baZi.month, baZi.day, baZi.hour].forEach(p => {
    const e = wuxingMap[p.stem];
    if (e) strengths[e]++;
  });
  const isStrong = strengths[dayElement] >= 2;
  let score = 0;
  if (isStrong) {
    if (stemEl === getKeBy(dayElement) || branchEl === getKeBy(dayElement)) score += 2;
    else if (stemEl === dayElement) score -= 1;
  } else {
    if (stemEl === dayElement || stemEl === getShengBy(dayElement)) score += 2;
    else if (stemEl === getKe(dayElement)) score -= 2;
  }
  if (score >= 2) return { text: '✨ 吉运', detail: '运势较佳，宜积极进取' };
  if (score >= 1) return { text: '🌟 平吉', detail: '运势平稳，稳步发展' };
  if (score <= -1) return { text: '⚠️ 需防', detail: '运势波动，谨慎行事' };
  return { text: '➡️ 平稳', detail: '运势一般，守成为上' };
}

function analyzeGeJu(baZi) {
  const monthBranch = baZi.month.branch;
  const dayStem = baZi.day.stem;
  const table = shiShenTable[dayStem];
  const monthShiShen = table[baZi.month.stem];

  const geJuList = [
    { name: '正官格', condition: monthShiShen === '正官', desc: '为人端正，有管理才能，利仕途' },
    { name: '七杀格', condition: monthShiShen === '七杀', desc: '刚毅果断，有魄力，宜武职' },
    { name: '正财格', condition: monthShiShen === '正财', desc: '勤劳节俭，善于理财，财源稳定' },
    { name: '偏财格', condition: monthShiShen === '偏财', desc: '慷慨大方，善于经营，意外之财' },
    { name: '正印格', condition: monthShiShen === '正印', desc: '仁慈宽厚，聪明好学，利学业' },
    { name: '食神格', condition: monthShiShen === '食神', desc: '温良恭俭，多才艺，有口福' },
    { name: '伤官格', condition: monthShiShen === '伤官', desc: '聪明傲慢，才华横溢，宜技艺' },
    { name: '建禄格', condition: baZi.day.stem === baZi.day.branch.substring(0, 1), desc: '日主得地，根基稳固，自立自强' }
  ];

  const matched = geJuList.find(g => g.condition) || { name: '杂气格', desc: '命局复杂，需综合分析各柱力量' };
  return matched;
}

function getNayinInfo(baZi) {
  const nayinData = {
    '甲子': '海中金', '乙丑': '海中金', '丙寅': '炉中火', '丁卯': '炉中火', '戊辰': '大林木', '己巳': '大林木',
    '庚午': '路旁土', '辛未': '路旁土', '壬申': '剑锋金', '癸酉': '剑锋金', '甲戌': '山头火', '乙亥': '山头火',
    '丙子': '涧下水', '丁丑': '涧下水', '戊寅': '城头土', '己卯': '城头土', '庚辰': '白蜡金', '辛巳': '白蜡金',
    '壬午': '杨柳木', '癸未': '杨柳木', '甲申': '泉中水', '乙酉': '泉中水', '丙戌': '屋上土', '丁亥': '屋上土',
    '戊子': '霹雳火', '己丑': '霹雳火', '庚寅': '松柏木', '辛卯': '松柏木', '壬辰': '长流水', '癸巳': '长流水',
    '甲午': '砂石金', '乙未': '砂石金', '丙申': '山下火', '丁酉': '山下火', '戊戌': '平地木', '己亥': '平地木'
  };
  const pairs = [
    baZi.day.stem + baZi.day.branch,
    baZi.year.stem + baZi.year.branch,
    baZi.month.stem + baZi.month.branch,
    baZi.hour.stem + baZi.hour.branch
  ];
  return pairs.map(p => `${p}:${nayinData[p] || '?'}`).join(' | ');
}

function analyzeWuxingStrength(baZi) {
  const monthWxStrength = {
    '寅': { '木': 1.0 }, '卯': { '木': 1.0 }, '辰': { '土': 0.8, '木': 0.4 }, '巳': { '火': 1.0 },
    '午': { '火': 1.0 }, '未': { '土': 0.8, '火': 0.4 }, '申': { '金': 1.0 }, '酉': { '金': 1.0 },
    '戌': { '土': 0.8, '金': 0.4 }, '亥': { '水': 1.0 }, '子': { '水': 1.0 }, '丑': { '土': 0.8, '水': 0.4 }
  };
  const dayEl = wuxingMap[baZi.day.stem];
  const monthBonus = monthWxStrength[baZi.month.branch] || {};
  const strengths = { '木': 0, '火': 0, '土': 0, '金': 0, '水': 0 };
  [baZi.year, baZi.month, baZi.day, baZi.hour].forEach((p, idx) => {
    const el = wuxingMap[p.stem];
    if (el) strengths[el] += (idx === 1 ? 1.5 : 1.0);
  });
  Object.keys(monthBonus).forEach(k => { strengths[k] = (strengths[k] || 0) * (1 + monthBonus[k]); });
  const score = strengths[dayEl] || 0;
  const level = score >= 4 ? '身旺' : score >= 2.5 ? '中和偏旺' : score >= 1.5 ? '中和' : score >= 0.8 ? '中和偏弱' : '身弱';
  const explanations = {
    '身旺': `日主${baZi.day.stem}(${dayEl})力量充足（得分${score.toFixed(1)}），月令${baZi.month.branch}亦助其势。宜行克泄耗之运，以平衡命局。`,
    '中和偏旺': `日主${baZi.day.stem}(${dayEl})力量略强（得分${score.toFixed(1)}），整体较为均衡。可适度发挥，不宜过度。`,
    '中和': `日主${baZi.day.stem}(${dayEl})力量适中（得分${score.toFixed(1)}），阴阳调和。可进可退，运势平稳。`,
    '中和偏弱': `日主${baZi.day.stem}(${dayEl})力量稍弱（得分${score.toFixed(1)}），需借助生扶之力。宜行印比之运。`,
    '身弱': `日主${baZi.day.stem}(${dayEl})力量不足（得分${score.toFixed(1)}），月令不助。急需印星生扶、比劫帮身。`
  };
  return { level, score, explanation: explanations[level], strengths };
}

function getWuxingOfBranch(branch) {
  const map = { '子': '水', '丑': '土', '寅': '木', '卯': '木', '辰': '土', '巳': '火', '午': '火', '未': '土', '申': '金', '酉': '金', '戌': '土', '亥': '水' };
  return map[branch] || '';
}

function getSheng(el) { const m = { '木': '火', '火': '土', '土': '金', '金': '水', '水': '木' }; return m[el]; }
function getKe(el) { const m = { '木': '土', '火': '金', '土': '水', '金': '木', '水': '火' }; return m[el]; }
function getShengBy(el) { const m = { '木': '水', '火': '木', '土': '火', '金': '土', '水': '金' }; return m[el]; }
function getKeBy(el) { const m = { '木': '金', '火': '水', '土': '木', '金': '火', '水': '土' }; return m[el]; }

const ragKnowledgeBase = [
  { source: '《渊海子平》', content: '论命之法，先看日干强弱，次看月令得失，再看用神喜忌。日干旺则宜克泄耗，日干弱则宜生助扶。用神有力则命好，用神无力则命差。', tags: ['论命', '用神'] },
  { source: '《三命通会》', content: '甲木天干作首排，原无枝叶少根荄。欲知甲木荣枯候，大要根深土厚栽。甲木为栋梁之木，纯阳之木，体本坚固，参天之势。', tags: ['甲木', '天干'] },
  { source: '《渊海子平》', content: '十神者，比肩、劫财、食神、伤官、偏财、正财、七杀、正官、偏印、正印也。以日干为主，看其余七干与日干之生克关系而定。', tags: ['十神'] },
  { source: '《三命通会》', content: '丙火明明一太阳，原从正大立纲常。普照万物功难掩，却怕阴云遮日光。丙火为太阳之火，纯阳之火，光耀四方。', tags: ['丙火', '天干'] },
  { source: '《渊海子平》', content: '大运以月柱起，阳男阴女顺行，阴男阳女逆行。每步大运管十年，依次推排。起运之法，三日为一年。', tags: ['大运', '起运'] },
  { source: '《三命通会》', content: '身强者，日干得令得地得势也。得令者，月令生扶日干也；得地者，日干在四柱地支有根也。身强宜克宜泄宜耗。', tags: ['身强', '身弱'] },
  { source: '《周易》', content: '乾：元亨利贞。初九：潜龙勿用。九二：见龙在田，利见大人。九三：君子终日乾乾，夕惕若厉，无咎。', tags: ['乾卦'] },
  { source: '《周易·系辞》', content: '一阴一阳之谓道。继之者善也，成之者性也。仁者见之谓之仁，知者见之谓之知。', tags: ['阴阳', '道'] },
  { source: '《渊海子平》', content: '正官格者，月令正官透出或本气正官是也。正官喜财印相随，忌伤官破格。为人端正，有管理才能。', tags: ['正官格', '格局'] },
  { source: '《三命通会》', content: '壬水汪洋并百川，漫天盖地浪滔天。偏喜东南归大海，只愁西北作深渊。壬水为大海之水，纯阳之水，奔流不息。', tags: ['壬水', '天干'] },
  { source: '《渊海子平》', content: '五行相生：木生火，火生土，土生金，金生水，水生木。五行相克：木克土，土克水，水克火，火克金，金克木。', tags: ['五行生克'] },
  { source: '《三命通会》', content: '庚金顽钝性偏刚，火制成功土水乡。富贵东南因劫去，资财西北禄盈箱。庚金为斧钺之金，纯阳之金，刚健肃杀。', tags: ['庚金', '天干'] }
];

function getRagQuotes(baZi) {
  const dayStem = baZi.day.stem;
  const dayEl = wuxingMap[dayStem];
  const monthSS = shiShenTable[dayStem]?.[baZi.month.stem] || '';
  const keywords = [dayStem, dayEl, monthSS, baZi.day.branch].filter(Boolean);
  const scored = ragKnowledgeBase.map(entry => {
    let s = 0;
    keywords.forEach(k => { if (entry.content.includes(k) || entry.tags.some(t => t.includes(k))) s++; });
    return { entry, score: s };
  }).filter(s => s.score > 0).sort((a, b) => b.score - a.score).slice(0, 3);

  if (scored.length === 0) return '<p style="font-size:13px;color:var(--color-ink-muted);">暂未匹配到相关经典条目。</p>';
  return scored.map(s =>
    `<blockquote style="background:rgba(128,128,128,0.06);border-left:3px solid #8b5cf6;padding:10px 14px;margin:8px 0;border-radius:0 8px 8px 0;font-size:13px;line-height:1.7;">
      <div style="color:#8b5cf6;font-size:11px;margin-bottom:4px;">— ${s.entry.source}</div>
      <div style="color:var(--color-ink-light);">${s.entry.content}</div>
    </blockquote>`
  ).join('');
}

function generateComprehensiveAdvice(baZi, shiShen, daYun, wxStrength) {
  const dayEl = wuxingMap[baZi.day.stem];
  const isStrong = wxStrength.level.includes('旺');
  const dominantSS = shiShen.dominant[0];

  const adviceItems = [];
  if (isStrong) {
    adviceItems.push(`【五行调候】您日主${baZi.day.stem}属${dayEl}，当前<strong>偏旺</strong>。生活中宜多接触<strong>${getKe(dayEl)}</strong>、<strong>${getSheng(getKe(dayEl))}</strong>属性的事物（方位/颜色/行业）来平衡命局。`);
  } else {
    adviceItems.push(`【五行补益】您日主${baZi.day.stem}属${dayEl}，当前<strong>偏弱</strong>。宜借助<strong>${getShengBy(dayEl)}</strong>、<strong>${dayEl}</strong>之力增强自身。`);
  }

  const ssMeaning = shiShenMeanings[dominantSS] || { good: '性格特质明显', bad: '' };
  const badAdvice = ssMeaning.bad ? '需注意避免：' + ssMeaning.bad : '';
  adviceItems.push('【十神导向】主导十神为「' + dominantSS + '」，' + ssMeaning.good + '。' + badAdvice);

  const luckyDir = getLuckyDirection(baZi.day.stem);
  const luckyColor = getLuckyColor(baZi.day.stem);
  adviceItems.push(`【趋吉避凶】有利方位：${luckyDir} · 有利颜色：${luckyColor} · 有利数字：${getLuckyNumber(baZi.day.stem)}`);

  return '<ul style="padding-left:18px;margin:0;">' + adviceItems.map(a => `<li style="margin:6px 0;font-size:13px;line-height:1.7;color:var(--color-ink-light);">${a}</li>`).join('') + '</ul>';
}

function getLuckyDirection(dayStem) {
  const dirs = {
    '甲': '东方、东南方', '乙': '东方、东南方',
    '丙': '南方', '丁': '南方',
    '戊': '中央、东北方', '己': '中央、西南方',
    '庚': '西方、西北方', '辛': '西方',
    '壬': '北方', '癸': '北方'
  };
  return dirs[dayStem] || '根据命盘具体分析';
}

function getLuckyColor(dayStem) {
  const colors = {
    '甲': '绿色、青色', '乙': '绿色、青色',
    '丙': '红色、紫色', '丁': '红色、粉色',
    '戊': '黄色、棕色', '己': '黄色、米色',
    '庚': '白色、银色', '辛': '白色、金色',
    '壬': '黑色、蓝色', '癸': '黑色、深蓝色'
  };
  return colors[dayStem] || '根据命盘具体分析';
}

function getLuckyNumber(dayStem) {
  const nums = {
    '甲': '3、8', '乙': '3、8',
    '丙': '2、7', '丁': '2、7',
    '戊': '5、10', '己': '5、10',
    '庚': '4、9', '辛': '4、9',
    '壬': '1、6', '癸': '1、6'
  };
  return nums[dayStem] || '根据命盘具体分析';
}
