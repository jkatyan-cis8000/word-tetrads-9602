import { CATEGORIES, generateDailySeed, SeedRandom, selectPuzzleWords } from './categories';

export type GameResult = {
  success: boolean;
  category?: string;
  difficulty?: string;
  words: string[];
};

export type SolvedGroup = {
  category: string;
  words: string[];
  difficulty: string;
};

export type GameState = {
  words: string[];
  selectedWords: string[];
  solvedGroups: SolvedGroup[];
  mistakes: number;
  maxMistakes: number;
};

export class Puzzle {
  private words: string[];
  private selectedWords: string[];
  private solvedGroups: SolvedGroup[];
  private mistakes: number;
  private maxMistakes: number;
  private currentCategories: { name: string; difficulty: string; words: string[] }[];

  constructor(seed?: number) {
    const date = new Date();
    const dailySeed = seed ?? generateDailySeed(date);
    const puzzleData = selectPuzzleWords(dailySeed);
    
    this.words = puzzleData.words;
    this.selectedWords = [];
    this.solvedGroups = [];
    this.mistakes = 0;
    this.maxMistakes = 4;
    this.currentCategories = puzzleData.categories.map(cat => ({
      name: cat.name,
      difficulty: cat.difficulty,
      words: cat.words
    }));
  }

  selectWord(word: string): void {
    if (this.selectedWords.includes(word)) return;
    if (this.selectedWords.length >= 4) return;
    
    this.selectedWords.push(word);
  }

  deselectWord(word: string): void {
    this.selectedWords = this.selectedWords.filter(w => w !== word);
  }

  getSelectedWords(): string[] {
    return [...this.selectedWords];
  }

  submitGuess(): GameResult {
    const selected = [...this.selectedWords];
    
    if (selected.length !== 4) {
      return { success: false, words: selected };
    }

    const matchingCategory = this.currentCategories.find(cat => 
      selected.every(word => cat.words.includes(word))
    );

    if (matchingCategory) {
      this.solvedGroups.push({
        category: matchingCategory.name,
        words: selected,
        difficulty: matchingCategory.difficulty
      });
      
      this.words = this.words.filter(word => !selected.includes(word));
      this.selectedWords = [];
      
      return {
        success: true,
        category: matchingCategory.name,
        difficulty: matchingCategory.difficulty,
        words: selected
      };
    } else {
      this.mistakes++;
      this.selectedWords = [];
      
      return {
        success: false,
        words: selected
      };
    }
  }

  shuffleWords(): void {
    const shuffled = [...this.words];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    this.words = shuffled;
  }

  isGameWon(): boolean {
    return this.solvedGroups.length === 4;
  }

  isGameOver(): boolean {
    return this.isGameWon() || this.mistakes >= this.maxMistakes;
  }

  getWords(): string[] {
    return [...this.words];
  }

  getSolvedGroups(): SolvedGroup[] {
    return [...this.solvedGroups];
  }

  getMistakes(): number {
    return this.mistakes;
  }

  getMaxMistakes(): number {
    return this.maxMistakes;
  }

  getRemainingWords(): string[] {
    return [...this.words];
  }

  isWordSelected(word: string): boolean {
    return this.selectedWords.includes(word);
  }

  getSelectedCount(): number {
    return this.selectedWords.length;
  }

  validateGroup(words: string[]): { valid: boolean; category?: string; difficulty?: string } {
    if (words.length !== 4) {
      return { valid: false };
    }

    const matchingCategory = this.currentCategories.find(cat => 
      words.every(word => cat.words.includes(word))
    );

    if (matchingCategory) {
      return {
        valid: true,
        category: matchingCategory.name,
        difficulty: matchingCategory.difficulty
      };
    }

    return { valid: false };
  }

  static validateGroupStatic(words: string[], categories: { name: string; difficulty: string; words: string[] }[]): { valid: boolean; category?: string; difficulty?: string } {
    if (words.length !== 4) {
      return { valid: false };
    }

    const matchingCategory = categories.find(cat => 
      words.every(word => cat.words.includes(word))
    );

    if (matchingCategory) {
      return {
        valid: true,
        category: matchingCategory.name,
        difficulty: matchingCategory.difficulty
      };
    }

    return { valid: false };
  }
}

export const validateAllPossibleGroups = (words: string[], categories: { name: string; difficulty: string; words: string[] }[]): SolvedGroup[] => {
  const validGroups: SolvedGroup[] = [];
  
  for (const cat of categories) {
    const matchingWords = words.filter(word => cat.words.includes(word));
    if (matchingWords.length === 4) {
      validGroups.push({
        category: cat.name,
        words: matchingWords,
        difficulty: cat.difficulty
      });
    }
  }
  
  return validGroups;
};
