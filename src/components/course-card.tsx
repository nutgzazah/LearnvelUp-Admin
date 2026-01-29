"use client";

import React from "react";
import { Course } from "@/types";

type CourseCardsProps = {
  courses: Course[];
  onClickCourse?: (course: Course) => void;
};

function getCourseThumb(course: any) {
  return (
    course?.thumbnail_url ||
    course?.thumbnailUrl ||
    course?.image_url ||
    course?.imageUrl ||
    course?.cover_url ||
    course?.coverUrl ||
    ""
  );
}

function getCourseDesc(course: any) {
  return (
    course?.description ||
    course?.detail ||
    course?.summary ||
    course?.short_description ||
    ""
  );
}

function getCourseOwner(course: any) {
  return course?.owner_name || course?.ownerName || course?.teacher || course?.creator || "";
}

function getCourseCategories(course: any): string[] {
  const c = course?.categories ?? course?.category ?? course?.tags ?? [];
  if (Array.isArray(c)) return c.filter(Boolean).map(String);
  if (typeof c === "string" && c.trim()) return [c.trim()];
  return [];
}

function getStudentCount(course: any) {
  return (
    course?.student_count ??
    course?.studentsCount ??
    course?.enrolled_count ??
    course?.enrolledCount ??
    course?.students ??
    null
  );
}

export function CourseCards({ courses, onClickCourse }: CourseCardsProps) {
  if (!courses?.length) {
    return (
      <div className="rounded-2xl border border-dashed p-10 text-center text-muted-foreground">
        ยังไม่มีคอร์ส
      </div>
    );
  }

  return (
    <div className="max-w-none w-full mx-auto space-y-8 pb-10 px-10">
      {courses.map((course: any) => {
        const thumb = getCourseThumb(course);
        const desc = getCourseDesc(course);
        const owner = getCourseOwner(course);
        const cats = getCourseCategories(course);
        const students = getStudentCount(course);

        return (
          <button
            key={course.id ?? course.course_id ?? course.slug ?? course.title}
            type="button"
            onClick={() => onClickCourse?.(course)}
            className={[
              "w-full text-left",
              "rounded-2xl border-2 border-primary/70 bg-white",
              "shadow-sm hover:shadow-md transition",
              "overflow-hidden",
            ].join(" ")}
          >
            <div className="flex flex-col md:flex-row">
              {/* Left image */}
              <div className="md:w-[420px] w-full bg-slate-100">
                {thumb ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={thumb}
                    alt={course.title ?? "course"}
                    className="h-[260px] md:h-[300px] w-full object-cover"
                  />
                ) : (
                  <div className="h-[260px] w-full flex items-center justify-center text-muted-foreground">
                    No Image
                  </div>
                )}
              </div>

              {/* Right content */}
              <div className="flex-1 p-6 relative">
                <div className="pr-6">
                  <h3 className="text-h4 font-bold text-black line-clamp-2">
                    {course.title ?? course.name ?? "-"}
                  </h3>

                  <div className="mt-3 text-small">
                    <span className="font-semibold text-primary">รายละเอียด :</span>{" "}
                    <span className="text-muted-foreground">
                      {owner ? (
                        <>
                          🚀 <span className="text-foreground/90">{owner}</span> คือ
                        </>
                      ) : (
                        "—"
                      )}
                    </span>
                  </div>

                  <p className="mt-2 text-body text-muted-foreground line-clamp-2">
                    {desc || "—"}
                  </p>

                  {/* Category pills */}
                  <div className="mt-5 flex flex-wrap gap-3">
                    {cats.length ? (
                      cats.slice(0, 3).map((tag, i) => (
                        <span
                          key={`${tag}-${i}`}
                          className="inline-flex items-center rounded-full bg-primary px-5 py-2 text-white text-small font-semibold"
                        >
                          {tag}
                        </span>
                      ))
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-primary px-5 py-2 text-white text-small font-semibold">
                        โปรแกรมมิ่ง
                      </span>
                    )}
                  </div>
                </div>

                {/* students bottom-right */}
                <div className="absolute right-6 bottom-5 text-small text-black">
                  นักเรียน{" "}
                  <span className="font-semibold text-foreground">
                    {typeof students === "number"
                      ? students.toLocaleString("th-TH")
                      : "—"}
                  </span>{" "}
                  คน
                </div>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
