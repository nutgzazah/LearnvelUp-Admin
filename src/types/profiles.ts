export interface Profile {
  id: string;

  username?: string | null;

  gender?: string | null;
  birthdate?: string | null;
  age_group?: string | null;

  equipped_avatar_id?: number | null;
  equipped_frame_id?: number | null;

  created_at?: string;
  updated_at?: string | null;
}

