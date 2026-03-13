import { supabase } from "@/lib/supabase";
import { ChapterPayload } from "@/types/chapters";

type ChoiceKey = "ก" | "ข" | "ค" | "ง";

type Choice = {
  key: ChoiceKey;
  label: string;
};

type QuestionBlock = {
  question: string;
  choices: Choice[];
  selectedChoiceKey: ChoiceKey | null;
};

type CreateFullChapterPayload = {
  chapter: ChapterPayload;
  questions: QuestionBlock[];
};

export async function createFullChapter({
  chapter,
  questions,
}: CreateFullChapterPayload) {

  /* ---------- 1 insert chapter ---------- */

  const { data: chapterData, error: chapterError } = await supabase
    .from("chapters")
    .insert([chapter])
    .select()
    .single();

  if (chapterError) {
    console.error("chapter insert error", chapterError);
    throw chapterError;
  }

  const chapterId = chapterData.id;

  /* ---------- 2 insert questions ---------- */

  for (let qIndex = 0; qIndex < questions.length; qIndex++) {
    const q = questions[qIndex];

    const { data: questionData, error: questionError } = await supabase
      .from("questions")
      .insert([
        {
          chapter_id: chapterId,
          question_text: q.question,
          sequence_order: qIndex + 1,
          points: 1,
        },
      ])
      .select()
      .single();

    if (questionError) {
      console.error("question insert error", questionError);
      throw questionError;
    }

    const questionId = questionData.id;

    /* ---------- 3 insert answers ---------- */

    const answersPayload = q.choices.map((c) => ({
      question_id: questionId,
      answer_text: c.label,
      is_correct: q.selectedChoiceKey === c.key,
    }));

    const { error: answerError } = await supabase
      .from("answers")
      .insert(answersPayload);

    if (answerError) {
      console.error("answer insert error", answerError);
      throw answerError;
    }
  }

  return chapterData;
}