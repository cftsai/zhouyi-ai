import { IInterpreter, InterpretationResult, InterpretationTemplate } from '../interfaces';
import { DEFAULT_LANGUAGE, templates as defaultTemplates } from './i18n';
import { DeepSeekInterpretationEnhancer, DeepSeekKeyManager } from '../extensions/deepseek';

export class Interpreter implements IInterpreter {
  private templates: InterpretationTemplate[];
  private defaultLanguage: string;
  private deepSeekEnhancer: DeepSeekInterpretationEnhancer | null = null;

  constructor() {
    this.templates = [...defaultTemplates];
    this.defaultLanguage = DEFAULT_LANGUAGE;
    this.initializeDeepSeek();
  }

  private initializeDeepSeek(): void {
    const keyManager = DeepSeekKeyManager.getInstance();
    if (keyManager.isApiKeySet()) {
      const apiKey = keyManager.getApiKey();
      if (apiKey) {
        this.deepSeekEnhancer = new DeepSeekInterpretationEnhancer(apiKey);
      }
    }
  }

  setDeepSeekApiKey(apiKey: string): void {
    const keyManager = DeepSeekKeyManager.getInstance();
    keyManager.setApiKey(apiKey);
    this.deepSeekEnhancer = new DeepSeekInterpretationEnhancer(apiKey);
  }

  async interpret(result: unknown, templateId?: string, language?: string, useAIEnhancement: boolean = false): Promise<InterpretationResult> {
    const targetLanguage = language || this.defaultLanguage;
    let selectedTemplate: InterpretationTemplate | undefined;

    if (templateId) {
      selectedTemplate = this.templates.find(t => t.id === templateId);
    }

    if (!selectedTemplate) {
      selectedTemplate = this.templates.find(t => t.language === targetLanguage) || this.templates[0];
    }

    let interpretation = this.renderTemplate(selectedTemplate.template, result);

    if (useAIEnhancement && this.deepSeekEnhancer) {
      try {
        const enhancedInterpretation = await this.deepSeekEnhancer.enhanceInterpretation(interpretation, result);
        interpretation = enhancedInterpretation;
      } catch (error) {
        console.error('DeepSeek enhancement error:', error);
        interpretation += '\n\n【AI 增强失败：' + (error instanceof Error ? error.message : String(error)) + '】';
      }
    }

    return {
      originalResult: result,
      interpretation,
      templateId: selectedTemplate.id,
      language: selectedTemplate.language,
      timestamp: new Date(),
      aiEnhanced: useAIEnhancement && this.deepSeekEnhancer !== null
    };
  }

  addTemplate(template: InterpretationTemplate): void {
    const existingIndex = this.templates.findIndex(t => t.id === template.id);
    if (existingIndex >= 0) {
      this.templates[existingIndex] = template;
    } else {
      this.templates.push(template);
    }
  }

  getTemplates(language?: string): InterpretationTemplate[] {
    if (language) {
      return this.templates.filter(t => t.language === language);
    }
    return this.templates;
  }

  setDefaultLanguage(language: string): void {
    this.defaultLanguage = language;
  }

  getDefaultLanguage(): string {
    return this.defaultLanguage;
  }

  private renderTemplate(template: string, data: unknown): string {
    let result = template;
    const placeholders = template.match(/\{\{([^}]+)\}\}/g) || [];

    for (const placeholder of placeholders) {
      const key = placeholder.replace(/\{\{([^}]+)\}\}/, '$1').trim();
      let value = this.getValueFromPath(data, key);
      
      if (value === undefined || value === null) {
        value = '';
      } else if (typeof value === 'object') {
        value = JSON.stringify(value);
      }

      result = result.replace(placeholder, String(value));
    }

    return result;
  }

  private getValueFromPath(obj: unknown, path: string): unknown {
    const keys = path.split('.');
    let value = obj;

    for (const key of keys) {
      if (value === undefined || value === null) {
        return undefined;
      }
      if (typeof value !== 'object' || value === null) {
        return undefined;
      }
      value = (value as Record<string, unknown>)[key];
    }

    return value;
  }
}
