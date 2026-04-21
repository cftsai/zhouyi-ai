import { HeavenlyStem, EarthlyBranch } from '../interfaces';
import { Solar, Lunar, EightChar } from 'lunar-javascript';

const heavenlyStems: HeavenlyStem[] = [
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

const earthlyBranches: EarthlyBranch[] = [
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

const stemNameToIndex: Record<string, number> = {
  '甲': 0, '乙': 1, '丙': 2, '丁': 3, '戊': 4,
  '己': 5, '庚': 6, '辛': 7, '壬': 8, '癸': 9
};

const branchNameToIndex: Record<string, number> = {
  '子': 0, '丑': 1, '寅': 2, '卯': 3, '辰': 4, '巳': 5,
  '午': 6, '未': 7, '申': 8, '酉': 9, '戌': 10, '亥': 11
};

function stemNameToObject(name: string): HeavenlyStem {
  const index = stemNameToIndex[name];
  if (index === undefined) {
    return heavenlyStems[0];
  }
  return heavenlyStems[index];
}

function branchNameToObject(name: string): EarthlyBranch {
  const index = branchNameToIndex[name];
  if (index === undefined) {
    return earthlyBranches[0];
  }
  return earthlyBranches[index];
}

function getEightChar(year: number, month: number, day: number, hour: number, minute: number = 0, second: number = 0): EightChar {
  const solar = Solar.fromYmdHms(year, month, day, hour, minute, second);
  const lunar = solar.getLunar();
  return lunar.getEightChar();
}

function getYearStem(year: number): HeavenlyStem {
  const index = ((year - 4) % 10 + 10) % 10;
  return heavenlyStems[index];
}

function getYearBranch(year: number): EarthlyBranch {
  const index = ((year - 4) % 12 + 12) % 12;
  return earthlyBranches[index];
}

function getYearStemBranch(year: number, month: number, day: number, hour: number = 0, minute: number = 0, second: number = 0): { stem: HeavenlyStem; branch: EarthlyBranch } {
  const eightChar = getEightChar(year, month, day, hour, minute, second);
  const yearGanZhi = eightChar.getYear();
  const stemName = yearGanZhi.charAt(0);
  const branchName = yearGanZhi.charAt(1);
  return {
    stem: stemNameToObject(stemName),
    branch: branchNameToObject(branchName)
  };
}

function getMonthBranch(month: number): EarthlyBranch {
  const monthToBranch = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 0, 1];
  const index = monthToBranch[(month - 1) % 12] ?? 2;
  return earthlyBranches[index];
}

function getMonthStem(yearStemIndex: number, month: number): HeavenlyStem {
  const yearStemMod5 = yearStemIndex % 5;
  const startStemIndex = [2, 4, 6, 8, 0][yearStemMod5];
  const monthStemIndex = (startStemIndex + (month - 1)) % 10;
  return heavenlyStems[monthStemIndex];
}

function getMonthStemBranch(year: number, month: number, day: number, hour: number = 0, minute: number = 0, second: number = 0): { stem: HeavenlyStem; branch: EarthlyBranch } {
  const eightChar = getEightChar(year, month, day, hour, minute, second);
  const monthGanZhi = eightChar.getMonth();
  const stemName = monthGanZhi.charAt(0);
  const branchName = monthGanZhi.charAt(1);
  return {
    stem: stemNameToObject(stemName),
    branch: branchNameToObject(branchName)
  };
}

function getDayStemBranch(year: number, month: number, day: number): { stem: HeavenlyStem; branch: EarthlyBranch } {
  const eightChar = getEightChar(year, month, day, 12, 0, 0);
  const dayGanZhi = eightChar.getDay();
  const stemName = dayGanZhi.charAt(0);
  const branchName = dayGanZhi.charAt(1);
  return {
    stem: stemNameToObject(stemName),
    branch: branchNameToObject(branchName)
  };
}

function getHourBranch(hour: number): EarthlyBranch {
  const adjustedHour = ((hour + 1) % 24);
  const index = Math.floor(adjustedHour / 2) % 12;
  return earthlyBranches[index];
}

function getHourStem(dayStem: HeavenlyStem, hour: number): HeavenlyStem {
  const dayStemIndex = dayStem.index;
  const hourBranchIndex = Math.floor(((hour + 1) % 24) / 2);
  const startStemIndex = (dayStemIndex % 5) * 2;
  const hourStemIndex = (startStemIndex + hourBranchIndex) % 10;
  return heavenlyStems[hourStemIndex];
}

function getHourStemBranch(dayStem: HeavenlyStem, hour: number, minute: number = 0): { stem: HeavenlyStem; branch: EarthlyBranch } {
  const adjustedHour = ((hour + 1) % 24);
  const hourBranchIndex = Math.floor(adjustedHour / 2) % 12;
  const dayStemIndex = dayStem.index;
  const startStemIndex = (dayStemIndex % 5) * 2;
  const hourStemIndex = (startStemIndex + hourBranchIndex) % 10;
  return {
    stem: heavenlyStems[hourStemIndex],
    branch: earthlyBranches[hourBranchIndex]
  };
}

function isBeforeLiChun(year: number, month: number, day: number): boolean {
  try {
    const eightChar = getEightChar(year, month, day, 0, 0, 0);
    const yearGanZhi = eightChar.getYear();
    const yearStemName = yearGanZhi.charAt(0);
    const expectedStemName = getYearStem(year).name;
    return yearStemName !== expectedStemName;
  } catch {
    return false;
  }
}

function getSolarTermMonth(year: number, month: number, day: number): number {
  try {
    const eightChar = getEightChar(year, month, day, 0, 0, 0);
    const monthGanZhi = eightChar.getMonth();
    const branchName = monthGanZhi.charAt(1);
    const branchToMonth: Record<string, number> = {
      '寅': 1, '卯': 2, '辰': 3, '巳': 4, '午': 5, '未': 6,
      '申': 7, '酉': 8, '戌': 9, '亥': 10, '子': 11, '丑': 12
    };
    return branchToMonth[branchName] || month;
  } catch {
    return month;
  }
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

const solarTermsData: Record<number, Array<{ name: string; month: number; day: number }>> = {};

const jieQiToMonth: Record<string, number> = {
  '立春': 1, '惊蛰': 2, '清明': 3, '立夏': 4,
  '芒种': 5, '小暑': 6, '立秋': 7, '白露': 8,
  '寒露': 9, '立冬': 10, '大雪': 11, '小寒': 12
};

export {
  getYearStem, getYearBranch, getYearStemBranch,
  getMonthStem, getMonthBranch, getMonthStemBranch,
  getDayStemBranch, getHourStem, getHourBranch, getHourStemBranch,
  getSolarTermMonth, isBeforeLiChun,
  getNayin, getWuxingOfStem, getWuxingOfBranch, getYinyangOfStem,
  heavenlyStems, earthlyBranches,
  solarTermsData, jieQiToMonth, nayinTable,
  getEightChar, stemNameToObject, branchNameToObject
};
