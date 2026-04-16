// 测试梅花易数模块
const meiHua = require('./meiHua');

console.log('=== 梅花易数测试 ===\n');

// 测试1：时间起卦
console.log('1. 测试时间起卦:');
try {
  const timeResult = meiHua.timeDivination();
  console.log(`   时间: ${timeResult.time.toLocaleString()}`);
  console.log(`   上卦: ${timeResult.upper.symbol} ${timeResult.upper.name} (${timeResult.upper.nature})`);
  console.log(`   下卦: ${timeResult.lower.symbol} ${timeResult.lower.name} (${timeResult.lower.nature})`);
  console.log(`   动爻: 第${timeResult.movingLine}爻`);
  console.log('   ✅ 时间起卦测试通过\n');
} catch (error) {
  console.log(`   ❌ 时间起卦测试失败: ${error.message}\n`);
}

// 测试2：数字起卦
console.log('2. 测试数字起卦:');
try {
  const numbers = [1, 2, 3, 4, 5];
  const numberResult = meiHua.numberDivination(numbers);
  console.log(`   输入数字: ${numbers.join(', ')}`);
  console.log(`   上卦: ${numberResult.upper.symbol} ${numberResult.upper.name} (${numberResult.upper.nature})`);
  console.log(`   下卦: ${numberResult.lower.symbol} ${numberResult.lower.name} (${numberResult.lower.nature})`);
  console.log(`   动爻: 第${numberResult.movingLine}爻`);
  console.log('   ✅ 数字起卦测试通过\n');
} catch (error) {
  console.log(`   ❌ 数字起卦测试失败: ${error.message}\n`);
}

// 测试3：断卦逻辑
console.log('3. 测试断卦逻辑:');
try {
  const testHexagram = {
    upper: meiHua.TRIGRAMS[7], // 乾
    lower: meiHua.TRIGRAMS[0], // 坤
    movingLine: 3
  };
  const analysis = meiHua.analyzeHexagram(testHexagram);
  console.log(`   上卦: ${analysis.upper.symbol} ${analysis.upper.name} (${analysis.upper.nature})`);
  console.log(`   下卦: ${analysis.lower.symbol} ${analysis.lower.name} (${analysis.lower.nature})`);
  console.log(`   动爻: 第${analysis.movingLine}爻`);
  console.log(`   含义: ${analysis.meaning}`);
  console.log(`   建议: ${analysis.advice}`);
  console.log('   ✅ 断卦逻辑测试通过\n');
} catch (error) {
  console.log(`   ❌ 断卦逻辑测试失败: ${error.message}\n`);
}

// 测试4：预测接口 - 时间起卦
console.log('4. 测试预测接口 - 时间起卦:');
try {
  const timePredict = meiHua.predict('time');
  console.log(`   时间: ${timePredict.time.toLocaleString()}`);
  console.log(`   上卦: ${timePredict.upper.symbol} ${timePredict.upper.name} (${timePredict.upper.nature})`);
  console.log(`   下卦: ${timePredict.lower.symbol} ${timePredict.lower.name} (${timePredict.lower.nature})`);
  console.log(`   动爻: 第${timePredict.movingLine}爻`);
  console.log(`   含义: ${timePredict.meaning}`);
  console.log(`   建议: ${timePredict.advice}`);
  console.log('   ✅ 预测接口 - 时间起卦测试通过\n');
} catch (error) {
  console.log(`   ❌ 预测接口 - 时间起卦测试失败: ${error.message}\n`);
}

// 测试5：预测接口 - 数字起卦
console.log('5. 测试预测接口 - 数字起卦:');
try {
  const testNumbers = [8, 8, 8];
  const numberPredict = meiHua.predict('number', testNumbers);
  console.log(`   输入数字: ${numberPredict.numbers.join(', ')}`);
  console.log(`   上卦: ${numberPredict.upper.symbol} ${numberPredict.upper.name} (${numberPredict.upper.nature})`);
  console.log(`   下卦: ${numberPredict.lower.symbol} ${numberPredict.lower.name} (${numberPredict.lower.nature})`);
  console.log(`   动爻: 第${numberPredict.movingLine}爻`);
  console.log(`   含义: ${numberPredict.meaning}`);
  console.log(`   建议: ${numberPredict.advice}`);
  console.log('   ✅ 预测接口 - 数字起卦测试通过\n');
} catch (error) {
  console.log(`   ❌ 预测接口 - 数字起卦测试失败: ${error.message}\n`);
}

// 测试6：错误处理
console.log('6. 测试错误处理:');
try {
  // 测试空数字数组
  meiHua.numberDivination([]);
  console.log('   ❌ 错误处理测试失败: 应该抛出错误\n');
} catch (error) {
  console.log(`   ✅ 错误处理测试通过: ${error.message}\n`);
}

try {
  // 测试不支持的起卦方法
  meiHua.predict('invalid', []);
  console.log('   ❌ 错误处理测试失败: 应该抛出错误\n');
} catch (error) {
  console.log(`   ✅ 错误处理测试通过: ${error.message}\n`);
}

console.log('=== 测试完成 ===');
