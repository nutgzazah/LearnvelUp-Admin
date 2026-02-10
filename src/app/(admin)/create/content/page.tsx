"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { CourseDetail } from "@/components/course-detail";

type EpisodePayload = {
  title: string;
  videoFile: File | null;
  questions: {
    question: string;
    choices: { key: "ก" | "ข" | "ค" | "ง"; label: string }[];
    selectedChoiceKey: "ก" | "ข" | "ค" | "ง" | null;
  }[];
};

export default function ContentPage() {
  const router = useRouter();

  // จำนวนตอนที่แสดง (เริ่ม 1 ตอน)
  const [episodeCount, setEpisodeCount] = useState(1);

  // เก็บข้อมูลแต่ละตอนหลังจากกดเสร็จ (ถ้าต้องการ)
  const [episodesData, setEpisodesData] = useState<Record<number, EpisodePayload>>({});

  const addEpisode = () => setEpisodeCount((n) => n + 1);

  return (
    <div className="max-w-8xl mx-auto space-y-8 pb-10 pl-20 pr-20">
      {/* Back button */}
      <div>
        <button
          type="button"
          onClick={() => router.push("/create")}
          className="px-6 py-2 text-primary font-bold rounded-lg shadow-md cursor-pointer transitionbg-primary bg-background hover:bg-primary/90 hover:text-white border-primary border"
        >
          ย้อนกลับ
        </button>
      </div>

      {/* Episodes list */}
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

      {/* ปุ่มเพิ่มตอน (แยกไว้ที่ parent ตามรูป) */}
      <button
        type="button"
        onClick={addEpisode}
        className="flex w-full items-center justify-center rounded-2xl border border-dashed bg-transparent py-4 text-sm font-medium text-foreground/70 transition hover:bg-black/5"
        aria-label="add"
      >
        +
      </button>
    </div>
  );
}
