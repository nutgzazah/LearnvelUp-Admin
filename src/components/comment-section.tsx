"use client";

import React from "react";
import { FiSend } from "react-icons/fi";

type CommentCard = {
  partNo: number;
  content: string;
  usernameLabel?: string;
};

type CommentSectionProps = {
  title?: string; // default: "ความคิดเห็น"
  comments?: CommentCard[];
  onReplySubmit?: (partNo: number, replyText: string) => void;
};

export function CommentSection({
  title = "ความคิดเห็น",
  comments = [
    {
      partNo: 1,
      content:
        "กดเปิด Python ไม่ได้ครับมันขึ้นว่า Python is not recognized as an internal or external command",
      usernameLabel: "ชื่อผู้ใช้",
    },
  ],
  onReplySubmit,
}: CommentSectionProps) {
  const [reply, setReply] = React.useState<Record<number, string>>({});

  const handleSubmit = (partNo: number) => {
    const text = (reply[partNo] ?? "").trim();
    if (!text) return;
    onReplySubmit?.(partNo, text);
    setReply((prev) => ({ ...prev, [partNo]: "" }));
  };

  return (
    <section className="w-full">
      <h2 className="text-xl font-semibold text-foreground">{title}</h2>

      <div className="mt-4 space-y-5">
        {comments.map((c) => (
          <div
            key={c.partNo}
            className="rounded-2xl border-2 border-indigo-500/70 bg-background p-6 shadow-sm"
          >
            <div className="space-y-3">
              <p className="text-lg font-semibold text-foreground">
                ตอนที่ {c.partNo}
              </p>

              <p className="text-sm leading-relaxed text-foreground">
                {c.content}
              </p>

              <p className="text-xs text-muted-foreground">
                {c.usernameLabel ?? "ชื่อผู้ใช้"}
              </p>
            </div>

            <div className="mt-4 flex items-center gap-3">
              <input
                value={reply[c.partNo] ?? ""}
                onChange={(e) =>
                  setReply((prev) => ({ ...prev, [c.partNo]: e.target.value }))
                }
                placeholder="ตอบกลับความคิดเห็น"
                className="h-11 w-full rounded-xl border-2 border-indigo-500/70 bg-background px-4 text-sm outline-none focus:border-indigo-600"
              />

              <button
                type="button"
                onClick={() => handleSubmit(c.partNo)}
                className="h-11 w-11 shrink-0 rounded-xl border-2 border-indigo-500/70 bg-background flex items-center justify-center cursor-pointer active:scale-[0.98]"
                aria-label="ส่งคำตอบกลับ"
                title="ส่ง"
              >
                <FiSend className="text-indigo-500" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
