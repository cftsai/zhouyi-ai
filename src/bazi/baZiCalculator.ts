import { SolarDate, LunarDate, BaZi, BaZiInfo } from '../interfaces';
import { solarToLunar } from './lunarConverter';
import { getYearStem, getYearBranch, getMonthStem, getMonthBranch, getDayStemBranch, getHourStem, getHourBranch } from './stemsAndBranches';

// 五行对应关系
const wuxingMap: Record<string, string> = {
  '甲': '木', '乙': '木',
  '丙': '火', '丁': '火',
  '戊': '土', '己': '土',
  '庚': '金', '辛': '金',
  '壬': '水', '癸': '水'
};

// 阴阳对应关系
const yinyangMap: Record<string, string> = {
  '甲': '阳', '乙': '阴',
  '丙': '阳', '丁': '阴',
  '戊': '阳', '己': '阴',
  '庚': '阳', '辛': '阴',
  '壬': '阳', '癸': '阴'
};


// 计算八字
export function calculateBaZi(solarDate: SolarDate): BaZiInfo {
  // 转换为农历
  const lunarDate = solarToLunar(solarDate);
  
  const { year, month, day, hour } = solarDate;
  
  // 计算年柱
  const yearStem = getYearStem(year);
  const yearBranch = getYearBranch(year);
  
  // 计算月柱
  const monthStem = getMonthStem(year, month);
  const monthBranch = getMonthBranch(month);
  
  // 计算日柱
  const dayStemBranch = getDayStemBranch(year, month, day);
  const dayStem = dayStemBranch.stem;
  const dayBranch = dayStemBranch.branch;
  
  // 计算时柱
  const hourStem = getHourStem(dayStem, hour);
  const hourBranch = getHourBranch(hour);
  
  // 构建八字
  const baZi: BaZi = {
    year: { stem: yearStem, branch: yearBranch },
    month: { stem: monthStem, branch: monthBranch },
    day: { stem: dayStem, branch: dayBranch },
    hour: { stem: hourStem, branch: hourBranch }
  };
  
  // 计算五行
  const wuxing = {
    year: wuxingMap[yearStem.name] || '',
    month: wuxingMap[monthStem.name] || '',
    day: wuxingMap[dayStem.name] || '',
    hour: wuxingMap[hourStem.name] || ''
  };
  
  // 计算阴阳
  const yinyang = {
    year: yinyangMap[yearStem.name] || '',
    month: yinyangMap[monthStem.name] || '',
    day: yinyangMap[dayStem.name] || '',
    hour: yinyangMap[hourStem.name] || ''
  };
  
  return {
    solarDate,
    lunarDate,
    baZi,
    wuxing,
    yinyang
  };
}

// 获取四柱信息
export function getSiZhuInfo(baZiInfo: BaZiInfo): string {
  const { baZi } = baZiInfo;
  
  return `${baZi.year.stem.name}${baZi.year.branch.name} ${baZi.month.stem.name}${baZi.month.branch.name} ${baZi.day.stem.name}${baZi.day.branch.name} ${baZi.hour.stem.name}${baZi.hour.branch.name}`;
}
