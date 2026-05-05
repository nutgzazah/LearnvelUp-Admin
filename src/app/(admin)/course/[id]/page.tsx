"use client";

import { useParams } from "next/navigation";
import { CommentSection, CommentCard } from "@/components/comment-section";
import { CourseEdit } from "@/components/course-edit";
import { useState, useEffect, useMemo } from "react";
import { getCourseById, updateChapter } from "@/services";
import {
  getCommentsByChapterIds,
  createReplyComment,
  updateReplyComment,
  markCommentAsResolved,
} from "@/services/comments-service";
import { CommentWithProfile } from "@/types/comments";

export default function CourseDetailPage() {
  const params = useParams<{ id: string }>();
  const [course, setCourse] = useState<any>(null);
  const [comments, setComments] = useState<CommentWithProfile[]>([]);

  useEffect(() => {
    if (!params.id) return;

    (async () => {
      try {
        const data = await getCourseById(params.id);
        console.log("course data:", data);
        setCourse(data);

        const chapterIds =
          data?.chapters?.map((chapter: any) => chapter.id) ?? [];

        if (chapterIds.length > 0) {
          const commentData = await getCommentsByChapterIds(chapterIds);
          console.log("comments data:", commentData);
          setComments(commentData);
        } else {
          setComments([]);
        }
      } catch (error) {
        console.error("load course detail error:", error);
      }
    })();
  }, [params.id]);

  async function updateChapterHandler(payload: any) {
    await updateChapter(payload);
    console.log("saved to database");
  }

  async function handleReplySubmit(commentId: number, replyText: string) {
    try {
      const parentComment = comments.find((comment) => comment.id === commentId);
      if (!parentComment) {
        throw new Error("Parent comment not found");
      }

      const existingReply = comments.find(
        (comment) => comment.parent_id === commentId
      );

      if (existingReply) {
        await updateReplyComment(existingReply.id, replyText);
      } else {
        await createReplyComment({
          chapter_id: parentComment.chapter_id,
          parent_id: parentComment.id,
          content: replyText,
        });
      }

      const chapterIds =
        course?.chapters?.map((chapter: any) => chapter.id) ?? [];
      const refreshedComments = await getCommentsByChapterIds(chapterIds);
      setComments(refreshedComments);
    } catch (error: any) {
      console.log("handleReplySubmit error:", error);
      alert(error?.message ?? "เกิดข้อผิดพลาดในการตอบกลับคอมเมนต์");
    }
  }

  async function handleMarkAsResolved(commentId: number) {
  try {
    await markCommentAsResolved(commentId);

    const chapterIds =
      course?.chapters?.map((chapter: any) => chapter.id) ?? [];

    const refreshedComments = await getCommentsByChapterIds(chapterIds);
    setComments(refreshedComments);
  } catch (error: any) {
    console.log("handleMarkAsResolved error:", error);
    alert(error?.message ?? "เกิดข้อผิดพลาดในการเปลี่ยนสถานะความคิดเห็น");
  }
}

  const mappedComments: CommentCard[] = useMemo(() => {
    if (!course?.chapters || !comments.length) return [];

    const parentComments = comments.filter(
      (comment) => !comment.parent_id && comment.is_resolved !== true
    );
    const replyComments = comments.filter((comment) => !!comment.parent_id);

    return parentComments
      .map((comment) => {
        const matchedChapter = course.chapters.find(
          (chapter: any) => chapter.id === comment.chapter_id
        );

        if (!matchedChapter) return null;

        const partNo =
          course.chapters.findIndex(
            (chapter: any) => chapter.id === comment.chapter_id
          ) + 1;

        const reply = replyComments.find(
          (replyComment) => replyComment.parent_id === comment.id
        );

        return {
          id: comment.id,
          chapterId: comment.chapter_id,
          partNo,
          chapterTitle: matchedChapter.title,
          content: comment.content,
          usernameLabel: comment.profiles?.username ?? "ไม่ทราบชื่อ",
          replyId: reply?.id ?? null,
          replyText: reply?.content ?? null,
        };
      })
      .filter(Boolean) as CommentCard[];
  }, [course, comments]);

  if (!course) {
    return <div className="p-10">Loading...</div>;
  }

  return (
    <div className="max-w-8xl mx-auto space-y-8 pb-10 pl-20 pr-20">
      <div>
        <h1 className="text-h2 font-bold text-primary">
          หัวข้อ : {course.title}
        </h1>
      </div>

      <div className="space-y-6">
        {course.chapters?.map((chapter: any, index: number) => {
          return (
            <CourseEdit
              key={chapter.id}
              chapterId={chapter.id}
              courseId={course.id}
              episodeNo={index + 1}
              title={chapter.title}
              videoUrl={chapter.video_url}
              questions={chapter.questions}
              onSave={updateChapterHandler}
            />
          );
        })}
      </div>

      <CommentSection
        comments={mappedComments}
        onReplySubmit={handleReplySubmit}
        onMarkAsResolved={handleMarkAsResolved}
      />
    </div>
  );
}