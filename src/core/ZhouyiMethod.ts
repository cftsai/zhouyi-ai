import { FortuneResult, FortuneMethod, ZhouyiHexagram, HexagramLine } from '../interfaces';
import { BaseFortuneMethod } from './FortuneTeller';

const hexagramData: [string, string][] = [
  ['111111', '乾'], ['000000', '坤'], ['100010', '屯'], ['010001', '蒙'],
  ['111010', '需'], ['010111', '讼'], ['000010', '师'], ['010000', '比'],
  ['111011', '小畜'], ['110111', '履'], ['111000', '泰'], ['000111', '否'],
  ['101111', '同人'], ['111101', '大有'], ['001000', '谦'], ['000100', '豫'],
  ['011110', '随'], ['100110', '蛊'], ['110000', '临'], ['000011', '观'],
  ['100101', '噬嗑'], ['101001', '贲'], ['100000', '剥'], ['000001', '复'],
  ['100111', '无妄'], ['111001', '大畜'], ['100001', '颐'], ['011110', '大过'],
  ['010010', '坎'], ['101101', '离'], ['001110', '咸'], ['011100', '恒'],
  ['001111', '遁'], ['111100', '大壮'], ['000101', '晋'], ['101000', '明夷'],
  ['101011', '家人'], ['110101', '睽'], ['001010', '蹇'], ['010100', '解'],
  ['110001', '损'], ['100011', '益'], ['111110', '夬'], ['011111', '姤'],
  ['000110', '萃'], ['011000', '升'], ['010110', '困'], ['011010', '井'],
  ['101110', '革'], ['011101', '鼎'], ['100100', '震'], ['001001', '艮'],
  ['001011', '渐'], ['110100', '归妹'], ['101100', '丰'], ['001101', '旅'],
  ['011011', '巽'], ['110110', '兑'], ['010011', '涣'], ['110010', '节'],
  ['110011', '中孚'], ['001100', '小过'], ['101010', '既济'], ['010101', '未济']
];

const hexagramMap = new Map<string, string>(hexagramData);

const hexagramMeanings: Record<string, string> = {
  '乾': '元亨利贞，刚健中正', '坤': '元亨，利牝马之贞，厚德载物',
  '屯': '元亨利贞，勿用有攸往', '蒙': '亨，匪我求童蒙，童蒙求我',
  '需': '有孚光亨贞吉，利涉大川', '讼': '有孚窒惕中吉终凶',
  '师': '贞丈人吉无咎', '比': '吉，原筮元永贞无咎',
  '小畜': '亨，密云不雨', '履': '履虎尾不咥人亨',
  '泰': '小往大来吉亨', '否': '否之匪人不利君子贞',
  '同人': '同人于野亨', '大有': '元亨',
  '谦': '亨君子有终', '豫': '利建侯行师',
  '随': '元亨利贞无咎', '蛊': '元亨利涉大川',
  '临': '元亨利贞', '观': '盥而不荐有孚颙若',
  '噬嗑': '亨利用狱', '贲': '亨小利有攸往',
  '剥': '不利有攸往', '复': '亨出入无疾朋来无咎',
  '无妄': '元亨利贞', '大畜': '利贞不家食吉',
  '颐': '贞吉观颐自求口实', '大过': '栋桡利有攸往亨',
  '坎': '有孚维心亨行有尚', '离': '利贞亨畜牝牛吉',
  '咸': '亨利贞取女吉', '恒': '亨无咎利贞利有攸往',
  '遁': '亨小利贞', '大壮': '利贞',
  '晋': '康侯用锡马蕃庶', '明夷': '利艰贞',
  '家人': '利女贞', '睽': '小事吉',
  '蹇': '利西南不利东北', '解': '利西南无所往来复吉',
  '损': '有孚元吉无咎可贞', '益': '利有攸往利涉大川',
  '夬': '扬于王庭孚号有厉', '姤': '女壮勿用取女',
  '萃': '亨王假有庙', '升': '元亨用见大人',
  '困': '亨贞大人吉无咎', '井': '改邑不改井无丧无得',
  '革': '已日乃孚元亨利贞', '鼎': '元吉亨',
  '震': '亨震来虩虩笑言哑哑', '艮': '艮其背不获其身',
  '渐': '女归吉利贞', '归妹': '征凶无攸利',
  '丰': '亨王假之勿忧', '旅': '小亨旅贞吉',
  '巽': '小亨利有攸往', '兑': '亨利贞',
  '涣': '亨王假有庙', '节': '亨苦节不可贞',
  '中孚': '豚鱼吉利涉大川', '小过': '亨利贞可小事',
  '既济': '亨小利贞初吉终乱', '未济': '亨小狐汔济濡其尾'
};

const yaoTexts: Record<string, string[]> = {
  '乾': ['初九：潜龙勿用', '九二：见龙在田利见大人', '九三：君子终日乾乾夕惕若厉无咎', '九四：或跃在渊无咎', '九五：飞龙在天利见大人', '上九：亢龙有悔'],
  '坤': ['初六：履霜坚冰至', '六二：直方大不习无不利', '六三：含章可贞或从王事无成有终', '六四：括囊无咎无誉', '六五：黄裳元吉', '上六：龙战于野其血玄黄'],
  '泰': ['初九：拔茅茹以其汇征吉', '九二：包荒用冯河不遐遗朋亡得尚于中行', '九三：无平不陂无往不复艰贞无咎', '六四：翩翩不富以其邻不戒以孚', '六五：帝乙归妹以祉元吉', '上六：城复于隍勿用师自邑告命贞吝'],
  '否': ['初六：拔茅茹以其汇贞吉亨', '六二：包承小人吉大人否亨', '六三：包羞', '九四：有命无咎畴离祉', '九五：休否大人吉其亡其亡系于苞桑', '上九：倾否先否后喜']
};

export class ZhouyiMethod extends BaseFortuneMethod {
  constructor() {
    super('Zhouyi', 'Traditional Chinese Zhouyi divination method');
  }

  async execute(question: string): Promise<FortuneResult> {
    const hexagram = this.coinCastMethod();
    return {
      question,
      answer: this.generateAnswer(hexagram),
      method: this.name,
      timestamp: new Date(),
      details: hexagram
    };
  }

  coinCastMethod(): ZhouyiHexagram {
    const lines: HexagramLine[] = [];
    for (let i = 1; i <= 6; i++) {
      const coins = [
        Math.random() < 0.5 ? 2 : 3,
        Math.random() < 0.5 ? 2 : 3,
        Math.random() < 0.5 ? 2 : 3
      ];
      const sum = coins.reduce((a, b) => a + b, 0);
      const isYang = sum % 2 === 1;
      const isChanging = sum === 6 || sum === 9;
      lines.push({
        position: i,
        isChanging,
        text: isYang ? (isChanging ? '九（动）' : '九') : (isChanging ? '六（动）' : '六')
      });
    }
    const binaryStr = lines.map(l => (l.text.includes('九') ? '1' : '0')).join('');
    const name = hexagramMap.get(binaryStr) || '未知卦';
    const meaning = hexagramMeanings[name] || '';
    const trigrams = ['乾', '坤', '震', '巽', '坎', '离', '艮', '兑'];
    const upperLines = lines.slice(0, 3);
    const lowerLines = lines.slice(3);
    const upperTrigram = trigrams[this.getTrigramIndex(upperLines)] || '乾';
    const lowerTrigram = trigrams[this.getTrigramIndex(lowerLines)] || '乾';
    const changingLines = lines.filter(l => l.isChanging).map(l => l.position);
    const yaoTextArray = yaoTexts[name] || lines.map((l, i) => `第${i + 1}爻：${l.text}`);
    const detailedLines = lines.map((l, i) => ({
      ...l,
      text: yaoTextArray[i] || l.text
    }));
    let hexagramNumber = 0;
    for (const [key, val] of hexagramData) {
      hexagramNumber++;
      if (val === name) break;
    }
    return {
      upperTrigram,
      lowerTrigram,
      hexagramNumber,
      name,
      meaning,
      lines: detailedLines,
      changingLines
    };
  }

  yarrowStalkMethod(): ZhouyiHexagram {
    return this.coinCastMethod();
  }

  private getTrigramIndex(lines: HexagramLine[]): number {
    const binary = lines.map(l => l.text.includes('九') ? 1 : 0).join('');
    const trigramMap: Record<string, number> = {
      '111': 0, '110': 1, '101': 2, '100': 3,
      '011': 4, '010': 5, '001': 6, '000': 7
    };
    return trigramMap[binary] ?? 0;
  }

  private generateAnswer(hexagram: ZhouyiHexagram): string {
    const changingInfo = hexagram.changingLines && hexagram.changingLines.length > 0
      ? `动爻在第${hexagram.changingLines.join('、')}爻，`
      : '无动爻，';
    return `所得卦象为${hexagram.name}卦（第${hexagram.hexagramNumber}卦），${hexagram.meaning}。${changingInfo}卦辞曰：${hexagram.meaning}。${hexagram.lines ? hexagram.lines.filter(l => l.isChanging).map(l => l.text).join('；') : ''}`;
  }
}
