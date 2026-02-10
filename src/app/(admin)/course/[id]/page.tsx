"use client";

import { useParams } from "next/navigation";
import { CommentSection } from "@/components/comment-section";
import { CourseDetail } from "@/components/course-detail";
import { useRouter } from "next/navigation";
import { useState } from "react";

type EpisodePayload = {
  title: string;
  videoFile: File | null;
  questions: {
    question: string;
    choices: { key: "ก" | "ข" | "ค" | "ง"; label: string }[];
    selectedChoiceKey: "ก" | "ข" | "ค" | "ง" | null;
  }[];
};


export default function CourseDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

    // จำนวนตอนที่แสดง (เริ่ม 1 ตอน)
  const [episodeCount, setEpisodeCount] = useState(1);
  
    // เก็บข้อมูลแต่ละตอนหลังจากกดเสร็จ (ถ้าต้องการ)
  const [episodesData, setEpisodesData] = useState<Record<number, EpisodePayload>>({});
  
  const addEpisode = () => setEpisodeCount((n) => n + 1);

  return (
    <div className="max-w-8xl mx-auto space-y-8 pb-10 pl-20 pr-20">
      <div>
        <h1 className="text-h2 font-bold text-primary">ทดสอบ 1 2 3</h1>
        <p className="mt-4 text-body text-foreground">
          course id: <span className="font-semibold">{params.id}</span>
        </p>
      </div>
      <div className="space-y-6">
        {Array.from({ length: episodeCount }).map((_, idx) => {
          const episodeNo = idx + 1;

          return (
            <CourseDetail
              key={episodeNo}
              episodeNo={episodeNo}
              onDone={(payload) => {
                console.log("DONE EP:", episodeNo, payload);

                // เก็บข้อมูลไว้ใช้ต่อ/ส่ง API ทีหลังได้
                setEpisodesData((prev) => ({
                  ...prev,
                  [episodeNo]: payload,
                }));
              }}
            />
          );
        })}
      </div>

      <CommentSection />
    </div>
  );
}
