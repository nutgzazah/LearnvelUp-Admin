"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getCourses } from "@/services";
import { getCategories } from "@/services";
import { Course } from "@/types";
import { CourseCards } from "@/components/course-card";
import { Categories } from "@/types/categories";

export default function CoursesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const instructorId = searchParams.get("instructorId");

  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<Categories[]>([]);
  

  useEffect(() => {
    (async () => {
      try {
        const [courseRes, categoryRes] = await Promise.all([
          getCourses(),
          getCategories(),
        ]);

        setCategories(categoryRes ?? []);

        if (instructorId) {
          const filtered = (courseRes ?? []).filter(
            (c) => String(c.instructor_id ?? "") === instructorId
          );
          setCourses(filtered);
        } else {
          setCourses(courseRes ?? []);
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [instructorId]);

  return (
    <div className="max-w-8xl mx-auto space-y-8 pb-10 pl-20 pr-20">
      <h1 className="text-h2 font-bold text-primary">คอร์สเรียนของฉัน</h1>
      {loading ? (
        <div>กำลังโหลด...</div>
      ) : (
        <CourseCards
          courses={courses}
          categories={categories}
          onClickCourse={(c: any) => {
            const id = c?.id;
            if (!id) return;
            router.push(`/course/${id}`);
          }}
        />
      )}
    </div>
  );
}