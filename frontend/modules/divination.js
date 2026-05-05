import { showNotification, escapeHtml } from './ui.js';

export function renderHexagramSVG(lines, changingLines = [], size = 200) {
  const lineHeight = 8;
  const lineGap = 14;
  const lineWidth = 140;
  const breakGap = 20;
  const totalHeight = lines.length * (lineHeight + lineGap) - lineGap;
  const startY = (size - totalHeight) / 2;
  const startX = (size - lineWidth) / 2;

  let svg = `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg" class="hexagram-svg">`;

  lines.forEach((isYang, index) => {
    const y = startY + index * (lineHeight + lineGap);
    const isChanging = changingLines.includes(index + 1);
    const color = isChanging ? 'var(--color-cinnabar)' : 'var(--color-ink)';
    const opacity = isChanging ? '1' : '0.85';

    if (isYang) {
      svg += `<rect x="${startX}" y="${y}" width="${lineWidth}" height="${lineHeight}" rx="2" fill="${color}" opacity="${opacity}">`;
      if (isChanging) {
        svg += `<animate attributeName="opacity" values="1;0.5;1" dur="1.5s" repeatCount="indefinite"/>`;
      }
      svg += `</rect>`;
    } else {
      const halfWidth = (lineWidth - breakGap) / 2;
      svg += `<rect x="${startX}" y="${y}" width="${halfWidth}" height="${lineHeight}" rx="2" fill="${color}" opacity="${opacity}">`;
      if (isChanging) {
        svg += `<animate attributeName="opacity" values="1;0.5;1" dur="1.5s" repeatCount="indefinite"/>`;
      }
      svg += `</rect>`;
      svg += `<rect x="${startX + halfWidth + breakGap}" y="${y}" width="${halfWidth}" height="${lineHeight}" rx="2" fill="${color}" opacity="${opacity}">`;
      if (isChanging) {
        svg += `<animate attributeName="opacity" values="1;0.5;1" dur="1.5s" repeatCount="indefinite"/>`;
      }
      svg += `</rect>`;
    }
  });

  svg += '</svg>';
  return svg;
}

export function renderZhouyiResult() {
  const result = window.HEXAGRAMS_FULL[Math.floor(Math.random() * window.HEXAGRAMS_FULL.length)];
  const lines = result.symbols.split(' ');
  const upperTrigram = window.trigramSymbols.indexOf(lines[0]);
  const lowerTrigram = window.trigramSymbols.indexOf(lines[1]);

  const lineArray = [];
  for (let i = 0; i < 3; i++) lineArray.push((upperTrigram >> (2 - i)) & 1);
  for (let i = 0; i < 3; i++) lineArray.push((lowerTrigram >> (2 - i)) & 1);

  const svg = renderHexagramSVG(lineArray.map(l => l === 1));

  document.getElementById('hexagram-svg').innerHTML = svg;
  document.getElementById('hexagram-name').textContent = result.name;
  document.getElementById('hexagram-meaning').textContent = result.meaning;

  const userQuestion = document.getElementById('question').value.trim();
  const detailedInterp = result.desc;
  const interpretationText = userQuestion
    ? `【针对"${userQuestion}"的解读】\n\n${detailedInterp}\n\n就您提出的问题而言，此卦象提示：${getQuestionSpecificAdvice(result.name, userQuestion)}`
    : `此卦象显示：${detailedInterp}`;
  document.getElementById('interpretation').textContent = interpretationText;
  document.getElementById('advice').textContent = result.advice || getAdvice(result.name);
  document.getElementById('bazi-result').classList.remove('show');
  document.getElementById('bazi-result-hexagram').style.display = 'block';
  document.getElementById('result-details').style.display = 'grid';

  return { method: 'zhouyi', name: result.name, meaning: result.meaning, interpretation: interpretationText };
}

export function renderLiuyaoResult() {
  const castResult = window.castHexagram();
  const hex = castResult.hexagram;

  const lineArray = castResult.lines.map(l => l.isYang);
  const svg = renderHexagramSVG(lineArray, castResult.changingLines);

  document.getElementById('hexagram-svg').innerHTML = svg;
  document.getElementById('hexagram-name').textContent = hex.name + `（第${HEXAGRAMS_FULL.indexOf(hex) + 1}卦）`;
  document.getElementById('hexagram-meaning').textContent = hex.meaning;

  let interpretationText = `【本卦】${hex.name}\n${hex.desc}\n\n`;
  if (castResult.changingLines.length > 0 && castResult.transformedHexagram) {
    interpretationText += `【动爻】第${castResult.changingLines.join('、')}爻动\n`;
    interpretationText += `【变卦】${castResult.transformedHexagram.name}\n${castResult.transformedHexagram.desc}\n\n`;
    interpretationText += `综合解读：本卦${hex.name}，变卦为${castResult.transformedHexagram.name}。此象显示事物正在转变中，应顺应变化，把握时机。`;
  } else {
    interpretationText += `【六爻稳定】无动爻，卦象稳固。\n\n综合解读：${hex.desc}`;
  }

  document.getElementById('interpretation').textContent = interpretationText;
  document.getElementById('advice').textContent = hex.advice;
  document.getElementById('bazi-result').classList.remove('show');
  document.getElementById('bazi-result-hexagram').style.display = 'block';
  document.getElementById('result-details').style.display = 'grid';

  return { method: 'liuyao', name: hex.name, changingLines: castResult.changingLines, interpretation: interpretationText };
}

function getAdvice(hexagramName) {
  const advices = {
    '乾为天': '宜积极进取，把握机遇，但需注意刚过易折',
    '坤为地': '宜厚德载物，包容含蓄，稳步推进事业',
    '天泽履': '宜谨慎行事，量力而行，见险而止',
    '地天泰': '宜把握时机，乘势而上，注意阴阳平衡',
    '天火同人': '宜广结善缘，协调关系，合伙创业有利',
    '火天大有': '宜谦逊待人，广纳财富，声名远扬',
    '山天大畜': '宜蓄势待发，学习提升，储备知识和能力',
    '天山遁': '宜暂时退守，养精蓄锐，等待更好时机',
  };
  return advices[hexagramName] || '运势平稳，顺其自然';
}

function getQuestionSpecificAdvice(hexagramName, question) {
  const q = question.toLowerCase();

  const careerKeywords = ['事业', '工作', '职业', '升职', '跳槽', '创业', '办公', '职位', '求职', '面试'];
  const wealthKeywords = ['财运', '财富', '金钱', '投资', '理财', '赚钱', '破财', '收入', '生意', '经商'];
  const loveKeywords = ['感情', '婚姻', '恋爱', '桃花', '分手', '复合', '相亲', '对象', '结婚', '离婚', '爱情'];
  const healthKeywords = ['健康', '身体', '疾病', '养生', '手术', '体检', '平安'];
  const familyKeywords = ['家庭', '父母', '子女', '孩子', '婆媳', '亲戚'];
  const studyKeywords = ['学习', '考试', '升学', '考研', '学业', '成绩', '留学'];

  let category = '综合';
  if (careerKeywords.some(k => q.includes(k))) category = '事业';
  else if (wealthKeywords.some(k => q.includes(k))) category = '财运';
  else if (loveKeywords.some(k => q.includes(k))) category = '感情';
  else if (healthKeywords.some(k => q.includes(k))) category = '健康';
  else if (familyKeywords.some(k => q.includes(k))) category = '家庭';
  else if (studyKeywords.some(k => q.includes(k))) category = '学业';

  const advices = {
    '乾为天': {
      '事业': '当前事业运势极佳，适合主动出击争取机会。但要注意与同事保持良好关系，不可独断专行。',
      '财运': '正财运旺盛，可通过努力工作获得可观收入。偏财也可适度参与，但切勿贪心。',
      '感情': '个人魅力十足，易吸引异性。已有伴侣者应多关心对方，避免大男子主义/强势态度。',
      '健康': '精力充沛，适合开始健身计划。注意不要过度劳累，保证充足睡眠。',
      '家庭': '在家中宜以和为贵，不宜将工作压力带回家。多陪伴家人，增进感情。',
      '学业': '学习状态极佳，适合挑战高难度目标。保持专注，可取得突破性进步。',
      '综合': '整体运势旺盛，各方面都在向好发展。关键是保持积极向上的态度，同时注意人际关系。',
    },
    '坤为地': {
      '事业': '事业宜稳不宜急，当前适合默默积累实力和经验。不宜锋芒毕露，低调行事最佳。',
      '财运': '财运平稳，不宜进行高风险投资。稳健理财，积少成多。',
      '感情': '感情以包容和理解为主，多站在对方角度思考。温柔以待，感情自会升温。',
      '健康': '注意脾胃消化系统，饮食要有规律。适当运动但不要剧烈。',
      '家庭': '家庭和睦的关键在于包容和付出。多做家务，关心长辈，家庭氛围会更和谐。',
      '学业': '学习需要耐心和毅力，不急不躁，循序渐进必有收获。',
      '综合': '整体运势以稳为主，当前最重要的是打好基础，培养实力，等待时机。',
    },
    '地天泰': {
      '事业': '事业正值上升期，阴阳和合利于合作。可以主动寻求合作伙伴或团队项目。',
      '财运': '财运亨通，是投资的好时机。但仍需理性分析，不可盲目跟风。',
      '感情': '感情运势大好，单身者有望遇到心仪对象。已有伴侣者关系会更加融洽。',
      '健康': '身体状况良好，气血调和。保持良好的生活习惯即可。',
      '家庭': '家庭和睦，适合全家一起出行或聚会。亲子关系也会更加亲密。',
      '学业': '学习效率提高，思维活跃。适合参加讨论式学习或团队项目。',
      '综合': '万事通达的好时期，可以大胆推进各项计划。但也要居安思危，为可能的变化做准备。',
    },
    '天泽履': {
      '事业': '事业上要认清自己的位置，不可越级行事。做好本职工作，积累经验最重要。',
      '财运': '财运一般，不宜大额投资。量入为出，避免超出能力的消费。',
      '感情': '感情中要注意平等沟通，不可居高临下。尊重对方的想法和感受。',
      '健康': '注意足部和关节保护，运动前做好热身。',
      '家庭': '家庭中要尊重长辈意见，但也要有自己的判断。和谐相处需要双方共同努力。',
      '学业': '学习要脚踏实地，打好基础再追求更高目标。不可好高骛远。',
      '综合': '当前最重要的是量力而行，步步为营。虽然进展可能不快，但稳健前行是最好的策略。',
    },
  };

  const hexAdvice = advices[hexagramName];
  if (hexAdvice && hexAdvice[category]) {
    return hexAdvice[category];
  }

  const generalAdvices = {
    '事业': '事业方面需要结合当前卦象的启示，审时度势，做出最合适的选择。',
    '财运': '财运走势与个人决策密切相关，建议谨慎理财，不贪不急。',
    '感情': '感情生活需要用心经营，真诚沟通是维系关系的关键。',
    '健康': '健康是根本，建议规律作息，适度运动，保持心情愉悦。',
    '家庭': '家庭和睦需要每个成员的付出，多沟通、多理解、多包容。',
    '学业': '学业进步需要恒心和专注，找到适合自己的学习方法很重要。',
    '综合': '整体而言，顺应卦象的指引，保持积极心态，自然能够趋吉避凶。',
  };

  return generalAdvices[category] || generalAdvices['综合'];
}
