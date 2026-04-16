const { Interpreter } = require('./zhouyi-fortune-framework/dist/interpretation');

async function testDeepSeekIntegration() {
  console.log('测试DeepSeek API集成...');
  
  // 创建解释器实例
  const interpreter = new Interpreter();
  
  // 设置DeepSeek API密钥
  const apiKey = 'sk-993b10cd2ea540f6b3f7e8f6901c6d7f';
  interpreter.setDeepSeekApiKey(apiKey);
  
  // 测试数据
  const testResult = {
    hexagram: "乾卦",
    lines: ["初九", "九二", "九三", "九四", "九五", "上九"],
    analysis: "乾为天，刚健中正，象征着强健有力的阳性能量。"
  };
  
  console.log('测试1: 基础解释');
  const basicResult = await interpreter.interpret(testResult);
  console.log('基础解释结果:', basicResult.interpretation);
  
  console.log('\n测试2: AI增强解释');
  const aiResult = await interpreter.interpret(testResult, undefined, undefined, true);
  console.log('AI增强解释结果:', aiResult.interpretation);
  console.log('是否使用AI增强:', aiResult.aiEnhanced);
  
  console.log('\nDeepSeek API集成测试完成！');
}

testDeepSeekIntegration().catch(error => {
  console.error('测试失败:', error);
});
