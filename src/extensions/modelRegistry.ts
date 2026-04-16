import { ModelRegistry, PredictionModel } from '../interfaces';

export class DefaultModelRegistry implements ModelRegistry {
  private models: Map<string, PredictionModel> = new Map();

  register(model: PredictionModel): void {
    if (!model || !model.id) {
      throw new Error('Invalid model: model must have an id');
    }
    
    if (this.models.has(model.id)) {
      throw new Error(`Model with id ${model.id} already registered`);
    }
    
    this.models.set(model.id, model);
  }

  unregister(modelId: string): void {
    if (!modelId) {
      throw new Error('Invalid modelId: modelId must be provided');
    }
    
    if (!this.models.has(modelId)) {
      throw new Error(`Model with id ${modelId} not found`);
    }
    
    this.models.delete(modelId);
  }

  getModel(modelId: string): PredictionModel | null {
    if (!modelId) {
      return null;
    }
    
    return this.models.get(modelId) || null;
  }

  getAllModels(): PredictionModel[] {
    return Array.from(this.models.values());
  }

  getModelsByTag(tag: string): PredictionModel[] {
    if (!tag) {
      return [];
    }
    
    return Array.from(this.models.values()).filter(model => {
      const metadata = model.getMetadata();
      return metadata.tags && metadata.tags.includes(tag);
    });
  }
}