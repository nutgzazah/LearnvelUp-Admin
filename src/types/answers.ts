export type Answer = {
  id: number;
  question_id: number;
  answer_text: string;
  is_correct: boolean;
};

export type AnswerPayload = Omit<Answer, "id">;