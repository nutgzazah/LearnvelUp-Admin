"use client";

import { useEffect, useState } from "react";
import { getCourses } from "@/services";
import { Course } from "@/types";
import { CourseCards } from "@/components/course-card";

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await getCourses();
        setCourses(res ?? []);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="max-w-8xl mx-auto space-y-8 pb-10 pl-100 pr-20">
      {/* Header */}
      <div>
        <h1 className="text-h2 font-bold text-primary">คอร์สเรียนของฉัน</h1>
      </div>

      {loading ? (
        <div className="text-muted-foreground">กำลังโหลด...</div>
      ) : (
        <CourseCards
          courses={courses}
          onClickCourse={(c) => {
            // ใส่ action ตอนกดการ์ด เช่น ไปหน้า detail
            console.log("click course:", c);
          }}
        />
      )}
    </div>
  );
}
