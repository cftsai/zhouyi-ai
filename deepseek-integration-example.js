const { Interpreter, DeepSeekKeyManager } = require('./zhouyi-fortune-framework/dist');

async function exampleUsage() {
  console.log('DeepSeek API集成示例');
  console.log('======================');
  
  // 1. 全局设置API密钥
  const apiKey = 'sk-993b10cd2ea540f6b3f7e8f6901c6d7f';
  const keyManager = DeepSeekKeyManager.getInstance();
  keyManager.setApiKey(apiKey);
  console.log('API密钥已设置');
  
  // 2. 创建解释器实例
  const interpreter = new Interpreter();
  console.log('解释器实例已创建');
  
  // 3. 示例预测结果
  const predictionResult = {
    method: '周易',
    question: '事业发展',
    hexagram: '乾卦',
    lines: ['初九', '九二', '九三', '九四', '九五', '上九'],
    analysis: '乾为天，刚健中正，象征着强健有力的阳性能量。'
  };
  
  console.log('\n示例预测结果:', predictionResult);
  
  // 4. 使用基础解释
  console.log('\n1. 基础解释:');
  const basicResult = await interpreter.interpret(predictionResult);
  console.log('解释结果:', basicResult.interpretation);
  console.log('是否AI增强:', basicResult.aiEnhanced);
  
  // 5. 使用AI增强解释
  console.log('\n2. AI增强解释:');
  try {
    const aiResult = await interpreter.interpret(predictionResult, undefined, undefined, true);
    console.log('解释结果:', aiResult.interpretation);
    console.log('是否AI增强:', aiResult.aiEnhanced);
  } catch (error) {
    console.error('AI增强解释失败:', error.message);
    console.log('提示: 请确保网络连接正常，API密钥有效');
  }
  
  // 6. 直接使用DeepSeekModel
  console.log('\n3. 直接使用DeepSeekModel:');
  const { DeepSeekModel } = require('./zhouyi-fortune-framework/dist/extensions');
  const deepSeekModel = new DeepSeekModel(apiKey);
  
  try {
    const customPrompt = '请解释乾卦的含义及其在事业发展中的启示';
    const customResult = await deepSeekModel.generate(customPrompt);
    console.log('自定义提示结果:', customResult);
  } catch (error) {
    console.error('直接调用DeepSeek API失败:', error.message);
  }
  
  console.log('\n示例完成！');
}

exampleUsage().catch(error => {
  console.error('示例执行失败:', error);
});
