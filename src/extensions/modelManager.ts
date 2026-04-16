import { ModelManager, PredictionModel, ModelRegistry, ModelMetadata } from '../interfaces';
import { DefaultModelRegistry } from './modelRegistry';

export class DefaultModelManager implements ModelManager {
  registry: ModelRegistry;
  private loadedModels: Set<string> = new Set();

  constructor(registry?: ModelRegistry) {
    this.registry = registry || new DefaultModelRegistry();
  }

  async loadModel(modelId: string): Promise<PredictionModel> {
    if (!modelId) {
      throw new Error('Invalid modelId: modelId must be provided');
    }

    const model = this.registry.getModel(modelId);
    if (!model) {
      throw new Error(`Model with id ${modelId} not found in registry`);
    }

    // 标记模型为已加载
    this.loadedModels.add(modelId);
    return model;
  }

  unloadModel(modelId: string): void {
    if (!modelId) {
      throw new Error('Invalid modelId: modelId must be provided');
    }

    if (!this.loadedModels.has(modelId)) {
      throw new Error(`Model with id ${modelId} is not loaded`);
    }

    this.loadedModels.delete(modelId);
  }

  listModels(): PredictionModel[] {
    return this.registry.getAllModels();
  }

  getModelInfo(modelId: string): ModelMetadata | null {
    if (!modelId) {
      return null;
    }

    const model = this.registry.getModel(modelId);
    if (!model) {
      return null;
    }

    return model.getMetadata();
  }

  validateModel(model: PredictionModel): boolean {
    if (!model) {
      return false;
    }

    // 验证模型的必需属性
    if (!model.id || !model.name || !model.version || !model.author) {
      return false;
    }

    // 验证模型方法
    if (typeof model.predict !== 'function' || typeof model.getMetadata !== 'function') {
      return false;
    }

    // 验证元数据
    const metadata = model.getMetadata();
    if (!metadata || !metadata.id || !metadata.name || !metadata.version || !metadata.author) {
      return false;
    }

    return true;
  }
}