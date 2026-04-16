import { HeavenlyStem, EarthlyBranch } from '../interfaces';

const heavenlyStems = [
  { name: '甲', index: 0 },
  { name: '乙', index: 1 },
  { name: '丙', index: 2 },
  { name: '丁', index: 3 },
  { name: '戊', index: 4 },
  { name: '己', index: 5 },
  { name: '庚', index: 6 },
  { name: '辛', index: 7 },
  { name: '壬', index: 8 },
  { name: '癸', index: 9 }
];

const earthlyBranches = [
  { name: '子', index: 0 },
  { name: '丑', index: 1 },
  { name: '寅', index: 2 },
  { name: '卯', index: 3 },
  { name: '辰', index: 4 },
  { name: '巳', index: 5 },
  { name: '午', index: 6 },
  { name: '未', index: 7 },
  { name: '申', index: 8 },
  { name: '酉', index: 9 },
  { name: '戌', index: 10 },
  { name: '亥', index: 11 }
];

const wuxingOfStem: Record<string, string> = {
  '甲': '木', '乙': '木', '丙': '火', '丁': '火', '戊': '土',
  '己': '土', '庚': '金', '辛': '金', '壬': '水', '癸': '水'
};

const wuxingOfBranch: Record<string, string> = {
  '子': '水', '丑': '土', '寅': '木', '卯': '木', '辰': '土', '巳': '火',
  '午': '火', '未': '土', '申': '金', '酉': '金', '戌': '土', '亥': '水'
};

const yinyangOfStem: Record<string, string> = {
  '甲': '阳', '乙': '阴', '丙': '阳', '丁': '阴', '戊': '阳',
  '己': '阴', '庚': '阳', '辛': '阴', '壬': '阳', '癸': '阴'
};

const nayinTable: Record<string, string> = {
  '甲子': '海中金', '乙丑': '海中金', '丙寅': '炉中火', '丁卯': '炉中火',
  '戊辰': '大林木', '己巳': '大林木', '庚午': '路旁土', '辛未': '路旁土',
  '壬申': '剑锋金', '癸酉': '剑锋金', '甲戌': '山头火', '乙亥': '山头火',
  '丙子': '涧下水', '丁丑': '涧下水', '戊寅': '城头土', '己卯': '城头土',
  '庚辰': '白蜡金', '辛巳': '白蜡金', '壬午': '杨柳木', '癸未': '杨柳木',
  '甲申': '泉中水', '乙酉': '泉中水', '丙戌': '屋上土', '丁亥': '屋上土',
  '戊子': '霹雳火', '己丑': '霹雳火', '庚寅': '松柏木', '辛卯': '松柏木',
  '壬辰': '长流水', '癸巳': '长流水', '甲午': '砂石金', '乙未': '砂石金',
  '丙申': '山下火', '丁酉': '山下火', '戊戌': '平地木', '己亥': '平地木',
  '庚子': '壁上土', '辛丑': '壁上土', '壬寅': '金箔金', '癸卯': '金箔金',
  '甲辰': '覆灯火', '乙巳': '覆灯火', '丙午': '天河水', '丁未': '天河水',
  '戊申': '大驿土', '己酉': '大驿土', '庚戌': '钗钏金', '辛亥': '钗钏金',
  '壬子': '桑柘木', '癸丑': '桑柘木', '甲寅': '大溪水', '乙卯': '大溪水',
  '丙辰': '沙中土', '丁巳': '沙中土', '戊午': '天上火', '己未': '天上火',
  '庚申': '石榴木', '辛酉': '石榴木', '壬戌': '大海水', '癸亥': '大海水'
};

interface SolarTerm {
  name: string;
  month: number;
  day: number;
}

const solarTermsData: Record<number, SolarTerm[]> = {
  2020: [
    { name: '小寒', month: 1, day: 6 }, { name: '大寒', month: 1, day: 20 },
    { name: '立春', month: 2, day: 4 }, { name: '雨水', month: 2, day: 19 },
    { name: '惊蛰', month: 3, day: 5 }, { name: '春分', month: 3, day: 20 },
    { name: '清明', month: 4, day: 4 }, { name: '谷雨', month: 4, day: 19 },
    { name: '立夏', month: 5, day: 5 }, { name: '小满', month: 5, day: 20 },
    { name: '芒种', month: 6, day: 5 }, { name: '夏至', month: 6, day: 21 },
    { name: '小暑', month: 7, day: 6 }, { name: '大暑', month: 7, day: 22 },
    { name: '立秋', month: 8, day: 7 }, { name: '处暑', month: 8, day: 22 },
    { name: '白露', month: 9, day: 7 }, { name: '秋分', month: 9, day: 22 },
    { name: '寒露', month: 10, day: 8 }, { name: '霜降', month: 10, day: 23 },
    { name: '立冬', month: 11, day: 7 }, { name: '小雪', month: 11, day: 22 },
    { name: '大雪', month: 12, day: 7 }, { name: '冬至', month: 12, day: 21 }
  ],
  2021: [
    { name: '小寒', month: 1, day: 5 }, { name: '大寒', month: 1, day: 20 },
    { name: '立春', month: 2, day: 3 }, { name: '雨水', month: 2, day: 18 },
    { name: '惊蛰', month: 3, day: 5 }, { name: '春分', month: 3, day: 20 },
    { name: '清明', month: 4, day: 4 }, { name: '谷雨', month: 4, day: 20 },
    { name: '立夏', month: 5, day: 5 }, { name: '小满', month: 5, day: 21 },
    { name: '芒种', month: 6, day: 5 }, { name: '夏至', month: 6, day: 21 },
    { name: '小暑', month: 7, day: 7 }, { name: '大暑', month: 7, day: 22 },
    { name: '立秋', month: 8, day: 7 }, { name: '处暑', month: 8, day: 23 },
    { name: '白露', month: 9, day: 7 }, { name: '秋分', month: 9, day: 23 },
    { name: '寒露', month: 10, day: 8 }, { name: '霜降', month: 10, day: 23 },
    { name: '立冬', month: 11, day: 7 }, { name: '小雪', month: 11, day: 22 },
    { name: '大雪', month: 12, day: 7 }, { name: '冬至', month: 12, day: 21 }
  ],
  2022: [
    { name: '小寒', month: 1, day: 5 }, { name: '大寒', month: 1, day: 20 },
    { name: '立春', month: 2, day: 4 }, { name: '雨水', month: 2, day: 19 },
    { name: '惊蛰', month: 3, day: 5 }, { name: '春分', month: 3, day: 20 },
    { name: '清明', month: 4, day: 5 }, { name: '谷雨', month: 4, day: 20 },
    { name: '立夏', month: 5, day: 5 }, { name: '小满', month: 5, day: 21 },
    { name: '芒种', month: 6, day: 6 }, { name: '夏至', month: 6, day: 21 },
    { name: '小暑', month: 7, day: 7 }, { name: '大暑', month: 7, day: 23 },
    { name: '立秋', month: 8, day: 7 }, { name: '处暑', month: 8, day: 23 },
    { name: '白露', month: 9, day: 7 }, { name: '秋分', month: 9, day: 23 },
    { name: '寒露', month: 10, day: 8 }, { name: '霜降', month: 10, day: 23 },
    { name: '立冬', month: 11, day: 7 }, { name: '小雪', month: 11, day: 22 },
    { name: '大雪', month: 12, day: 7 }, { name: '冬至', month: 12, day: 22 }
  ],
  2023: [
    { name: '小寒', month: 1, day: 5 }, { name: '大寒', month: 1, day: 20 },
    { name: '立春', month: 2, day: 4 }, { name: '雨水', month: 2, day: 19 },
    { name: '惊蛰', month: 3, day: 6 }, { name: '春分', month: 3, day: 21 },
    { name: '清明', month: 4, day: 5 }, { name: '谷雨', month: 4, day: 20 },
    { name: '立夏', month: 5, day: 6 }, { name: '小满', month: 5, day: 21 },
    { name: '芒种', month: 6, day: 6 }, { name: '夏至', month: 6, day: 21 },
    { name: '小暑', month: 7, day: 7 }, { name: '大暑', month: 7, day: 23 },
    { name: '立秋', month: 8, day: 8 }, { name: '处暑', month: 8, day: 23 },
    { name: '白露', month: 9, day: 8 }, { name: '秋分', month: 9, day: 23 },
    { name: '寒露', month: 10, day: 8 }, { name: '霜降', month: 10, day: 24 },
    { name: '立冬', month: 11, day: 8 }, { name: '小雪', month: 11, day: 22 },
    { name: '大雪', month: 12, day: 7 }, { name: '冬至', month: 12, day: 22 }
  ],
  2024: [
    { name: '小寒', month: 1, day: 6 }, { name: '大寒', month: 1, day: 20 },
    { name: '立春', month: 2, day: 4 }, { name: '雨水', month: 2, day: 19 },
    { name: '惊蛰', month: 3, day: 5 }, { name: '春分', month: 3, day: 20 },
    { name: '清明', month: 4, day: 4 }, { name: '谷雨', month: 4, day: 19 },
    { name: '立夏', month: 5, day: 5 }, { name: '小满', month: 5, day: 20 },
    { name: '芒种', month: 6, day: 5 }, { name: '夏至', month: 6, day: 21 },
    { name: '小暑', month: 7, day: 6 }, { name: '大暑', month: 7, day: 22 },
    { name: '立秋', month: 8, day: 7 }, { name: '处暑', month: 8, day: 22 },
    { name: '白露', month: 9, day: 7 }, { name: '秋分', month: 9, day: 22 },
    { name: '寒露', month: 10, day: 8 }, { name: '霜降', month: 10, day: 23 },
    { name: '立冬', month: 11, day: 7 }, { name: '小雪', month: 11, day: 22 },
    { name: '大雪', month: 12, day: 6 }, { name: '冬至', month: 12, day: 21 }
  ],
  2025: [
    { name: '小寒', month: 1, day: 5 }, { name: '大寒', month: 1, day: 20 },
    { name: '立春', month: 2, day: 3 }, { name: '雨水', month: 2, day: 18 },
    { name: '惊蛰', month: 3, day: 5 }, { name: '春分', month: 3, day: 20 },
    { name: '清明', month: 4, day: 4 }, { name: '谷雨', month: 4, day: 20 },
    { name: '立夏', month: 5, day: 5 }, { name: '小满', month: 5, day: 21 },
    { name: '芒种', month: 6, day: 5 }, { name: '夏至', month: 6, day: 21 },
    { name: '小暑', month: 7, day: 7 }, { name: '大暑', month: 7, day: 22 },
    { name: '立秋', month: 8, day: 7 }, { name: '处暑', month: 8, day: 23 },
    { name: '白露', month: 9, day: 7 }, { name: '秋分', month: 9, day: 23 },
    { name: '寒露', month: 10, day: 8 }, { name: '霜降', month: 10, day: 23 },
    { name: '立冬', month: 11, day: 7 }, { name: '小雪', month: 11, day: 22 },
    { name: '大雪', month: 12, day: 7 }, { name: '冬至', month: 12, day: 21 }
  ],
  2026: [
    { name: '小寒', month: 1, day: 5 }, { name: '大寒', month: 1, day: 20 },
    { name: '立春', month: 2, day: 4 }, { name: '雨水', month: 2, day: 18 },
    { name: '惊蛰', month: 3, day: 5 }, { name: '春分', month: 3, day: 20 },
    { name: '清明', month: 4, day: 5 }, { name: '谷雨', month: 4, day: 20 },
    { name: '立夏', month: 5, day: 5 }, { name: '小满', month: 5, day: 21 },
    { name: '芒种', month: 6, day: 5 }, { name: '夏至', month: 6, day: 21 },
    { name: '小暑', month: 7, day: 7 }, { name: '大暑', month: 7, day: 22 },
    { name: '立秋', month: 8, day: 7 }, { name: '处暑', month: 8, day: 23 },
    { name: '白露', month: 9, day: 7 }, { name: '秋分', month: 9, day: 23 },
    { name: '寒露', month: 10, day: 8 }, { name: '霜降', month: 10, day: 23 },
    { name: '立冬', month: 11, day: 7 }, { name: '小雪', month: 11, day: 22 },
    { name: '大雪', month: 12, day: 7 }, { name: '冬至', month: 12, day: 21 }
  ]
};

const jieQiToMonth: Record<string, number> = {
  '立春': 1, '惊蛰': 2, '清明': 3, '立夏': 4,
  '芒种': 5, '小暑': 6, '立秋': 7, '白露': 8,
  '寒露': 9, '立冬': 10, '大雪': 11, '小寒': 12
};

function getSolarTermMonth(year: number, month: number, day: number): number {
  const terms = solarTermsData[year];
  if (!terms) {
    return month;
  }
  let resultMonth = month;
  for (let i = terms.length - 1; i >= 0; i--) {
    const term = terms[i];
    const termDate = new Date(year, term.month - 1, term.day);
    const currentDate = new Date(year, month - 1, day);
    if (currentDate >= termDate && jieQiToMonth[term.name] !== undefined) {
      resultMonth = jieQiToMonth[term.name];
      break;
    }
  }
  return resultMonth;
}

function isBeforeLiChun(year: number, month: number, day: number): boolean {
  const terms = solarTermsData[year];
  if (!terms) return false;
  const lichun = terms.find(t => t.name === '立春');
  if (!lichun) return false;
  const lichunDate = new Date(year, lichun.month - 1, lichun.day);
  const currentDate = new Date(year, month - 1, day);
  return currentDate < lichunDate;
}

function getYearStem(year: number): HeavenlyStem {
  const index = (year - 3) % 10;
  return heavenlyStems[index < 0 ? index + 10 : index];
}

function getYearBranch(year: number): EarthlyBranch {
  const index = (year - 3) % 12;
  return earthlyBranches[index < 0 ? index + 12 : index];
}

function getYearStemBranch(year: number, month: number, day: number): { stem: HeavenlyStem; branch: EarthlyBranch } {
  const actualYear = isBeforeLiChun(year, month, day) ? year - 1 : year;
  return {
    stem: getYearStem(actualYear),
    branch: getYearBranch(actualYear)
  };
}

function getMonthBranch(month: number): EarthlyBranch {
  const monthToBranch = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 0, 1];
  const index = monthToBranch[(month - 1) % 12] ?? 2;
  return earthlyBranches[index];
}

function getMonthStem(yearStemIndex: number, month: number): HeavenlyStem {
  const monthStemIndex = (yearStemIndex % 5 * 2 + month) % 10;
  return heavenlyStems[monthStemIndex < 0 ? monthStemIndex + 10 : monthStemIndex];
}

function getMonthStemBranch(year: number, month: number, day: number): { stem: HeavenlyStem; branch: EarthlyBranch } {
  const actualYear = isBeforeLiChun(year, month, day) ? year - 1 : year;
  const yearStem = getYearStem(actualYear);
  const solarTermMonth = getSolarTermMonth(year, month, day);
  const monthStem = getMonthStem(yearStem.index, solarTermMonth);
  const monthBranch = getMonthBranch(solarTermMonth);
  return { stem: monthStem, branch: monthBranch };
}

function getDayStemBranch(year: number, month: number, day: number): { stem: HeavenlyStem; branch: EarthlyBranch } {
  const baseDate = new Date(2000, 0, 7);
  const targetDate = new Date(year, month - 1, day);
  const daysDiff = Math.floor((targetDate.getTime() - baseDate.getTime()) / (24 * 60 * 60 * 1000));
  const stemIndex = ((daysDiff % 10) + 10) % 10;
  const branchIndex = ((daysDiff % 12) + 12) % 12;
  return {
    stem: heavenlyStems[stemIndex],
    branch: earthlyBranches[branchIndex]
  };
}

function getHourBranch(hour: number): EarthlyBranch {
  const index = Math.floor(hour / 2) % 12;
  return earthlyBranches[index];
}

function getHourStem(dayStem: HeavenlyStem, hour: number): HeavenlyStem {
  const dayStemIndex = dayStem.index;
  const hourBranchIndex = Math.floor(((hour + 1) % 24) / 2);
  const hourStemIndex = ((dayStemIndex * 2 + hourBranchIndex) % 10 + 10) % 10;
  return heavenlyStems[hourStemIndex];
}

function getNayin(stemName: string, branchName: string): string {
  return nayinTable[stemName + branchName] || '';
}

function getWuxingOfStem(stemName: string): string {
  return wuxingOfStem[stemName] || '';
}

function getWuxingOfBranch(branchName: string): string {
  return wuxingOfBranch[branchName] || '';
}

function getYinyangOfStem(stemName: string): string {
  return yinyangOfStem[stemName] || '';
}

export {
  getYearStem, getYearBranch, getYearStemBranch,
  getMonthStem, getMonthBranch, getMonthStemBranch,
  getDayStemBranch, getHourStem, getHourBranch,
  getSolarTermMonth, isBeforeLiChun,
  getNayin, getWuxingOfStem, getWuxingOfBranch, getYinyangOfStem,
  heavenlyStems, earthlyBranches,
  solarTermsData, jieQiToMonth, nayinTable
};
