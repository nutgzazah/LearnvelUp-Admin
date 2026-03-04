import { createClient } from "@supabase/supabase-js";
import type { Categories } from "@/types";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function getCategories(): Promise<Categories[]> {
  const { data, error } = await supabase
    .from("categories")            // ชื่อตารางใน DB
    .select("id,name")
    .order("id", { ascending: true });

  if (error) {
  console.log("getCategories error:", error);
  throw error;
}
  return (data ?? []) as Categories[];
}