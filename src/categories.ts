export type Category = {
  name: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  words: string[];
};

export const CATEGORIES: Category[] = [
  {
    name: 'Fruits',
    difficulty: 'easy',
    words: ['apple', 'banana', 'cherry', 'date', 'elderberry', 'fig', 'grape', 'honeydew']
  },
  {
    name: 'Colors',
    difficulty: 'easy',
    words: ['red', 'blue', 'green', 'yellow', 'orange', 'purple', 'black', 'white']
  },
  {
    name: 'Months',
    difficulty: 'medium',
    words: ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august']
  },
  {
    name: 'Planets',
    difficulty: 'medium',
    words: ['mercury', 'venus', 'earth', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune']
  },
  {
    name: 'Animals',
    difficulty: 'medium',
    words: ['lion', 'tiger', 'bear', 'wolf', 'fox', 'zebra', 'giraffe', 'elephant']
  },
  {
    name: 'Body Parts',
    difficulty: 'medium',
    words: ['hand', 'foot', 'head', 'heart', 'liver', 'brain', 'skin', 'bone']
  },
  {
    name: 'Weather',
    difficulty: 'medium',
    words: ['rain', 'snow', 'wind', 'cloud', 'fog', 'hail', 'sleet', 'storm']
  },
  {
    name: 'Vehicles',
    difficulty: 'medium',
    words: ['car', 'bus', 'train', 'plane', 'ship', 'bike', 'truck', 'boat']
  },
  {
    name: 'Music',
    difficulty: 'hard',
    words: ['note', 'scale', 'chord', 'beat', 'rhythm', 'melody', 'harmony', 'tone']
  },
  {
    name: 'Sports',
    difficulty: 'hard',
    words: ['goal', 'score', 'team', 'play', 'win', 'loss', 'draw', 'race']
  },
  {
    name: 'Shapes',
    difficulty: 'hard',
    words: ['circle', 'square', 'triangle', 'rectangle', 'pentagon', 'hexagon', 'octagon', 'sphere']
  },
  {
    name: 'Clothing',
    difficulty: 'hard',
    words: ['shirt', 'pants', 'dress', 'coat', 'hat', 'shoes', 'socks', 'gloves']
  },
  {
    name: 'Household Items',
    difficulty: 'expert',
    words: ['table', 'chair', 'lamp', 'mirror', 'rug', 'curtain', 'bed', 'sofa']
  },
  {
    name: 'Kitchen Items',
    difficulty: 'expert',
    words: ['spoon', 'fork', 'knife', 'plate', 'bowl', 'cup', 'glass', 'mug']
  },
  {
    name: 'Tools',
    difficulty: 'expert',
    words: ['hammer', 'screwdriver', 'wrench', 'pliers', 'saw', 'drill', 'clamp', 'level']
  },
  {
    name: 'Birds',
    difficulty: 'expert',
    words: ['eagle', 'hawk', 'falcon', 'owl', 'sparrow', 'robin', 'crow', 'dove']
  },
  {
    name: 'Trees',
    difficulty: 'expert',
    words: ['oak', 'pine', 'maple', 'birch', 'willow', 'elm', 'ash', 'beech']
  },
  {
    name: 'Musical Instruments',
    difficulty: 'expert',
    words: ['guitar', 'piano', 'violin', 'flute', 'trumpet', 'saxophone', 'drums', 'bass']
  },
  {
    name: 'Countries',
    difficulty: 'expert',
    words: ['usa', 'canada', 'mexico', 'brazil', 'uk', 'france', 'germany', 'japan']
  },
  {
    name: 'Ocean Words',
    difficulty: 'expert',
    words: ['wave', 'tide', 'current', 'reef', 'shell', 'coral', 'whale', 'shark']
  }
];

export const getRandomInt = (seed: number): number => {
  const x = Math.sin(seed++) * 10000;
  return Math.floor(x - Math.floor(x));
};

export class SeedRandom {
  private seed: number;
  
  constructor(seed: number) {
    this.seed = seed;
  }
  
  next(): number {
    this.seed = (this.seed * 9301 + 49297) % 233280;
    return this.seed / 233280;
  }
  
  nextInt(max: number): number {
    return Math.floor(this.next() * max);
  }
}

export const generateDailySeed = (date: Date): number => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  return year * 10000 + month * 100 + day;
};

export const selectPuzzleWords = (seed: number): { words: string[]; categories: Category[] } => {
  const rng = new SeedRandom(seed);
  const shuffledCategories = [...CATEGORIES];
  
  for (let i = shuffledCategories.length - 1; i > 0; i--) {
    const j = rng.nextInt(i + 1);
    [shuffledCategories[i], shuffledCategories[j]] = [shuffledCategories[j], shuffledCategories[i]];
  }
  
  const selectedCategories = shuffledCategories.slice(0, 4);
  const allWords = selectedCategories.flatMap(cat => cat.words);
  
  const shuffledWords = [...allWords];
  for (let i = shuffledWords.length - 1; i > 0; i--) {
    const j = rng.nextInt(i + 1);
    [shuffledWords[i], shuffledWords[j]] = [shuffledWords[j], shuffledWords[i]];
  }
  
  return {
    words: shuffledWords,
    categories: selectedCategories
  };
};
