"use client";

import { useMemo, useRef, useState } from "react";
import { FiUpload, FiCheck } from "react-icons/fi";
import { FiEdit2 } from "react-icons/fi";

type ChoiceKey = "ก" | "ข" | "ค" | "ง";

type Choice = {
  key: ChoiceKey;
  label: string;
};

type QuestionBlock = {
  question: string;
  choices: Choice[];
  selectedChoiceKey: ChoiceKey | null;
};

type CourseDetailProps = {
  defaultTitle?: string;
  defaultVideoUrl?: string;
  episodeNo?: number;

  onDone?: (payload: {
    title: string;
    videoFile: File | null;
    questions: QuestionBlock[];
  }) => void;
};

const EMPTY_CHOICES: Choice[] = [
  { key: "ก", label: "" },
  { key: "ข", label: "" },
  { key: "ค", label: "" },
  { key: "ง", label: "" },
];

const makeEmptyQuestion = (): QuestionBlock => ({
  question: "",
  choices: EMPTY_CHOICES.map((c) => ({ ...c })),
  selectedChoiceKey: null,
});

export function CourseDetail({
  defaultTitle = "",
  defaultVideoUrl = "",
  episodeNo = 1,
  onDone,
}: CourseDetailProps) {
  const [title, setTitle] = useState(defaultTitle);
  const [videoFile, setVideoFile] = useState<File | null>(null);

  const [questions, setQuestions] = useState<QuestionBlock[]>([
    makeEmptyQuestion(),
    makeEmptyQuestion(),
    makeEmptyQuestion(),
  ]);

  const [isCollapsed, setIsCollapsed] = useState(false);

  const fileRef = useRef<HTMLInputElement | null>(null);

  const videoLabel = useMemo(() => {
    if (videoFile) return videoFile.name;
    if (defaultVideoUrl) return "มีวิดีโอที่อัปโหลดไว้แล้ว";
    return "คลิกเพื่ออัปโหลดวิดีโอ";
  }, [videoFile, defaultVideoUrl]);

  const onPickVideo = () => fileRef.current?.click();

  const onChangeVideo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    setVideoFile(f);
  };

  const handleDone = () => {
    onDone?.({
      title: title.trim(),
      videoFile,
      questions: questions.map((q) => ({
        question: q.question.trim(),
        choices: q.choices.map((c) => ({ ...c, label: c.label.trim() })),
        selectedChoiceKey: q.selectedChoiceKey,
      })),
    });

    setIsCollapsed(true);
  };

  const setQuestionText = (qIndex: number, value: string) => {
    setQuestions((prev) =>
      prev.map((q, i) => (i === qIndex ? { ...q, question: value } : q))
    );
  };

  const setChoiceLabel = (qIndex: number, key: ChoiceKey, value: string) => {
    setQuestions((prev) =>
      prev.map((q, i) => {
        if (i !== qIndex) return q;
        return {
          ...q,
          choices: q.choices.map((c) =>
            c.key === key ? { ...c, label: value } : c
          ),
        };
      })
    );
  };

  const setSelectedChoice = (qIndex: number, key: ChoiceKey) => {
    setQuestions((prev) =>
      prev.map((q, i) => (i === qIndex ? { ...q, selectedChoiceKey: key } : q))
    );
  };

  // Collapsed summary
  if (isCollapsed) {
    return (
      <div className="w-full">
        <div className="flex items-center justify-between border-b pb-3">
          <div className="text-sm font-medium text-foreground">
            ตอนที่ {episodeNo}{" "}
            <span className="font-semibold">{title?.trim() || "-"}</span>
          </div>

          <button
            type="button"
            onClick={() => setIsCollapsed(false)}
            className="h-9 w-9 rounded-full border flex items-center justify-center hover:bg-black/5 transition"
            aria-label="edit"
            title="แก้ไข"
          >
            <FiEdit2 size={16} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      {/* ชื่อตอน */}
      <div className="space-y-2">
        <p className="text-sm font-medium text-foreground">ชื่อตอน</p>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-xl border bg-muted/30 px-4 py-3 outline-none focus:border-black"
        />
      </div>

      {/* อัพโหลดวิดีโอ */}
      <div className="space-y-2">
        <p className="text-sm font-medium text-foreground">อัพโหลดวิดีโอ</p>

        <button
          type="button"
          onClick={onPickVideo}
          className="relative w-full rounded-2xl border bg-muted/30 px-4 py-10 transition hover:bg-black/5"
        >
          <div className="flex flex-col items-center justify-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-xl border bg-background">
              <FiUpload size={20} />
            </div>
            <p className="text-sm text-foreground/80">{videoLabel}</p>
            <p className="text-xs text-foreground/60">ความยาวไม่เกิน 3 นาที</p>
          </div>

          <input
            ref={fileRef}
            type="file"
            accept="video/*"
            className="hidden"
            onChange={onChangeVideo}
          />
        </button>
      </div>

      {/* 3 คำถาม */}
      {questions.map((q, qIndex) => (
        <div key={qIndex} className="space-y-4">
          <p className="text-sm font-semibold text-foreground">
            คำถามที่ {qIndex + 1}
          </p>

          <div className="rounded-2xl border bg-background px-4 py-4">
            <input
              value={q.question}
              onChange={(e) => setQuestionText(qIndex, e.target.value)}
              className="w-full bg-transparent text-sm outline-none"
              placeholder="พิมพ์คำถาม..."
            />
          </div>

          <div className="space-y-3">
            {q.choices.map((c) => {
              const active = q.selectedChoiceKey === c.key;

              return (
                <div key={c.key} className="flex items-center gap-3">
                  <div className="w-10 text-sm font-medium text-foreground">
                    {c.key} :
                  </div>

                  <div className="flex-1">
                    <div className="rounded-full border bg-background px-4 py-2">
                      <input
                        value={c.label}
                        onChange={(e) =>
                          setChoiceLabel(qIndex, c.key, e.target.value)
                        }
                        className="w-full bg-transparent text-sm outline-none"
                        placeholder={`ตัวเลือก ${c.key}`}
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedChoice(qIndex, c.key)}
                    className={[
                      "h-8 w-8 rounded-full border flex items-center justify-center transition",
                      active
                        ? "border-emerald-500 bg-emerald-500"
                        : "border-gray-300 bg-white hover:bg-black/5",
                    ].join(" ")}
                    aria-label={`เลือกข้อ ${c.key} สำหรับคำถามที่ ${qIndex + 1}`}
                  >
                    {active ? (
                      <FiCheck className="text-white" size={16} />
                    ) : null}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {/* ปุ่มเสร็จ */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleDone}
          className="px-6 py-2 text-white font-bold rounded-lg shadow-md cursor-pointer transitionbg-primary bg-primary hover:bg-primary/90"
        >
          เสร็จ
        </button>
      </div>

    </div>
  );
}
