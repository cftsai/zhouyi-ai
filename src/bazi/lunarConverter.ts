import { LunarDate, SolarDate } from '../interfaces';
import { Solar } from 'lunar-javascript';

/**
 * 公历转农历
 * 使用 lunar-javascript 库，支持 1900-2100 年
 */
export function solarToLunar(solarDate: SolarDate): LunarDate {
  const { year, month, day } = solarDate;

  try {
    const solar = Solar.fromYmd(year, month, day);
    const lunar = solar.getLunar();

    const lunarMonth = lunar.getMonth();
    return {
      year: lunar.getYear(),
      month: Math.abs(lunarMonth),
      day: lunar.getDay(),
      isLeap: lunarMonth < 0
    };
  } catch (error) {
    // fallback：若库不支持该日期，返回原日期并标记非闰月
    return {
      year,
      month,
      day,
      isLeap: false
    };
  }
}

/**
 * 农历转公历
 * 使用 lunar-javascript 库，支持 1900-2100 年
 */
export function lunarToSolar(lunarDate: LunarDate): SolarDate {
  const { year, month, day, isLeap } = lunarDate;

  try {
    // lunar-javascript 的 Solar.fromYmd 没有直接支持农历转公历的反向接口
    // 这里通过遍历公历日期找到对应的农历日期作为近似实现
    // 实际项目中若频繁调用，建议缓存或直接使用库的其他接口
    const startDate = new Date(year, month - 1, day);
    const searchRange = 60; // 前后搜索 60 天

    for (let offset = -searchRange; offset <= searchRange; offset++) {
      const checkDate = new Date(startDate.getTime() + offset * 24 * 60 * 60 * 1000);
      const solar = Solar.fromYmd(checkDate.getFullYear(), checkDate.getMonth() + 1, checkDate.getDate());
      const lunar = solar.getLunar();

      if (
        lunar.getYear() === year &&
        Math.abs(lunar.getMonth()) === month &&
        lunar.getDay() === day &&
        (lunar.getMonth() < 0) === isLeap
      ) {
        return {
          year: checkDate.getFullYear(),
          month: checkDate.getMonth() + 1,
          day: checkDate.getDate(),
          hour: 0,
          minute: 0,
          second: 0
        };
      }
    }

    // 未找到匹配，返回原日期 fallback
    return {
      year,
      month,
      day,
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
