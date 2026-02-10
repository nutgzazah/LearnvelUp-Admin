"use client";

import React from "react";
import { FiBookOpen, FiEye } from "react-icons/fi";
import { FaCoins } from "react-icons/fa";

export default function Home() {
  return (
    <div className="min-h-screen w-full px-8 py-8 ml-8">
      {/* Wrapper ให้เต็มจอ */}
      <div className="w-full h-full space-y-8">
        {/* ===== แถวบน: 3 กล่อง ===== */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="rounded-2xl border-2 border-orange-400 bg-orange-50 p-10 shadow-sm">
            <div className="text-center text-black text-h3 font-semibold">
              จำนวนเหรียญที่ได้รับ
            </div>

            <div className="mt-8 flex items-center justify-center gap-7">
              <div className="h-16 w-16 rounded-full bg-black flex items-center justify-center">
                <FaCoins className="text-white text-h4 -mt-0.5" />
              </div>

              <div className="text-h3 font-medium text-black tracking-wide">
                999,999,999
              </div>
            </div>
          </div>

          {/* กล่อง 2 */}
          <div className="rounded-2xl border-2 border-black bg-neutral-100 p-10 shadow-sm">
            <div className="text-center text-black text-h3 font-semibold">
              จำนวนคอร์ส
            </div>

            <div className="mt-8 flex items-center justify-center gap-7">
              <div className="h-16 w-16 rounded-full bg-black flex items-center justify-center">
                <FiBookOpen className="text-white" size={32} />
              </div>

              <div className="text-h3 text-black font-medium tracking-wide">
                12
              </div>
            </div>
          </div>

          {/* กล่อง 3 */}
          <div className="rounded-2xl border-2 border-purple-600 bg-purple-100 p-10 shadow-sm">
            <div className="text-center text-h3 text-black font-semibold">
              ยอดการเข้าชมทั้งหมด
            </div>

            <div className="mt-8 flex items-center justify-center gap-7">
              <div className="h-16 w-16 rounded-full bg-black flex items-center justify-center">
                <FiEye className="text-white" size={32} />
              </div>

              <div className="text-h3 text-black font-medium tracking-wide">
                999,999,999
              </div>
            </div>
          </div>
        </div>

        {/* ===== แถวล่าง: 2 กล่อง (ให้กินพื้นที่ที่เหลือ) ===== */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="rounded-2xl border-2 border-black bg-white shadow-sm min-h-[420px]" />
          <div className="rounded-2xl border-2 border-black bg-white shadow-sm min-h-[420px]" />
        </div>
      </div>
    </div>
  );
}
