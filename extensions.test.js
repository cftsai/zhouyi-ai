const { BasePredictionModel, DefaultModelManager, DefaultModelRegistry } = require('./dist');

describe('Extensions', () => {
  describe('BasePredictionModel', () => {
    test('should create a BasePredictionModel instance', () => {
      class TestModel extends BasePredictionModel {
        async predict(data) {
          return this.createPredictionResult(data, { result: 'test' }, 0.9);
        }
      }
      
      const model = new TestModel(
        'test-model',
        'Test Model',
        'Test description',
        '1.0.0',
        'Test Author',
        ['test', 'example'],
        ['dependency1']
      );
      
      expect(model).toBeInstanceOf(BasePredictionModel);
      expect(model.id).toBe('test-model');
      expect(model.name).toBe('Test Model');
      expect(model.description).toBe('Test description');
      expect(model.version).toBe('1.0.0');
      expect(model.author).toBe('Test Author');
    });

    test('should create prediction result', () => {
      class TestModel extends BasePredictionModel {
        async predict(data) {
          return this.createPredictionResult(data, { result: 'test' }, 0.9);
        }
      }
      
      const model = new TestModel('test-model', 'Test Model', 'Test description', '1.0.0', 'Test Author');
      const input = { test: 'data' };
      const output = { result: 'test' };
      const confidence = 0.9;
      
      const result = model.createPredictionResult(input, output, confidence);
      
      expect(result).toHaveProperty('modelId', 'test-model');
      expect(result).toHaveProperty('input', input);
      expect(result).toHaveProperty('output', output);
      expect(result).toHaveProperty('confidence', confidence);
      expect(result).toHaveProperty('timestamp');
    });

    test('should get metadata', () => {
      class TestModel extends BasePredictionModel {
        async predict(data) {
          return this.createPredictionResult(data, { result: 'test' }, 0.9);
        }
      }
      
      const model = new TestModel('test-model', 'Test Model', 'Test description', '1.0.0', 'Test Author');
      const metadata = model.getMetadata();
      
      expect(metadata).toHaveProperty('id', 'test-model');
      expect(metadata).toHaveProperty('name', 'Test Model');
      expect(metadata).toHaveProperty('description', 'Test description');
      expect(metadata).toHaveProperty('version', '1.0.0');
      expect(metadata).toHaveProperty('author', 'Test Author');
      expect(metadata).toHaveProperty('createdAt');
    });
  });

  describe('ModelRegistry', () => {
    test('should register and get model', () => {
      class TestModel extends BasePredictionModel {
        async predict(data) {
          return this.createPredictionResult(data, { result: 'test' }, 0.9);
        }
      }
      
      const registry = new DefaultModelRegistry();
      const model = new TestModel('test-model', 'Test Model', 'Test description', '1.0.0', 'Test Author');
      
      registry.register(model);
      const retrievedModel = registry.getModel('test-model');
      
      expect(retrievedModel).toBe(model);
    });

    test('should unregister model', () => {
      class TestModel extends BasePredictionModel {
        async predict(data) {
          return this.createPredictionResult(data, { result: 'test' }, 0.9);
        }
      }
      
      const registry = new DefaultModelRegistry();
      const model = new TestModel('test-model', 'Test Model', 'Test description', '1.0.0', 'Test Author');
      
      registry.register(model);
      registry.unregister('test-model');
      const retrievedModel = registry.getModel('test-model');
      
      expect(retrievedModel).toBeNull();
    });

    test('should get all models', () => {
      class TestModel1 extends BasePredictionModel {
        async predict(data) {
          return this.createPredictionResult(data, { result: 'test1' }, 0.9);
        }
      }
      
      class TestModel2 extends BasePredictionModel {
        async predict(data) {
          return this.createPredictionResult(data, { result: 'test2' }, 0.9);
        }
      }
      
      const registry = new DefaultModelRegistry();
      const model1 = new TestModel1('test-model-1', 'Test Model 1', 'Test description 1', '1.0.0', 'Test Author');
      const model2 = new TestModel2('test-model-2', 'Test Model 2', 'Test description 2', '1.0.0', 'Test Author');
      
      registry.register(model1);
      registry.register(model2);
      const models = registry.getAllModels();
      
      expect(models.length).toBe(2);
      expect(models).toContain(model1);
      expect(models).toContain(model2);
    });
  });

  describe('DefaultModelManager', () => {
    test('should create a DefaultModelManager instance', () => {
      const manager = new DefaultModelManager();
      expect(manager).toBeInstanceOf(DefaultModelManager);
      expect(manager.registry).toBeInstanceOf(DefaultModelRegistry);
    });

    test('should validate model', () => {
      class ValidModel extends BasePredictionModel {
        async predict(data) {
          return this.createPredictionResult(data, { result: 'test' }, 0.9);
        }
      }
      
      class InvalidModel {
        // Missing required properties and methods
      }
      
      const manager = new DefaultModelManager();
      const validModel = new ValidModel('valid-model', 'Valid Model', 'Valid description', '1.0.0', 'Test Author');
      const invalidModel = new InvalidModel();
      
      expect(manager.validateModel(validModel)).toBe(true);
      expect(manager.validateModel(invalidModel)).toBe(false);
    });

    test('should load and unload model', async () => {
      class TestModel extends BasePredictionModel {
        async predict(data) {
          return this.createPredictionResult(data, { result: 'test' }, 0.9);
        }
      }
      
      const manager = new DefaultModelManager();
      const model = new TestModel('test-model', 'Test Model', 'Test description', '1.0.0', 'Test Author');
      
      manager.registry.register(model);
      const loadedModel = await manager.loadModel('test-model');
      
      expect(loadedModel).toBe(model);
      
      manager.unloadModel('test-model');
      // After unloading, should still be able to load again
      const reloadedModel = await manager.loadModel('test-model');
      expect(reloadedModel).toBe(model);
    });

    test('should list models', () => {
      class TestModel extends BasePredictionModel {
        async predict(data) {
          return this.createPredictionResult(data, { result: 'test' }, 0.9);
        }
      }
      
      const manager = new DefaultModelManager();
      const model = new TestModel('test-model', 'Test Model', 'Test description', '1.0.0', 'Test Author');
      
      manager.registry.register(model);
      const models = manager.listModels();
      
      expect(models.length).toBe(1);
      expect(models[0]).toHaveProperty('id', 'test-model');
      expect(models[0]).toHaveProperty('name', 'Test Model');
    });

    test('should get model info', () => {
      class TestModel extends BasePredictionModel {
        async predict(data) {
          return this.createPredictionResult(data, { result: 'test' }, 0.9);
        }
      }
      
      const manager = new DefaultModelManager();
      const model = new TestModel('test-model', 'Test Model', 'Test description', '1.0.0', 'Test Author');
      
      manager.registry.register(model);
      const modelInfo = manager.getModelInfo('test-model');
      
      expect(modelInfo).toHaveProperty('id', 'test-model');
      expect(modelInfo).toHaveProperty('name', 'Test Model');
      expect(modelInfo).toHaveProperty('description', 'Test description');
      expect(modelInfo).toHaveProperty('version', '1.0.0');
      expect(modelInfo).toHaveProperty('author', 'Test Author');
    });
  });
});
