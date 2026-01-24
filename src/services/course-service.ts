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
export const updateCourse = async (id: number, payload: CoursePayload) => {
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
