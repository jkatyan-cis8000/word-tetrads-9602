import { Puzzle } from './gameLogic';

export type GameState = {
  words: string[];
  selectedWords: string[];
  solvedGroups: Array<{ category: string; words: string[]; difficulty: string }>;
  mistakes: number;
  maxMistakes: number;
  isGameOver: boolean;
  isGameWon: boolean;
};

export class WordTetradsGame {
  private puzzle: Puzzle;
  private onGameStateChange?: (state: GameState) => void;

  constructor(seed?: number) {
    this.puzzle = new Puzzle(seed);
  }

  init(): void {
    this.notifyGameStateChange();
  }

  selectWord(word: string): void {
    this.puzzle.selectWord(word);
    this.notifyGameStateChange();
  }

  deselectWord(word: string): void {
    this.puzzle.deselectWord(word);
    this.notifyGameStateChange();
  }

  submitGuess(): boolean {
    const result = this.puzzle.submitGuess();
    this.notifyGameStateChange();
    return result.success;
  }

  shuffleWords(): void {
    this.puzzle.shuffleWords();
    this.notifyGameStateChange();
  }

  getWords(): string[] {
    return this.puzzle.getWords();
  }

  getSelectedWords(): string[] {
    return this.puzzle.getSelectedWords();
  }

  getSolvedGroups(): Array<{ category: string; words: string[]; difficulty: string }> {
    return this.puzzle.getSolvedGroups();
  }

  getMistakes(): number {
    return this.puzzle.getMistakes();
  }

  getMaxMistakes(): number {
    return this.puzzle.getMaxMistakes();
  }

  isGameWon(): boolean {
    return this.puzzle.isGameWon();
  }

  isGameOver(): boolean {
    return this.puzzle.isGameOver();
  }

  getState(): GameState {
    return {
      words: this.getWords(),
      selectedWords: this.getSelectedWords(),
      solvedGroups: this.getSolvedGroups(),
      mistakes: this.getMistakes(),
      maxMistakes: this.getMaxMistakes(),
      isGameOver: this.isGameOver(),
      isGameWon: this.isGameWon()
    };
  }

  onStateChange(callback: (state: GameState) => void): void {
    this.onGameStateChange = callback;
  }

  private notifyGameStateChange(): void {
    if (this.onGameStateChange) {
      this.onGameStateChange(this.getState());
    }
  }
}

export const createGame = (seed?: number): WordTetradsGame => {
  return new WordTetradsGame(seed);
};

export const initGameDOM = (game: WordTetradsGame): void => {
  const gridContainer = document.getElementById('gridContainer');
  const messageArea = document.getElementById('messageArea');
  const categoryReveal = document.getElementById('categoryReveal');
  const mistakeCount = document.querySelector('.mistake-count');
  const shuffleBtn = document.getElementById('shuffleBtn');
  const newGameBtn = document.getElementById('newGameBtn');

  if (!gridContainer || !messageArea || !categoryReveal || !mistakeCount) {
    return;
  }

  const renderGrid = (): void => {
    gridContainer.innerHTML = '';
    const words = game.getWords();
    const selected = game.getSelectedWords();

    words.forEach(word => {
      const tile = document.createElement('div');
      tile.className = `word-tile ${selected.includes(word) ? 'selected' : ''}`;
      tile.textContent = word;
      tile.addEventListener('click', () => {
        if (game.getSelectedWords().includes(word)) {
          game.deselectWord(word);
        } else if (game.getSelectedWords().length < 4) {
          game.selectWord(word);
        }
      });
      gridContainer.appendChild(tile);
    });
  };

  const renderMistakes = (): void => {
    mistakeCount.textContent = `${game.getMaxMistakes() - game.getMistakes()}`;
  };

  const renderSolvedGroups = (): void => {
    categoryReveal.innerHTML = '';
    game.getSolvedGroups().forEach(group => {
      const groupDiv = document.createElement('div');
      groupDiv.className = `solved-group ${group.difficulty}`;
      groupDiv.innerHTML = `<strong>${group.category}</strong> (${group.words.join(', ')})`;
      categoryReveal.appendChild(groupDiv);
    });
  };

  const showMessage = (message: string, type: 'success' | 'error' | 'info' = 'info'): void => {
    messageArea.innerHTML = `<span class="message-${type}">${message}</span>`;
    setTimeout(() => {
      messageArea.innerHTML = '';
    }, 3000);
  };

  game.onStateChange(() => {
    renderGrid();
    renderMistakes();
    renderSolvedGroups();

    const state = game.getState();
    if (state.isGameWon) {
      showMessage('Congratulations! You solved all categories!', 'success');
    } else if (state.isGameOver) {
      showMessage('Game Over! Try again.', 'error');
    }
  });

  if (shuffleBtn) {
    shuffleBtn.addEventListener('click', () => game.shuffleWords());
  }

  if (newGameBtn) {
    newGameBtn.addEventListener('click', () => {
      window.location.reload();
    });
  }

  game.init();
};
