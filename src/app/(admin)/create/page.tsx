"use client";

import { useEffect, useState } from "react";
import {
  getCourses,
  createCourse,
  updateCourse,
  deleteCourse,
} from "@/services";
import { Course, CoursePayload } from "@/types";
import { FiUploadCloud } from "react-icons/fi";
import { CategoryPopup } from "@/components/category-popup";


export default function CreatecoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string>("");
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [categoryText, setCategoryText] = useState("");

  const CATEGORY_LIST = [
    "แพทย์",
    "วิศว",
    "ไอที",
    "วิทยาศาสตร์",
    "คณิตศาสตร์",
    "สถิติ",
    "ธุรกิจ",
    "บัญชี",
    "การตลาด",
    "กฎหมาย",
    "ภาษา",
    "จิตวิทยา",
    "ศิลปะ",
    "ออกแบบ",
    "เขียนโปรแกรม",
    "ทักษะอาชีพ",
  ];

  // State for edit mode
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  // State form
  const [form, setForm] = useState<CoursePayload>({
    title: "",
    description: "",
    price: 0,
    image_url: "",
  });

  // --- Functions ---

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getCourses();
      setCourses(data);
    } catch (error) {
      console.error(error);
      alert("โหลดข้อมูลไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Clear Function
  const resetForm = () => {
    setForm({ title: "", description: "", price: 0, image_url: "" });
    setIsEditing(false);
    setEditId(null);
  };

  // Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || form.price === undefined || form.price < 0) {
      return alert("กรุณากรอกชื่อและราคาให้ถูกต้อง");
    }

    try {
      if (isEditing && editId) {
        // 🟡 Edit mode
        await updateCourse(editId, form);
        alert("แก้ไขข้อมูลเรียบร้อย!");
      } else {
        // 🟢 Add mode
        await createCourse(form);
        alert("เพิ่มคอร์สเรียบร้อย! 🎉");
      }

      resetForm(); // reset form
      loadData(); // Load data
    } catch (error: any) {
      alert("เกิดข้อผิดพลาด: " + error.message);
    }
  };

  // edit in table
  const handleEdit = (course: Course) => {
    setIsEditing(true);
    setEditId(course.id);
    // add data to form
    setForm({
      title: course.title,
      description: course.description || "",
      price: course.price,
      image_url: course.image_url || "",
    });
    // scroll window to form
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: number) => {
    if (!confirm("ยืนยันที่จะลบคอร์สนี้? (กู้คืนไม่ได้นะ)")) return;
    try {
      await deleteCourse(id);
      setCourses((prev) => prev.filter((c) => c.id !== id));
    } catch (error) {
      alert("ลบไม่สำเร็จ");
    }
  };

  return (
    <div className="max-w-8xl mx-auto space-y-8 pb-10 pl-100 pr-20">
      {/* Header */}
      <div>
        <h1 className="text-h2 font-bold text-primary">สร้างคอร์สเรียน</h1>
      </div>

      {/* 📝 form (Dynamic: change header and title) */}
      <div
        className={`p-6 rounded-2xl shadow-custom border transition-colors ${
          isEditing
            ? "bg-amber-50 border-amber-200 dark:bg-amber-900/20"
            : "bg-card border-gray-200"
        }`}
      >
        <div className="flex justify-between items-center mb-4">
          <h3
            className={`text-h4 font-bold ${isEditing ? "text-amber-600" : "text-text"}`}
          >
            {isEditing ? "✏️ แก้ไขข้อมูลคอร์ส" : "เพิ่มคอร์สใหม่"}
          </h3>
          {isEditing && (
            <button
              onClick={resetForm}
              className="text-small text-gray-500 hover:text-gray-700 underline"
            >
              ยกเลิกการแก้ไข
            </button>
          )}
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <div className="space-y-4 md:col-span-2">
            <label className="block text-h6 font-bold mb-4 mt-2">ชื่อคอร์ส *</label>
            <input
              type="text"
              className="w-full p-2 border rounded-lg bg-background"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
          </div>

          <div className="space-y-1 md:col-span-2">
            <label className="block text-h6 font-bold mb-4">รายละเอียด</label>
            <textarea
              className="w-full p-2 border rounded-lg bg-background h-24"
              value={form.description || ""}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
          </div>

          <div className="space-y-1 md:col-span-2">
            <label className="block text-h6 font-bold mb-4">ผลลัพธ์การเรียนรู้ *</label>
            <input
              type="text"
              className="w-full p-2 border rounded-lg bg-background"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
          </div>

          

          <div className="space-y-2 md:col-span-2">
            <label className="block text-h6 font-bold mb-4">อัพโหลดหน้าปกคอร์ส</label>

            {/* กล่องคลิกเพื่ออัปโหลด */}
            <label className="block cursor-pointer">
              <div className="w-full rounded-2xl border-2 border-dashed border-gray-400 bg-background p-6 flex items-center justify-center gap-3 hover:bg-gray-800 transition">
                <FiUploadCloud className="text-3xl text-gray-500" />
              </div>

              {/* input file (ซ่อน) */}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  setCoverFile(file);

                  if (file) {
                    const url = URL.createObjectURL(file);
                    setCoverPreview(url);
                  } else {
                    setCoverPreview("");
                  }
                }}
              />
            </label>

            {/* preview รูป (ถ้ามี) */}
            {coverPreview && (
              <div className="mt-2">
                <img
                  src={coverPreview}
                  alt="cover preview"
                  className="h-40 w-full object-cover rounded-xl border"
                />
                <p className="text-xs text-gray-500 mt-1">
                  ไฟล์: {coverFile?.name}
                </p>
              </div>
            )}
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="block text-h6 font-bold mb-2">หมวดหมู่ (ไม่เกิน 2) *</label>

            <button
              type="button"
              onClick={() => setCategoryOpen(true)}
              className="px-6 py-2 text-white font-bold rounded-lg shadow-md cursor-pointer transition bg-primary hover:bg-primary/90 mt-2 mb-6"
            >
              เพิ่มหมวดหมู่
            </button>

            <input
              type="text"
              className="w-full p-2 border rounded-lg bg-background"
              value={categoryText}
              onChange={(e) => setCategoryText(e.target.value)}
              placeholder="เลือกหมวดหมู่จากปุ่ม"
              required
            />
          </div>


          <div className="md:col-span-2 text-right mt-2 flex justify-end gap-3">
            {isEditing && (
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-2 bg-gray-200 text-gray-700 font-bold rounded-lg hover:bg-gray-300 transition"
              >
                ยกเลิก
              </button>
            )}

            

            <button
              type="submit"
              className={`px-6 py-2 text-white font-bold rounded-lg shadow-md cursor-pointer transition ${
                isEditing
                  ? "bg-amber-500 hover:bg-amber-600"
                  : "bg-primary hover:bg-primary/90"
              }`}
            >
              {isEditing ? "บันทึกการแก้ไข" : "ถัดไป"}
            </button>
          </div>
        </form>
      <CategoryPopup
        open={categoryOpen}
        categories={CATEGORY_LIST}
        defaultSelected={
          categoryText
            ? categoryText.split(",").map((s) => s.trim()).filter(Boolean)
            : []
        }
        onClose={() => setCategoryOpen(false)}
        onConfirm={(selected) => {
          const text = selected.join(", ");
          setCategoryText(text);

          // ถ้าต้องการเก็บลง form ด้วย (กรณี CoursePayload มี field category จริง)
          // setForm((prev) => ({ ...prev, category: text }));

          setCategoryOpen(false);
        }}
      />
      </div>
        
    </div>
  );
}
