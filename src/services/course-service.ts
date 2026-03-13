import { supabase } from "@/lib/supabase";
import { Course, CoursePayload } from "@/types/course";

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

export async function updateChapter(payload: any) {

  const { chapter_id, title, questions } = payload;

  await supabase
    .from("chapters")
    .update({ title })
    .eq("id", chapter_id);

  for (const q of questions) {

    await supabase
      .from("questions")
      .update({
        question_text: q.question_text
      })
      .eq("id", q.question_id);

    for (const a of q.answers) {

      await supabase
        .from("answers")
        .update({
          answer_text: a.answer_text,
          is_correct: a.is_correct
        })
        .eq("id", a.id);  

    }

  }

}


