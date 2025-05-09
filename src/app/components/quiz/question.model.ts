export interface Question {
    question: string; // The question text
    answers: { [key: string]: string }; // Key-value pairs for answers (e.g., 'A': 'Paris')
    correctAnswer: string; // The correct answer key (e.g., 'A')
    explanation?: string

  }
  