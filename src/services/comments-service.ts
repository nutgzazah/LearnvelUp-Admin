import { supabase } from "@/lib/supabase";
import { CommentWithProfile } from "@/types/comments";

export async function getCommentsByChapterIds(
  chapterIds: number[]
): Promise<CommentWithProfile[]> {
  if (!chapterIds.length) return [];

  const { data, error } = await supabase
    .from("comments")
    .select(`
      *,
      profiles (
        id,
        username
      )
    `)
    .in("chapter_id", chapterIds)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("getCommentsByChapterIds error:", error);
    throw error;
  }

  return (data ?? []) as CommentWithProfile[];
}

export async function createReplyComment(payload: {
  chapter_id: number;
  parent_id: number;
  content: string;
  user_id?: string | null;
}) {
  const { data, error } = await supabase
    .from("comments")
    .insert(payload)
    .select()
    .single();

  if (error) {
    console.error("createReplyComment error:", error);
    throw new Error(error.message || "Failed to create reply comment");
  }

  return data;
}

export async function updateReplyComment(replyId: number, content: string) {
  const { data, error } = await supabase
    .from("comments")
    .update({
      content,
      updated_at: new Date().toISOString(),
    })
    .eq("id", replyId)
    .select()
    .single();

  if (error) throw error;
  return data as Comment;
}

type CommentWithRelations = CommentWithProfile & {
  chapters?: {
    id: number;
    course_id: number;
    courses?: {
      id: number;
      instructor_id?: number | null;
      title: string;
      cover_image_url?: string | null;
    } | null;
  } | null;
};

// export async function getUnrepliedCommentsByInstructorId(
//   instructorId: number
// ): Promise<CommentWithRelations[]> {
//   const { data, error } = await supabase
//     .from("comments")
//     .select(`
//       *,
//       profiles (
//         id,
//         username
//       ),
//       chapters (
//         id,
//         course_id,
//         courses (
//           id,
//           instructor_id,
//           title,
//           cover_image_url
//         )
//       )
//     `)
//     .order("created_at", { ascending: true });

//   if (error) {
//     console.error("getUnrepliedCommentsByInstructorId error:", error);
//     throw error;
//   }

//   const comments = (data ?? []) as CommentWithRelations[];

//   const filteredByInstructor = comments.filter(
//     (comment) => comment.chapters?.courses?.instructor_id === instructorId
//   );

//   const parentComments = filteredByInstructor.filter(
//     (comment) => comment.parent_id == null
//   );

//   const repliedParentIds = new Set(
//     filteredByInstructor
//       .filter((comment) => comment.parent_id != null)
//       .map((comment) => comment.parent_id as number)
//   );

//   return parentComments.filter(
//     (comment) =>
//       !repliedParentIds.has(comment.id) &&
//       comment.is_resolved !== true
//   );
// }

export async function getUnrepliedCommentsByInstructorId(
  instructorId: number
): Promise<CommentWithRelations[]> {
  const { data, error } = await supabase
    .from("comments")
    .select(`
      *,
      profiles (
        id,
        username
      ),
      chapters (
        id,
        course_id,
        courses (
          id,
          instructor_id,
          title,
          cover_image_url
        )
      )
    `)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("getUnrepliedCommentsByInstructorId error:", error);
    throw error;
  }

  const comments = (data ?? []) as CommentWithRelations[];

  const filteredByInstructor = comments.filter(
    (comment) => comment.chapters?.courses?.instructor_id === instructorId
  );

  const parentComments = filteredByInstructor.filter(
    (comment) => comment.parent_id == null
  );

  const repliedByAdminParentIds = new Set(
    filteredByInstructor
      .filter(
        (comment) =>
          comment.parent_id != null &&
          comment.user_id == null
      )
      .map((comment) => comment.parent_id as number)
  );

  return parentComments.filter(
    (comment) =>
      comment.is_resolved !== true &&
      !repliedByAdminParentIds.has(comment.id)
  );
}

export async function markCommentAsResolved(commentId: number) {
  const { data, error } = await supabase
    .from("comments")
    .update({
      is_resolved: true,
      updated_at: new Date().toISOString(),
    })
    .eq("id", commentId)
    .select()
    .single();

  if (error) {
    console.error("markCommentAsResolved error:", error);
    throw new Error(error.message || "Failed to mark comment as resolved");
  }

  return data;
}