import { supabase } from "@/lib/supabase";
import { Course, CoursePayload } from "@/types/course";
import { uploadChapterVideo ,getVideoDurationSeconds} from "@/services/video-service";

type UpdateChapterPayload = {
  chapter_id: number;
  course_id: number;
  title: string;
  videoFile?: File | null;
  questions: {
    question_id: number;
    question_text: string;
    answers: {
      id: number;
      answer_text: string;
      is_correct: boolean;
    }[];
  }[];
};


// 1. READ:
export const getCourses = async (): Promise<Course[]> => {
  const { data, error } = await supabase
    .from("courses")
    .select("*")
    .order("id", { ascending: false });

  if (error) throw error;
  return data || [];
};

// 2. CREATE:
export const createCourse = async (payload: CoursePayload) => {
  const { data, error } = await supabase
    .from("courses")
    .insert([payload])
    .select();

  if (error) throw error;
  return data;
};

// 3. UPDATE:
export const updateCourse = async (id: number, payload: Partial<CoursePayload>) => {
  const { data, error } = await supabase
    .from("courses")
    .update(payload)
    .eq("id", id)
    .select();

  if (error) throw error;
  return data;
};

// 4. DELETE:
export const deleteCourse = async (id: number) => {
  const { error } = await supabase.from("courses").delete().eq("id", id);
  if (error) throw error;
};

export async function getCourseById(id: string) {

  const { data, error } = await supabase
    .from("courses")
    .select(`
      id,
      title,
      chapters (
        id,
        title,
        video_url,
        questions (
          id,
          question_text,
          answers (
            id,
            answer_text,
            is_correct
          )
        )
      )
    `)
    .eq("id", id)
    .order("id", { foreignTable: "chapters", ascending: true })
    .single();

  if (error) {
    console.error(error);
  }

  return data;
}

export async function updateChapter(payload: UpdateChapterPayload) {
  const { chapter_id, course_id, title, questions, videoFile } = payload;

  let videoPath: string | undefined;
  let durationSeconds: number | undefined;

  if (videoFile) {
    const uploaded = await uploadChapterVideo({
      file: videoFile,
      courseId: course_id,
      chapterId: chapter_id,
    });

    videoPath = uploaded.filePath;
    durationSeconds = await getVideoDurationSeconds(videoFile);
  }

  const updateData: {
    title: string;
    video_url?: string;
    duration_seconds?: number;
  } = {
    title,
  };

  if (videoPath) {
    updateData.video_url = videoPath;
  }

  if (durationSeconds !== undefined) {
    updateData.duration_seconds = durationSeconds;
  }

  const { error: chapterError } = await supabase
    .from("chapters")
    .update(updateData)
    .eq("id", chapter_id);

  if (chapterError) throw chapterError;

  for (const q of questions) {
    const { error: questionError } = await supabase
      .from("questions")
      .update({
        question_text: q.question_text,
      })
      .eq("id", q.question_id);

    if (questionError) throw questionError;

    for (const a of q.answers) {
      const { error: answerError } = await supabase
        .from("answers")
        .update({
          answer_text: a.answer_text,
          is_correct: a.is_correct,
        })
        .eq("id", a.id);

      if (answerError) throw answerError;
    }
  }
}

export async function uploadCourseCover(file: File) {
  const fileExt = file.name.split(".").pop();
  const fileName = `${Date.now()}.${fileExt}`;

  const filePath = `courses/${fileName}`;

  const { error } = await supabase.storage
    .from("images")
    .upload(filePath, file);

  if (error) throw error;

  const { data } = supabase.storage
    .from("images")
    .getPublicUrl(filePath);

  return data.publicUrl;
}

export const getViewCourse = async (instructorId?: string): Promise<Course[]> => {
  let query = supabase
    .from("courses")
    .select("*")
    .order("id", { ascending: false });

  if (instructorId) {
    query = query.eq("instructor_id", instructorId);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data || [];
};


