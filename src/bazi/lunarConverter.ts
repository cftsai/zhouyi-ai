import { LunarDate, SolarDate } from '../interfaces';

// 农历数据 - 简化版，实际应用中可能需要更完整的数据
const lunarData: Record<number, (number | boolean)[][]> = {
  // 1900-2100年的农历数据，这里只列出部分示例
  // 格式：[年，月，日，是否闰月]
  2000: [[1, 24, false], [2, 23, false], [3, 25, false], [4, 23, false], [5, 24, false], [6, 22, false], [7, 23, false], [8, 22, false], [9, 22, false], [10, 22, false], [11, 21, false], [12, 21, false]],
  2001: [[1, 24, false], [2, 23, false], [3, 24, false], [4, 22, false], [5, 23, false], [6, 22, false], [7, 22, false], [8, 21, false], [9, 21, false], [10, 20, false], [11, 20, false], [12, 20, false]],
  2002: [[1, 22, false], [2, 21, false], [3, 23, false], [4, 21, false], [5, 22, false], [6, 21, false], [7, 21, false], [8, 20, false], [9, 19, false], [10, 19, false], [11, 18, false], [12, 18, false]],
  2003: [[1, 22, false], [2, 21, false], [3, 23, false], [4, 21, false], [5, 22, false], [6, 21, false], [7, 21, false], [8, 20, false], [9, 19, false], [10, 19, false], [11, 18, false], [12, 18, false]],
  2004: [[1, 22, false], [2, 21, false], [3, 22, true], [4, 21, false], [5, 22, false], [6, 21, false], [7, 21, false], [8, 20, false], [9, 19, false], [10, 19, false], [11, 18, false], [12, 18, false]],
  2005: [[1, 22, false], [2, 21, false], [3, 22, false], [4, 21, false], [5, 22, false], [6, 21, false], [7, 21, false], [8, 20, false], [9, 19, false], [10, 19, false], [11, 18, false], [12, 18, false]],
  2006: [[1, 22, false], [2, 21, false], [3, 22, false], [4, 21, false], [5, 22, false], [6, 21, false], [7, 21, false], [8, 20, false], [9, 19, false], [10, 19, false], [11, 18, false], [12, 18, false]],
  2007: [[1, 22, false], [2, 21, false], [3, 22, false], [4, 21, false], [5, 22, false], [6, 21, false], [7, 21, false], [8, 20, false], [9, 19, false], [10, 19, false], [11, 18, false], [12, 18, false]],
  2008: [[1, 22, false], [2, 21, false], [3, 22, true], [4, 21, false], [5, 22, false], [6, 21, false], [7, 21, false], [8, 20, false], [9, 19, false], [10, 19, false], [11, 18, false], [12, 18, false]],
  2009: [[1, 22, false], [2, 21, false], [3, 22, false], [4, 21, false], [5, 22, false], [6, 21, false], [7, 21, false], [8, 20, false], [9, 19, false], [10, 19, false], [11, 18, false], [12, 18, false]],
  2010: [[1, 22, false], [2, 21, false], [3, 22, false], [4, 21, false], [5, 22, false], [6, 21, false], [7, 21, false], [8, 20, false], [9, 19, false], [10, 19, false], [11, 18, false], [12, 18, false]],
  2011: [[1, 22, false], [2, 21, false], [3, 22, false], [4, 21, false], [5, 22, false], [6, 21, false], [7, 21, false], [8, 20, false], [9, 19, false], [10, 19, false], [11, 18, false], [12, 18, false]],
  2012: [[1, 22, false], [2, 21, false], [3, 22, true], [4, 21, false], [5, 22, false], [6, 21, false], [7, 21, false], [8, 20, false], [9, 19, false], [10, 19, false], [11, 18, false], [12, 18, false]],
  2013: [[1, 22, false], [2, 21, false], [3, 22, false], [4, 21, false], [5, 22, false], [6, 21, false], [7, 21, false], [8, 20, false], [9, 19, false], [10, 19, false], [11, 18, false], [12, 18, false]],
  2014: [[1, 22, false], [2, 21, false], [3, 22, false], [4, 21, false], [5, 22, false], [6, 21, false], [7, 21, false], [8, 20, false], [9, 19, false], [10, 19, false], [11, 18, false], [12, 18, false]],
  2015: [[1, 22, false], [2, 21, false], [3, 22, false], [4, 21, false], [5, 22, false], [6, 21, false], [7, 21, false], [8, 20, false], [9, 19, false], [10, 19, false], [11, 18, false], [12, 18, false]],
  2016: [[1, 22, false], [2, 21, false], [3, 22, true], [4, 21, false], [5, 22, false], [6, 21, false], [7, 21, false], [8, 20, false], [9, 19, false], [10, 19, false], [11, 18, false], [12, 18, false]],
  2017: [[1, 22, false], [2, 21, false], [3, 22, false], [4, 21, false], [5, 22, false], [6, 21, false], [7, 21, false], [8, 20, false], [9, 19, false], [10, 19, false], [11, 18, false], [12, 18, false]],
  2018: [[1, 22, false], [2, 21, false], [3, 22, false], [4, 21, false], [5, 22, false], [6, 21, false], [7, 21, false], [8, 20, false], [9, 19, false], [10, 19, false], [11, 18, false], [12, 18, false]],
  2019: [[1, 22, false], [2, 21, false], [3, 22, false], [4, 21, false], [5, 22, false], [6, 21, false], [7, 21, false], [8, 20, false], [9, 19, false], [10, 19, false], [11, 18, false], [12, 18, false]],
  2020: [[1, 22, false], [2, 21, false], [3, 22, true], [4, 21, false], [5, 22, false], [6, 21, false], [7, 21, false], [8, 20, false], [9, 19, false], [10, 19, false], [11, 18, false], [12, 18, false]],
};


// 公历转农历
export function solarToLunar(solarDate: SolarDate): LunarDate {
  const { year, month, day } = solarDate;
  
  // 简化实现，实际应用中需要更复杂的算法
  // 这里使用预定义的数据进行简单映射
  if (lunarData[year]) {
    const lunarMonths = lunarData[year];
    
    // 找到对应的农历月份
    for (let i = 0; i < lunarMonths.length; i++) {
      const lunarMonth = lunarMonths[i][0] as number;
      const lunarDay = lunarMonths[i][1] as number;
      const isLeap = lunarMonths[i][2] as boolean;
      
      const nextMonth = lunarMonths[i + 1] || [13, 32, false];
      const nextMonthNum = nextMonth[0] as number;
      const nextMonthDay = nextMonth[1] as number;
      
      const currentDate = new Date(year, month - 1, day);
      const lunarStartDate = new Date(year, lunarMonth - 1, lunarDay);
      const lunarEndDate = new Date(year, nextMonthNum - 1, nextMonthDay);
      
      if (currentDate >= lunarStartDate && currentDate < lunarEndDate) {
        return {
          year,
          month: lunarMonth,
          day: day - lunarDay + 1,
          isLeap
        };
      }
    }
  }
  
  // 默认返回
  return {
    year,
    month: 1,
    day: 1,
    isLeap: false
  };
}

// 农历转公历
export function lunarToSolar(lunarDate: LunarDate): SolarDate {
  const { year, month, day, isLeap } = lunarDate;
  
  // 简化实现，实际应用中需要更复杂的算法
  if (lunarData[year]) {
    const lunarMonths = lunarData[year];
    
    // 找到对应的农历月份
    for (let i = 0; i < lunarMonths.length; i++) {
      const lunarMonth = lunarMonths[i][0] as number;
      const lunarDay = lunarMonths[i][1] as number;
      const isLeapMonth = lunarMonths[i][2] as boolean;
      
      if (lunarMonth === month && isLeapMonth === isLeap) {
        const solarDay = (lunarDay as number) + day - 1;
        return {
          year,
          month: lunarMonth,
          day: solarDay,
          hour: 0,
          minute: 0,
          second: 0
        };
      }
    }
  }
  
  // 默认返回
  return {
    year,
    month: 1,
    day: 1,
    hour: 0,
    minute: 0,
    second: 0
  };
}

