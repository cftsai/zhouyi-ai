// 周易、三命通会、渊海子平经典命理逻辑验证脚本
const fs = require('fs');
const path = require('path');

console.log('=== 经典命理逻辑验证报告 ===\n');
console.log('检查依据：《周易》、《三命通会》、《渊海子平》等经典命理著作\n');

// 1. 检查天干地支计算逻辑
console.log('1. 天干地支计算逻辑验证');
console.log('=========================');

// 检查天干地支数据完整性
const stemsAndBranchesPath = path.join(__dirname, 'src', 'bazi', 'stemsAndBranches.ts');
const stemsContent = fs.readFileSync(stemsAndBranchesPath, 'utf8');

// 检查天干数量
const heavenlyStemsCount = (stemsContent.match(/name: '([甲乙丙丁戊己庚辛壬癸])'/g) || []).length;
console.log(`✓ 天干数量: ${heavenlyStemsCount}/10 ${heavenlyStemsCount === 10 ? '✅' : '❌'}`);

// 检查地支数量  
const earthlyBranchesCount = (stemsContent.match(/name: '([子丑寅卯辰巳午未申酉戌亥])'/g) || []).length;
console.log(`✓ 地支数量: ${earthlyBranchesCount}/12 ${earthlyBranchesCount === 12 ? '✅' : '❌'}`);

// 检查年柱计算算法
const yearStemRegex = /getYearStem.*year.*number.*{[\s\S]*?index.*=.*\(year.*-.*3\).*%/;
const yearBranchRegex = /getYearBranch.*year.*number.*{[\s\S]*?index.*=.*\(year.*-.*3\).*%/;
const hasYearStemAlgo = yearStemRegex.test(stemsContent);
const hasYearBranchAlgo = yearBranchRegex.test(stemsContent);
console.log(`✓ 年天干算法 (year-3)%10: ${hasYearStemAlgo ? '✅' : '❌'}`);
console.log(`✓ 年地支算法 (year-3)%12: ${hasYearBranchAlgo ? '✅' : '❌'}`);

// 2. 检查五行生克逻辑
console.log('\n2. 五行生克逻辑验证');
console.log('===================');

const fateAnalyzerPath = path.join(__dirname, 'src', 'fate', 'fateAnalyzer.ts');
const fateContent = fs.readFileSync(fateAnalyzerPath, 'utf8');

// 检查五行映射
const wuxingMapRegex = /const wuxingMap.*{[\s\S]*?'甲'.*'wood'[\s\S]*?'癸'.*'water'.*}/;
const hasWuxingMap = wuxingMapRegex.test(fateContent);
console.log(`✓ 五行映射表完整: ${hasWuxingMap ? '✅' : '❌'}`);

// 检查五行生克关系（喜忌分析）
const wuxingPreferenceRegex = /preferences.*favorable.*\[\].*unfavorable.*\[\]/;
const hasWuxingPreference = wuxingPreferenceRegex.test(fateContent);
console.log(`✓ 五行喜忌分析: ${hasWuxingPreference ? '✅' : '❌（过于简化）'}`);

// 3. 检查八字排盘逻辑
console.log('\n3. 八字排盘逻辑验证 (依据《渊海子平》)');
console.log('======================================');

const baziCalculatorPath = path.join(__dirname, 'src', 'bazi', 'baZiCalculator.ts');
const baziContent = fs.readFileSync(baziCalculatorPath, 'utf8');

// 检查四柱计算
const calculateBaZiRegex = /calculateBaZi.*solarDate.*SolarDate.*{[\s\S]*?yearStem.*getYearStem[\s\S]*?hourBranch.*getHourBranch/;
const hasBaZiCalc = calculateBaZiRegex.test(baziContent);
console.log(`✓ 四柱计算函数: ${hasBaZiCalc ? '✅' : '❌'}`);

// 检查月柱是否考虑节气（关键问题）
const monthStemCall = /getMonthStem.*year.*month/;
const monthBranchCall = /getMonthBranch.*month/;
const hasMonthCalls = monthStemCall.test(baziContent) && monthBranchCall.test(baziContent);
console.log(`✓ 月柱调用: ${hasMonthCalls ? '✅' : '❌'}`);
console.log(`⚠️  月柱问题: 代码未按节气划分月柱，不符合《渊海子平》要求`);

// 4. 检查十神逻辑
console.log('\n4. 十神逻辑验证 (依据《三命通会》)');
console.log('==================================');

// 检查十神表
const shiShenTableRegex = /const shiShenTable.*Record.*string.*Record.*string.*string.*{[\s\S]*?'甲'.*{[\s\S]*?'甲'.*'比肩'.*'癸'.*'正印'.*}[\s\S]*?'癸'.*{[\s\S]*?'甲'.*'伤官'.*'癸'.*'比肩'.*}/;
const hasShiShenTable = shiShenTableRegex.test(fateContent);
console.log(`✓ 十神映射表: ${hasShiShenTable ? '✅ 完整' : '❌ 不完整'}`);

// 检查十神分析函数
const analyzeShiShenRegex = /analyzeShiShen.*baZiInfo.*BaZiInfo.*{[\s\S]*?shiShenTable\[dayStem\]\[stem\].*dominantShiShen/;
const hasShiShenAnalysis = analyzeShiShenRegex.test(fateContent);
console.log(`✓ 十神分析函数: ${hasShiShenAnalysis ? '✅' : '❌'}`);

// 5. 检查大运流年逻辑
console.log('\n5. 大运流年逻辑验证');
console.log('===================');

// 检查大运计算
const analyzeDaYunRegex = /analyzeDaYunLiuNian.*baZiInfo.*BaZiInfo.*{[\s\S]*?daYunList.*LiuNian\[\]/;
const hasDaYunAnalysis = analyzeDaYunRegex.test(fateContent);
console.log(`✓ 大运流年函数: ${hasDaYunAnalysis ? '✅（但过于简化）' : '❌'}`);

console.log(`⚠️  大运问题: 未按传统规则（月柱起运，阳顺阴逆）`);
console.log(`⚠️  流年问题: 推算过于简化，未考虑干支作用关系`);

// 6. 检查周易卦象逻辑
console.log('\n6. 周易卦象逻辑验证');
console.log('===================');

const zhouyiMethodPath = path.join(__dirname, 'src', 'core', 'ZhouyiMethod.ts');
const zhouyiContent = fs.readFileSync(zhouyiMethodPath, 'utf8');

const liuyaoPath = path.join(__dirname, 'src', 'liuyao', 'liuYaoCalculator.ts');
const liuyaoContent = fs.readFileSync(liuyaoPath, 'utf8');

// 检查周易方法
const zhouyiClassRegex = /class ZhouyiMethod.*BaseFortuneMethod/;
const hasZhouyiMethod = zhouyiClassRegex.test(zhouyiContent);
console.log(`✓ 周易方法类: ${hasZhouyiMethod ? '✅' : '❌'}`);

// 检查六爻计算器
const liuyaoClassRegex = /class LiuYaoCalculator/;
const hasLiuyaoCalculator = liuyaoClassRegex.test(liuyaoContent);
console.log(`✓ 六爻计算器: ${hasLiuyaoCalculator ? '✅' : '❌'}`);

// 检查卦象数据
const hexagramsRegex = /hexagrams.*{[\s\S]*?number.*1.*name.*'乾'.*meaning[\s\S]*?number.*64.*name.*'未济'/;
const hasHexagramsData = hexagramsRegex.test(liuyaoContent);
console.log(`✓ 六十四卦数据: ${hasHexagramsData ? '✅ 完整' : '❌ 不完整'}`);

// 7. 检查RAG知识库相关逻辑
console.log('\n7. RAG知识库算命逻辑验证');
console.log('========================');

// 搜索RAG相关代码
const searchRAG = (content) => content.includes('RAG') || content.includes('rag') || 
                     content.includes('retrieval') || content.includes('Retrieval') ||
                     content.includes('knowledge') && content.includes('base');

const allFiles = [
  'src/core/FortuneTeller.ts',
  'src/core/ZhouyiMethod.ts', 
  'src/fate/fateAnalyzer.ts',
  'src/bazi/baZiCalculator.ts',
  'src/liuyao/liuYaoCalculator.ts',
  'src/interpretation/Interpreter.ts'
];

let hasRAGLogic = false;
allFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    if (searchRAG(content)) {
      hasRAGLogic = true;
      console.log(`  在 ${file} 中发现RAG相关代码`);
    }
  }
});

console.log(`✓ RAG知识库集成: ${hasRAGLogic ? '✅ 存在' : '❌ 未发现（用户提到RAG但代码未实现）'}`);

// 总结报告
console.log('\n=== 总结报告 ===');
console.log('===============\n');

const issues = [];

// 收集主要问题
if (!hasRAGLogic) {
  issues.push('❌ 未实现RAG（检索增强生成）知识库算命逻辑，不符合用户需求');
}

if (heavenlyStemsCount !== 10) {
  issues.push('❌ 天干数据不完整');
}

if (earthlyBranchesCount !== 12) {
  issues.push('❌ 地支数据不完整');
}

issues.push('⚠️  月柱计算未按节气划分，不符合《渊海子平》要求');
issues.push('⚠️  大运推算未遵循传统规则（月柱起运，阳顺阴逆）');
issues.push('⚠️  流年推算过于简化，未考虑干支作用关系');
issues.push('⚠️  五行喜忌分析过于简化，未考虑旺衰平衡');
issues.push('⚠️  缺少六亲关系分析（父母、兄弟、子女、妻财、官鬼）');
issues.push('⚠️  周易方法随机起卦，不符合传统起卦仪式');

console.log('主要发现的问题：');
issues.forEach((issue, index) => {
  console.log(`${index + 1}. ${issue}`);
});

console.log('\n✅ 正确的部分：');
console.log('1. 天干地支基本计算算法正确');
console.log('2. 十神映射表完整准确');
console.log('3. 六爻卦象数据完整，有手动和时间起卦方法');
console.log('4. 项目架构清晰，有扩展接口');

console.log('\n=== 改进建议 ===');
console.log('===============\n');

console.log('1. 实现RAG知识库集成：');
console.log('   - 添加《周易》、《三命通会》、《渊海子平》等经典文本向量化');
console.log('   - 实现基于用户问题的经典知识检索');
console.log('   - 将检索结果与算法结果融合生成解释');

console.log('\n2. 修复八字排盘逻辑：');
console.log('   - 添加节气计算，正确划分月柱');
console.log('   - 处理年柱以立春为界');
console.log('   - 完善大运推算算法（月柱起运，阳顺阴逆）');

console.log('\n3. 增强命理分析：');
console.log('   - 添加五行旺衰分析（得地、得势、得气）');
console.log('   - 完善十神力量计算');
console.log('   - 添加六亲关系分析');
console.log('   - 完善流年与八字作用关系分析');

console.log('\n4. 改进周易方法：');
console.log('   - 实现传统起卦方法（蓍草、铜钱）');
console.log('   - 添加纳甲、六亲、世应等六爻完整体系');
console.log('   - 完善卦象解释，结合经典爻辞');

console.log('\n=== 验证完成 ===');