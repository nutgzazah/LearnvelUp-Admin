export type CourseStatus = "draft" | "published" | "closed";

export type Course = {
  id: number;
  instructor_id?: number | null;
  category_id?: number | null;
  sub_category_1_id?: number | null;
  sub_category_2_id?: number | null;

  title: string;
  description?: string | null;
  learning_outcome?: string | null;
  cover_image_url?: string | null;

  price_coins: number | null;
  status: CourseStatus;

  total_enrolled?: number | null;
  created_at?: string; // timestamptz -> string (ISO)
};

export type CoursePayload = Omit<Course,"id" | "created_at" | "total_enrolled">;

