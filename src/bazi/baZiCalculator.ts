import { SolarDate, LunarDate, BaZi, BaZiInfo } from '../interfaces';
import { solarToLunar } from './lunarConverter';
import { getYearStemBranch, getMonthStemBranch, getDayStemBranch, getHourStemBranch, getWuxingOfStem, getWuxingOfBranch, getYinyangOfStem, getNayin, stemNameToObject, branchNameToObject } from './stemsAndBranches';

export function calculateBaZi(solarDate: SolarDate): BaZiInfo {
  const { year, month, day, hour, minute, second } = solarDate;

  const lunarDate = solarToLunar(solarDate);

  const yearPillar = getYearStemBranch(year, month, day, hour, minute || 0, second || 0);
  const monthPillar = getMonthStemBranch(year, month, day, hour, minute || 0, second || 0);
  const dayPillar = getDayStemBranch(year, month, day);
  const hourPillar = getHourStemBranch(dayPillar.stem, hour, minute || 0);

  const baZi: BaZi = {
    year: yearPillar,
    month: monthPillar,
    day: dayPillar,
    hour: hourPillar
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
