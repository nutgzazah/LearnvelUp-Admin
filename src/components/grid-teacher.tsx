"use client";

import { useEffect, useMemo, useState } from "react";
import { FiMoreVertical, FiStar, FiUsers } from "react-icons/fi";

export type TeacherUser = {
  id: string | number;
  name: string;
};

type GridTeacherProps = {
  query?: string;
  users: TeacherUser[];
  onPick?: (user: TeacherUser) => void;
};

const PAGE_SIZE = 8;

export function GridTeacher({ query = "", users, onPick }: GridTeacherProps) {
  const [page, setPage] = useState(1);


  // เปลี่ยน query แล้วกลับหน้า 1
  useEffect(() => {
    setPage(1);
  }, [query]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return users;

    return users.filter((u) =>
      (u.name ?? "").toLowerCase().includes(q)
    );
  }, [users, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);


  return (
    <div className="mt-6">
      {pageItems.length === 0 ? (
        <div className="rounded-xl border bg-background p-6 text-center text-black/60">
          ไม่พบผู้สอน
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {pageItems.map((u) => {
            return (
              <button
                key={u.id}
                type="button"
                onClick={() => onPick?.(u)}
                className="group relative rounded-2xl border bg-background p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md cursor-pointer"
              >

                {/* avatar */}
                <div className="mt-3 flex flex-col items-center">
                  <div className="h-20 w-20 overflow-hidden rounded-full bg-black/5">
                    <FiUsers size={36} className="text-black/40" />
                  </div>
                  <p className="mt-3 text-sm font-semibold">{u.name}</p>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      <div className="mt-6 flex items-center justify-center gap-2">
        <button
          type="button"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          className="h-9 w-9 rounded-md border hover:bg-black/5 disabled:opacity-40"
          disabled={page === 1}
        >
          ←
        </button>

        {Array.from({ length: totalPages }).map((_, i) => {
          const p = i + 1;
          const active = p === page;
          return (
            <button
              key={p}
              type="button"
              onClick={() => setPage(p)}
              className={[
                "h-9 w-9 rounded-md border text-sm",
                active ? "bg-primary text-white border-primary" : "hover:bg-black/5",
              ].join(" ")}
            >
              {p}
            </button>
          );
        })}

        <button
          type="button"
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          className="h-9 w-9 rounded-md border hover:bg-black/5 disabled:opacity-40"
          disabled={page === totalPages}
        >
          →
        </button>
      </div>
    </div>
  );
}
