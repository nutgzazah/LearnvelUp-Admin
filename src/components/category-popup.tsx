"use client";

import { useEffect, useMemo, useState } from "react";

type CategoryPopupProps = {
  open: boolean;
  categories: string[];
  defaultSelected?: string[];
  onClose: () => void;
  onConfirm: (selected: string[]) => void;
};

export function CategoryPopup({
  open,
  categories,
  defaultSelected = [],
  onClose,
  onConfirm,
}: CategoryPopupProps) {
  const [selected, setSelected] = useState<string[]>(defaultSelected);

  useEffect(() => {
    if (open) setSelected(defaultSelected);
  }, [open, defaultSelected]);

  const allSelected = useMemo(
    () => selected.length === categories.length && categories.length > 0,
    [selected, categories]
  );

  const MAX_SELECT = 2;

  const toggle = (name: string) => {
    setSelected((prev) => {
      // ถ้าเลือกอยู่แล้ว → เอาออกได้เสมอ
      if (prev.includes(name)) {
        return prev.filter((x) => x !== name);
      }

      // ถ้ายังไม่เลือก แต่ครบ 2 แล้ว → ไม่ให้เพิ่ม
      if (prev.length >= MAX_SELECT) {
        return prev;
      }

      // เพิ่มได้ปกติ
      return [...prev, name];
    });
  };

  const toggleAll = () => {
    setSelected(allSelected ? [] : [...categories]);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* overlay */}
      <button
        type="button"
        onClick={onClose}
        className="absolute inset-0 bg-black/40"
        aria-label="Close"
      />

      {/* modal */}
      <div className="absolute left-1/2 top-1/2 w-[92%] max-w-4xl -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6 shadow-xl">
        {/* title */}
        <h2 className="text-3xl font-bold text-primary">หมวดหมู่ทั้งหมด</h2>
        <div className="mt-3 h-[3px] w-64 bg-primary" />

        {/* chips */}
        <div className="mt-6 flex flex-wrap gap-3">
          {categories.map((c) => {
            const active = selected.includes(c);
            return (
              <button
                key={c}
                type="button"
                onClick={() => toggle(c)}
                className={[
                  "rounded-full border px-6 py-3 text-body transition",
                  active
                    ? "border-primary bg-white text-primary"
                    : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50",
                ].join(" ")}
              >
                {c}
              </button>
            );
          })}
        </div>

        {/* actions */}
        <div className="mt-8 flex items-center justify-end">
          {/* <button
            type="button"
            onClick={toggleAll}
            className={[
              "rounded-full border px-6 py-3 text-body transition",
              allSelected
                ? "border-primary bg-white text-primary"
                : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50",
            ].join(" ")}
          >
            ทั้งหมด
          </button> */}

          <div className="flex gap-3">
            {/* <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-gray-300 px-6 py-3 text-body text-gray-700 hover:bg-gray-50 transition"
            >
              ยกเลิก
            </button> */}

            <button
              type="button"
              onClick={() => onConfirm(selected)}
              className="rounded-full border border-gray-300 px-10 py-3 text-body text-gray-700 hover:bg-gray-50 transition"
            >
              ตกลง
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
