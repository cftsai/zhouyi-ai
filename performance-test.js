// 性能测试脚本
const meiHua = require('./meiHua');
const { FortuneTeller } = require('./zhouyi-fortune-framework/dist/core/FortuneTeller');
const { ZhouyiMethod } = require('./zhouyi-fortune-framework/dist/core/ZhouyiMethod');

// 测试梅花易数的性能
async function testMeiHuaPerformance() {
  console.log('测试梅花易数性能...');
  
  // 测试时间起卦
  const startTime1 = performance.now();
  const result1 = meiHua.predict('time');
  const endTime1 = performance.now();
  const duration1 = endTime1 - startTime1;
  console.log(`梅花易数时间起卦: ${duration1.toFixed(2)}ms`);
  
  // 测试数字起卦
  const startTime2 = performance.now();
  const result2 = meiHua.predict('number', [1, 2, 3, 4, 5, 6]);
  const endTime2 = performance.now();
  const duration2 = endTime2 - startTime2;
  console.log(`梅花易数数字起卦: ${duration2.toFixed(2)}ms`);
  
  return { timeMethod: duration1, numberMethod: duration2 };
}

// 测试周易方法的性能
async function testZhouyiPerformance() {
  console.log('\n测试周易方法性能...');
  
  const zhouyiMethod = new ZhouyiMethod();
  const fortuneTeller = new FortuneTeller(zhouyiMethod);
  
  const startTime = performance.now();
  const result = await fortuneTeller.tellFortune('测试问题');
  const endTime = performance.now();
  const duration = endTime - startTime;
  console.log(`周易方法: ${duration.toFixed(2)}ms`);
  
  return duration;
}

// 边界情况测试
function testEdgeCases() {
  console.log('\n测试边界情况...');
  
  // 测试梅花易数数字起卦的边界情况
  try {
    meiHua.predict('number', []);
    console.log('数字起卦空数组测试: 失败（应该抛出错误）');
  } catch (error) {
    console.log('数字起卦空数组测试: 成功（正确抛出错误）');
  }
  
  try {
    meiHua.predict('number', [999999999]);
    console.log('数字起卦大数字测试: 成功');
  } catch (error) {
    console.log('数字起卦大数字测试: 失败', error.message);
  }
  
  // 测试不支持的起卦方法
  try {
    meiHua.predict('invalid', []);
    console.log('不支持的起卦方法测试: 失败（应该抛出错误）');
  } catch (error) {
    console.log('不支持的起卦方法测试: 成功（正确抛出错误）');
  }
}

// 压力测试
async function stressTest() {
  console.log('\n进行压力测试...');
  
  const iterations = 1000;
  let totalDuration = 0;
  
  // 测试梅花易数时间起卦
  console.log(`测试梅花易数时间起卦 ${iterations} 次...`);
  const startTotal = performance.now();
  
  for (let i = 0; i < iterations; i++) {
    const start = performance.now();
    meiHua.predict('time');
    const end = performance.now();
    totalDuration += (end - start);
  }
  
  const endTotal = performance.now();
  const avgDuration = totalDuration / iterations;
  const totalTime = endTotal - startTotal;
  
  console.log(`平均响应时间: ${avgDuration.toFixed(2)}ms`);
  console.log(`总耗时: ${totalTime.toFixed(2)}ms`);
  console.log(`每秒处理请求数: ${(iterations / (totalTime / 1000)).toFixed(2)}`);
  
  return { avgDuration, totalTime, throughput: iterations / (totalTime / 1000) };
}

// 主测试函数
async function runTests() {
  console.log('=== 性能测试开始 ===\n');
  
  // 运行性能测试
  const meiHuaResults = await testMeiHuaPerformance();
  const zhouyiResult = await testZhouyiPerformance();
  
  // 运行边界情况测试
  testEdgeCases();
  
  // 运行压力测试
  const stressResults = await stressTest();
  
  console.log('\n=== 测试结果汇总 ===');
  console.log(`梅花易数时间起卦: ${meiHuaResults.timeMethod.toFixed(2)}ms`);
  console.log(`梅花易数数字起卦: ${meiHuaResults.numberMethod.toFixed(2)}ms`);
  console.log(`周易方法: ${zhouyiResult.toFixed(2)}ms`);
  console.log(`压力测试平均响应时间: ${stressResults.avgDuration.toFixed(2)}ms`);
  console.log(`压力测试总耗时: ${stressResults.totalTime.toFixed(2)}ms`);
  console.log(`压力测试吞吐量: ${stressResults.throughput.toFixed(2)} req/s`);
  
  // 检查性能是否符合要求
  const maxResponseTime = 100;
  const isMeiHuaTimeOk = meiHuaResults.timeMethod <= maxResponseTime;
  const isMeiHuaNumberOk = meiHuaResults.numberMethod <= maxResponseTime;
  const isZhouyiOk = zhouyiResult <= maxResponseTime;
  const isStressOk = stressResults.avgDuration <= maxResponseTime;
  
  console.log('\n=== 性能评估 ===');
  console.log(`梅花易数时间起卦: ${isMeiHuaTimeOk ? '通过' : '不通过'}`);
  console.log(`梅花易数数字起卦: ${isMeiHuaNumberOk ? '通过' : '不通过'}`);
  console.log(`周易方法: ${isZhouyiOk ? '通过' : '不通过'}`);
  console.log(`压力测试: ${isStressOk ? '通过' : '不通过'}`);
  
  const allPassed = isMeiHuaTimeOk && isMeiHuaNumberOk && isZhouyiOk && isStressOk;
  console.log(`\n=== 总体结果 ===`);
  console.log(allPassed ? '所有测试通过！' : '部分测试不通过，需要优化。');
}

// 运行测试
runTests();