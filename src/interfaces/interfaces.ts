export interface InterpretationTemplate {
  id: string;
  name: string;
  description: string;
  template: string;
  language: string;
}

export interface InterpretationResult {
  originalResult: unknown;
  interpretation: string;
  templateId: string;
  language: string;
  timestamp: Date;
  aiEnhanced?: boolean;
}

export interface IInterpreter {
  interpret(result: unknown, templateId?: string, language?: string, useAIEnhancement?: boolean): Promise<InterpretationResult>;
  addTemplate(template: InterpretationTemplate): void;
  getTemplates(language?: string): InterpretationTemplate[];
  setDefaultLanguage(language: string): void;
  getDefaultLanguage(): string;
  setDeepSeekApiKey(apiKey: string): void;
}

export interface PredictionModel {
  id: string;
  name: string;
  description: string;
  version: string;
  author: string;
  predict(data: unknown): Promise<PredictionResult>;
  getMetadata(): ModelMetadata;
}

export interface PredictionResult {
  modelId: string;
  input: unknown;
  output: unknown;
  confidence: number;
  timestamp: Date;
  details?: unknown;
}

export interface ModelMetadata {
  id: string;
  name: string;
  description: string;
  version: string;
  author: string;
  createdAt: Date;
  tags?: string[];
  dependencies?: string[];
}

export interface ModelManager {
  registry: ModelRegistry;
  loadModel(modelId: string): Promise<PredictionModel>;
  unloadModel(modelId: string): void;
  listModels(): PredictionModel[];
  getModelInfo(modelId: string): ModelMetadata | null;
  validateModel(model: PredictionModel): boolean;
}

export interface ModelRegistry {
  register(model: PredictionModel): void;
  unregister(modelId: string): void;
  getModel(modelId: string): PredictionModel | null;
  getAllModels(): PredictionModel[];
  getModelsByTag(tag: string): PredictionModel[];
}

export interface SolarDate {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute?: number;
  second?: number;
}

export interface LunarDate {
  year: number;
  month: number;
  day: number;
  isLeap: boolean;
}

export interface BaZi {
  year: { stem: HeavenlyStem; branch: EarthlyBranch };
  month: { stem: HeavenlyStem; branch: EarthlyBranch };
  day: { stem: HeavenlyStem; branch: EarthlyBranch };
  hour: { stem: HeavenlyStem; branch: EarthlyBranch };
}

export interface BaZiInfo {
  solarDate: SolarDate;
  lunarDate: LunarDate;
  baZi: BaZi;
  wuxing: {
    year: string;
    month: string;
    day: string;
    hour: string;
  };
  yinyang: {
    year: string;
    month: string;
    day: string;
    hour: string;
  };
}

export interface HeavenlyStem {
  name: string;
  index: number;
}

export interface EarthlyBranch {
  name: string;
  index: number;
}

export interface LiuYaoHexagram {
  upperTrigram: string;
  lowerTrigram: string;
  hexagramNumber: number;
  name: string;
  meaning: string;
  lines: LiuYaoLine[];
  changingLines?: number[];
  transformedHexagram?: LiuYaoHexagram;
}

export interface LiuYaoLine {
  position: number;
  isChanging: boolean;
  yinYang: 'yang' | 'yin';
  text: string;
}

export interface ManualCastInput {
  first: number[];
  second: number[];
  third: number[];
}

export interface TimeCastInput {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
}

export interface WuXingAnalysis {
  distribution: {
    wood: number;
    fire: number;
    earth: number;
    metal: number;
    water: number;
  };
  strengths: {
    wood?: 'strong' | 'medium' | 'weak';
    fire?: 'strong' | 'medium' | 'weak';
    earth?: 'strong' | 'medium' | 'weak';
    metal?: 'strong' | 'medium' | 'weak';
    water?: 'strong' | 'medium' | 'weak';
  };
  preferences: {
    favorable: string[];
    unfavorable: string[];
  };
  analysis: string;
}

export interface ShiShenInfo {
  type: string;
  element: string;
  yinYang: string;
  position: 'year' | 'month' | 'day' | 'hour';
  strength: 'strong' | 'medium' | 'weak';
  source?: 'stem' | 'hidden';
  hiddenStemName?: string;
}

export interface ShiShenAnalysis {
  shiShenList: ShiShenInfo[];
  dominantShiShen: string[];
  analysis: string;
  shiShenCount?: Record<string, number>;
  branchShiShenList?: ShiShenInfo[];
}

export interface DaYun {
  startAge: number;
  endAge: number;
  years: number[];
  stem: string;
  branch: string;
  element: string;
  luck: 'good' | 'medium' | 'bad';
  analysis: string;
}

export interface LiuNian {
  year: number;
  stem: string;
  branch: string;
  element: string;
  luck: 'good' | 'medium' | 'bad';
  analysis: string;
}

export interface DaYunLiuNianAnalysis {
  daYunList: DaYun[];
  liuNianList: LiuNian[];
  currentDaYun: DaYun | null;
  currentLiuNian: LiuNian | null;
  analysis: string;
}

export interface FateAnalysis {
  wuXingAnalysis: WuXingAnalysis;
  shiShenAnalysis: ShiShenAnalysis;
  daYunLiuNianAnalysis: DaYunLiuNianAnalysis;
  overallAnalysis: string;
  suggestions: string[];
}

export interface IFortuneTeller {
  tellFortune(question: string): Promise<FortuneResult>;
  getMethod(): string;
}

export interface FortuneResult {
  question: string;
  answer: string;
  method: string;
  timestamp: Date;
  details?: unknown;
}

export interface FortuneMethod {
  name: string;
  description: string;
  execute(question: string): Promise<FortuneResult>;
}

export interface ZhouyiHexagram {
  upperTrigram: string;
  lowerTrigram: string;
  hexagramNumber: number;
  name: string;
  meaning: string;
  lines?: HexagramLine[];
  changingLines?: number[];
  transformedHexagram?: ZhouyiHexagram;
}

export interface HexagramLine {
  position: number;
  isChanging: boolean;
  text: string;
}
