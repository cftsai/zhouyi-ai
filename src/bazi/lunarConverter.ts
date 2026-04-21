import { LunarDate, SolarDate } from '../interfaces';
import { Solar, Lunar } from 'lunar-javascript';

export function solarToLunar(solarDate: SolarDate): LunarDate {
  const { year, month, day, hour, minute, second } = solarDate;

  try {
    const solar = Solar.fromYmdHms(year, month, day, hour || 0, minute || 0, second || 0);
    const lunar = solar.getLunar();

    const lunarMonth = lunar.getMonth();
    return {
      year: lunar.getYear(),
      month: Math.abs(lunarMonth),
      day: lunar.getDay(),
      isLeap: lunarMonth < 0
    };
  } catch (error) {
    return {
      year,
      month,
      day,
      isLeap: false
    };
  }
}

export function lunarToSolar(lunarDate: LunarDate): SolarDate {
  const { year, month, day, isLeap } = lunarDate;

  try {
    const lunar = Lunar.fromYmdHms(year, isLeap ? -month : month, day, 0, 0, 0);
    const solar = lunar.getSolar();

    return {
      year: solar.getYear(),
      month: solar.getMonth(),
      day: solar.getDay(),
      hour: 0,
      minute: 0,
      second: 0
    };
  } catch (error) {
    return {
      year,
      month,
      day,
      hour: 0,
      minute: 0,
      second: 0
    };
  }
}
