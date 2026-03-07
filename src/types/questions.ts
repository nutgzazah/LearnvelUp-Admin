export type Question = {
  id: number;
  chapter_id: number;
  question_text: string;
  sequence_order: number;
  points: number;
};

export type QuestionPayload = Omit<Question, "id">;