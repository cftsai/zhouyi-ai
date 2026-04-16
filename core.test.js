const { FortuneTeller, ZhouyiMethod, BaseFortuneMethod } = require('./dist');

describe('Core Classes', () => {
  describe('FortuneTeller', () => {
    test('should create a FortuneTeller instance with a method', () => {
      const method = new ZhouyiMethod();
      const fortuneTeller = new FortuneTeller(method);
      expect(fortuneTeller).toBeInstanceOf(FortuneTeller);
    });

    test('should return the method name', () => {
      const method = new ZhouyiMethod();
      const fortuneTeller = new FortuneTeller(method);
      expect(fortuneTeller.getMethod()).toBe('Zhouyi');
    });

    test('should execute fortune telling and return a result', async () => {
      const method = new ZhouyiMethod();
      const fortuneTeller = new FortuneTeller(method);
      const question = '测试问题';
      const result = await fortuneTeller.tellFortune(question);
      
      expect(result).toHaveProperty('question', question);
      expect(result).toHaveProperty('answer');
      expect(result).toHaveProperty('method', 'Zhouyi');
      expect(result).toHaveProperty('timestamp');
      expect(result).toHaveProperty('details');
      expect(result.details).toHaveProperty('upperTrigram');
      expect(result.details).toHaveProperty('lowerTrigram');
      expect(result.details).toHaveProperty('hexagramNumber');
      expect(result.details).toHaveProperty('name');
      expect(result.details).toHaveProperty('meaning');
      expect(result.details).toHaveProperty('lines');
      expect(Array.isArray(result.details.lines)).toBe(true);
      expect(result.details.lines.length).toBe(6);
    });
  });

  describe('ZhouyiMethod', () => {
    test('should create a ZhouyiMethod instance', () => {
      const method = new ZhouyiMethod();
      expect(method).toBeInstanceOf(ZhouyiMethod);
      expect(method.name).toBe('Zhouyi');
      expect(method.description).toBe('Traditional Chinese Zhouyi divination method');
    });

    test('should execute and return a fortune result', async () => {
      const method = new ZhouyiMethod();
      const question = '测试问题';
      const result = await method.execute(question);
      
      expect(result).toHaveProperty('question', question);
      expect(result).toHaveProperty('answer');
      expect(result).toHaveProperty('method', 'Zhouyi');
      expect(result).toHaveProperty('timestamp');
      expect(result).toHaveProperty('details');
    });
  });

  describe('BaseFortuneMethod', () => {
    test('should create a BaseFortuneMethod instance', () => {
      class TestMethod extends BaseFortuneMethod {
        async execute(question) {
          return {
            question,
            answer: 'Test answer',
            method: this.name,
            timestamp: new Date()
          };
        }
      }
      
      const method = new TestMethod('TestMethod', 'Test description');
      expect(method).toBeInstanceOf(BaseFortuneMethod);
      expect(method.name).toBe('TestMethod');
      expect(method.description).toBe('Test description');
    });

    test('should throw error when execute is not implemented', async () => {
      class TestMethod extends BaseFortuneMethod {
        // execute not implemented
      }
      
      const method = new TestMethod('TestMethod', 'Test description');
      await expect(method.execute('Test question')).rejects.toThrow('Method not implemented');
    });
  });
});
