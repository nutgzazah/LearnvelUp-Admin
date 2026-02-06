
"use client";

import { useParams } from "next/navigation";

export default function CourseDetailPage() {
  const params = useParams<{ id: string }>();

  return (
    <div className="max-w-5xl mx-auto p-10 space-y-8">
      <div>
        <h1 className="text-h2 font-bold text-primary">ทดสอบ 1 2 3</h1>
        <p className="mt-4 text-body text-foreground">
          course id: <span className="font-semibold">{params.id}</span>
        </p>
      </div>

      {/* เรียกใช้ตรงนี้ */}
      
    </div>
  );
}
