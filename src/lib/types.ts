export type Question = {
  id: number;
  questionText: React.ReactNode;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  points: number;
};
