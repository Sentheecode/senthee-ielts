export interface QuestionBank {
  reading: ReadingQuestion[];
  listening: ListeningQuestion[];
  writing: string[];
  speaking: SpeakingQuestion[];
}

export interface ReadingQuestion {
  id: string;
  difficulty: "easy" | "medium" | "hard";
  tags: string[];
  source: string;
  title: string;
  passage: string;
  questions: {
    id: string;
    text: string;
    options: string[];
    answer: number;
    explanation: string;
  }[];
}

export interface ListeningQuestion {
  id: string;
  difficulty: "easy" | "medium" | "hard";
  tags: string[];
  source: string;
  title: string;
  script: string;
  questions: {
    id: string;
    text: string;
    options: string[];
    answer: number;
    explanation: string;
  }[];
}

export interface SpeakingQuestion {
  id: string;
  difficulty: "easy" | "medium" | "hard";
  part: number;
  prompt: string;
}
