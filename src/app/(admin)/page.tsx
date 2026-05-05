"use client";

import React from "react";
import { FiBookOpen, FiEye } from "react-icons/fi";
import { FaCoins } from "react-icons/fa";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getViewCourse, getCategories } from "@/services";
import { Course } from "@/types";
import { Categories } from "@/types/categories";
import { CourseViewCard } from "@/components/courseview-card";
import { useRef } from "react";
import { FiChevronDown } from "react-icons/fi";
import { CommentViewCard } from "@/components/comment-viewer";
import { CommentWithProfile } from "@/types/comments";
import { getUnrepliedCommentsByInstructorId } from "@/services/comments-service";

export default function Home() {
  const searchParams = useSearchParams();
  const instructorId = searchParams.get("instructorId");
  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<Categories[]>([]);
  // const listRef = useRef<HTMLDivElement>(null);
  const courseListRef = useRef<HTMLDivElement>(null);
  const commentListRef = useRef<HTMLDivElement>(null);


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

  const [comments, setComments] = useState<CommentWithRelations[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [courseData, categoryData] = await Promise.all([
          getViewCourse(instructorId || undefined),
          getCategories(),
        ]);

        const fetchedCourses = courseData || [];
        setCourses(fetchedCourses);
        setCategories(categoryData || []);

        const unrepliedComments =
          await getUnrepliedCommentsByInstructorId(Number(instructorId));
        
        console.log("instructorId:", instructorId);
        console.log("unrepliedComments:", unrepliedComments);

        setComments(unrepliedComments);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [instructorId]);

  // const handleScroll = () => {
  //   listRef.current?.scrollBy({
  //     top: 200,
  //     behavior: "smooth",
  //   });
  // };
  const handleCourseScroll = () => {
    courseListRef.current?.scrollBy({
      top: 200,
      behavior: "smooth",
    });
  };

  const handleCommentScroll = () => {
    commentListRef.current?.scrollBy({
      top: 200,
      behavior: "smooth",
    });
  };

  if (!instructorId) {
    return (
      <div className="min-h-screen flex items-center justify-center px-8">
        <div className="rounded-2xl border-2 border-dashed border-foreground px-12 py-10 text-center">
          <p className="text-h4 font-semibold text-foreground">
            โปรดเลือกผู้สอนที่จะจัดการ
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full max-w-[1400px] mx-auto px-8 py-8">
      <div className="w-full h-full space-y-8">
        {/* ===== แถวบน: 3 กล่อง ===== */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="rounded-2xl border-2 border-orange-400 bg-orange-50 p-10 shadow-sm">
            <div className="text-center text-black text-h3 font-semibold">
              จำนวนเหรียญที่ได้รับ
            </div>

            <div className="mt-8 flex items-center justify-center gap-7">
              <div className="h-16 w-16 rounded-full bg-black flex items-center justify-center">
                <FaCoins className="text-white text-h4 -mt-0.5" />
              </div>

              <div className="text-h5 font-medium text-black tracking-wide">
                999,999,999
              </div>
            </div>
          </div>

          <div className="rounded-2xl border-2 border-black bg-neutral-100 p-10 shadow-sm">
            <div className="text-center text-black text-h3 font-semibold">
              จำนวนคอร์สทั้งหมด
            </div>

            <div className="mt-8 flex items-center justify-center gap-7">
              <div className="h-16 w-16 rounded-full bg-black flex items-center justify-center">
                <FiBookOpen className="text-white" size={32} />
              </div>

              <div className="text-h5 text-black font-medium tracking-wide">
                12
              </div>
            </div>
          </div>

          <div className="rounded-2xl border-2 border-purple-600 bg-purple-100 p-10 shadow-sm">
            <div className="text-center text-h3 text-black font-semibold">
              ยอดการเข้าชมทั้งหมด
            </div>

            <div className="mt-8 flex items-center justify-center gap-7">
              <div className="h-16 w-16 rounded-full bg-black flex items-center justify-center">
                <FiEye className="text-white" size={32} />
              </div>

              <div className="text-h5 text-black font-medium tracking-wide">
                999,999,999
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[40%_60%] gap-8 w-full">
          <div className="rounded-2xl border-2 border-black bg-neutral-100 shadow-sm min-h-[420px] p-6 flex flex-col">
  
            <h2 className="text-h4 md:text-3xl font-bold text-black text-center">
              ภาพรวมคอร์สทั้งหมด
            </h2>

            {/* List (scrollable) */}
            <div
              ref={courseListRef}
              className="mt-6 space-y-4 overflow-y-auto max-h-[300px] pr-2"
            >
              {courses.map((course) => (
                <CourseViewCard
                  key={course.id}
                  course={course}
                  categories={categories}
                />
              ))}
            </div>

            {/* ปุ่มลูกศร */}
            {courses.length > 3 && (
              <div className="flex justify-center mt-4">
                <button
                  onClick={handleCourseScroll}
                  className="p-2 rounded-full hover:bg-black/10 transition text-black"
                >
                  <FiChevronDown size={24} />
                </button>
              </div>
            )}
          </div>

          <div className="rounded-2xl border-2 border-black bg-white shadow-sm min-h-[420px] p-6">
            <h2 className="text-h4 md:text-3xl font-bold text-black text-center mb-6">
              คำถามล่าสุด
            </h2>

            <div
              ref={commentListRef}
              className="space-y-4 overflow-y-auto max-h-[300px] pr-2"
            >
              {comments.map((comment) => (
                <CommentViewCard
                  key={comment.id}
                  courseTitle={comment.chapters?.courses?.title ?? "ไม่พบชื่อคอร์ส"}
                  content={comment.content}
                  username={comment.profiles?.username ?? "ไม่ทราบชื่อ"}
                  created_at={comment.created_at ?? undefined}
                  coverImageUrl={comment.chapters?.courses?.cover_image_url ?? null}
                />
              ))}
            </div>

            {/* ปุ่มลูกศร */}
             {comments.length > 3 && (
                <div className="flex justify-center mt-4">
                  <button
                    onClick={handleCommentScroll}
                    className="p-2 rounded-full hover:bg-black/10 transition text-black"
                  >
                    <FiChevronDown size={24} />
                  </button>
                </div>
              )}
          </div>

        </div>
    </div>
    </div>
  );
}