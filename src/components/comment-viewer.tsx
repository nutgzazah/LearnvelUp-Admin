"use client";

import Image from "next/image";

type CommentViewCardProps = {
  courseTitle: string;
  content: string;
  username?: string | null;
  created_at?: string;
  coverImageUrl?: string | null;
};

function formatDate(dateStr?: string) {
  if (!dateStr) return "-";

  const date = new Date(dateStr);
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = date.getFullYear();

  return `${dd}/${mm}/${yyyy}`;
}

export function CommentViewCard({
  courseTitle,
  content,
  username,
  created_at,
  coverImageUrl,
}: CommentViewCardProps) {
  return (
    <div className="flex items-center justify-between gap-4 bg-gray-100 p-4 rounded-xl">
      
      {/* LEFT */}
      <div className="flex gap-4 items-start flex-1">
        
        {/* Avatar */}
        <Image
          src="/images/otter_main_bgyellow.png"
          alt="avatar"
          width={50}
          height={50}
          className="rounded-full object-cover"
        />

        <div className="flex flex-col gap-1 flex-1">
          
          {/* Course Title */}
          <h3 className="text-h5 md:text-base font-semibold line-clamp-2 text-black">
            {courseTitle}
          </h3>

          {/* Username + Date */}
          <div className="text-sm text-gray-600 flex gap-2 items-center">
            <span>{username ?? "ไม่ทราบชื่อ"}</span>
            <span>{formatDate(created_at)}</span>
          </div>

          {/* Content */}
          <p className="text-base text-black leading-relaxed line-clamp-2">
            {content}
          </p>
        </div>
      </div>

      {/* RIGHT IMAGE */}
      <div className="w-[220px] h-[120px] shrink-0 rounded-lg overflow-hidden">
        <img
          src={
            coverImageUrl ||
            "https://www.shutterstock.com/blog/wp-content/uploads/sites/5/2020/07/trendy-background-ideas-cover.jpg"
          }
          alt={courseTitle}
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}