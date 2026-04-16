import { KnowledgeEntry, searchKnowledge, getKnowledgeByCategory, getKnowledgeBySource, getKnowledgeByTag, getKnowledgeCount, knowledgeBase } from './knowledgeBase';
import { BaZiInfo, FateAnalysis } from '../interfaces';
import { wuxingMap } from '../fate/fateAnalyzer';

export interface RagResult {
  query: string;
  matchedEntries: KnowledgeEntry[];
  augmentedAnalysis: string;
  relevantQuotes: string[];
}

export interface RagSearchOptions {
  limit?: number;
  sources?: string[];
  categories?: string[];
  minScore?: number;
}

function extractKeywordsFromBaZi(baZiInfo: BaZiInfo): string[] {
  const { baZi } = baZiInfo;
  const keywords: string[] = [];
  const dayStem = baZi.day.stem.name;
  const dayElement = wuxingMap[dayStem] || '';
  keywords.push(dayStem, dayElement);
  keywords.push(baZi.year.stem.name + baZi.year.branch.name);
  keywords.push(baZi.month.stem.name + baZi.month.branch.name);
  keywords.push(baZi.day.stem.name + baZi.day.branch.name);
  keywords.push(baZi.hour.stem.name + baZi.hour.branch.name);
  const allStems = [baZi.year.stem.name, baZi.month.stem.name, baZi.day.stem.name, baZi.hour.stem.name];
  allStems.forEach(stem => {
    const wx = wuxingMap[stem];
    if (wx) keywords.push(wx);
  });
  return [...new Set(keywords)];
}

function extractKeywordsFromFate(fateAnalysis: FateAnalysis): string[] {
  const keywords: string[] = [];
  fateAnalysis.shiShenAnalysis.shiShenList.forEach(s => {
    keywords.push(s.type);
  });
  keywords.push(...fateAnalysis.shiShenAnalysis.dominantShiShen);
  const wxCn: Record<string, string> = { wood: '木', fire: '火', earth: '土', metal: '金', water: '水' };
  fateAnalysis.wuXingAnalysis.preferences.favorable.forEach(f => {
    keywords.push(wxCn[f] || f);
    keywords.push('喜' + (wxCn[f] || f));
  });
  fateAnalysis.wuXingAnalysis.preferences.unfavorable.forEach(u => {
    keywords.push(wxCn[u] || u);
    keywords.push('忌' + (wxCn[u] || u));
  });
  return [...new Set(keywords)];
}

export function searchRag(query: string, options?: RagSearchOptions): RagResult {
  const limit = options?.limit || 10;
  let results = searchKnowledge(query, limit * 2);
  if (options?.sources && options.sources.length > 0) {
    results = results.filter(e => options.sources!.includes(e.source));
  }
  if (options?.categories && options.categories.length > 0) {
    results = results.filter(e => options.categories!.some(c => e.category.includes(c)));
  }
  results = results.slice(0, limit);
  const relevantQuotes = results.slice(0, 3).map(e => `【${e.source}·${e.title}】${e.content.substring(0, 80)}...`);
  const augmentedAnalysis = results.length > 0
    ? `根据经典文献检索，${results.map(e => `《${e.source}》${e.title}云：${e.content.substring(0, 60)}`).join('；')}`
    : '未检索到相关经典文献。';
  return {
    query,
    matchedEntries: results,
    augmentedAnalysis,
    relevantQuotes
  };
}

export function augmentBaZiWithRag(baZiInfo: BaZiInfo, fateAnalysis: FateAnalysis): RagResult[] {
  const baziKeywords = extractKeywordsFromBaZi(baZiInfo);
  const fateKeywords = extractKeywordsFromFate(fateAnalysis);
  const allKeywords = [...new Set([...baziKeywords, ...fateKeywords])];
  const queries = [
    allKeywords.slice(0, 3).join(' '),
    ...fateAnalysis.shiShenAnalysis.dominantShiShen.map(s => s + ' ' + allKeywords[0]),
    ...fateAnalysis.wuXingAnalysis.preferences.favorable.slice(0, 2).map(f => {
      const wxCn: Record<string, string> = { wood: '木', fire: '火', earth: '土', metal: '金', water: '水' };
      return '喜' + (wxCn[f] || f);
    })
  ];
  return queries.map(q => searchRag(q, { limit: 5 }));
}

export function getRagStats(): { totalEntries: number; bySource: Record<string, number>; byCategory: Record<string, number> } {
  const stats = getKnowledgeCount();
  return {
    totalEntries: stats.total,
    bySource: stats.bySource,
    byCategory: stats.byCategory
  };
}

export { KnowledgeEntry, searchKnowledge, getKnowledgeByCategory, getKnowledgeBySource, getKnowledgeByTag, getKnowledgeCount, knowledgeBase };
