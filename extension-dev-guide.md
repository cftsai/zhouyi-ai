# 扩展接口开发指南

## 1. 概述

本指南旨在帮助开发者理解和使用周易占卜框架的扩展接口功能，包括如何创建自定义预测模型、注册模型以及管理模型。

## 2. 核心概念

### 2.1 预测模型（PredictionModel）

预测模型是扩展接口的核心组件，用于实现各种预测功能。每个预测模型都需要实现以下接口：

```typescript
interface PredictionModel {
  id: string;           // 模型唯一标识符
  name: string;         // 模型名称
  description: string;  // 模型描述
  version: string;      // 模型版本
  author: string;       // 模型作者
  predict(data: any): Promise<PredictionResult>;  // 预测方法
  getMetadata(): ModelMetadata;  // 获取模型元数据
}
```

### 2.2 模型注册（ModelRegistry）

模型注册机制用于管理所有预测模型，提供注册、注销、获取模型等功能。

### 2.3 模型管理（ModelManager）

模型管理功能用于加载、卸载、验证模型，以及获取模型信息。

## 3. 创建自定义预测模型

### 3.1 继承BasePredictionModel

最简单的方法是继承`BasePredictionModel`抽象类，它已经实现了大部分通用功能：

```typescript
import { BasePredictionModel, PredictionResult } from '../extensions';

export class MyCustomModel extends BasePredictionModel {
  constructor() {
    super(
      'my-custom-model',      // 模型ID
      '我的自定义模型',        // 模型名称
      '这是一个示例自定义模型',  // 模型描述
      '1.0.0',               // 版本
      '开发者名称',            // 作者
      ['custom', 'example'],  // 标签
      []                     // 依赖
    );
  }

  async predict(data: any): Promise<PredictionResult> {
    // 实现预测逻辑
    const result = {
      // 预测结果
    };

    return this.createPredictionResult(data, result, 0.95);
  }
}
```

### 3.2 直接实现PredictionModel接口

如果需要更灵活的实现，可以直接实现`PredictionModel`接口：

```typescript
import { PredictionModel, PredictionResult, ModelMetadata } from '../extensions';

export class DirectModel implements PredictionModel {
  id = 'direct-model';
  name = '直接实现模型';
  description = '直接实现PredictionModel接口的示例';
  version = '1.0.0';
  author = '开发者名称';

  async predict(data: any): Promise<PredictionResult> {
    // 实现预测逻辑
    return {
      modelId: this.id,
      input: data,
      output: { /* 预测结果 */ },
      confidence: 0.9,
      timestamp: new Date()
    };
  }

  getMetadata(): ModelMetadata {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      version: this.version,
      author: this.author,
      createdAt: new Date()
    };
  }
}
```

## 4. 注册和管理模型

### 4.1 创建模型管理器

```typescript
import { DefaultModelManager } from '../extensions';

// 创建模型管理器
const modelManager = new DefaultModelManager();
```

### 4.2 注册模型

```typescript
import { MyCustomModel } from './models/myCustomModel';

// 创建模型实例
const myModel = new MyCustomModel();

// 注册模型
modelManager.registry.register(myModel);
```

### 4.3 加载和使用模型

```typescript
// 加载模型
const model = await modelManager.loadModel('my-custom-model');

// 使用模型进行预测
const result = await model.predict({
  // 输入数据
});

console.log('预测结果:', result);
```

### 4.4 管理模型

```typescript
// 列出所有模型
const models = modelManager.listModels();
console.log('所有模型:', models);

// 获取模型信息
const modelInfo = modelManager.getModelInfo('my-custom-model');
console.log('模型信息:', modelInfo);

// 卸载模型
modelManager.unloadModel('my-custom-model');

// 注销模型
modelManager.registry.unregister('my-custom-model');
```

## 5. 模型验证

在注册模型之前，可以使用模型管理器的`validateModel`方法验证模型是否符合要求：

```typescript
import { MyCustomModel } from './models/myCustomModel';

const myModel = new MyCustomModel();
const isValid = modelManager.validateModel(myModel);

if (isValid) {
  modelManager.registry.register(myModel);
  console.log('模型注册成功');
} else {
  console.error('模型验证失败');
}
```

## 6. 示例：创建一个简单的运势预测模型

```typescript
import { BasePredictionModel, PredictionResult } from '../extensions';

export class FortunePredictionModel extends BasePredictionModel {
  constructor() {
    super(
      'fortune-prediction',
      '运势预测模型',
      '基于周易原理的运势预测模型',
      '1.0.0',
      '周易框架团队',
      ['fortune', 'zhouyi'],
      []
    );
  }

  async predict(data: any): Promise<PredictionResult> {
    const { date, question } = data;
    
    // 这里可以实现具体的运势预测逻辑
    // 例如结合日期、问题类型等因素进行分析
    
    const fortuneLevels = ['大吉', '吉', '中吉', '小吉', '凶'];
    const randomLevel = fortuneLevels[Math.floor(Math.random() * fortuneLevels.length)];
    
    const prediction = {
      date,
      question,
      fortune: randomLevel,
      advice: '根据周易原理，建议您保持积极心态，谨慎决策。'
    };

    return this.createPredictionResult(data, prediction, 0.85);
  }
}
```

## 7. 最佳实践

1. **模型命名规范**：使用唯一、清晰的模型ID，建议采用小写字母和连字符的组合。
2. **版本管理**：遵循语义化版本规范（Major.Minor.Patch）。
3. **标签使用**：合理使用标签，便于模型分类和检索。
4. **错误处理**：在预测方法中实现适当的错误处理。
5. **性能优化**：对于复杂的预测逻辑，考虑使用缓存或其他优化手段。
6. **文档完善**：为模型提供详细的描述和使用说明。

## 8. 常见问题

### 8.1 模型注册失败

- 检查模型ID是否唯一
- 确保模型实现了所有必需的方法和属性
- 使用`validateModel`方法验证模型

### 8.2 预测结果不准确

- 检查预测逻辑是否正确
- 确保输入数据格式正确
- 考虑调整模型参数或算法

### 8.3 模型加载失败

- 检查模型是否已注册
- 确保模型ID正确
- 检查模型依赖是否满足

## 9. 总结

扩展接口为周易占卜框架提供了灵活的预测模型扩展能力，开发者可以通过实现`PredictionModel`接口或继承`BasePredictionModel`类来创建自定义预测模型。通过模型注册和管理机制，可以方便地管理和使用各种预测模型，为框架增加新的功能和能力。

希望本指南能够帮助您快速上手扩展接口开发，为周易占卜框架贡献更多优秀的预测模型！