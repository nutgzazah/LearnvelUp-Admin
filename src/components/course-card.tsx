"use client";

import React from "react";
import { Course, CourseStatus } from "@/types";
import { Categories } from "@/types/categories";

type CourseCardsProps = {
  courses: Course[];
  categories: Categories[];
  onClickCourse?: (course: Course) => void;
  onChangeStatus?: (courseId: number, status: CourseStatus) => void;
};

export function CourseCards({ courses,categories, onClickCourse, onChangeStatus,}: CourseCardsProps) {
  console.log("categories", categories);
  console.log("course.category_id", courses?.[0]?.category_id);

  const getStatusColor = (status: CourseStatus) => {
    switch (status) {
      case "published":
        return "text-green-500";
      case "draft":
        return "text-gray-400";
      case "closed":
        return "text-red-500";
      default:
        return "text-gray-400";
    }
  };

  if (!courses?.length) {
    return (
      <div className="rounded-2xl border border-dashed p-10 text-center text-muted-foreground">
        ยังไม่มีคอร์ส
      </div>
    );
  }

  const STATUS_OPTIONS: CourseStatus[] = ["draft", "published", "closed"];

  return (
    <div className="max-w-none w-full mx-auto space-y-8 pb-10 px-10">
      {courses.map((course) => { const category = categories?.find((c) => c.id === course.category_id);
        return (
          <button
            key={course.id}
            type="button"
            onClick={() => onClickCourse?.(course)}
            className={[
              "w-full text-left",
              "rounded-2xl border-2 border-primary/70 bg-background",
              "shadow-sm hover:shadow-md transition",
              "overflow-hidden",
            ].join(" ")}
          >
            <div className="flex flex-col md:flex-row">
              {/* Left image */}
              <div className="md:w-[350px] w-full bg-slate-100">
                  <img
                    src="https://www.shutterstock.com/blog/wp-content/uploads/sites/5/2020/07/trendy-background-ideas-cover.jpg"
                    alt="w,j0ib'"
                    className="h-[260px] md:h-[300px] w-full object-cover"
                  />
              </div>

              {/* Right content */}
              <div className="flex-1 p-6 relative">
                <div className="pr-6">
                  <h3 className="text-h4 font-bold text-foreground line-clamp-2">
                    {course.title}
                  </h3>

                  <p className="mt-2 text-body text-foreground line-clamp-2">
                    <span className="font-semibold text-primary">รายละเอียด : </span>
                    {course.description ?? "-"}
                  </p>

                  {/* Category pills */}
                  <div className="mt-5 flex flex-wrap gap-3">
                    {[
                      course.category_id,
                      course.sub_category_1_id,
                      course.sub_category_2_id,
                    ]
                      .filter(Boolean) // เอาเฉพาะที่ไม่ null
                      .map((id) => {
                        const cat = categories.find((c) => c.id === id);
                        if (!cat) return null;

                        return (
                          <span
                            key={id}
                            className="inline-flex items-center rounded-full bg-primary px-5 py-2 text-white text-small font-semibold"
                          >
                            {cat.name} 
                          </span>
                        );
                      })}
                  </div>
                </div>

                {/* students bottom-right */}
                <div className="absolute right-6 bottom-5 left-6 flex items-center justify-between text-small text-foreground">

                  {/* LEFT : Course Status */}
                  <div className="flex items-center gap-2">
                    <span className="text-small font-semibold text-foreground">
                      Course Status :
                    </span>
                    <span className={`text-sm ${getStatusColor(course.status)}`}>
                      ●
                    </span>
                    <select
                      value={course.status}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) =>
                        onChangeStatus?.(course.id, e.target.value as CourseStatus)
                      }
                      className="rounded-lg border px-2 py-1 text-xs bg-transparent"
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* RIGHT : Students */}
                  <div>
                    นักเรียน{" "}
                    <span className="font-semibold">
                      {course.total_enrolled ?? "-"}
                    </span>{" "}
                    คน
                  </div>

                </div>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
