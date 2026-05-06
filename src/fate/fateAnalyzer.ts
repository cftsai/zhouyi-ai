import { BaZiInfo, WuXingAnalysis, ShiShenAnalysis, DaYunLiuNianAnalysis, FateAnalysis, ShiShenInfo, DaYun, LiuNian } from '../interfaces';
import { heavenlyStems, earthlyBranches, getWuxingOfStem, getWuxingOfBranch, getYinyangOfStem } from '../bazi/stemsAndBranches';
import { Solar } from 'lunar-javascript';

const wuxingMap: Record<string, string> = {
  '甲': '木', '乙': '木', '丙': '火', '丁': '火', '戊': '土',
  '己': '土', '庚': '金', '辛': '金', '壬': '水', '癸': '水'
};

const shiShenTable: Record<string, Record<string, string>> = {
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

const liuQinMap: Record<string, string> = {
  '比肩': '兄弟', '劫财': '兄弟',
  '食神': '子孙', '伤官': '子孙',
  '偏财': '妻财', '正财': '妻财',
  '七杀': '官鬼', '正官': '官鬼',
  '偏印': '父母', '正印': '父母'
};

const wuxingSheng: Record<string, string> = {
  '木': '火', '火': '土', '土': '金', '金': '水', '水': '木'
};

const wuxingKe: Record<string, string> = {
  '木': '土', '火': '金', '土': '水', '金': '木', '水': '火'
};

const wuxingShengBy: Record<string, string> = {
  '木': '水', '火': '木', '土': '火', '金': '土', '水': '金'
};

const wuxingKeBy: Record<string, string> = {
  '木': '金', '火': '水', '土': '木', '金': '火', '水': '土'
};

const monthOrder = ['寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥', '子', '丑'];
const monthWuxingStrength: Record<string, Record<string, number>> = {
  '寅': { '木': 1.0, '火': 0.3, '土': 0.1, '金': 0.1, '水': 0.3 },
  '卯': { '木': 1.0, '火': 0.3, '土': 0.1, '金': 0.1, '水': 0.2 },
  '辰': { '木': 0.4, '火': 0.2, '土': 0.8, '金': 0.2, '水': 0.2 },
  '巳': { '木': 0.2, '火': 1.0, '土': 0.3, '金': 0.1, '水': 0.1 },
  '午': { '木': 0.2, '火': 1.0, '土': 0.3, '金': 0.1, '水': 0.1 },
  '未': { '木': 0.2, '火': 0.4, '土': 0.8, '金': 0.2, '水': 0.1 },
  '申': { '木': 0.1, '火': 0.1, '土': 0.2, '金': 1.0, '水': 0.3 },
  '酉': { '木': 0.1, '火': 0.1, '土': 0.2, '金': 1.0, '水': 0.3 },
  '戌': { '木': 0.1, '火': 0.2, '土': 0.8, '金': 0.4, '水': 0.1 },
  '亥': { '木': 0.3, '火': 0.1, '土': 0.1, '金': 0.2, '水': 1.0 },
  '子': { '木': 0.3, '火': 0.1, '土': 0.1, '金': 0.1, '水': 1.0 },
  '丑': { '木': 0.1, '火': 0.1, '土': 0.8, '金': 0.3, '水': 0.4 }
};

const zhiCangGan: Record<string, string[]> = {
  '子': ['癸'], '丑': ['己', '癸', '辛'], '寅': ['甲', '丙', '戊'],
  '卯': ['乙'], '辰': ['戊', '乙', '癸'], '巳': ['丙', '庚', '戊'],
  '午': ['丁', '己'], '未': ['己', '丁', '乙'], '申': ['庚', '壬', '戊'],
  '酉': ['辛'], '戌': ['戊', '辛', '丁'], '亥': ['壬', '甲']
};

function calculateWuxingStrength(baZiInfo: BaZiInfo): Record<string, number> {
  const { baZi } = baZiInfo;
  const monthBranch = baZi.month.branch.name;
  const monthStrength = monthWuxingStrength[monthBranch] || {};

  const strength: Record<string, number> = { '木': 0, '火': 0, '土': 0, '金': 0, '水': 0 };

  const allStemsAndBranches = [
    { name: baZi.year.stem.name, type: 'stem' as const },
    { name: baZi.year.branch.name, type: 'branch' as const },
    { name: baZi.month.stem.name, type: 'stem' as const },
    { name: baZi.month.branch.name, type: 'branch' as const },
    { name: baZi.day.stem.name, type: 'stem' as const },
    { name: baZi.day.branch.name, type: 'branch' as const },
    { name: baZi.hour.stem.name, type: 'stem' as const },
    { name: baZi.hour.branch.name, type: 'branch' as const }
  ];

  const hiddenStemWeights = [1.0, 0.5, 0.3];

  allStemsAndBranches.forEach(item => {
    if (item.type === 'stem') {
      const wx = wuxingMap[item.name] || '';
      if (wx) {
        const weight = (item.name === baZi.month.stem.name) ? 1.5 : 1.0;
        strength[wx] = (strength[wx] || 0) + weight;
      }
    } else {
      const hiddenStems = zhiCangGan[item.name] || [];
      const monthMultiplier = (item.name === baZi.month.branch.name) ? 1.5 : 1.0;
      hiddenStems.forEach((stem, idx) => {
        const wx = wuxingMap[stem];
        if (wx) {
          const weight = (hiddenStemWeights[idx] || 0) * monthMultiplier;
          strength[wx] = (strength[wx] || 0) + weight;
        }
      });
    }
  });

  Object.keys(strength).forEach(wx => {
    const monthBonus = monthStrength[wx] || 0;
    strength[wx] = strength[wx] * (1 + monthBonus);
  });

  return strength;
}

export function analyzeWuXing(baZiInfo: BaZiInfo): WuXingAnalysis {
  const { baZi } = baZiInfo;
  const distribution = { wood: 0, fire: 0, earth: 0, metal: 0, water: 0 };
  const wxToEn: Record<string, string> = { '木': 'wood', '火': 'fire', '土': 'earth', '金': 'metal', '水': 'water' };

  const allStems = [
    baZi.year.stem.name, baZi.month.stem.name,
    baZi.day.stem.name, baZi.hour.stem.name
  ];
  const allBranches = [
    baZi.year.branch.name, baZi.month.branch.name,
    baZi.day.branch.name, baZi.hour.branch.name
  ];

  allStems.forEach(stem => {
    const element = wuxingMap[stem];
    if (element) distribution[wxToEn[element] as keyof typeof distribution]++;
  });
  allBranches.forEach(branch => {
    const element = getWuxingOfBranch(branch);
    if (element && wxToEn[element]) distribution[wxToEn[element] as keyof typeof distribution]++;
  });

  const strengths: WuXingAnalysis['strengths'] = {};
  const strengthScores = calculateWuxingStrength(baZiInfo);
  Object.keys(distribution).forEach(en => {
    const cn = { wood: '木', fire: '火', earth: '土', metal: '金', water: '水' }[en] || '';
    const score = strengthScores[cn] || 0;
    if (score >= 4) strengths[en as keyof WuXingAnalysis['strengths']] = 'strong';
    else if (score >= 2) strengths[en as keyof WuXingAnalysis['strengths']] = 'medium';
    else strengths[en as keyof WuXingAnalysis['strengths']] = 'weak';
  });

  const dayStem = baZi.day.stem.name;
  const dayElement = wuxingMap[dayStem] || '';
  const dayScore = strengthScores[dayElement] || 0;
  const preferences: { favorable: string[]; unfavorable: string[] } = { favorable: [], unfavorable: [] };

  if (dayScore >= 4) {
    preferences.favorable = [wuxingShengBy[dayElement], wuxingKe[dayElement]].map(s => wxToEn[s] || '').filter(Boolean) as string[];
    preferences.unfavorable = [dayElement, wuxingSheng[dayElement]].map(s => wxToEn[s] || '').filter(Boolean) as string[];
  } else {
    preferences.favorable = [dayElement, wuxingShengBy[dayElement]].map(s => wxToEn[s] || '').filter(Boolean) as string[];
    preferences.unfavorable = [wuxingKeBy[dayElement], wuxingKe[dayElement]].map(s => wxToEn[s] || '').filter(Boolean) as string[];
  }

  const analysis = `五行分布：木${distribution.wood}、火${distribution.fire}、土${distribution.earth}、金${distribution.metal}、水${distribution.water}。日主${dayStem}(${dayElement})${dayScore >= 4 ? '偏旺' : dayScore >= 2 ? '中和' : '偏弱'}，喜${preferences.favorable.map(e => ({ wood: '木', fire: '火', earth: '土', metal: '金', water: '水' }[e] || '')).join('、')}，忌${preferences.unfavorable.map(e => ({ wood: '木', fire: '火', earth: '土', metal: '金', water: '水' }[e] || '')).join('、')}。`;

  return { distribution, strengths, preferences, analysis };
}

export function analyzeShiShen(baZiInfo: BaZiInfo): ShiShenAnalysis {
  const { baZi } = baZiInfo;
  const dayStem = baZi.day.stem.name;
  const shiShenList: ShiShenInfo[] = [];
  const branchShiShenList: ShiShenInfo[] = [];
  const shiShenCount: Record<string, number> = {};

  // 十神分析基于日干与其他三柱天干的关系，日干本身不计算十神
  const positions = ['year', 'month', 'hour'] as const;
  positions.forEach(position => {
    const stem = baZi[position].stem.name;
    const shiShenType = shiShenTable[dayStem]?.[stem] || '';
    const element = wuxingMap[stem] || '';
    const yinYang = getYinyangOfStem(stem);

    shiShenList.push({
      type: shiShenType,
      element,
      yinYang,
      position,
      strength: 'medium',
      source: 'stem'
    });
    shiShenCount[shiShenType] = (shiShenCount[shiShenType] || 0) + 1;
  });

  // 地支藏干十神
  const branchPositions = ['year', 'month', 'day', 'hour'] as const;
  const hiddenWeights = [0.3, 0.2, 0.1];

  branchPositions.forEach(position => {
    const branchName = baZi[position].branch.name;
    const hiddenStems = zhiCangGan[branchName] || [];
    hiddenStems.forEach((stem, idx) => {
      const shiShenType = shiShenTable[dayStem]?.[stem] || '';
      if (!shiShenType) return;
      const element = wuxingMap[stem] || '';
      const yinYang = getYinyangOfStem(stem);

      const info: ShiShenInfo = {
        type: shiShenType,
        element,
        yinYang,
        position,
        strength: 'medium',
        source: 'hidden',
        hiddenStemName: stem
      };
      branchShiShenList.push(info);

      const weight = hiddenWeights[idx] || 0;
      shiShenCount[shiShenType] = (shiShenCount[shiShenType] || 0) + weight;
    });
  });

  const dominantShiShen = Object.entries(shiShenCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([type]) => type as any);

  const stemPart = shiShenList.map(s => `${s.position}柱${s.type}`).join('、');
  const branchPart = branchShiShenList.map(s => `${s.position}支藏${s.hiddenStemName}→${s.type}`).join('、');
  const analysis = `十神分布：${stemPart}。地支藏干十神：${branchPart}。主导十神：${dominantShiShen.join('、')}。`;

  return { shiShenList, branchShiShenList, dominantShiShen, shiShenCount, analysis };
}

function calculateDaYunList(baZiInfo: BaZiInfo, gender: 'male' | 'female'): DaYun[] {
  const { baZi } = baZiInfo;
  const yearStem = baZi.year.stem;
  const monthStem = baZi.month.stem;
  const monthBranch = baZi.month.branch;

  const isYearStemYang = yearStem.index % 2 === 0;
  const isMale = gender === 'male';
  const forward = (isYearStemYang && isMale) || (!isYearStemYang && !isMale);

  const startAge = calculateStartAge(baZiInfo, forward);

  const daYunList: DaYun[] = [];
  let currentStemIndex = monthStem.index;
  let currentBranchIndex = monthBranch.index;

  for (let i = 0; i < 8; i++) {
    if (forward) {
      currentStemIndex = (currentStemIndex + 1) % 10;
      currentBranchIndex = (currentBranchIndex + 1) % 12;
    } else {
      currentStemIndex = (currentStemIndex - 1 + 10) % 10;
      currentBranchIndex = (currentBranchIndex - 1 + 12) % 12;
    }

    const stemName = heavenlyStems[currentStemIndex].name;
    const branchName = earthlyBranches[currentBranchIndex].name;
    const element = wuxingMap[stemName] || '';
    const startAgeVal = startAge + i * 10;
    const endAgeVal = startAgeVal + 9;
    const years = [];
    for (let y = baZiInfo.solarDate.year + startAgeVal; y <= baZiInfo.solarDate.year + endAgeVal; y++) {
      years.push(y);
    }

    const luck = evaluateDaYunLuck(stemName, branchName, baZiInfo);

    daYunList.push({
      startAge: startAgeVal,
      endAge: endAgeVal,
      years,
      stem: stemName,
      branch: branchName,
      element,
      luck,
      analysis: `大运${stemName}${branchName}（${startAgeVal}-${endAgeVal}岁）：${luck === 'good' ? '运势较好' : luck === 'medium' ? '运势平稳' : '运势需防'}`
    });
  }

  return daYunList;
}

function calculateStartAge(baZiInfo: BaZiInfo, forward: boolean): number {
  const { year, month, day, hour, minute, second } = baZiInfo.solarDate;

  try {
    const solar = Solar.fromYmdHms(year, month, day, hour || 0, minute || 0, second || 0);
    const lunar = solar.getLunar();

    if (forward) {
      const nextJieQi = lunar.getNextJie();
      if (nextJieQi) {
        const nextSolar = nextJieQi.getSolar();
        const birthDate = new Date(year, month - 1, day);
        const nextDate = new Date(nextSolar.getYear(), nextSolar.getMonth() - 1, nextSolar.getDay());
        const diffDays = Math.floor((nextDate.getTime() - birthDate.getTime()) / (24 * 60 * 60 * 1000));
        const startAge = Math.round(Math.abs(diffDays) / 3);
        return Math.max(1, Math.min(startAge, 10));
      }
    } else {
      const prevJieQi = lunar.getPrevJie();
      if (prevJieQi) {
        const prevSolar = prevJieQi.getSolar();
        const birthDate = new Date(year, month - 1, day);
        const prevDate = new Date(prevSolar.getYear(), prevSolar.getMonth() - 1, prevSolar.getDay());
        const diffDays = Math.floor((birthDate.getTime() - prevDate.getTime()) / (24 * 60 * 60 * 1000));
        const startAge = Math.round(Math.abs(diffDays) / 3);
        return Math.max(1, Math.min(startAge, 10));
      }
    }
  } catch {
  }

  return 3;
}

function evaluateDaYunLuck(stemName: string, branchName: string, baZiInfo: BaZiInfo): 'good' | 'medium' | 'bad' {
  const dayStem = baZiInfo.baZi.day.stem.name;
  const dayElement = wuxingMap[dayStem] || '';
  const stemElement = wuxingMap[stemName] || '';
  const branchElement = getWuxingOfBranch(branchName) || '';

  const strengthScores = calculateWuxingStrength(baZiInfo);
  const dayScore = strengthScores[dayElement] || 0;
  const isDayStrong = dayScore >= 3;

  let score = 0;
  if (isDayStrong) {
    if (wuxingKe[dayElement] === stemElement || wuxingKe[dayElement] === branchElement) score += 2;
    if (wuxingSheng[dayElement] === stemElement || wuxingSheng[dayElement] === branchElement) score -= 1;
    if (dayElement === stemElement) score -= 1;
  } else {
    if (dayElement === stemElement || wuxingShengBy[dayElement] === stemElement) score += 2;
    if (wuxingKeBy[dayElement] === stemElement || wuxingKeBy[dayElement] === branchElement) score += 1;
    if (wuxingKe[dayElement] === stemElement) score -= 2;
  }

  if (score >= 2) return 'good';
  if (score <= -1) return 'bad';
  return 'medium';
}

function calculateLiuNianList(startYear: number, count: number): LiuNian[] {
  const liuNianList: LiuNian[] = [];
  const baseYear = 1984;
  const baseStemIndex = 0;
  const baseBranchIndex = 0;

  for (let i = 0; i < count; i++) {
    const year = startYear + i;
    const stemIndex = (baseStemIndex + (year - baseYear)) % 10;
    const branchIndex = (baseBranchIndex + (year - baseYear)) % 12;
    const stemName = heavenlyStems[((stemIndex % 10) + 10) % 10].name;
    const branchName = earthlyBranches[((branchIndex % 12) + 12) % 12].name;
    const element = wuxingMap[stemName] || '';

    liuNianList.push({
      year,
      stem: stemName,
      branch: branchName,
      element,
      luck: 'medium',
      analysis: `${year}年${stemName}${branchName}，${element}运`
    });
  }

  return liuNianList;
}

export function analyzeDaYunLiuNian(baZiInfo: BaZiInfo, gender: 'male' | 'female' = 'male'): DaYunLiuNianAnalysis {
  const currentYear = new Date().getFullYear();
  const birthYear = baZiInfo.solarDate.year;
  const age = currentYear - birthYear;

  const daYunList = calculateDaYunList(baZiInfo, gender);
  const liuNianList = calculateLiuNianList(currentYear, 10);

  liuNianList.forEach(liuNian => {
    const dayStem = baZiInfo.baZi.day.stem.name;
    const dayElement = wuxingMap[dayStem] || '';
    const lnElement = wuxingMap[liuNian.stem] || '';
    const strengthScores = calculateWuxingStrength(baZiInfo);
    const dayScore = strengthScores[dayElement] || 0;
    const isDayStrong = dayScore >= 3;

    if (isDayStrong) {
      liuNian.luck = (wuxingKe[dayElement] === lnElement || wuxingSheng[dayElement] === lnElement) ? 'good' : 'medium';
    } else {
      liuNian.luck = (dayElement === lnElement || wuxingShengBy[dayElement] === lnElement) ? 'good' : (wuxingKeBy[dayElement] === lnElement ? 'bad' : 'medium');
    }
    liuNian.analysis = `${liuNian.year}年${liuNian.stem}${liuNian.branch}，${liuNian.luck === 'good' ? '运势较佳' : liuNian.luck === 'bad' ? '需防不顺' : '运势平稳'}`;
  });

  const currentDaYun = daYunList.find(daYun => age >= daYun.startAge && age <= daYun.endAge) || null;
  const currentLiuNian = liuNianList.find(liuNian => liuNian.year === currentYear) || null;

  const analysis = `当前大运：${currentDaYun ? `${currentDaYun.stem}${currentDaYun.branch}（${currentDaYun.startAge}-${currentDaYun.endAge}岁）` : '未进入大运'}。当前流年：${currentLiuNian ? `${currentLiuNian.stem}${currentLiuNian.branch}` : currentYear + '年'}。`;

  return { daYunList, liuNianList, currentDaYun, currentLiuNian, analysis };
}

export function analyzeFate(baZiInfo: BaZiInfo, gender: 'male' | 'female' = 'male'): FateAnalysis {
  const wuXingAnalysis = analyzeWuXing(baZiInfo);
  const shiShenAnalysis = analyzeShiShen(baZiInfo);
  const daYunLiuNianAnalysis = analyzeDaYunLiuNian(baZiInfo, gender);

  const overallAnalysis = `命局分析：${wuXingAnalysis.analysis} ${shiShenAnalysis.analysis} ${daYunLiuNianAnalysis.analysis}`;

  const suggestions = [
    '保持良好心态，顺应天时地利人和',
    `五行喜${wuXingAnalysis.preferences.favorable.map(e => ({ wood: '木', fire: '火', earth: '土', metal: '金', water: '水' }[e] || '')).join('、')}，可在生活中多接触相关元素`,
    '在有利大运和流年积极进取，不利时期谨慎守成',
    '注意调和六亲关系，趋吉避凶'
  ];

  return {
    wuXingAnalysis,
    shiShenAnalysis,
    daYunLiuNianAnalysis,
    overallAnalysis,
    suggestions
  };
}

export { liuQinMap, wuxingSheng, wuxingKe, wuxingShengBy, wuxingKeBy, calculateWuxingStrength, shiShenTable, wuxingMap };
