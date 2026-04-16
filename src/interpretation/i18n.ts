import { InterpretationTemplate } from '../interfaces';

export const DEFAULT_LANGUAGE = 'zh-CN';

export const templates: InterpretationTemplate[] = [
  {
    id: 'default-zh-cn',
    name: '默认模板（中文）',
    description: '默认的中文解释模板',
    template: '针对问题「{{question}}」，使用{{method}}方法的结果是：{{answer}}。详细信息：{{details}}',
    language: 'zh-CN'
  },
  {
    id: 'default-en-us',
    name: 'Default Template (English)',
    description: 'Default English interpretation template',
    template: 'For the question "{{question}}", the result using {{method}} method is: {{answer}}. Details: {{details}}',
    language: 'en-US'
  },
  {
    id: 'detailed-zh-cn',
    name: '详细模板（中文）',
    description: '详细的中文解释模板',
    template: '尊敬的用户，针对您提出的问题「{{question}}」，我们使用{{method}}方法进行了分析。\n\n分析结果：{{answer}}\n\n详细信息：{{details}}\n\n此解释生成于 {{timestamp}}',
    language: 'zh-CN'
  },
  {
    id: 'detailed-en-us',
    name: 'Detailed Template (English)',
    description: 'Detailed English interpretation template',
    template: 'Dear user, regarding your question "{{question}}", we analyzed it using the {{method}} method.\n\nAnalysis result: {{answer}}\n\nDetails: {{details}}\n\nThis interpretation was generated on {{timestamp}}',
    language: 'en-US'
  }
];
