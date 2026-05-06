import { LiuYaoHexagram, LiuYaoLine, ManualCastInput, TimeCastInput } from '../interfaces';

const yaoTexts: Record<string, string[]> = {
  '乾': ['初九：潜龙勿用', '九二：见龙在田利见大人', '九三：君子终日乾乾夕惕若厉无咎', '九四：或跃在渊无咎', '九五：飞龙在天利见大人', '上九：亢龙有悔'],
  '坤': ['初六：履霜坚冰至', '六二：直方大不习无不利', '六三：含章可贞或从王事无成有终', '六四：括囊无咎无誉', '六五：黄裳元吉', '上六：龙战于野其血玄黄'],
  '屯': ['初九：磐桓利居贞利建侯', '六二：屯如邅如乘马班如匪寇婚媾女子贞不字十年乃字', '六三：即鹿无虞惟入于林中君子几不如舍往吝', '六四：乘马班如求婚媾往吉无不利', '九五：屯其膏小贞吉大贞凶', '上六：乘马班如泣血涟如'],
  '蒙': ['初六：发蒙利用刑人用说桎梏以往吝', '九二：包蒙吉纳妇吉子克家', '六三：勿用取女见金夫不有躬无攸利', '六四：困蒙吝', '六五：童蒙吉', '上九：击蒙不利为寇利御寇'],
  '需': ['初九：需于郊利用恒无咎', '九二：需于沙小有言终吉', '九三：需于泥致寇至', '六四：需于血出自穴', '九五：需于酒食贞吉', '上六：入于穴有不速之客三人来敬之终吉'],
  '讼': ['初六：不永所事小有言终吉', '九二：不克讼归而逋其邑人三百户无眚', '六三：食旧德贞厉终吉或从王事无成', '九四：不克讼复即命渝安贞吉', '九五：讼元吉', '上六：或锡之鞶带终朝三褫之'],
  '师': ['初六：师出以律否臧凶', '九二：在师中吉无咎王三锡命', '六三：师或舆尸凶', '六四：师左次无咎', '六五：田有禽利执言无咎长子帅师弟子舆尸贞凶', '上六：大君有命开国承家小人勿用'],
  '比': ['初六：有孚比之无咎有孚盈缶终来有他吉', '六二：比之自内贞吉', '六三：比之匪人', '六四：外比之贞吉', '九五：显比王用三驱失前禽邑人不诫吉', '上六：比之无首凶'],
  '小畜': ['初九：复自道何其咎吉', '九二：牵复吉', '九三：舆说辐夫妻反目', '六四：有孚血去惕出无咎', '九五：有孚挛如富以其邻', '上九：既雨既处尚德载妇贞厉月几望君子征凶'],
  '履': ['初九：素履往无咎', '九二：履道坦坦幽人贞吉', '六三：眇能视跛能履履虎尾咥人凶武人为于大君', '九四：履虎尾愬愬终吉', '九五：夬履贞厉', '上九：视履考祥其旋元吉'],
  '泰': ['初九：拔茅茹以其汇征吉', '九二：包荒用冯河不遐遗朋亡得尚于中行', '九三：无平不陂无往不复艰贞无咎', '六四：翩翩不富以其邻不戒以孚', '六五：帝乙归妹以祉元吉', '上六：城复于隍勿用师自邑告命贞吝'],
  '否': ['初六：拔茅茹以其汇贞吉亨', '六二：包承小人吉大人否亨', '六三：包羞', '九四：有命无咎畴离祉', '九五：休否大人吉其亡其亡系于苞桑', '上九：倾否先否后喜'],
  '同人': ['初九：同人于门无咎', '六二：同人于宗吝', '九三：伏戎于莽升其高陵三岁不兴', '九四：乘其墉弗克攻吉', '九五：同人先号啕而后笑大师克相遇', '上九：同人于郊无悔'],
  '大有': ['初九：无交害匪咎艰则无咎', '九二：大车以载有攸往无咎', '九三：公用亨于天子小人弗克', '九四：匪其彭无咎', '六五：厥孚交如威如吉', '上九：自天佑之吉无不利'],
  '谦': ['初六：谦谦君子用涉大川吉', '六二：鸣谦贞吉', '九三：劳谦君子有终吉', '六四：无不利撝谦', '六五：不富以其邻利用侵伐无不利', '上六：鸣谦利用行师征邑国'],
  '豫': ['初六：鸣豫凶', '六二：介于石不终日贞吉', '六三：盱豫悔迟有悔', '九四：由豫大有得勿疑朋盍簪', '六五：贞疾恒不死', '上六：冥豫成有渝无咎'],
  '随': ['初九：官有渝贞吉出门交有功', '六二：系小子失丈夫', '六三：系丈夫失小子随有求得利居贞', '九四：随有获贞凶有孚在道以明何咎', '九五：孚于嘉吉', '上六：拘系之乃从维之王用亨于西山'],
  '蛊': ['初六：干父之蛊有子考无咎厉终吉', '九二：干母之蛊不可贞', '九三：干父之蛊小有悔无大咎', '六四：裕父之蛊往见吝', '六五：干父之蛊用誉', '上九：不事王侯高尚其事'],
  '临': ['初九：咸临贞吉', '九二：咸临吉无不利', '六三：甘临无攸利既忧之无咎', '六四：至临无咎', '六五：知临大君之宜吉', '上六：敦临吉无咎'],
  '观': ['初六：童观小人无咎君子吝', '六二：窥观利女贞', '六三：观我生进退', '六四：观国之光利用宾于王', '九五：观我生君子无咎', '上九：观其生君子无咎'],
  '噬嗑': ['初九：屦校灭趾无咎', '六二：噬肤灭鼻无咎', '六三：噬腊肉遇毒小吝无咎', '九四：噬乾胏得金矢利艰贞吉', '六五：噬乾肉得黄金贞厉无咎', '上九：何校灭耳凶'],
  '贲': ['初九：贲其趾舍车而徒', '六二：贲其须', '九三：贲如濡如永贞吉', '六四：贲如皤如白马翰如匪寇婚媾', '六五：贲于丘园束帛戋戋吝终吉', '上九：白贲无咎'],
  '剥': ['初六：剥床以足蔑贞凶', '六二：剥床以辨蔑贞凶', '六三：剥之无咎', '六四：剥床以肤凶', '六五：贯鱼以宫人宠无不利', '上九：硕果不食君子得舆小人剥庐'],
  '复': ['初九：不远复无祇悔元吉', '六二：休复吉', '六三：频复厉无咎', '六四：中行独复', '六五：敦复无悔', '上六：迷复凶有灾眚用行师终有大败以其国君凶至于十年不克征'],
  '无妄': ['初九：无妄往吉', '六二：不耕获不菑畲则利有攸往', '六三：无妄之灾或系于牛行人之得邑人之灾', '九四：可贞无咎', '九五：无妄之疾勿药有喜', '上九：无妄行有眚无攸利'],
  '大畜': ['初九：有厉利已', '九二：舆说輹', '九三：良马逐利艰贞曰闲舆卫利有攸往', '六四：童牛之牿元吉', '六五：豮豕之牙吉', '上九：何天之衢亨'],
  '颐': ['初九：舍尔灵龟观我朵颐凶', '六二：颠颐拂经于丘颐征凶', '六三：拂颐贞凶十年勿用无攸利', '六四：颠颐吉虎视眈眈其欲逐逐无咎', '六五：拂经居贞吉不可涉大川', '上九：由颐厉吉利涉大川'],
  '大过': ['初六：藉用白茅无咎', '九二：枯杨生稊老夫得其女妻无不利', '九三：栋桡凶', '九四：栋隆吉有它吝', '九五：枯杨生华老妇得其士夫无咎无誉', '上六：过涉灭顶凶无咎'],
  '坎': ['初六：习坎入于坎窞凶', '九二：坎有险求小得', '六三：来之坎坎险且枕入于坎窞勿用', '六四：樽酒簋贰用缶纳约自牖终无咎', '九五：坎不盈祗既平无咎', '上六：系用徽纆寘于丛棘三岁不得凶'],
  '离': ['初九：履错然敬之无咎', '六二：黄离元吉', '九三：日昃之离不鼓缶而歌则大耋之嗟凶', '九四：突如其来如焚如死如弃如', '六五：出涕沱若戚嗟若吉', '上九：王用出征有嘉折首获匪其丑无咎'],
  '咸': ['初六：咸其拇', '六二：咸其腓凶居吉', '九三：咸其股执其随往吝', '九四：贞吉悔亡憧憧往来朋从尔思', '九五：咸其脢无悔', '上六：咸其辅颊舌'],
  '恒': ['初六：浚恒贞凶无攸利', '九二：悔亡', '九三：不恒其德或承之羞贞吝', '九四：田无禽', '六五：恒其德贞妇人吉夫子凶', '上六：振恒凶'],
  '遁': ['初六：遁尾厉勿用有攸往', '六二：执之用黄牛之革莫之胜说', '九三：系遁有疾厉畜臣妾吉', '九四：好遁君子吉小人否', '九五：嘉遁贞吉', '上九：肥遁无不利'],
  '大壮': ['初九：壮于趾征凶有孚', '九二：贞吉', '九三：小人用壮君子用罔贞厉羝羊触藩羸其角', '九四：贞吉悔亡藩决不羸壮于大舆之輹', '六五：丧羊于易无悔', '上六：羝羊触藩不能退不能遂无攸利艰则吉'],
  '晋': ['初六：晋如摧如贞吉罔孚裕无咎', '六二：晋如愁如贞吉受兹介福于其王母', '六三：众允悔亡', '九四：晋如硕鼠贞厉', '六五：悔亡失得勿恤往吉无不利', '上九：晋其角维用伐邑厉吉无咎贞吝'],
  '明夷': ['初九：明夷于飞垂其翼君子于行三日不食有攸往主人有言', '六二：明夷夷于左股用拯马壮吉', '九三：明夷于南狩得其大首不可疾贞', '六四：入于左腹获明夷之心于出门庭', '六五：箕子之明夷利贞', '上六：不明晦初登于天后入于地'],
  '家人': ['初九：闲有家悔亡', '六二：无攸遂在中馈贞吉', '九三：家人嗃嗃悔厉吉妇子嘻嘻终吝', '六四：富家大吉', '九五：王假有家勿恤吉', '上九：有孚威如终吉'],
  '睽': ['初九：悔亡丧马勿逐自复见恶人无咎', '九二：遇主于巷无咎', '六三：见舆曳其牛掣其人天且劓无初有终', '九四：睽孤遇元夫交孚厉无咎', '六五：悔亡厥宗噬肤往何咎', '上九：睽孤见豕负涂载鬼一车先张之弧后说之弧匪寇婚媾往遇雨则吉'],
  '蹇': ['初六：往蹇来誉', '九二：王臣蹇蹇匪躬之故', '九三：往蹇来反', '六四：往蹇来连', '九五：大蹇朋来', '上六：往蹇来硕吉利建侯'],
  '解': ['初六：无咎', '九二：田获三狐得黄矢贞吉', '六三：负且乘致寇至贞吝', '九四：解而拇朋至斯孚', '六五：君子维有解吉有孚于小人', '上六：公用射隼于高墉之上获之无不利'],
  '损': ['初九：已事遄往无咎酌损之', '九二：利贞征凶弗损益之', '六三：三人行则损一人一人行则得其友', '六四：损其疾使遄有喜无咎', '六五：或益之十朋之龟弗克违元吉', '上九：弗损益之无咎贞吉利有攸往得臣无家'],
  '益': ['初九：利用为大作元吉无咎', '六二：或益之十朋之龟弗克违永贞吉王用享于帝吉', '六三：益之用凶事无咎有孚中行告公用圭', '六四：中行告公从利用为依迁国', '九五：有孚惠心勿问元吉有孚惠我德', '上九：莫益之或击之立心勿恒凶'],
  '夬': ['初九：壮于前趾往不胜为咎', '九二：惕号莫夜有戎勿恤', '九三：壮于頄有凶君子夬夬独行遇雨若濡有愠无咎', '九四：臀无肤其行次且牵羊悔亡闻言不信', '九五：苋陆夬夬中行无咎', '上六：无号终有凶'],
  '姤': ['初六：系于金柅贞吉有攸往见凶羸豕孚蹢躅', '九二：包有鱼无咎不利宾', '九三：臀无肤其行次且厉无大咎', '九四：包无鱼起凶', '九五：以杞包瓜含章有陨自天', '上九：姤其角吝无咎'],
  '萃': ['初六：有孚不终乃乱乃萃若号一握为笑勿恤往无咎', '六二：引吉无咎孚乃利用禴', '六三：萃如嗟如无攸利往无咎小吝', '九四：大吉无咎', '九五：萃有位无咎匪孚元永贞悔亡', '上六：赍咨涕洟无咎'],
  '升': ['初六：允升大吉', '九二：孚乃利用禴无咎', '九三：升虚邑', '六四：王用亨于岐山吉无咎', '六五：贞吉升阶', '上六：冥升利于不息之贞'],
  '困': ['初六：臀困于株木入于幽谷三岁不觌', '九二：困于酒食朱绂方来利用享祀征凶无咎', '六三：困于石据于蒺藜入于其宫不见其妻凶', '九四：来徐徐困于金车吝有终', '九五：劓刖困于赤绂乃徐有说利用祭祀', '上六：困于葛藟于臲卼曰动悔有悔征吉'],
  '井': ['初六：井泥不食旧井无禽', '九二：井谷射鲋瓮敝漏', '九三：井渫不食为我心恻可用汲王明并受其福', '六四：井甃无咎', '九五：井冽寒泉食', '上六：井收勿幕有孚元吉'],
  '革': ['初九：巩用黄牛之革', '六二：已日乃革之征吉无咎', '九三：征凶贞厉革言三就有孚', '九四：悔亡有孚改命吉', '九五：大人虎变未占有孚', '上六：君子豹变小人革面征凶居贞吉'],
  '鼎': ['初六：鼎颠趾利出否得妾以其子无咎', '九二：鼎有实我仇有疾不我能即吉', '九三：鼎耳革其行塞雉膏不食方雨亏悔终吉', '九四：鼎折足覆公餗其形渥凶', '六五：鼎黄耳金铉利贞', '上九：鼎玉铉大吉无不利'],
  '震': ['初九：震来虩虩笑言哑哑震惊百里不丧匕鬯', '六二：震来厉亿丧贝跻于九陵勿逐七日得', '六三：震苏苏震行无眚', '九四：震遂泥', '六五：震往来厉亿无丧有事', '上六：震索索视矍矍征凶震不于其躬于其邻无咎婚媾有言'],
  '艮': ['初六：艮其趾无咎利永贞', '六二：艮其腓不拯其随其心不快', '九三：艮其限列其夤厉熏心', '六四：艮其身无咎', '六五：艮其辅言有序悔亡', '上九：敦艮吉'],
  '渐': ['初六：鸿渐于干小子厉有言无咎', '六二：鸿渐于磐饮食衎衎吉', '九三：鸿渐于陆夫征不复妇孕不育凶利御寇', '六四：鸿渐于木或得其桷无咎', '九五：鸿渐于陵妇三岁不孕终莫之胜吉', '上九：鸿渐于陆其羽可用为仪吉'],
  '归妹': ['初九：归妹以娣跛能履征吉', '九二：眇能视利幽人之贞', '六三：归妹以须反归以娣', '九四：归妹愆期迟归有时', '六五：帝乙归妹其君之袂不如其娣之袂良月几望吉', '上六：女承筐无实士刲羊无血无攸利'],
  '丰': ['初九：遇其配主虽旬无咎往有尚', '六二：丰其蔀日中见斗往得疑疾有孚发若吉', '九三：丰其沛日中见沫折其右肱无咎', '九四：丰其蔀日中见斗遇其夷主吉', '六五：来章有庆誉吉', '上六：丰其屋蔀其家窥其户阒其无人三岁不觌凶'],
  '旅': ['初六：旅琐琐斯其所取灾', '六二：旅即次怀其资得童仆贞', '九三：旅焚其次丧其童仆贞厉', '九四：旅于处得其资斧我心不快', '六五：射雉一矢亡终以誉命', '上九：鸟焚其巢旅人先笑后号啕丧牛于易凶'],
  '巽': ['初六：进退利武人之贞', '九二：巽在床下用史巫纷若吉无咎', '九三：频巽吝', '六四：悔亡田获三品', '九五：贞吉悔亡无不利无初有终先庚三日后庚三日吉', '上九：巽在床下丧其资斧贞凶'],
  '兑': ['初九：和兑吉', '九二：孚兑吉悔亡', '六三：来兑凶', '九四：商兑未宁介疾有喜', '九五：孚于剥有厉', '上六：引兑'],
  '涣': ['初六：用拯马壮吉', '九二：涣奔其机悔亡', '六三：涣其躬无悔', '六四：涣其群元吉涣有丘匪夷所思', '九五：涣汗其大号涣王居无咎', '上九：涣其血去逖出无咎'],
  '节': ['初九：不出户庭无咎', '九二：不出门庭凶', '六三：不节若则嗟若无咎', '六四：安节亨', '九五：甘节吉往有尚', '上六：苦节贞凶悔亡'],
  '中孚': ['初九：虞吉有他不燕', '九二：鸣鹤在阴其子和之我有好爵吾与尔靡之', '六三：得敌或鼓或罢或泣或歌', '六四：月几望马匹亡无咎', '九五：有孚挛如无咎', '上九：翰音登于天贞凶'],
  '小过': ['初六：飞鸟以凶', '六二：过其祖遇其妣不及其君遇其臣无咎', '九三：弗过防之从或戕之凶', '九四：无咎弗过遇之往厉必戒勿用永贞', '六五：密云不雨自我西郊公弋取彼在穴', '上六：弗遇过之飞鸟离之凶是谓灾眚'],
  '既济': ['初九：曳其轮濡其尾无咎', '六二：妇丧其茀勿逐七日得', '九三：高宗伐鬼方三年克之小人勿用', '六四：繻有衣袽终日戒', '九五：东邻杀牛不如西邻之禴祭实受其福', '上六：濡其首厉'],
  '未济': ['初六：濡其尾吝', '九二：曳其轮贞吉', '六三：未济征凶利涉大川', '九四：贞吉悔亡震用伐鬼方三年有赏于大国', '六五：贞吉无悔君子之光有孚吉', '上九：有孚于饮酒无咎濡其首有孚失是']
};

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
        text: '' // 先留空，后面在 calculateHexagram 中填充
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
        text: '' // 先留空，后面在 calculateHexagram 中填充
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

    // 按卦名获取爻辞并填充到 lines 中
    const yaoTextArray = yaoTexts[hexagram?.name || '乾'] || [];
    const detailedLines = lines.map((line, i) => ({
      ...line,
      text: yaoTextArray[i] || (line.yinYang === 'yang' ? `初九` : `初六`)
    }));

    return {
      upperTrigram: upperTrigram.name,
      lowerTrigram: lowerTrigram.name,
      hexagramNumber,
      name: hexagram?.name || '',
      meaning: hexagram?.meaning || '',
      lines: detailedLines,
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
      '1-8': 12, '2-8': 45, '3-8': 61, '4-8': 32, '5-8': 41, '6-8': 7, '7-8': 8, '8-8': 64
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

    // 通过卦序反查上下卦组合
    const map = this.getHexagramMap();
    let upperNum = 1;
    let lowerNum = 1;
    for (const [key, num] of Object.entries(map)) {
      if (num === hexagramNumber) {
        const parts = key.split('-').map(Number);
        upperNum = parts[0];
        lowerNum = parts[1];
        break;
      }
    }

    const upperTrigram = this.trigrams[upperNum - 1];
    const lowerTrigram = this.trigrams[lowerNum - 1];
    const lowerLines = this.getLinesFromTrigram(lowerTrigram, 1);
    const upperLines = this.getLinesFromTrigram(upperTrigram, 4);
    const lines = [...lowerLines, ...upperLines];

    // 按卦名获取爻辞
    const yaoTextArray = yaoTexts[hexagram.name] || [];
    const detailedLines = lines.map((line, i) => ({
      ...line,
      text: yaoTextArray[i] || line.text
    }));

    return {
      upperTrigram: upperTrigram.name,
      lowerTrigram: lowerTrigram.name,
      hexagramNumber,
      name: hexagram.name,
      meaning: hexagram.meaning,
      lines: detailedLines,
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
      '1-8': 12, '2-8': 45, '3-8': 61, '4-8': 32, '5-8': 41, '6-8': 7, '7-8': 8, '8-8': 64
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
        text: '' // 先留空，在 getHexagramInfo 中填充
      });
    }
    
    return lines;
  }
}

export default LiuYaoCalculator;
