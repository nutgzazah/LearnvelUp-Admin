export interface Comment {
  id: number;
  chapter_id: number;
  user_id: string | null ;

  parent_id?: number | null;
  content: string;

  created_at?: string | null;
  updated_at?: string | null;
  is_resolved: boolean;
}

export type CommentPayload = Omit<Comment, "id">;

export interface CommentWithProfile extends Comment {
  profiles?: {
    id: string;
    username?: string | null;
  } | null;
}