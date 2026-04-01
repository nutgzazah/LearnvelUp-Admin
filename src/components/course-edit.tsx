"use client";

import { useEffect, useRef, useState } from "react";
import { FiCheck, FiEdit2, FiSave } from "react-icons/fi";
import { getVideoPreviewUrl } from "@/services/video-service";

type ChoiceKey = "ก" | "ข" | "ค" | "ง";

type Choice = {
  id: number;
  key: ChoiceKey;
  label: string;
};

type QuestionBlock = {
  id: number;
  question: string;
  choices: Choice[];
  selectedChoiceKey: ChoiceKey | null;
};

type CourseEditProps = {
  chapterId: number;
  courseId: number;
  episodeNo: number;
  title: string;
  videoUrl?: string | null;

  questions: {
    id: number;
    question_text: string;
    answers: {
      id: number;
      answer_text: string;
      is_correct: boolean;
    }[];
  }[];

  onSave?: (payload: any) => Promise<void>;
};

const KEY_LIST: ChoiceKey[] = ["ก", "ข", "ค", "ง"];

export function CourseEdit({
  chapterId,
  courseId,
  episodeNo,
  title: initialTitle,
  videoUrl,
  questions: initialQuestions,
  onSave,
}: CourseEditProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(initialTitle);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [previewVideoUrl, setPreviewVideoUrl] = useState<string | null>(null);
  const [videoLoading, setVideoLoading] = useState(false);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [questions, setQuestions] = useState<QuestionBlock[]>(
    initialQuestions.map((q) => {

      const correctIndex = q.answers.findIndex(a => a.is_correct);

      return {
        id: q.id,
        question: q.question_text,
        choices: q.answers.map((a, i) => ({
          id: a.id,             // ⭐ สำคัญ
          key: KEY_LIST[i],
          label: a.answer_text
        })),
        selectedChoiceKey:
          correctIndex >= 0 ? KEY_LIST[correctIndex] : null
      };

    })
  );

  const setQuestionText = (qIndex: number, value: string) => {
    setQuestions(prev =>
      prev.map((q, i) =>
        i === qIndex ? { ...q, question: value } : q
      )
    );
  };

  const setChoiceLabel = (qIndex: number, key: ChoiceKey, value: string) => {

    setQuestions(prev =>
      prev.map((q, i) => {

        if (i !== qIndex) return q;

        return {
          ...q,
          choices: q.choices.map(c =>
            c.key === key
              ? { ...c, label: value }
              : c
          )
        };

      })
    );

  };

  const setSelectedChoice = (qIndex: number, key: ChoiceKey) => {

    setQuestions(prev =>
      prev.map((q, i) =>
        i === qIndex
          ? { ...q, selectedChoiceKey: key }
          : q
      )
    );

  };

  useEffect(() => {
    let isMounted = true;

    const loadVideoPreview = async () => {
      if (videoFile) {
        const localUrl = URL.createObjectURL(videoFile);
        setPreviewVideoUrl(localUrl);
        setVideoLoading(false);

        return;
      }

      if (!videoUrl) {
        setPreviewVideoUrl(null);
        return;
      }

      try {
        setVideoLoading(true);
        const signedUrl = await getVideoPreviewUrl(videoUrl);

        if (isMounted) {
          setPreviewVideoUrl(signedUrl);
        }
      } catch (error) {
        console.error("โหลด video preview ไม่สำเร็จ", error);
        if (isMounted) {
          setPreviewVideoUrl(null);
        }
      } finally {
        if (isMounted) {
          setVideoLoading(false);
        }
      }
    };

    loadVideoPreview();

    return () => {
      isMounted = false;
    };
  }, [videoUrl, videoFile]);

  const handlePickVideo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setVideoFile(file);
  };

  const handleSave = async () => {
    const payload = {
      chapter_id: chapterId,
      course_id: courseId,
      title,
      videoFile,
      questions: questions.map(q => ({
        question_id: q.id,
        question_text: q.question,
        answers: q.choices.map(c => ({
          id: c.id,                       
          answer_text: c.label,
          is_correct: c.key === q.selectedChoiceKey
        }))
      }))
    };

    if (onSave) {
      await onSave(payload);
    }

    setIsEditing(false);
    setVideoFile(null);

  };

  if (isCollapsed) {
    return (
      <div className="w-full">
        <div className="flex items-center justify-between border-b pb-3">

          <div className="text-sm font-medium text-foreground">
            ตอนที่ {episodeNo}{" "}
            <span className="font-semibold">
              {title?.trim() || "-"}
            </span>
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
    <div className="w-full space-y-6 border rounded-2xl p-6">

      <div className="flex justify-between items-center">

        <h2 className="font-semibold">
          ตอนที่ {episodeNo}
        </h2>

        <div className="flex gap-2">
          {!isEditing ? (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="flex gap-2 text-sm border px-3 py-1 rounded-lg"
              >
                <FiEdit2 size={14} />
                แก้ไข
              </button>

              <button
                onClick={() => setIsCollapsed(true)}
                className="flex gap-2 text-sm border px-3 py-1 rounded-lg"
              >
                ย่อ
              </button>
            </>

          ) : (

            <button
              onClick={handleSave}
              className="flex gap-2 text-sm bg-black text-white px-3 py-1 rounded-lg"
            >
              <FiSave size={14} />
              บันทึก
            </button>

          )}

        </div>

      </div>

      {/* title */}

      {isEditing ? (
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          className="w-full rounded-xl border px-4 py-3"
        />

      ) : (
        <div className="border rounded-xl px-4 py-3">
          {title}
        </div>

      )}

      {/* video preview */}
      <div className="space-y-2">
        <p className="text-sm font-medium text-foreground">วิดีโอ</p>

        {isEditing && (
          <>
            <input
              ref={fileInputRef}
              type="file"
              accept="video/*"
              onChange={handlePickVideo}
              className="hidden"
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="rounded-xl border px-4 py-2 text-sm"
            >
              เลือกวิดีโอใหม่
            </button>
          </>
        )}

        {videoLoading ? (
          <div className="rounded-2xl border px-4 py-8 text-center text-sm text-foreground/60">
            กำลังโหลดวิดีโอ...
          </div>
        ) : previewVideoUrl ? (
          <div className="overflow-hidden rounded-2xl border bg-black">
            <video
              src={previewVideoUrl}
              controls
              preload="metadata"
              className="w-full max-h-[420px]"
            >
              เบราว์เซอร์นี้ไม่รองรับการเล่นวิดีโอ
            </video>
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed px-4 py-8 text-center text-sm text-foreground/60">
            ยังไม่มีวิดีโอ
          </div>
        )}
      </div>

      {questions.map((q, qIndex) => (

        <div key={q.id} className="space-y-4">

          <p className="font-semibold">
            คำถามที่ {qIndex + 1}
          </p>

          {isEditing ? (

            <input
              value={q.question}
              onChange={(e) =>
                setQuestionText(qIndex, e.target.value)
              }
              className="w-full border rounded-xl px-4 py-2"
            />

          ) : (

            <p>{q.question}</p>

          )}

          <div className="space-y-3">

            {q.choices.map(c => {

              const active = q.selectedChoiceKey === c.key;

              return (

                <div key={c.id} className="flex gap-3 items-center">

                  <div className="w-6">{c.key}</div>

                  {isEditing ? (

                    <input
                      value={c.label}
                      onChange={(e) =>
                        setChoiceLabel(qIndex, c.key, e.target.value)
                      }
                      className="flex-1 border rounded-full px-4 py-2"
                    />

                  ) : (

                    <div className="flex-1 border rounded-full px-4 py-2">
                      {c.label}
                    </div>

                  )}

                  {isEditing ? (

                    <button
                        onClick={() =>
                        setSelectedChoice(qIndex, c.key)
                        }
                        className={`h-8 w-8 rounded-full border flex items-center justify-center
                        ${active ? "bg-emerald-500 border-emerald-500" : ""}`}
                    >
                        {active && <FiCheck className="text-white"/>}
                    </button>

                    ) : (

                    active && (
                        <div className="h-8 w-8 rounded-full bg-emerald-500 flex items-center justify-center">
                        <FiCheck className="text-white" size={14}/>
                        </div>
                    )

                    )}

                </div>

              );

            })}

          </div>

        </div>

      ))}

    </div>
  );}
