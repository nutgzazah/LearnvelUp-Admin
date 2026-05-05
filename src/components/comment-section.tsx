"use client";

import React from "react";
import { FiSend, FiEdit2 } from "react-icons/fi";

export type CommentCard = {
  id: number;
  chapterId: number;
  partNo: number;
  chapterTitle: string;
  content: string;
  usernameLabel?: string;
  replyId?: number | null;
  replyText?: string | null;
};

type CommentSectionProps = {
  title?: string;
  comments?: CommentCard[];
  onMarkAsResolved?: (commentId: number) => void;
  onReplySubmit?: (commentId: number, replyText: string) => Promise<void> | void;
};

type FilterType = "unanswered" | "all";

export function CommentSection({
  title = "คำถามในบทเรียน",
  comments = [],
  onReplySubmit,
  onMarkAsResolved,
}: CommentSectionProps) {
  const [reply, setReply] = React.useState<Record<number, string>>({});
  const [editingCommentId, setEditingCommentId] = React.useState<number | null>(null);
  const [filterType, setFilterType] = React.useState<FilterType>("unanswered");

  const filteredComments = React.useMemo(() => {
    if (filterType === "all") return comments;
    return comments.filter((c) => !c.replyText?.trim());
  }, [comments, filterType]);

  const handleSubmit = async (commentId: number) => {
    const text = (reply[commentId] ?? "").trim();
    if (!text) return;

    await onReplySubmit?.(commentId, text);

    setEditingCommentId(null);
    setReply((prev) => ({ ...prev, [commentId]: "" }));
  };

  const handleEdit = (commentId: number, currentReplyText: string) => {
    setEditingCommentId(commentId);
    setReply((prev) => ({
      ...prev,
      [commentId]: currentReplyText,
    }));
  };

  return (
    <section className="w-full">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-xl font-semibold text-foreground">{title}</h2>

        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value as FilterType)}
          className="h-10 rounded-xl border-2 border-indigo-500/70 bg-background px-3 text-sm text-foreground outline-none focus:border-indigo-600"
        >
          <option value="unanswered">ความคิดเห็นที่ยังไม่ได้ตอบกลับ</option>
          <option value="all">ความคิดเห็นทั้งหมด</option>
        </select>
      </div>

      <div className="mt-4 space-y-5">
        {filteredComments.map((c) => {
          const hasReply = !!c.replyText?.trim();
          const isEditing = editingCommentId === c.id;

          return (
            <div
              key={c.id}
              className="rounded-2xl border-2 border-indigo-500/70 bg-background p-6 shadow-sm"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-4">
                  <h3 className="text-h4 font-bold text-white">
                    ตอนที่ {c.partNo} : {c.chapterTitle}
                  </h3>

                  {!c.replyText && (
                    <button
                      type="button"
                      onClick={() => onMarkAsResolved?.(c.id)}
                      className="shrink-0 rounded-xl border border-primary px-4 py-2 text-sm text-primary hover:bg-primary hover:text-white transition"
                    >
                      อ่านแล้ว
                    </button>
                  )}
                </div>

                <p className="text-body mb-5 leading-relaxed text-foreground">
                  {c.content}
                </p>

                <p className="text-tiny text-muted-foreground">
                  user ; {c.usernameLabel ?? "ชื่อผู้ใช้"}
                </p>
              </div>

              <div className="mt-4">
                {hasReply && !isEditing ? (
                  <div className="flex items-center gap-3">
                    <div className="min-h-11 flex-1 rounded-xl border-2 border-indigo-500/70 bg-background px-4 py-3 text-sm text-foreground">
                      {c.replyText}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleEdit(c.id, c.replyText ?? "")}
                      className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-xl border-2 border-indigo-500/70 bg-background active:scale-[0.98]"
                      aria-label="แก้ไขคำตอบกลับ"
                      title="แก้ไข"
                    >
                      <FiEdit2 className="text-indigo-500" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <input
                      value={reply[c.id] ?? ""}
                      onChange={(e) =>
                        setReply((prev) => ({
                          ...prev,
                          [c.id]: e.target.value,
                        }))
                      }
                      placeholder="ตอบกลับความคิดเห็น"
                      className="h-11 w-full rounded-xl border-2 border-indigo-500/70 bg-background px-4 text-sm outline-none focus:border-indigo-600"
                    />

                    <button
                      type="button"
                      onClick={() => handleSubmit(c.id)}
                      className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-xl border-2 border-indigo-500/70 bg-background active:scale-[0.98]"
                      aria-label="ส่งคำตอบกลับ"
                      title="ส่ง"
                    >
                      <FiSend className="text-indigo-500" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {filteredComments.length === 0 && (
          <div className="rounded-2xl border-2 border-dashed border-indigo-500/50 p-6 text-sm text-muted-foreground">
            ไม่พบความคิดเห็นตามตัวกรองที่เลือก
          </div>
        )}
      </div>
    </section>
  );
}