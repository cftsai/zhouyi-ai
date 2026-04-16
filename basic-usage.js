const { FortuneTeller, ZhouyiMethod } = require('../dist');

async function basicUsage() {
  console.log('=== 周易占卜框架基本使用示例 ===\n');

  // 创建周易占卜方法实例
  const zhouyiMethod = new ZhouyiMethod();

  // 创建占卜师实例
  const fortuneTeller = new FortuneTeller(zhouyiMethod);

  // 获取使用的占卜方法
  console.log(`使用的占卜方法: ${fortuneTeller.getMethod()}`);
  console.log('');

  // 执行占卜
  const question = '我最近的事业运势如何？';
  console.log(`占卜问题: ${question}`);
  console.log('');

  try {
    const result = await fortuneTeller.tellFortune(question);
    console.log('=== 占卜结果 ===');
    console.log(`问题: ${result.question}`);
    console.log(`答案: ${result.answer}`);
    console.log(`方法: ${result.method}`);
    console.log(`时间: ${result.timestamp.toLocaleString()}`);
    console.log('');
    
    // 打印详细信息
    if (result.details) {
      console.log('=== 详细信息 ===');
      console.log(`卦象: ${result.details.name}`);
      console.log(`卦序: ${result.details.hexagramNumber}`);
      console.log(`上卦: ${result.details.upperTrigram}`);
      console.log(`下卦: ${result.details.lowerTrigram}`);
      console.log(`卦意: ${result.details.meaning}`);
      console.log('');
      
      if (result.details.lines) {
        console.log('=== 爻辞 ===');
        result.details.lines.forEach((line, index) => {
          console.log(`第${line.position}爻: ${line.text} ${line.isChanging ? '(变爻)' : ''}`);
        });
      }
    }
  } catch (error) {
    console.error('占卜过程中出错:', error.message);
  }
}

// 运行示例
basicUsage();
