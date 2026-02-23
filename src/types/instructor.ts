export type Instructor = {
  id: number;
  email?: string;
  username: string;
  avatar_url?: string;
  bio?: string;
};

export type InstructorPayload = Omit<Instructor, "id">;