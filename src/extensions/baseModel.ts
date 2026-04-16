import { PredictionModel, PredictionResult, ModelMetadata } from '../interfaces';

export abstract class BasePredictionModel implements PredictionModel {
  id: string;
  name: string;
  description: string;
  version: string;
  author: string;
  private createdAt: Date;
  private tags: string[];
  private dependencies: string[];

  constructor(
    id: string,
    name: string,
    description: string,
    version: string,
    author: string,
    tags: string[] = [],
    dependencies: string[] = []
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.version = version;
    this.author = author;
    this.createdAt = new Date();
    this.tags = tags;
    this.dependencies = dependencies;
  }

  abstract predict(data: any): Promise<PredictionResult>;

  getMetadata(): ModelMetadata {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      version: this.version,
      author: this.author,
      createdAt: this.createdAt,
      tags: this.tags,
      dependencies: this.dependencies
    };
  }

  protected createPredictionResult(input: any, output: any, confidence: number, details?: any): PredictionResult {
    return {
      modelId: this.id,
      input,
      output,
      confidence,
      timestamp: new Date(),
      details
    };
  }
}