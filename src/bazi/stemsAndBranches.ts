import { HeavenlyStem, EarthlyBranch } from '../interfaces';

// 天干
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

// 地支
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

// 计算年天干
function getYearStem(year: number): HeavenlyStem {
  const index = (year - 3) % 10;
  return heavenlyStems[index < 0 ? index + 10 : index];
}

// 计算年地支
function getYearBranch(year: number): EarthlyBranch {
  const index = (year - 3) % 12;
  return earthlyBranches[index < 0 ? index + 12 : index];
}

// 计算月地支（修正：正月建寅，即一月为寅月）
function getMonthBranch(month: number): EarthlyBranch {
  // 农历月与地支对应：1月→寅(2), 2月→卯(3), ..., 11月→子(0), 12月→丑(1)
  const monthToBranch = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 0, 1];
  const index = monthToBranch[(month - 1) % 12] ?? 2;
  return earthlyBranches[index];
}

// 计算月天干
function getMonthStem(year: number, month: number): HeavenlyStem {
  const yearStemIndex = (year - 3) % 10;
  const monthStemIndex = (yearStemIndex * 2 + month) % 10;
  return heavenlyStems[monthStemIndex < 0 ? monthStemIndex + 10 : monthStemIndex];
}

// 计算日天干地支（基于已知的甲子日基准计算）
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

// 计算时地支
function getHourBranch(hour: number): EarthlyBranch {
  const index = Math.floor(hour / 2) % 12;
  return earthlyBranches[index];
}

// 计算时天干
function getHourStem(dayStem: HeavenlyStem, hour: number): HeavenlyStem {
  const dayStemIndex = dayStem.index;
  const hourBranchIndex = Math.floor(((hour + 1) % 24) / 2);
  const hourStemIndex = ((dayStemIndex * 2 + hourBranchIndex) % 10 + 10) % 10;
  return heavenlyStems[hourStemIndex];
}

export { getYearStem, getYearBranch, getMonthStem, getMonthBranch, getDayStemBranch, getHourStem, getHourBranch, heavenlyStems, earthlyBranches };
