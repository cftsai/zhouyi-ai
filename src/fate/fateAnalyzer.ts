import { BaZiInfo, WuXingAnalysis, ShiShenAnalysis, DaYunLiuNianAnalysis, FateAnalysis, ShiShenInfo, DaYun, LiuNian } from '../interfaces';

// 五行对应关系
const wuxingMap: Record<string, string> = {
  '甲': 'wood', '乙': 'wood',
  '丙': 'fire', '丁': 'fire',
  '戊': 'earth', '己': 'earth',
  '庚': 'metal', '辛': 'metal',
  '壬': 'water', '癸': 'water'
};

// 十神计算表
const shiShenTable: Record<string, Record<string, string>> = {
  '甲': {
    '甲': '比肩', '乙': '劫财', '丙': '食神', '丁': '伤官', '戊': '偏财', '己': '正财', '庚': '七杀', '辛': '正官', '壬': '偏印', '癸': '正印'
  },
  '乙': {
    '甲': '劫财', '乙': '比肩', '丙': '伤官', '丁': '食神', '戊': '正财', '己': '偏财', '庚': '正官', '辛': '七杀', '壬': '正印', '癸': '偏印'
  },
  '丙': {
    '甲': '偏印', '乙': '正印', '丙': '比肩', '丁': '劫财', '戊': '食神', '己': '伤官', '庚': '偏财', '辛': '正财', '壬': '七杀', '癸': '正官'
  },
  '丁': {
    '甲': '正印', '乙': '偏印', '丙': '劫财', '丁': '比肩', '戊': '伤官', '己': '食神', '庚': '正财', '辛': '偏财', '壬': '正官', '癸': '七杀'
  },
  '戊': {
    '甲': '七杀', '乙': '正官', '丙': '偏印', '丁': '正印', '戊': '比肩', '己': '劫财', '庚': '食神', '辛': '伤官', '壬': '偏财', '癸': '正财'
  },
  '己': {
    '甲': '正官', '乙': '七杀', '丙': '正印', '丁': '偏印', '戊': '劫财', '己': '比肩', '庚': '伤官', '辛': '食神', '壬': '正财', '癸': '偏财'
  },
  '庚': {
    '甲': '偏财', '乙': '正财', '丙': '七杀', '丁': '正官', '戊': '偏印', '己': '正印', '庚': '比肩', '辛': '劫财', '壬': '食神', '癸': '伤官'
  },
  '辛': {
    '甲': '正财', '乙': '偏财', '丙': '正官', '丁': '七杀', '戊': '正印', '己': '偏印', '庚': '劫财', '辛': '比肩', '壬': '伤官', '癸': '食神'
  },
  '壬': {
    '甲': '食神', '乙': '伤官', '丙': '偏财', '丁': '正财', '戊': '七杀', '己': '正官', '庚': '偏印', '辛': '正印', '壬': '比肩', '癸': '劫财'
  },
  '癸': {
    '甲': '伤官', '乙': '食神', '丙': '正财', '丁': '偏财', '戊': '正官', '己': '七杀', '庚': '正印', '辛': '偏印', '壬': '劫财', '癸': '比肩'
  }
};

// 五行分析
export function analyzeWuXing(baZiInfo: BaZiInfo): WuXingAnalysis {
  const { baZi } = baZiInfo;
  const distribution = {
    wood: 0,
    fire: 0,
    earth: 0,
    metal: 0,
    water: 0
  };

  // 统计五行分布
  const allStems = [
    baZi.year.stem.name,
    baZi.month.stem.name,
    baZi.day.stem.name,
    baZi.hour.stem.name
  ];

  allStems.forEach(stem => {
    const element = wuxingMap[stem];
    if (element) {
      distribution[element as keyof typeof distribution]++;
    }
  });

  // 计算五行强弱
  const strengths: WuXingAnalysis['strengths'] = {};
  Object.keys(distribution).forEach(element => {
    const count = distribution[element as keyof typeof distribution];
    if (count >= 2) {
      strengths[element as keyof WuXingAnalysis['strengths']] = 'strong';
    } else if (count === 1) {
      strengths[element as keyof WuXingAnalysis['strengths']] = 'medium';
    } else {
      strengths[element as keyof WuXingAnalysis['strengths']] = 'weak';
    }
  });

  // 分析五行喜忌
  const dayStem = baZi.day.stem.name;
  const dayElement = wuxingMap[dayStem];
  const preferences: { favorable: string[]; unfavorable: string[] } = {
    favorable: [],
    unfavorable: []
  };

  // 简单的喜忌分析逻辑
  if (dayElement === 'wood') {
    preferences.favorable = ['water', 'wood'];
    preferences.unfavorable = ['metal', 'fire'];
  } else if (dayElement === 'fire') {
    preferences.favorable = ['wood', 'fire'];
    preferences.unfavorable = ['water', 'earth'];
  } else if (dayElement === 'earth') {
    preferences.favorable = ['fire', 'earth'];
    preferences.unfavorable = ['wood', 'metal'];
  } else if (dayElement === 'metal') {
    preferences.favorable = ['earth', 'metal'];
    preferences.unfavorable = ['fire', 'water'];
  } else if (dayElement === 'water') {
    preferences.favorable = ['metal', 'water'];
    preferences.unfavorable = ['earth', 'wood'];
  }

  // 生成分析结果
  const analysis = `五行分布：木${distribution.wood}、火${distribution.fire}、土${distribution.earth}、金${distribution.metal}、水${distribution.water}。`;

  return {
    distribution,
    strengths,
    preferences,
    analysis
  };
}

// 十神分析
export function analyzeShiShen(baZiInfo: BaZiInfo): ShiShenAnalysis {
  const { baZi } = baZiInfo;
  const dayStem = baZi.day.stem.name;
  const shiShenList: ShiShenInfo[] = [];

  // 计算各柱的十神
  const positions = ['year', 'month', 'hour'] as const;
  positions.forEach(position => {
    const stem = baZi[position].stem.name;
    const shiShenType = shiShenTable[dayStem][stem] as any;
    const element = wuxingMap[stem];
    const yinYang = stem === '甲' || stem === '丙' || stem === '戊' || stem === '庚' || stem === '壬' ? '阳' : '阴';

    shiShenList.push({
      type: shiShenType,
      element: element || '',
      yinYang,
      position,
      strength: 'medium' // 简化处理，实际需要更复杂的计算
    });
  });

  // 统计十神分布
  const shiShenCount: Record<string, number> = {};
  shiShenList.forEach(shiShen => {
    shiShenCount[shiShen.type] = (shiShenCount[shiShen.type] || 0) + 1;
  });

  // 找出主导十神
  const dominantShiShen = Object.entries(shiShenCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2)
    .map(([type]) => type as any);

  // 生成分析结果
  const analysis = `十神分布：${shiShenList.map(s => s.type).join('、')}。主导十神：${dominantShiShen.join('、')}。`;

  return {
    shiShenList,
    dominantShiShen,
    analysis
  };
}

// 大运流年分析
export function analyzeDaYunLiuNian(baZiInfo: BaZiInfo): DaYunLiuNianAnalysis {
  const currentYear = new Date().getFullYear();
  const birthYear = baZiInfo.solarDate.year;
  const age = currentYear - birthYear;

  // 生成大运
  const daYunList: DaYun[] = [];
  for (let i = 0; i < 10; i++) {
    const startAge = 10 + i * 10;
    const endAge = startAge + 9;
    const startYear = birthYear + startAge;
    const endYear = birthYear + endAge;
    const years = [];
    for (let year = startYear; year <= endYear; year++) {
      years.push(year);
    }

    daYunList.push({
      startAge,
      endAge,
      years,
      stem: '甲', // 简化处理，实际需要计算
      branch: '子', // 简化处理，实际需要计算
      element: 'wood', // 简化处理，实际需要计算
      luck: i % 3 === 0 ? 'good' : i % 3 === 1 ? 'medium' : 'bad',
      analysis: `大运${startAge}-${endAge}岁：${i % 3 === 0 ? '运势较好' : i % 3 === 1 ? '运势一般' : '运势较差'}`
    });
  }

  // 生成流年
  const liuNianList: LiuNian[] = [];
  for (let year = currentYear; year <= currentYear + 10; year++) {
    liuNianList.push({
      year,
      stem: '甲', // 简化处理，实际需要计算
      branch: '子', // 简化处理，实际需要计算
      element: 'wood', // 简化处理，实际需要计算
      luck: year % 3 === 0 ? 'good' : year % 3 === 1 ? 'medium' : 'bad',
      analysis: `${year}年：${year % 3 === 0 ? '运势较好' : year % 3 === 1 ? '运势一般' : '运势较差'}`
    });
  }

  // 找出当前大运
  const currentDaYun = daYunList.find(daYun => age >= daYun.startAge && age <= daYun.endAge) || null;

  // 找出当前流年
  const currentLiuNian = liuNianList.find(liuNian => liuNian.year === currentYear) || null;

  // 生成分析结果
  const analysis = `当前大运：${currentDaYun ? `${currentDaYun.startAge}-${currentDaYun.endAge}岁` : '未进入大运'}。当前流年：${currentYear}年。`;

  return {
    daYunList,
    liuNianList,
    currentDaYun,
    currentLiuNian,
    analysis
  };
}

// 命理解读
export function analyzeFate(baZiInfo: BaZiInfo): FateAnalysis {
  const wuXingAnalysis = analyzeWuXing(baZiInfo);
  const shiShenAnalysis = analyzeShiShen(baZiInfo);
  const daYunLiuNianAnalysis = analyzeDaYunLiuNian(baZiInfo);

  // 生成总体分析
  const overallAnalysis = `命局分析：${wuXingAnalysis.analysis} ${shiShenAnalysis.analysis} ${daYunLiuNianAnalysis.analysis}`;

  // 生成建议
  const suggestions = [
    '保持良好的心态，积极面对生活',
    '根据五行喜忌调整生活和工作环境',
    '在有利的大运和流年抓住机会',
    '注意不利时期的风险防范'
  ];

  return {
    wuXingAnalysis,
    shiShenAnalysis,
    daYunLiuNianAnalysis,
    overallAnalysis,
    suggestions
  };
}
