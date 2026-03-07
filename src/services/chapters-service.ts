import { supabase } from "@/lib/supabase";
import { ChapterPayload } from "@/types/chapters";

export async function createChapter(payload: ChapterPayload) {
  const { data, error } = await supabase
    .from("chapters")
    .insert([payload])
    .select()
    .single();

  if (error) {
    console.error("createChapter error:", error);
    throw error;
  }

  return data;
}