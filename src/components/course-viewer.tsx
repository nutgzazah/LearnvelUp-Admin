"use client";

type Choice = {
  key: "ก" | "ข" | "ค" | "ง";
  label: string;
};

type Question = {
  question: string;
  choices: Choice[];
  selectedChoiceKey: "ก" | "ข" | "ค" | "ง" | null;
};

type CourseViewerProps = {
  title: string;
  videoUrl: string;
  questions: Question[];
  episodeNo: number;
};

export function CourseViewer({
  title,
  videoUrl,
  questions,
  episodeNo,
}: CourseViewerProps) {
  return (
    <div className="space-y-6">

      <h2 className="text-xl font-bold">
        ตอนที่ {episodeNo} : {title}
      </h2>

      {/* video */}
      <video
        controls
        className="w-full rounded-xl"
        src={videoUrl}
      />

      {/* questions */}
      {questions.map((q, i) => (
        <div key={i} className="space-y-3 border rounded-xl p-4">

          <p className="font-semibold">
            คำถามที่ {i + 1}
          </p>

          <p>{q.question}</p>

          <div className="space-y-2">
            {q.choices.map((c) => {
              const isCorrect = q.selectedChoiceKey === c.key;

              return (
                <div
                  key={c.key}
                  className={`px-4 py-2 rounded-lg border ${
                    isCorrect
                      ? "bg-green-100 border-green-400 font-semibold"
                      : "bg-white"
                  }`}
                >
                  {c.key} : {c.label}
                  {isCorrect && " ✓"}
                </div>
              );
            })}
          </div>

        </div>
      ))}
    </div>
  );
}