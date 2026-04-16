const { BasePredictionModel, DefaultModelManager } = require('../dist');

// 自定义预测模型类
class CustomPredictionModel extends BasePredictionModel {
  constructor() {
    super(
      'custom-fortune-model',
      '自定义运势预测模型',
      '基于周易原理的运势预测模型',
      '1.0.0',
      '周易框架团队',
      ['fortune', 'custom'],
      []
    );
  }

  async predict(data) {
    const { date, question, name } = data;
    
    // 模拟运势预测逻辑
    const fortuneLevels = ['大吉', '吉', '中吉', '小吉', '凶'];
    const randomLevel = fortuneLevels[Math.floor(Math.random() * fortuneLevels.length)];
    
    const prediction = {
      date,
      question,
      name,
      fortune: randomLevel,
      advice: '根据周易原理，建议您保持积极心态，谨慎决策。',
      luckyColor: this.getLuckyColor(randomLevel),
      luckyNumber: Math.floor(Math.random() * 10) + 1
    };

    return this.createPredictionResult(data, prediction, 0.85);
  }

  getLuckyColor(fortuneLevel) {
    const colorMap = {
      '大吉': '红色',
      '吉': '橙色',
      '中吉': '黄色',
      '小吉': '绿色',
      '凶': '蓝色'
    };
    return colorMap[fortuneLevel] || '灰色';
  }
}

async function extensionExample() {
  console.log('=== 周易占卜框架扩展开发示例 ===\n');

  // 创建模型管理器
  const modelManager = new DefaultModelManager();

  // 创建自定义模型实例
  const customModel = new CustomPredictionModel();

  // 验证模型
  const isValid = modelManager.validateModel(customModel);
  console.log(`模型验证结果: ${isValid ? '通过' : '失败'}`);
  console.log('');

  if (isValid) {
    // 注册模型
    modelManager.registry.register(customModel);
    console.log('模型注册成功');
    console.log('');

    // 列出所有模型
    const models = modelManager.listModels();
    console.log('=== 已注册的模型 ===');
    models.forEach(model => {
      console.log(`ID: ${model.id}`);
      console.log(`名称: ${model.name}`);
      console.log(`版本: ${model.version}`);
      console.log(`作者: ${model.author}`);
      console.log('');
    });

    // 加载模型
    try {
      const model = await modelManager.loadModel('custom-fortune-model');
      console.log('模型加载成功');
      console.log('');

      // 使用模型进行预测
      const predictionData = {
        date: new Date().toLocaleDateString(),
        question: '我最近的财运如何？',
        name: '张三'
      };

      console.log('=== 预测输入 ===');
      console.log(predictionData);
      console.log('');

      const result = await model.predict(predictionData);
      console.log('=== 预测结果 ===');
      console.log(`模型ID: ${result.modelId}`);
      console.log(`预测时间: ${result.timestamp.toLocaleString()}`);
      console.log(`置信度: ${result.confidence}`);
      console.log('');
      console.log('=== 预测详情 ===');
      console.log(`日期: ${result.output.date}`);
      console.log(`问题: ${result.output.question}`);
      console.log(`姓名: ${result.output.name}`);
      console.log(`运势: ${result.output.fortune}`);
      console.log(`建议: ${result.output.advice}`);
      console.log(`幸运色: ${result.output.luckyColor}`);
      console.log(`幸运数字: ${result.output.luckyNumber}`);
      console.log('');

      // 卸载模型
      modelManager.unloadModel('custom-fortune-model');
      console.log('模型卸载成功');
      console.log('');

      // 注销模型
      modelManager.registry.unregister('custom-fortune-model');
      console.log('模型注销成功');
    } catch (error) {
      console.error('模型操作过程中出错:', error.message);
    }
  } else {
    console.error('模型验证失败，无法注册');
  }
}

// 运行示例
extensionExample();
