import { LiuYaoHexagram, LiuYaoLine, ManualCastInput, TimeCastInput } from '../interfaces';

class LiuYaoCalculator {
  private trigrams = [
    { name: '乾', symbol: '☰', number: 1, meaning: '天' },
    { name: '兑', symbol: '☱', number: 2, meaning: '泽' },
    { name: '离', symbol: '☲', number: 3, meaning: '火' },
    { name: '震', symbol: '☳', number: 4, meaning: '雷' },
    { name: '巽', symbol: '☴', number: 5, meaning: '风' },
    { name: '坎', symbol: '☵', number: 6, meaning: '水' },
    { name: '艮', symbol: '☶', number: 7, meaning: '山' },
    { name: '坤', symbol: '☷', number: 8, meaning: '地' }
  ];

  private hexagrams = [
    { number: 1, name: '乾', meaning: '元亨利贞' },
    { number: 2, name: '坤', meaning: '元亨，利牝马之贞' },
    { number: 3, name: '屯', meaning: '元亨利贞，勿用有攸往' },
    { number: 4, name: '蒙', meaning: '亨。匪我求童蒙，童蒙求我' },
    { number: 5, name: '需', meaning: '有孚，光亨，贞吉' },
    { number: 6, name: '讼', meaning: '有孚窒惕，中吉，终凶' },
    { number: 7, name: '师', meaning: '贞，丈人吉，无咎' },
    { number: 8, name: '比', meaning: '吉。原筮元永贞，无咎' },
    { number: 9, name: '小畜', meaning: '亨。密云不雨，自我西郊' },
    { number: 10, name: '履', meaning: '履虎尾，不咥人，亨' },
    { number: 11, name: '泰', meaning: '小往大来，吉亨' },
    { number: 12, name: '否', meaning: '否之匪人，不利君子贞' },
    { number: 13, name: '同人', meaning: '同人于野，亨' },
    { number: 14, name: '大有', meaning: '元亨' },
    { number: 15, name: '谦', meaning: '亨，君子有终' },
    { number: 16, name: '豫', meaning: '利建侯行师' },
    { number: 17, name: '随', meaning: '元亨利贞，无咎' },
    { number: 18, name: '蛊', meaning: '元亨，利涉大川' },
    { number: 19, name: '临', meaning: '元亨利贞，至于八月有凶' },
    { number: 20, name: '观', meaning: '盥而不荐，有孚颙若' },
    { number: 21, name: '噬嗑', meaning: '亨。利用狱' },
    { number: 22, name: '贲', meaning: '亨。小利有攸往' },
    { number: 23, name: '剥', meaning: '不利有攸往' },
    { number: 24, name: '复', meaning: '亨。出入无疾，朋来无咎' },
    { number: 25, name: '无妄', meaning: '元亨利贞。其匪正有眚，不利有攸往' },
    { number: 26, name: '大畜', meaning: '利贞，不家食吉' },
    { number: 27, name: '颐', meaning: '贞吉。观颐，自求口实' },
    { number: 28, name: '大过', meaning: '栋桡，利有攸往，亨' },
    { number: 29, name: '坎', meaning: '有孚，维心亨，行有尚' },
    { number: 30, name: '离', meaning: '利贞，亨' },
    { number: 31, name: '咸', meaning: '亨，利贞，取女吉' },
    { number: 32, name: '恒', meaning: '亨，无咎，利贞，利有攸往' },
    { number: 33, name: '遁', meaning: '亨，小利贞' },
    { number: 34, name: '大壮', meaning: '利贞' },
    { number: 35, name: '晋', meaning: '康侯用锡马蕃庶，昼日三接' },
    { number: 36, name: '明夷', meaning: '利艰贞' },
    { number: 37, name: '家人', meaning: '利女贞' },
    { number: 38, name: '睽', meaning: '小事吉' },
    { number: 39, name: '蹇', meaning: '利西南，不利东北' },
    { number: 40, name: '解', meaning: '利西南。无所往，其来复吉' },
    { number: 41, name: '损', meaning: '有孚，元吉，无咎，可贞' },
    { number: 42, name: '益', meaning: '利有攸往，利涉大川' },
    { number: 43, name: '夬', meaning: '扬于王庭，孚号有厉' },
    { number: 44, name: '姤', meaning: '女壮，勿用取女' },
    { number: 45, name: '萃', meaning: '亨，王假有庙' },
    { number: 46, name: '升', meaning: '元亨，用见大人' },
    { number: 47, name: '困', meaning: '亨，贞，大人吉' },
    { number: 48, name: '井', meaning: '改邑不改井，无丧无得' },
    { number: 49, name: '革', meaning: '已日乃孚，元亨' },
    { number: 50, name: '鼎', meaning: '元吉，亨' },
    { number: 51, name: '震', meaning: '亨。震来虩虩，笑言哑哑' },
    { number: 52, name: '艮', meaning: '艮其背，不获其身' },
    { number: 53, name: '渐', meaning: '女归吉，利贞' },
    { number: 54, name: '归妹', meaning: '征凶，无攸利' },
    { number: 55, name: '丰', meaning: '亨，王假之' },
    { number: 56, name: '旅', meaning: '小亨，旅贞吉' },
    { number: 57, name: '巽', meaning: '小亨，利有攸往' },
    { number: 58, name: '兑', meaning: '亨，利贞' },
    { number: 59, name: '涣', meaning: '亨，王假有庙' },
    { number: 60, name: '节', meaning: '亨，苦节不可贞' },
    { number: 61, name: '中孚', meaning: '豚鱼吉，利涉大川' },
    { number: 62, name: '小过', meaning: '亨，利贞' },
    { number: 63, name: '既济', meaning: '亨，小利贞' },
    { number: 64, name: '未济', meaning: '亨，小狐汔济' }
  ];

  private lineTexts = [
    '初九：潜龙勿用',
    '九二：见龙在田，利见大人',
    '九三：君子终日乾乾，夕惕若厉，无咎',
    '九四：或跃在渊，无咎',
    '九五：飞龙在天，利见大人',
    '上九：亢龙有悔',
    '初六：履霜，坚冰至',
    '六二：直方大，不习无不利',
    '六三：含章可贞，或从王事，无成有终',
    '六四：括囊，无咎无誉',
    '六五：黄裳，元吉',
    '上六：龙战于野，其血玄黄'
  ];

  /**
   * 手动起卦
   * @param input 三次掷币结果
   * @returns 六爻卦象
   */
  manualCast(input: ManualCastInput): LiuYaoHexagram {
    const lines: LiuYaoLine[] = [];
    const allResults = [...input.first, ...input.second, ...input.third];

    for (let i = 0; i < 6; i++) {
      const result = allResults[i];
      const isChanging = result === 3 || result === 6;
      const yinYang = result % 2 === 1 ? 'yang' : 'yin';
      
      lines.push({
        position: i + 1,
        isChanging,
        yinYang,
        text: this.lineTexts[i + (yinYang === 'yang' ? 0 : 6)]
      });
    }

    return this.calculateHexagram(lines);
  }

  /**
   * 时间起卦
   * @param input 时间输入
   * @returns 六爻卦象
   */
  timeCast(input: TimeCastInput): LiuYaoHexagram {
    const { year, month, day, hour, minute } = input;
    const total = year + month + day + hour + minute;
    const upper = total % 8;
    const lower = (total + upper) % 8;
    const movingLine = (total % 6) + 1;

    const lines: LiuYaoLine[] = [];
    for (let i = 1; i <= 6; i++) {
      const isChanging = i === movingLine;
      const yinYang = (i % 2 === 1) ? 'yang' : 'yin';
      
      lines.push({
        position: i,
        isChanging,
        yinYang,
        text: this.lineTexts[i - 1 + (yinYang === 'yang' ? 0 : 6)]
      });
    }

    return this.calculateHexagram(lines);
  }

  /**
   * 计算卦象
   * @param lines 爻线
   * @returns 六爻卦象
   */
  private calculateHexagram(lines: LiuYaoLine[]): LiuYaoHexagram {
    const upperLines = lines.slice(0, 3);
    const lowerLines = lines.slice(3);
    
    const upperTrigram = this.getTrigram(upperLines);
    const lowerTrigram = this.getTrigram(lowerLines);
    
    const hexagramNumber = this.getHexagramNumber(upperTrigram.number, lowerTrigram.number);
    const hexagram = this.hexagrams.find(h => h.number === hexagramNumber);
    
    const changingLines = lines.filter(line => line.isChanging).map(line => line.position);
    const transformedHexagram = changingLines.length > 0 ? this.getTransformedHexagram(lines) : undefined;

    return {
      upperTrigram: upperTrigram.name,
      lowerTrigram: lowerTrigram.name,
      hexagramNumber,
      name: hexagram?.name || '',
      meaning: hexagram?.meaning || '',
      lines,
      changingLines,
      transformedHexagram
    };
  }

  /**
   * 获取卦象
   * @param lines 爻线
   * @returns 卦象
   */
  private getTrigram(lines: LiuYaoLine[]): { name: string; symbol: string; number: number; meaning: string } {
    let value = 0;
    for (let i = 0; i < 3; i++) {
      value += (lines[i].yinYang === 'yang' ? 1 : 0) * Math.pow(2, 2 - i);
    }
    return this.trigrams[value] || this.trigrams[0];
  }

  /**
   * 获取卦序号
   * @param upper 上卦序号
   * @param lower 下卦序号
   * @returns 卦序号
   */
  private getHexagramNumber(upper: number, lower: number): number {
    const hexagramMap: { [key: string]: number } = {
      '1-1': 1, '2-1': 43, '3-1': 14, '4-1': 34, '5-1': 9, '6-1': 5, '7-1': 3, '8-1': 2,
      '1-2': 10, '2-2': 58, '3-2': 21, '4-2': 27, '5-2': 35, '6-2': 63, '7-2': 49, '8-2': 16,
      '1-3': 19, '2-3': 36, '3-3': 30, '4-3': 55, '5-3': 22, '6-3': 38, '7-3': 52, '8-3': 23,
      '1-4': 51, '2-4': 54, '3-4': 24, '4-4': 42, '5-4': 28, '6-4': 17, '7-4': 44, '8-4': 20,
      '1-5': 62, '2-5': 47, '3-5': 13, '4-5': 25, '5-5': 57, '6-5': 37, '7-5': 31, '8-5': 15,
      '1-6': 60, '2-6': 48, '3-6': 29, '4-6': 40, '5-6': 46, '6-6': 64, '7-6': 59, '8-6': 4,
      '1-7': 33, '2-7': 50, '3-7': 11, '4-7': 53, '5-7': 26, '6-7': 39, '7-7': 56, '8-7': 18,
      '1-8': 12, '2-8': 45, '3-8': 61, '4-8': 32, '5-8': 41, '6-8': 7, '7-8': 8, '8-8': 6
    };
    return hexagramMap[`${upper}-${lower}`] || 1;
  }

  /**
   * 获取变卦
   * @param originalLines 原爻线
   * @returns 变卦
   */
  private getTransformedHexagram(originalLines: LiuYaoLine[]): LiuYaoHexagram {
    const transformedLines = originalLines.map(line => ({
      ...line,
      isChanging: false,
      yinYang: line.isChanging ? (line.yinYang === 'yang' ? 'yin' : 'yang') : line.yinYang
    }));
    return this.calculateHexagram(transformedLines);
  }

  /**
   * 查询卦象信息
   * @param hexagramNumber 卦序号
   * @returns 卦象信息
   */
  getHexagramInfo(hexagramNumber: number): LiuYaoHexagram | null {
    const hexagram = this.hexagrams.find(h => h.number === hexagramNumber);
    if (!hexagram) return null;

    // 直接返回卦象信息，不通过计算
    return {
      upperTrigram: '乾',
      lowerTrigram: '乾',
      hexagramNumber,
      name: hexagram.name,
      meaning: hexagram.meaning,
      lines: [
        { position: 1, isChanging: false, yinYang: 'yang', text: '初九：潜龙勿用' },
        { position: 2, isChanging: false, yinYang: 'yang', text: '九二：见龙在田，利见大人' },
        { position: 3, isChanging: false, yinYang: 'yang', text: '九三：君子终日乾乾，夕惕若厉，无咎' },
        { position: 4, isChanging: false, yinYang: 'yang', text: '九四：或跃在渊，无咎' },
        { position: 5, isChanging: false, yinYang: 'yang', text: '九五：飞龙在天，利见大人' },
        { position: 6, isChanging: false, yinYang: 'yang', text: '上九：亢龙有悔' }
      ],
      changingLines: [],
      transformedHexagram: undefined
    };
  }

  /**
   * 获取卦象映射
   * @returns 卦象映射
   */
  private getHexagramMap(): { [key: string]: number } {
    return {
      '1-1': 1, '2-1': 43, '3-1': 14, '4-1': 34, '5-1': 9, '6-1': 5, '7-1': 3, '8-1': 2,
      '1-2': 10, '2-2': 58, '3-2': 21, '4-2': 27, '5-2': 35, '6-2': 63, '7-2': 49, '8-2': 16,
      '1-3': 19, '2-3': 36, '3-3': 30, '4-3': 55, '5-3': 22, '6-3': 38, '7-3': 52, '8-3': 23,
      '1-4': 51, '2-4': 54, '3-4': 24, '4-4': 42, '5-4': 28, '6-4': 17, '7-4': 44, '8-4': 20,
      '1-5': 62, '2-5': 47, '3-5': 13, '4-5': 25, '5-5': 57, '6-5': 37, '7-5': 31, '8-5': 15,
      '1-6': 60, '2-6': 48, '3-6': 29, '4-6': 40, '5-6': 46, '6-6': 64, '7-6': 59, '8-6': 4,
      '1-7': 33, '2-7': 50, '3-7': 11, '4-7': 53, '5-7': 26, '6-7': 39, '7-7': 56, '8-7': 18,
      '1-8': 12, '2-8': 45, '3-8': 61, '4-8': 32, '5-8': 41, '6-8': 7, '7-8': 8, '8-8': 6
    };
  }

  /**
   * 从卦象生成爻线
   * @param trigram 卦象
   * @param startPosition 起始位置
   * @returns 爻线
   */
  private getLinesFromTrigram(trigram: { name: string; symbol: string; number: number; meaning: string }, startPosition: number): LiuYaoLine[] {
    const lines: LiuYaoLine[] = [];
    
    const trigramNumber = trigram.number;
    const yinYangMap: { [key: number]: ('yang' | 'yin')[] } = {
      1: ['yang', 'yang', 'yang'],  // 乾
      2: ['yang', 'yang', 'yin'],   // 兑
      3: ['yang', 'yin', 'yang'],   // 离
      4: ['yin', 'yang', 'yang'],   // 震
      5: ['yin', 'yin', 'yang'],    // 巽
      6: ['yin', 'yang', 'yin'],    // 坎
      7: ['yang', 'yin', 'yin'],    // 艮
      8: ['yin', 'yin', 'yin']      // 坤
    };
    
    const yinYangValues = yinYangMap[trigramNumber] || ['yang', 'yang', 'yang'];
    
    for (let i = 0; i < 3; i++) {
      const yinYang = yinYangValues[i];
      lines.push({
        position: startPosition + i,
        isChanging: false,
        yinYang,
        text: this.lineTexts[startPosition + i - 1 + (yinYang === 'yang' ? 0 : 6)]
      });
    }
    
    return lines;
  }
}

export default LiuYaoCalculator;