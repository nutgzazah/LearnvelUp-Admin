"use client";

import { Course } from "@/types";
import { Categories } from "@/types/categories";
import { FiEye } from "react-icons/fi";

type Props = {
  course: Course;
  categories: Categories[];
  onClick?: (course: Course) => void;
};

export function CourseViewCard({ course, categories, onClick }: Props) {
  return (
    <div
      onClick={() => onClick?.(course)}
      className="w-full rounded-2xl bg-gray-100 border-1 border-black shadow-md p-4 flex gap-4 cursor-pointer hover:shadow-lg transition"
    >
      {/* Left image */}
      <div className="w-[140px] h-[100px] rounded-xl overflow-hidden bg-slate-200 shrink-0">
        <img
          src={
            course.cover_image_url ||
            "https://www.shutterstock.com/blog/wp-content/uploads/sites/5/2020/07/trendy-background-ideas-cover.jpg"
          }
          alt={course.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Right content */}
      <div className="flex-1 flex flex-col justify-between">
        {/* Title */}
        <h3 className="text-h5 md:text-base font-semibold line-clamp-2 text-black">
          {course.title}
        </h3>

        {/* Category pills */}
        <div className="flex flex-wrap gap-2 mt-2">
          {[
            course.category_id,
          ]
            .filter(Boolean)
            .map((id) => {
              const cat = categories.find((c) => c.id === id);
              if (!cat) return null;

              return (
                <span
                  key={id}
                  className="bg-primary text-white text-small px-3 py-1 rounded-full"
                >
                  {cat.name}
                </span>
              );
            })}
        </div>

        {/* Bottom row */}
        <div className="flex items-center justify-between mt-2 text-small text-black">
          <div className="flex items-center gap-2">
            <span className="font-semibold">
              นักเรียน: {course.total_enrolled ?? "0"} คน
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}