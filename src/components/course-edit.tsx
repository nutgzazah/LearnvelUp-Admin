"use client";

import { useState } from "react";
import { FiCheck, FiEdit2, FiSave } from "react-icons/fi";

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
  episodeNo: number;
  title: string;

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
  episodeNo,
  title: initialTitle,
  questions: initialQuestions,
  onSave,
}: CourseEditProps) {

  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(initialTitle);

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

  const handleSave = async () => {

    const payload = {
      chapter_id: chapterId,
      title,
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

  };

  return (
    <div className="w-full space-y-6 border rounded-2xl p-6">

      <div className="flex justify-between">

        <h2 className="font-semibold">
          ตอนที่ {episodeNo}
        </h2>

        {!isEditing ? (

          <button
            onClick={() => setIsEditing(true)}
            className="flex gap-2 text-sm border px-3 py-1 rounded-lg"
          >
            <FiEdit2 size={14} />
            แก้ไข
          </button>

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
  );

}