import { SolarDate, LunarDate, BaZi, BaZiInfo } from '../interfaces';
import { solarToLunar } from './lunarConverter';
import { getYearStemBranch, getMonthStemBranch, getDayStemBranch, getHourStem, getHourBranch, getWuxingOfStem, getWuxingOfBranch, getYinyangOfStem, getNayin } from './stemsAndBranches';

export function calculateBaZi(solarDate: SolarDate): BaZiInfo {
  const { year, month, day, hour } = solarDate;
  const lunarDate = solarToLunar(solarDate);

  const yearPillar = getYearStemBranch(year, month, day);
  const monthPillar = getMonthStemBranch(year, month, day);
  const dayStemBranch = getDayStemBranch(year, month, day);
  const hourStem = getHourStem(dayStemBranch.stem, hour);
  const hourBranch = getHourBranch(hour);

  const baZi: BaZi = {
    year: { stem: yearPillar.stem, branch: yearPillar.branch },
    month: { stem: monthPillar.stem, branch: monthPillar.branch },
    day: { stem: dayStemBranch.stem, branch: dayStemBranch.branch },
    hour: { stem: hourStem, branch: hourBranch }
  };

  const wuxing = {
    year: getWuxingOfStem(yearPillar.stem.name),
    month: getWuxingOfStem(monthPillar.stem.name),
    day: getWuxingOfStem(dayStemBranch.stem.name),
    hour: getWuxingOfStem(hourStem.name)
  };

  const yinyang = {
    year: getYinyangOfStem(yearPillar.stem.name),
    month: getYinyangOfStem(monthPillar.stem.name),
    day: getYinyangOfStem(dayStemBranch.stem.name),
    hour: getYinyangOfStem(hourStem.name)
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
