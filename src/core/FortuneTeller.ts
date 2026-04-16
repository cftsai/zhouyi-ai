import { IFortuneTeller, FortuneResult, FortuneMethod } from '../interfaces';

export class FortuneTeller implements IFortuneTeller {
  private method: FortuneMethod;

  constructor(method: FortuneMethod) {
    this.method = method;
  }

  async tellFortune(question: string): Promise<FortuneResult> {
    return this.method.execute(question);
  }

  getMethod(): string {
    return this.method.name;
  }
}

export class BaseFortuneMethod implements FortuneMethod {
  name: string;
  description: string;

  constructor(name: string, description: string) {
    this.name = name;
    this.description = description;
  }

  async execute(question: string): Promise<FortuneResult> {
    throw new Error('Method not implemented');
  }
}