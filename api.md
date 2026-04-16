# 周易占卜框架 API 文档

## 1. 概述

周易占卜框架是一个用于实现各种占卜和预测功能的Node.js库，提供了核心的占卜功能和扩展接口。本API文档详细介绍了框架的核心类、接口和使用方法。

## 2. 核心类

### 2.1 FortuneTeller

`FortuneTeller`是框架的核心类，用于执行占卜操作。

#### 构造函数

```typescript
new FortuneTeller(method: FortuneMethod)
```

- **参数**：
  - `method`：占卜方法，实现了`FortuneMethod`接口的对象

#### 方法

##### tellFortune

```typescript
async tellFortune(question: string): Promise<FortuneResult>
```

- **功能**：执行占卜操作，返回占卜结果
- **参数**：
  - `question`：占卜问题
- **返回值**：
  - `Promise<FortuneResult>`：包含占卜结果的Promise

##### getMethod

```typescript
getMethod(): string
```

- **功能**：获取当前使用的占卜方法名称
- **返回值**：
  - `string`：占卜方法名称

### 2.2 BaseFortuneMethod

`BaseFortuneMethod`是一个抽象基类，用于创建自定义占卜方法。

#### 构造函数

```typescript
new BaseFortuneMethod(name: string, description: string)
```

- **参数**：
  - `name`：方法名称
  - `description`：方法描述

#### 方法

##### execute

```typescript
async execute(question: string): Promise<FortuneResult>
```

- **功能**：执行占卜操作（需要在子类中实现）
- **参数**：
  - `question`：占卜问题
- **返回值**：
  - `Promise<FortuneResult>`：包含占卜结果的Promise

### 2.3 ZhouyiMethod

`ZhouyiMethod`是一个基于传统周易的占卜方法实现。

#### 构造函数

```typescript
new ZhouyiMethod()
```

#### 方法

##### execute

```typescript
async execute(question: string): Promise<FortuneResult>
```

- **功能**：执行周易占卜操作
- **参数**：
  - `question`：占卜问题
- **返回值**：
  - `Promise<FortuneResult>`：包含占卜结果的Promise

## 3. 接口

### 3.1 IFortuneTeller

```typescript
interface IFortuneTeller {
  tellFortune(question: string): Promise<FortuneResult>;
  getMethod(): string;
}
```

### 3.2 FortuneResult

```typescript
interface FortuneResult {
  question: string;
  answer: string;
  method: string;
  timestamp: Date;
  details?: any;
}
```

### 3.3 ZhouyiHexagram

```typescript
interface ZhouyiHexagram {
  upperTrigram: string;
  lowerTrigram: string;
  hexagramNumber: number;
  name: string;
  meaning: string;
  lines?: HexagramLine[];
}
```

### 3.4 HexagramLine

```typescript
interface HexagramLine {
  position: number;
  isChanging: boolean;
  text: string;
}
```

### 3.5 FortuneMethod

```typescript
interface FortuneMethod {
  name: string;
  description: string;
  execute(question: string): Promise<FortuneResult>;
}
```

## 4. 扩展接口

### 4.1 PredictionModel

```typescript
interface PredictionModel {
  id: string;
  name: string;
  description: string;
  version: string;
  author: string;
  predict(data: any): Promise<PredictionResult>;
  getMetadata(): ModelMetadata;
}
```

### 4.2 BasePredictionModel

`BasePredictionModel`是一个抽象基类，用于创建自定义预测模型。

#### 构造函数

```typescript
new BasePredictionModel(
  id: string,
  name: string,
  description: string,
  version: string,
  author: string,
  tags?: string[],
  dependencies?: string[]
)
```

#### 方法

##### predict

```typescript
async predict(data: any): Promise<PredictionResult>
```

- **功能**：执行预测操作（需要在子类中实现）
- **参数**：
  - `data`：预测输入数据
- **返回值**：
  - `Promise<PredictionResult>`：包含预测结果的Promise

##### getMetadata

```typescript
getMetadata(): ModelMetadata
```

- **功能**：获取模型元数据
- **返回值**：
  - `ModelMetadata`：模型元数据

##### createPredictionResult

```typescript
createPredictionResult(input: any, output: any, confidence: number): PredictionResult
```

- **功能**：创建预测结果对象
- **参数**：
  - `input`：输入数据
  - `output`：输出数据
  - `confidence`：置信度
- **返回值**：
  - `PredictionResult`：预测结果对象

### 4.3 DefaultModelManager

`DefaultModelManager`是模型管理器的默认实现，用于管理预测模型。

#### 构造函数

```typescript
new DefaultModelManager()
```

#### 方法

##### registry

```typescript
registry: ModelRegistry
```

- **功能**：获取模型注册器

##### loadModel

```typescript
async loadModel(modelId: string): Promise<PredictionModel>
```

- **功能**：加载模型
- **参数**：
  - `modelId`：模型ID
- **返回值**：
  - `Promise<PredictionModel>`：模型实例

##### unloadModel

```typescript
unloadModel(modelId: string): void
```

- **功能**：卸载模型
- **参数**：
  - `modelId`：模型ID

##### validateModel

```typescript
validateModel(model: PredictionModel): boolean
```

- **功能**：验证模型
- **参数**：
  - `model`：模型实例
- **返回值**：
  - `boolean`：验证结果

##### listModels

```typescript
listModels(): ModelMetadata[]
```

- **功能**：列出所有模型
- **返回值**：
  - `ModelMetadata[]`：模型元数据列表

##### getModelInfo

```typescript
getModelInfo(modelId: string): ModelMetadata | undefined
```

- **功能**：获取模型信息
- **参数**：
  - `modelId`：模型ID
- **返回值**：
  - `ModelMetadata | undefined`：模型元数据

### 4.4 ModelRegistry

`ModelRegistry`是模型注册器，用于注册和管理模型。

#### 方法

##### register

```typescript
register(model: PredictionModel): void
```

- **功能**：注册模型
- **参数**：
  - `model`：模型实例

##### unregister

```typescript
unregister(modelId: string): void
```

- **功能**：注销模型
- **参数**：
  - `modelId`：模型ID

##### getModel

```typescript
getModel(modelId: string): PredictionModel | undefined
```

- **功能**：获取模型
- **参数**：
  - `modelId`：模型ID
- **返回值**：
  - `PredictionModel | undefined`：模型实例

##### getAllModels

```typescript
getAllModels(): PredictionModel[]
```

- **功能**：获取所有模型
- **返回值**：
  - `PredictionModel[]`：模型实例列表

## 5. 八字模块

### 5.1 BaZiCalculator

`BaZiCalculator`是八字计算器，用于计算八字信息。

#### 方法

##### calculateBaZi

```typescript
calculateBaZi(year: number, month: number, day: number, hour: number): BaZiResult
```

- **功能**：计算八字信息
- **参数**：
  - `year`：年份
  - `month`：月份
  - `day`：日期
  - `hour`：小时
- **返回值**：
  - `BaZiResult`：八字结果

### 5.2 LunarConverter

`LunarConverter`是农历转换器，用于转换公历和农历。

#### 方法

##### solarToLunar

```typescript
solarToLunar(year: number, month: number, day: number): LunarDate
```

- **功能**：公历转农历
- **参数**：
  - `year`：公历年
  - `month`：公历月
  - `day`：公历日
- **返回值**：
  - `LunarDate`：农历日期

##### lunarToSolar

```typescript
lunarToSolar(year: number, month: number, day: number, isLeap?: boolean): SolarDate
```

- **功能**：农历转公历
- **参数**：
  - `year`：农历年
  - `month`：农历月
  - `day`：农历日
  - `isLeap`：是否闰月
- **返回值**：
  - `SolarDate`：公历日期

## 6. 六爻模块

### 6.1 LiuYaoCalculator

`LiuYaoCalculator`是六爻计算器，用于计算六爻卦象。

#### 方法

##### calculateHexagram

```typescript
calculateHexagram(question: string): LiuYaoHexagram
```

- **功能**：计算六爻卦象
- **参数**：
  - `question`：占卜问题
- **返回值**：
  - `LiuYaoHexagram`：六爻卦象

## 7. 命运分析模块

### 7.1 FateAnalyzer

`FateAnalyzer`是命运分析器，用于分析命运信息。

#### 方法

##### analyzeFate

```typescript
analyzeFate(baZi: BaZiResult): FateAnalysisResult
```

- **功能**：分析命运信息
- **参数**：
  - `baZi`：八字结果
- **返回值**：
  - `FateAnalysisResult`：命运分析结果

## 8. 解释模块

### 8.1 Interpreter

`Interpreter`是解释器，用于解释占卜结果。

#### 方法

##### interpret

```typescript
interpret(result: FortuneResult, language?: string): string
```

- **功能**：解释占卜结果
- **参数**：
  - `result`：占卜结果
  - `language`：语言代码（默认中文）
- **返回值**：
  - `string`：解释结果

## 9. 工具函数

### 9.1 helpers

#### generateRandomNumber

```typescript
generateRandomNumber(min: number, max: number): number
```

- **功能**：生成随机数
- **参数**：
  - `min`：最小值
  - `max`：最大值
- **返回值**：
  - `number`：随机数

#### formatDate

```typescript
formatDate(date: Date, format: string): string
```

- **功能**：格式化日期
- **参数**：
  - `date`：日期对象
  - `format`：格式字符串
- **返回值**：
  - `string`：格式化后的日期字符串

## 10. 导入导出

### 10.1 导入

```typescript
// 导入所有模块
import * as ZhouyiFramework from 'zhouyi-fortune-framework';

// 导入核心类
import { FortuneTeller, ZhouyiMethod } from 'zhouyi-fortune-framework';

// 导入扩展模块
import { BasePredictionModel, DefaultModelManager } from 'zhouyi-fortune-framework';

// 导入八字模块
import { BaZiCalculator, LunarConverter } from 'zhouyi-fortune-framework';

// 导入六爻模块
import { LiuYaoCalculator } from 'zhouyi-fortune-framework';

// 导入命运分析模块
import { FateAnalyzer } from 'zhouyi-fortune-framework';

// 导入解释模块
import { Interpreter } from 'zhouyi-fortune-framework';

// 导入工具函数
import { generateRandomNumber, formatDate } from 'zhouyi-fortune-framework';
```

### 10.2 导出

框架导出以下模块：

- `FortuneTeller`：核心占卜类
- `ZhouyiMethod`：周易占卜方法
- `BaseFortuneMethod`：基础占卜方法类
- `BasePredictionModel`：基础预测模型类
- `DefaultModelManager`：默认模型管理器
- `ModelRegistry`：模型注册器
- `BaZiCalculator`：八字计算器
- `LunarConverter`：农历转换器
- `LiuYaoCalculator`：六爻计算器
- `FateAnalyzer`：命运分析器
- `Interpreter`：解释器
- `generateRandomNumber`：生成随机数函数
- `formatDate`：格式化日期函数
- 所有接口类型
