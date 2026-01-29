"use client";

import { useEffect, useState } from "react";
import {
  getCourses,
  createCourse,
  updateCourse,
  deleteCourse,
} from "@/services";
import { Course, CoursePayload } from "@/types";

export default function TeacherPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

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
    <div className="max-w-5xl mx-auto space-y-8 pb-10">
      {/* Header */}
      <div>
        <h1 className="text-h2 font-bold text-primary">จัดการคอร์สเรียน 📚</h1>
        <p className="text-gray-500">ระบบจัดการข้อมูลรายวิชา (CRUD)</p>
        <p className="text-gray-500">ไหนลองดูซิว่าใช่หรือเปล่า</p>
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
            {isEditing ? "✏️ แก้ไขข้อมูลคอร์ส" : "➕ เพิ่มคอร์สใหม่"}
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
          <div className="space-y-1">
            <label className="text-small font-bold">ชื่อคอร์ส *</label>
            <input
              type="text"
              className="w-full p-2 border rounded-lg bg-background"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-small font-bold">ราคา (บาท) *</label>
            <input
              type="number"
              className="w-full p-2 border rounded-lg bg-background"
              value={form.price.toString()}
              onChange={(e) => {
                const value = e.target.value;
                setForm({
                  ...form,
                  // if null , make it 0
                  price: value === "" ? 0 : parseFloat(value),
                });
              }}
              required
            />
          </div>

          <div className="space-y-1 md:col-span-2">
            <label className="text-small font-bold">รายละเอียด</label>
            <textarea
              className="w-full p-2 border rounded-lg bg-background h-24"
              value={form.description || ""}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
          </div>

          <div className="space-y-1 md:col-span-2">
            <label className="text-small font-bold">ลิงก์รูปปก (URL)</label>
            <input
              type="text"
              placeholder="https://example.com/image.png"
              className="w-full p-2 border rounded-lg bg-background"
              value={form.image_url || ""}
              onChange={(e) => setForm({ ...form, image_url: e.target.value })}
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
              className={`px-6 py-2 text-white font-bold rounded-lg shadow-md transition ${
                isEditing
                  ? "bg-amber-500 hover:bg-amber-600"
                  : "bg-primary hover:bg-primary/90"
              }`}
            >
              {isEditing ? "บันทึกการแก้ไข" : "+ บันทึกข้อมูล"}
            </button>
          </div>
        </form>
      </div>

      {/* 📋 table show dataล */}
      <div className="bg-card rounded-2xl shadow-custom border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200 bg-gray-50 dark:bg-gray-800">
          <h3 className="text-h4 font-bold">
            รายการคอร์สทั้งหมด ({courses.length})
          </h3>
        </div>

        {loading ? (
          <div className="p-12 text-center">
            <p className="text-primary font-bold animate-pulse">
              กำลังโหลดข้อมูล...
            </p>
          </div>
        ) : courses.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            ยังไม่มีข้อมูลคอร์ส
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-100 dark:bg-gray-700 text-small uppercase font-bold text-gray-500">
                <tr>
                  <th className="p-4 w-16">ID</th>
                  <th className="p-4">ข้อมูลคอร์ส</th>
                  <th className="p-4 w-32">ราคา</th>
                  <th className="p-4 w-40 text-center">จัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {courses.map((course) => (
                  <tr
                    key={course.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition"
                  >
                    <td className="p-4 font-mono text-small text-gray-400">
                      #{course.id}
                    </td>
                    <td className="p-4">
                      <p className="font-bold text-lg">{course.title}</p>
                      <p className="text-small text-gray-400 truncate max-w-md">
                        {course.description || "-"}
                      </p>
                    </td>
                    <td className="p-4 font-bold text-secondary text-lg">
                      ฿{course.price.toLocaleString()}
                    </td>
                    <td className="p-4">
                      <div className="flex justify-center gap-2">
                        {/* edit button */}
                        <button
                          onClick={() => handleEdit(course)}
                          className="px-3 py-1 bg-amber-100 text-amber-700 rounded-md text-small font-bold hover:bg-amber-200"
                        >
                          แก้ไข
                        </button>
                        {/* Delete button*/}
                        <button
                          onClick={() => handleDelete(course.id)}
                          className="px-3 py-1 bg-red-100 text-red-600 rounded-md text-small font-bold hover:bg-red-200"
                        >
                          ลบ
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
