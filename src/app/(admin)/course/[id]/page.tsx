"use client";

import { useParams } from "next/navigation";
import { CommentSection } from "@/components/comment-section";
import { CourseEdit } from "@/components/course-edit";
import { useState, useEffect } from "react";
import { getCourseById } from "@/services";
import { updateChapter } from "@/services";

export default function CourseDetailPage() {

  const params = useParams<{ id: string }>();
  const [course, setCourse] = useState<any>(null);

  useEffect(() => {
    if (!params.id) return;

    (async () => {
      const data = await getCourseById(params.id);
      console.log("course data:", data);
      setCourse(data);
    })();
  }, [params.id]);

  async function updateChapterHandler(payload: any) {
    await updateChapter(payload);
    console.log("saved to database");
  }

  if (!course) {
    return <div className="p-10">Loading...</div>;
  }

  return (
    <div className="max-w-8xl mx-auto space-y-8 pb-10 pl-20 pr-20">

      <div>
        <h1 className="text-h2 font-bold text-primary">
          {course.title}
        </h1>

      </div>

      <div className="space-y-6">

        {course.chapters?.map((chapter: any, index: number) => (
          <CourseEdit
            key={chapter.id}
            chapterId={chapter.id}
            episodeNo={index + 1}
            title={chapter.title}
            questions={chapter.questions}
            onSave={updateChapterHandler}
          />
        ))}

      </div>

      <CommentSection />

    </div>
  );
}