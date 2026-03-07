"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { CourseDetail } from "@/components/course-detail";
import { useSearchParams } from "next/navigation";
import { createFullChapter } from "@/services/createFullChapterService";

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
  const searchParams = useSearchParams();
  const courseId = Number(searchParams.get("courseId"));

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
              onDone={async (payload) => {

                try {

                  await createFullChapter({
                    chapter: {
                      course_id: courseId,
                      title: payload.title,
                      sequence_order: episodeNo,
                      energy_cost_per_question: 1,
                      quiz_pass_score: 3,
                      reward_energy: 0,
                      reward_xp: 0,
                      reward_coins: 0,
                    },
                    questions: payload.questions,
                  });

                  setEpisodesData((prev) => ({
                    ...prev,
                    [episodeNo]: payload,
                  }));

                } catch (err) {
                  console.error(err);
                }

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
