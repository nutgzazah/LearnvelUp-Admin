"use client";

import { useRef, useState } from "react";
import { FiSearch, FiUser } from "react-icons/fi";
import { GridTeacher, TeacherUser } from "@/components/grid-teacher";

export default function TeacherPage() {
  const mockTeachers = [
  { id: 1, name: "Maryam Amiri", role: "Designer", avatarUrl: "https://i.pravatar.cc/150?img=1", isFavorite: true },
  { id: 2, name: "Hossein Shams", role: "Full Stack Developer", avatarUrl: "https://i.pravatar.cc/150?img=12" },
  { id: 3, name: "Sarah Conner", role: "Support Agent", avatarUrl: "https://i.pravatar.cc/150?img=5" },
  { id: 4, name: "Frank Camly", role: "Support Agent", avatarUrl: "https://i.pravatar.cc/150?img=8" },
  { id: 5, name: "Freddie Arendes", role: "Marketing Department", avatarUrl: "https://i.pravatar.cc/150?img=9" },
  { id: 6, name: "Gary Camara", role: "Marketing Department", avatarUrl: "https://i.pravatar.cc/150?img=15", isFavorite: true },
  { id: 7, name: "Tim Hank", role: "Marketing Department", avatarUrl: "https://i.pravatar.cc/150?img=11" },
  { id: 8, name: "Fidel Tonn", role: "Support Agent", avatarUrl: "https://i.pravatar.cc/150?img=20", isFavorite: true },
  { id: 9, name: "Fidel Tonn", role: "Support Agent", avatarUrl: "https://i.pravatar.cc/150?img=20", isFavorite: true },
  { id: 10, name: "Fidel Tonn", role: "Support Agent", avatarUrl: "https://i.pravatar.cc/150?img=20", isFavorite: true },
  { id: 11, name: "KMUTT", role: "Support Agent", avatarUrl: "https://www.youtube.com/@kmuttlive", isFavorite: true },
];
  const [search, setSearch] = useState("");
  const [openGrid, setOpenGrid] = useState(true);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);

  const onPickImage = () => fileRef.current?.click();

  

  const onChangeImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const url = URL.createObjectURL(f);
    setPreviewUrl(url);
  };

  const onSearch = () => {
    // เปิด grid และใช้ search เป็นคำกรองใน modal
    setOpenGrid(true);
  };

  const onSubmit = () => {
    console.log({ username, email });
  };

  const onPickTeacher = (u: TeacherUser) => {
    console.log("picked:", u);
    setSearch(u.name);
  };

  return (
    <div className="max-w-8xl mx-auto space-y-8 pb-10 pl-100 pr-20">
      

      {/* ... ส่วนสร้างคนสอนใหม่ของคุณเหมือนเดิม ... */}
      <div className="space-y-6 ">
        <h1 className="text-h2 font-bold text-primary mt-16 mb-8">สร้างคนสอนใหม่</h1>

        <div className="grid grid-cols-12 gap-6 items-start max-w-6xl mx-auto">
          <div className="col-span-12 md:col-span-5">
            <div className="flex flex-col items-center gap-4">
              <div className="h-52 w-52 rounded-full border-2 bg-background flex items-center justify-center overflow-hidden">
                {previewUrl ? (
                  <img src={previewUrl} alt="preview" className="h-full w-full object-cover" />
                ) : (
                  <FiUser size={72} />
                )}
              </div>

              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={onChangeImage}
              />

              <button
                type="button"
                onClick={onPickImage}
                className="border-2 bg-background rounded-md px-4 py-2 hover:bg-black/5 nt-6"
              >
                อัปโหลดรูปโปรไฟล์
              </button>
            </div>
          </div>

          <div className="col-span-12 md:col-span-7">
            <div className="space-y-10">
              <div className="space-y-3">
                <label className="block text-xl font-semibold">ชื่อผู้ใช้</label>
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="กรอกชื่อผู้ใช้ที่นี่"
                  className="w-full border-2 bg-background rounded-md px-4 py-3 outline-none"
                />
              </div>

              <div className="space-y-3">
                <label className="block text-xl font-semibold">อีเมล</label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="กรอกอีเมลที่นี่"
                  className="w-full border-2 bg-background rounded-md px-4 py-3 outline-none"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={onSubmit}
                  className="px-6 py-2 text-white font-bold rounded-lg shadow-md cursor-pointer transition bg-primary hover:bg-primary/90"
                >
                  ตกลง
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="space-y-4">
        <h1 className="text-h2 font-bold text-primary">เลือกผู้สอนเพื่อจัดการ</h1>

        {/* Search bar */}
        <div className="flex items-center gap-4">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ช่องค้นหาผู้สอน"
            className="w-full border-2 bg-background rounded-md px-4 py-3 outline-none"
          />
          <button
            type="button"
            onClick={onSearch}
            className="px-6 py-2 text-white font-bold rounded-lg shadow-md cursor-pointer transition bg-primary hover:bg-primary/90"
            aria-label="search"
          > เลือก
            {/* <FiSearch size={20} /> */}
          </button>
        </div>

        <GridTeacher users={mockTeachers} query={search} onPick={onPickTeacher} />
      </div>
    </div>
  );
}
