import { SolarDate, LunarDate, BaZi, BaZiInfo } from '../interfaces';
import { solarToLunar } from './lunarConverter';
import { Solar } from 'lunar-javascript';
import { getWuxingOfStem, getWuxingOfBranch, getYinyangOfStem, getNayin, stemNameToObject, branchNameToObject } from './stemsAndBranches';

export function calculateBaZi(solarDate: SolarDate): BaZiInfo {
  const { year, month, day, hour, minute, second } = solarDate;

  const lunarDate = solarToLunar(solarDate);

  const solar = Solar.fromYmdHms(year, month, day, hour, minute || 0, second || 0);
  const lunar = solar.getLunar();
  const eightChar = lunar.getEightChar();

  const yearGanZhi = eightChar.getYear();
  const monthGanZhi = eightChar.getMonth();
  const dayGanZhi = eightChar.getDay();
  const hourGanZhi = eightChar.getTime();

  const baZi: BaZi = {
    year: { stem: stemNameToObject(yearGanZhi.charAt(0)), branch: branchNameToObject(yearGanZhi.charAt(1)) },
    month: { stem: stemNameToObject(monthGanZhi.charAt(0)), branch: branchNameToObject(monthGanZhi.charAt(1)) },
    day: { stem: stemNameToObject(dayGanZhi.charAt(0)), branch: branchNameToObject(dayGanZhi.charAt(1)) },
    hour: { stem: stemNameToObject(hourGanZhi.charAt(0)), branch: branchNameToObject(hourGanZhi.charAt(1)) }
  };

  const wuxing = {
    year: getWuxingOfStem(baZi.year.stem.name),
    month: getWuxingOfStem(baZi.month.stem.name),
    day: getWuxingOfStem(baZi.day.stem.name),
    hour: getWuxingOfStem(baZi.hour.stem.name)
  };

  const yinyang = {
    year: getYinyangOfStem(baZi.year.stem.name),
    month: getYinyangOfStem(baZi.month.stem.name),
    day: getYinyangOfStem(baZi.day.stem.name),
    hour: getYinyangOfStem(baZi.hour.stem.name)
  };

  return {
    solarDate,
    lunarDate,
    baZi,
    wuxing,
    yinyang
  };
}

export function getSiZhuInfo(baZiInfo: BaZiInfo): string {
  const { baZi } = baZiInfo;
  return `${baZi.year.stem.name}${baZi.year.branch.name} ${baZi.month.stem.name}${baZi.month.branch.name} ${baZi.day.stem.name}${baZi.day.branch.name} ${baZi.hour.stem.name}${baZi.hour.branch.name}`;
}

export function getNayinInfo(baZiInfo: BaZiInfo): { year: string; month: string; day: string; hour: string } {
  const { baZi } = baZiInfo;
  return {
    year: getNayin(baZi.year.stem.name, baZi.year.branch.name),
    month: getNayin(baZi.month.stem.name, baZi.month.branch.name),
    day: getNayin(baZi.day.stem.name, baZi.day.branch.name),
    hour: getNayin(baZi.hour.stem.name, baZi.hour.branch.name)
  };
}
