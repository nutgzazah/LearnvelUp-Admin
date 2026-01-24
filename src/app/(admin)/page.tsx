"use client";

import React from "react";

export default function Home() {
  return (
    <div className="min-h-screen p-8 flex flex-col items-center gap-10 ">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-h1 font-bold text-primary">LearnvelUp Admin 🦦</h1>
        <p className="text-h4 font-medium">Design System Check</p>
      </div>

      {/* Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
        {/* Card 1: Primary Theme */}
        <div className="bg-card p-6 rounded-2xl shadow-custom border-l-4 border-primary">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-h3 font-bold ">Users</h3>
            <span className="text-2xl">👥</span>
          </div>
          <p className="text-h1 font-bold text-primary">1,250</p>
          <p className="text-small text-gray-400 italic">
            Active users this month
          </p>
        </div>

        {/* Card 2: Secondary Theme */}
        <div className="bg-card p-6 rounded-2xl shadow-custom border-l-4 border-secondary">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-h3 font-bold ">Revenue</h3>
            <span className="text-2xl">💰</span>
          </div>
          <p className="text-h1 font-bold text-secondary">฿54,000</p>
          <p className="text-small text-gray-400 italic">Updated just now</p>
        </div>
      </div>

      {/* Button & Typography Check */}
      <div className="w-full max-w-4xl space-y-4">
        <h5 className="text-h5 font-bold ">Buttons & States</h5>
        <div className="flex flex-wrap gap-4">
          <button className="px-6 py-3 bg-primary  rounded-lg font-bold shadow-lg hover:opacity-90 transition">
            Primary Button
          </button>
          <button className="px-6 py-3 bg-secondary  rounded-lg font-bold shadow-md hover:opacity-90 transition">
            Secondary Button
          </button>
          <button className="px-6 py-3 bg-alert  rounded-lg font-bold shadow-md">
            Delete Action
          </button>
          <button className="px-6 py-3 bg-disablebg text-disabletext rounded-lg font-medium cursor-not-allowed">
            Disabled
          </button>
        </div>
      </div>

      {/* Font Weight Check */}
      <div className="w-full max-w-4xl p-6 bg-card rounded-xl shadow-custom">
        <p className="text-body ">K2D Regular: สวัสดีชาวโลก (ตัวปกติ)</p>
        <p className="text-body font-medium">
          K2D Medium: สวัสดีชาวโลก (ตัวหนาปานกลาง)
        </p>
        <p className="text-body font-bold text-primary">
          K2D Bold: สวัสดีชาวโลก (ตัวหนาสีหลัก)
        </p>
        <p className="text-body italic text-secondary">
          K2D Italic: สวัสดีชาวโลก (ตัวเอียงสีรอง)
        </p>
      </div>
    </div>
  );
}
