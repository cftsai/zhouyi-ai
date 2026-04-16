// 梅花易数核心模块

// 易经卦象
const TRIGRAMS = {
  0: { name: '坤', symbol: '☷', nature: '地' },
  1: { name: '震', symbol: '☳', nature: '雷' },
  2: { name: '坎', symbol: '☵', nature: '水' },
  3: { name: '兑', symbol: '☱', nature: '泽' },
  4: { name: '艮', symbol: '☶', nature: '山' },
  5: { name: '离', symbol: '☲', nature: '火' },
  6: { name: '巽', symbol: '☴', nature: '风' },
  7: { name: '乾', symbol: '☰', nature: '天' }
};

// 时间起卦算法
function timeDivination() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1; // 月份从0开始，需要+1
  const day = now.getDate();
  const hour = now.getHours();
  const minute = now.getMinutes();
  
  // 计算年数（减去1900）
  const yearNum = year - 1900;
  
  // 计算上卦：(年 + 月 + 日) % 8
  const upperSum = yearNum + month + day;
  const upperTrigram = upperSum % 8 === 0 ? 8 : upperSum % 8;
  
  // 计算下卦：(年 + 月 + 日 + 时) % 8
  const lowerSum = upperSum + hour;
  const lowerTrigram = lowerSum % 8 === 0 ? 8 : lowerSum % 8;
  
  // 计算动爻：(年 + 月 + 日 + 时) % 6
  const movingLine = (upperSum + hour) % 6 === 0 ? 6 : (upperSum + hour) % 6;
  
  return {
    upper: TRIGRAMS[upperTrigram - 1],
    lower: TRIGRAMS[lowerTrigram - 1],
    movingLine,
    time: now
  };
}

// 数字起卦算法
function numberDivination(numbers) {
  if (!numbers || numbers.length === 0) {
    throw new Error('请提供至少一个数字');
  }
  
  // 计算上卦：前半部分数字之和 % 8
  const mid = Math.ceil(numbers.length / 2);
  const upperSum = numbers.slice(0, mid).reduce((sum, num) => sum + num, 0);
  const upperTrigram = ((upperSum % 8) + 8) % 8 === 0 ? 8 : ((upperSum % 8) + 8) % 8;
  
  // 计算下卦：后半部分数字之和 % 8
  const lowerSum = numbers.slice(mid).reduce((sum, num) => sum + num, 0);
  const lowerTrigram = ((lowerSum % 8) + 8) % 8 === 0 ? 8 : ((lowerSum % 8) + 8) % 8;
  
  // 计算动爻：所有数字之和 % 6
  const totalSum = numbers.reduce((sum, num) => sum + num, 0);
  const movingLine = ((totalSum % 6) + 6) % 6 === 0 ? 6 : ((totalSum % 6) + 6) % 6;
  
  return {
    upper: TRIGRAMS[upperTrigram - 1],
    lower: TRIGRAMS[lowerTrigram - 1],
    movingLine,
    numbers
  };
}

// 断卦逻辑
function analyzeHexagram(hexagram) {
  const { upper, lower, movingLine } = hexagram;
  
  // 基本卦象分析
  const analysis = {
    upper: upper,
    lower: lower,
    movingLine,
    meaning: `上卦为${upper.nature}${upper.name}，下卦为${lower.nature}${lower.name}`,
    advice: ''
  };
  
  // 根据卦象组合给出基本建议
  const hexagramKey = `${upper.name}${lower.name}`;
  switch(hexagramKey) {
    case '乾乾':
      analysis.advice = '元亨利贞，吉祥如意，做事顺利。';
      break;
    case '坤坤':
      analysis.advice = '厚德载物，包容万物，宜静不宜动。';
      break;
    case '乾坤':
      analysis.advice = '天地交泰，阴阳和谐，大吉大利。';
      break;
    case '坤乾':
      analysis.advice = '地天泰，诸事亨通，名利双收。';
      break;
    case '震巽':
      analysis.advice = '风雷益，相得益彰，合作共赢。';
      break;
    case '离坎':
      analysis.advice = '水火既济，成功在望，需谨慎行事。';
      break;
    case '坎离':
      analysis.advice = '火水未济，事未完成，需继续努力。';
      break;
    default:
      analysis.advice = '吉凶参半，需谨慎行事，把握时机。';
  }
  
  // 根据动爻位置给出更具体的建议
  switch(movingLine) {
    case 1:
      analysis.advice += '初爻动，事情刚开始，需打好基础。';
      break;
    case 2:
      analysis.advice += '二爻动，事情发展中，需稳步前进。';
      break;
    case 3:
      analysis.advice += '三爻动，事情有变化，需灵活应对。';
      break;
    case 4:
      analysis.advice += '四爻动，事情进入关键期，需谨慎决策。';
      break;
    case 5:
      analysis.advice += '五爻动，事情接近成功，需保持警惕。';
      break;
    case 6:
      analysis.advice += '六爻动，事情已完成或需重新开始，需总结经验。';
      break;
  }
  
  return analysis;
}

// 预测接口
function predict(method, input) {
  let hexagram;
  
  if (method === 'time') {
    hexagram = timeDivination();
  } else if (method === 'number') {
    hexagram = numberDivination(input);
  } else {
    throw new Error('不支持的起卦方法');
  }
  
  const analysis = analyzeHexagram(hexagram);
  
  return {
    ...hexagram,
    ...analysis
  };
}

module.exports = {
  timeDivination,
  numberDivination,
  analyzeHexagram,
  predict,
  TRIGRAMS
};
