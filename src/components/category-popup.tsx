"use client";

import { useEffect, useMemo, useState } from "react";
import { Categories } from "@/types";

type CategoryPopupProps = {
  open: boolean;
  categories: Categories[];
  defaultSelected?: number[]; 
  onClose: () => void;
  onConfirm: (selected: number[]) => void;
};

export function CategoryPopup({
  open,
  categories,
  defaultSelected = [],
  onClose,
  onConfirm,
}: CategoryPopupProps) {
  const [selected, setSelected] = useState<number[]>(defaultSelected);

  useEffect(() => {
    if (open) setSelected(defaultSelected);
  }, [open, defaultSelected]);

  const allSelected = useMemo(
    () => selected.length === categories.length && categories.length > 0,
    [selected, categories]
  );

  const MAX_SELECT = 2;

  const toggle = (id: number) => {
  setSelected((prev) => {
    if (prev.includes(id)) {
      return prev.filter((x) => x !== id);
    }

    if (prev.length >= MAX_SELECT) {
      return prev;
    }

    return [...prev, id];
  });
};

  // const toggleAll = () => {
  //   setSelected(allSelected ? [] : [...categories]);
  // };

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
            const active = selected.includes(c.id);
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => toggle(c.id)}
                className={[
                  "rounded-full border px-6 py-3 text-body transition",
                  active
                    ? "border-primary bg-white text-primary"
                    : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50",
                ].join(" ")}
              >
                {c.name}
              </button>
            );
          })}
        </div>

        {/* actions */}
        <div className="mt-8 flex items-center justify-end">
          <div className="flex gap-3"> 
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
