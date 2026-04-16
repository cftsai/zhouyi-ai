// 综合测试脚本
const meiHua = require('./meiHua');
const { FortuneTeller } = require('./zhouyi-fortune-framework/dist/core/FortuneTeller');
const { ZhouyiMethod } = require('./zhouyi-fortune-framework/dist/core/ZhouyiMethod');

// 测试梅花易数的不同输入规模
function testMeiHuaInputScales() {
  console.log('测试梅花易数不同输入规模...');
  
  // 测试不同长度的数字数组
  const testCases = [
    { name: '1个数字', input: [1] },
    { name: '5个数字', input: [1, 2, 3, 4, 5] },
    { name: '10个数字', input: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
    { name: '100个数字', input: Array.from({ length: 100 }, (_, i) => i + 1) },
    { name: '1000个数字', input: Array.from({ length: 1000 }, (_, i) => i + 1) }
  ];
  
  testCases.forEach(testCase => {
    const startTime = performance.now();
    const result = meiHua.predict('number', testCase.input);
    const endTime = performance.now();
    const duration = endTime - startTime;
    console.log(`${testCase.name}: ${duration.toFixed(2)}ms`);
  });
}

// 测试周易方法的性能稳定性
async function testZhouyiStability() {
  console.log('\n测试周易方法性能稳定性...');
  
  const zhouyiMethod = new ZhouyiMethod();
  const fortuneTeller = new FortuneTeller(zhouyiMethod);
  
  const iterations = 100;
  let totalDuration = 0;
  let minDuration = Infinity;
  let maxDuration = 0;
  
  for (let i = 0; i < iterations; i++) {
    const startTime = performance.now();
    await fortuneTeller.tellFortune(`测试问题 ${i}`);
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    totalDuration += duration;
    minDuration = Math.min(minDuration, duration);
    maxDuration = Math.max(maxDuration, duration);
  }
  
  const avgDuration = totalDuration / iterations;
  console.log(`平均响应时间: ${avgDuration.toFixed(2)}ms`);
  console.log(`最小响应时间: ${minDuration.toFixed(2)}ms`);
  console.log(`最大响应时间: ${maxDuration.toFixed(2)}ms`);
}

// 测试边界情况
async function testEdgeCases() {
  console.log('\n测试边界情况...');
  
  // 测试梅花易数的边界情况
  console.log('=== 梅花易数边界情况测试 ===');
  
  // 测试空数组
  try {
    meiHua.predict('number', []);
    console.log('空数组测试: 失败（应该抛出错误）');
  } catch (error) {
    console.log('空数组测试: 成功（正确抛出错误）');
  }
  
  // 测试单个数字
  try {
    const result = meiHua.predict('number', [0]);
    console.log('单个数字测试: 成功');
  } catch (error) {
    console.log('单个数字测试: 失败', error.message);
  }
  
  // 测试负数
  try {
    const result = meiHua.predict('number', [-1, -2, -3]);
    console.log('负数测试: 成功');
  } catch (error) {
    console.log('负数测试: 失败', error.message);
  }
  
  // 测试大数字
  try {
    const result = meiHua.predict('number', [999999999, 999999999]);
    console.log('大数字测试: 成功');
  } catch (error) {
    console.log('大数字测试: 失败', error.message);
  }
  
  // 测试不支持的方法
  try {
    meiHua.predict('invalid', [1, 2, 3]);
    console.log('不支持的方法测试: 失败（应该抛出错误）');
  } catch (error) {
    console.log('不支持的方法测试: 成功（正确抛出错误）');
  }
  
  // 测试周易方法的边界情况
  console.log('\n=== 周易方法边界情况测试 ===');
  
  try {
    const zhouyiMethod = new ZhouyiMethod();
    const fortuneTeller = new FortuneTeller(zhouyiMethod);
    const result = await fortuneTeller.tellFortune('');
    console.log('空问题测试: 成功');
  } catch (error) {
    console.log('空问题测试: 失败', error.message);
  }
  
  try {
    const zhouyiMethod = new ZhouyiMethod();
    const fortuneTeller = new FortuneTeller(zhouyiMethod);
    const longQuestion = 'a'.repeat(1000);
    const result = await fortuneTeller.tellFortune(longQuestion);
    console.log('长问题测试: 成功');
  } catch (error) {
    console.log('长问题测试: 失败', error.message);
  }
}

// 测试并发性能
async function testConcurrentPerformance() {
  console.log('\n测试并发性能...');
  
  const concurrentRequests = 100;
  const requests = [];
  
  // 测试梅花易数
  console.log('测试梅花易数并发性能...');
  const startMeiHua = performance.now();
  
  for (let i = 0; i < concurrentRequests; i++) {
    requests.push(new Promise((resolve) => {
      meiHua.predict('time');
      resolve();
    }));
  }
  
  await Promise.all(requests);
  const endMeiHua = performance.now();
  const durationMeiHua = endMeiHua - startMeiHua;
  
  console.log(`梅花易数并发 ${concurrentRequests} 次: ${durationMeiHua.toFixed(2)}ms`);
  console.log(`平均响应时间: ${(durationMeiHua / concurrentRequests).toFixed(2)}ms`);
  
  // 测试周易方法
  console.log('\n测试周易方法并发性能...');
  const zhouyiMethod = new ZhouyiMethod();
  const fortuneTeller = new FortuneTeller(zhouyiMethod);
  const zhouyiRequests = [];
  
  const startZhouyi = performance.now();
  
  for (let i = 0; i < concurrentRequests; i++) {
    zhouyiRequests.push(fortuneTeller.tellFortune(`并发测试 ${i}`));
  }
  
  await Promise.all(zhouyiRequests);
  const endZhouyi = performance.now();
  const durationZhouyi = endZhouyi - startZhouyi;
  
  console.log(`周易方法并发 ${concurrentRequests} 次: ${durationZhouyi.toFixed(2)}ms`);
  console.log(`平均响应时间: ${(durationZhouyi / concurrentRequests).toFixed(2)}ms`);
}

// 主测试函数
async function runComprehensiveTests() {
  console.log('=== 综合测试开始 ===\n');
  
  // 测试不同输入规模
  testMeiHuaInputScales();
  
  // 测试周易方法性能稳定性
  await testZhouyiStability();
  
  // 测试边界情况
  await testEdgeCases();
  
  // 测试并发性能
  await testConcurrentPerformance();
  
  console.log('\n=== 综合测试完成 ===');
}

// 运行测试
runComprehensiveTests();