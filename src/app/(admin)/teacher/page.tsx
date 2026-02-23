"use client";

import { useRef, useState } from "react";
import { FiSearch, FiUser } from "react-icons/fi";
import { GridTeacher, TeacherUser } from "@/components/grid-teacher";
import { createInstructor, getInstructors } from "@/services/instructor-service";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function TeacherPage() {
  const [teachers, setTeachers] = useState<TeacherUser[]>([]);

  const [search, setSearch] = useState("");
  const [openGrid, setOpenGrid] = useState(true);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);

  const onPickImage = () => fileRef.current?.click();

  const router = useRouter();
  const [selectedInstructor, setSelectedInstructor] = useState<TeacherUser | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getInstructors();

        const mapped: TeacherUser[] = data.map((i) => ({
          id: i.id,
          name: i.username,
        }));

        setTeachers(mapped);
      } catch (err) {
        console.error("Load instructors failed:", err);
      }
    };

    load();
  }, []);
  

  const onChangeImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const url = URL.createObjectURL(f);
    setPreviewUrl(url);
  };

  const onSearch = () => {
    if (!selectedInstructor) {
      alert("กรุณาเลือกผู้สอนจากรายการก่อน");
      return;
    }

    const params = new URLSearchParams();
    params.set("instructorId", String(selectedInstructor.id));
    params.set("instructorName", selectedInstructor.name);

    router.push(`/teacher?${params.toString()}`);
  };

  const onSubmit = async () => {
    try {
      const newInstructor = await createInstructor({
        username,
        email: email || undefined,
        bio: bio || undefined,
        // avatar_url: previewUrl || undefined, // ถ้ายังไม่ได้อัปขึ้น storage อย่าเพิ่งส่ง previewUrl
      });

      console.log("created:", newInstructor);

      alert("สร้างผู้สอนสำเร็จแล้ว")

      setUsername("");
      setEmail("");
      setBio("");
      setPreviewUrl(null);

      const data = await getInstructors();
      setTeachers(
        data.map((i) => ({
          id: i.id,
          name: i.username,
        }))
      );
    } catch (err: any) {
      console.error(err);
      alert(err?.message ?? "Create instructor failed");
    }
  };

  const onPickTeacher = (u: TeacherUser) => {
    setSelectedInstructor(u);
    setSearch(u.name);
  };

  return (
    // <div className="max-w-8xl mx-auto space-y-8 pb-10 pl-100 pr-20 ml-8">
    <div className="max-w-8xl mx-auto space-y-8 pb-10 pl-20 pr-20">
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
                className="border-2 bg-background rounded-md px-4 py-2 hover:bg-black/5 nt-6 cursor-pointer"
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

              <div className="space-y-3">
                <label className="block text-xl font-semibold">Bio</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="กรอกชีวประวัติที่นี่"
                  className="w-full border-2 bg-background rounded-md px-4 py-3 outline-none"
                  rows={4}
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
          </button>
        </div>

        <GridTeacher users={teachers} query={search} onPick={onPickTeacher} />
      </div>
    </div>
  );
}
