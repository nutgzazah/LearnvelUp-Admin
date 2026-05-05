import { supabase } from "@/lib/supabase";
import { ChapterPayload } from "@/types/chapters";
import { getVideoDurationSeconds, uploadChapterVideo } from "@/services/video-service";

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
  videoFile?: File | null;
};

export async function createFullChapter({
  chapter,
  questions,
  videoFile,
}: CreateFullChapterPayload) {
  if (!chapter.course_id) {
    throw new Error("course_id is required");
  }

  // ดึง price_coins ของคอร์ส
  const { data: courseData, error: courseError } = await supabase
    .from("courses")
    .select("price_coins")
    .eq("id", chapter.course_id)
    .single();

  if (courseError) {
    console.error("course fetch error", courseError);
    throw courseError;
  }

  const priceCoins = courseData?.price_coins ?? 0;

  // คำนวณ 10% ของราคา
  const rewardCoins = Math.floor(priceCoins * 0.1);

  const chapterPayload: ChapterPayload = {
    ...chapter,
    video_url: null,
    duration_seconds: null,
    reward_energy: 2,
    reward_xp: 20,
    reward_coins: rewardCoins,
  };

  const { data: chapterData, error: chapterError } = await supabase
    .from("chapters")
    .insert([chapterPayload])
    .select()
    .single();

  if (chapterError) {
    console.error("chapter insert error", chapterError);
    throw chapterError;
  }

  const chapterId = chapterData.id;

  if (videoFile) {
    const durationSeconds = await getVideoDurationSeconds(videoFile);

    const uploaded = await uploadChapterVideo({
      file: videoFile,
      courseId: chapter.course_id,
      chapterId: chapterId,
    });

    const { error: updateChapterError } = await supabase
      .from("chapters")
      .update({
        video_url: uploaded.filePath,
        duration_seconds: durationSeconds,
      })
      .eq("id", chapterId);

    if (updateChapterError) {
      console.error("chapter video update error", updateChapterError);
      throw updateChapterError;
    }

    chapterData.video_url = uploaded.filePath;
    chapterData.duration_seconds = durationSeconds;
  }

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