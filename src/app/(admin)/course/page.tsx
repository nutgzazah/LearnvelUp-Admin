"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCourses } from "@/services";
import { Course } from "@/types";
import { CourseCards } from "@/components/course-card";

export default function CoursesPage() {
  const router = useRouter();
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
    <div className="max-w-8xl mx-auto space-y-8 pb-10 pl-20 pr-20">
      <div>
        <h1 className="text-h2 font-bold text-primary">คอร์สเรียนของฉัน</h1>
      </div>

      {loading ? (
        <div className="text-muted-foreground">กำลังโหลด...</div>
      ) : (
        <CourseCards
          courses={courses}
          onClickCourse={(c: any) => {
            const id = c?.id ?? c?.course_id ?? c?.slug; // เลือกตัวที่มีจริงในข้อมูลคุณ
            if (!id) return;
            router.push(`/course/${id}`);
          }}
        />
      )}
    </div>
  );
}
