import fetch, { Response as FetchResponse } from 'node-fetch';

interface DeepSeekMessage {
  role: string;
  content: string;
}

interface DeepSeekResponse {
  choices: {
    message: DeepSeekMessage;
    index: number;
    finish_reason: string;
  }[];
  created: number;
  model: string;
  object: string;
  usage: {
    completion_tokens: number;
    prompt_tokens: number;
    total_tokens: number;
  };
}

export class DeepSeekModel {
  private apiKey: string;
  private baseUrl: string = 'https://api.deepseek.com/v1/chat/completions';
  private model: string = 'deepseek-chat';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async generate(prompt: string, options?: any): Promise<string> {
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        model: this.model,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: options?.temperature || 0.7,
        max_tokens: options?.maxTokens || 1000,
        top_p: options?.topP || 0.95
      })
    });

    if (!response.ok) {
      const errorBody = await response.text().catch(() => '');
      throw new Error(`DeepSeek API error: ${response.status} ${response.statusText}${errorBody ? ' - ' + errorBody : ''}`);
    }

    const data = await response.json() as DeepSeekResponse;
    return data.choices?.[0]?.message?.content || '';
  }

  getName(): string {
    return 'DeepSeek';
  }

  getDescription(): string {
    return 'DeepSeek AI model for enhanced interpretations';
  }
}

export class DeepSeekKeyManager {
  private static instance: DeepSeekKeyManager;
  private apiKey: string | null = null;

  private constructor() {}

  static getInstance(): DeepSeekKeyManager {
    if (!DeepSeekKeyManager.instance) {
      DeepSeekKeyManager.instance = new DeepSeekKeyManager();
    }
    return DeepSeekKeyManager.instance;
  }

  setApiKey(key: string): void {
    this.apiKey = key;
  }

  getApiKey(): string | null {
    return this.apiKey;
  }

  isApiKeySet(): boolean {
    return !!this.apiKey;
  }
}

export class DeepSeekInterpretationEnhancer {
  private deepSeekModel: DeepSeekModel;

  constructor(apiKey: string) {
    this.deepSeekModel = new DeepSeekModel(apiKey);
  }

  async enhanceInterpretation(baseInterpretation: string, context: any): Promise<string> {
    const prompt = `基于以下周易预测结果和基础解释，生成一个更详细、更专业的解释：\n\n预测结果：${JSON.stringify(context)}\n\n基础解释：${baseInterpretation}\n\n请提供一个全面、深入的解释，包括：\n1. 对结果的详细分析\n2. 可能的影响和建议\n3. 相关的周易原理\n4. 专业的解读视角\n\n输出应该清晰、专业，符合周易预测的传统解读方式。`;

    return this.deepSeekModel.generate(prompt);
  }
}
