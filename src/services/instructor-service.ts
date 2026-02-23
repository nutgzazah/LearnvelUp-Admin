import { supabase } from "@/lib/supabase";
import type { Instructor, InstructorPayload } from "@/types/instructor";

export async function createInstructor(payload: InstructorPayload): Promise<Instructor> {
  const clean: InstructorPayload = {
    username: payload.username.trim(),
    email: payload.email?.trim() || undefined,
    bio: payload.bio?.trim() || undefined,
    avatar_url: payload.avatar_url?.trim() || undefined,
  };

  if (!clean.username) {
    throw new Error("Username is required");
  }

  const { data, error } = await supabase
    .from("instructors")
    .insert(clean)
    .select("*")
    .single();

  if (error) throw error;
  return data as Instructor;
}

export async function getInstructors(): Promise<Instructor[]> {
  const { data, error } = await supabase
    .from("instructors")
    .select("*")
    .order("id", { ascending: false });

  if (error) throw error;

  return data ?? [];
}