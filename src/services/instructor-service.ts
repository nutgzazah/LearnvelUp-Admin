import { supabase } from "@/lib/supabase";
import type { Instructor, InstructorPayload } from "@/types/instructor";

export async function createInstructor(payload: InstructorPayload): Promise<Instructor> {
  const clean: InstructorPayload = {
    username: payload.username.trim(),
    email: payload.email?.trim() || undefined,
    bio: payload.bio?.trim() || undefined,
    avatar_url: undefined,
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

export async function uploadInstructorAvatar(file: File, instructorId: number) {
  const fileExt = file.name.split(".").pop()?.toLowerCase() || "png";
  const filePath = `profile/${instructorId}.${fileExt}`;

  const { error } = await supabase.storage
    .from("images")
    .upload(filePath, file, {
      upsert: true,
      contentType: file.type || `image/${fileExt}`,
    });

  if (error) {
    throw error;
  }

  const { data } = supabase.storage
    .from("images")
    .getPublicUrl(filePath);

  return data.publicUrl;
}

export async function updateInstructorAvatar(
  instructorId: number,
  avatarUrl: string
): Promise<Instructor> {
  const { data, error } = await supabase
    .from("instructors")
    .update({ avatar_url: avatarUrl })
    .eq("id", instructorId)
    .select("*")
    .single();

  if (error) throw error;
  return data as Instructor;
}

export async function getInstructorCourseCount(
  instructorId: number
): Promise<number> {
  if (!instructorId) return 0;

  const { count, error } = await supabase
    .from("courses")
    .select("id", { count: "exact", head: true })
    .eq("instructor_id", instructorId);

  if (error) throw error;

  return count ?? 0;
}

export type InstructorCoinSummary = {
  totalCoins: number;
  totalEnrolled: number;
  courseCount: number;
};

export async function getInstructorCoinSummary(
  instructorId: number
): Promise<InstructorCoinSummary> {
  const { data, error } = await supabase
    .from("courses")
    .select("id, price_coins, total_enrolled")
    .eq("instructor_id", instructorId);

  if (error) {
    console.error("getInstructorCoinSummary error:", error);
    throw error;
  }

  const courses = data ?? [];

  const totalCoins = courses.reduce((sum, course) => {
    const price = Number(course.price_coins ?? 0);
    const enrolled = Number(course.total_enrolled ?? 0);

    return sum + price * enrolled;
  }, 0);

  const totalEnrolled = courses.reduce((sum, course) => {
    return sum + Number(course.total_enrolled ?? 0);
  }, 0);

  return {
    totalCoins,
    totalEnrolled,
    courseCount: courses.length,
  };
}