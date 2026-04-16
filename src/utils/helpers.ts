export function formatDate(date: Date): string {
  return date.toISOString();
}

export function validateQuestion(question: string): boolean {
  return !!question && question.trim().length > 0;
}

export function generateRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}