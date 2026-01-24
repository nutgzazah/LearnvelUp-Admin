export type Course = {
  id: number;
  title: string;
  description?: string;
  price: number;
  image_url?: string;
  created_at?: string;
};

export type CoursePayload = Omit<Course, "id" | "created_at">;
