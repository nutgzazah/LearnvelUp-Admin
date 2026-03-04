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
import { getCategories } from "@/services/categories-service";
import { Categories } from "@/types";
import { useRouter, useSearchParams } from "next/navigation";


export default function CreatecoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string>("");
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [categoryTarget, setCategoryTarget] = useState<"primary" | "secondary">("primary");
  const [primaryCategoryId, setPrimaryCategoryId] = useState<number | null>(null);
  const [secondaryCategoryIds, setSecondaryCategoryIds] = useState<number[]>([]);
  const router = useRouter();
  const [categories, setCategories] = useState<Categories[]>([]);

  // State for edit mode
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  const searchParams = useSearchParams();

  useEffect(() => {
    const idStr = searchParams.get("instructorId");
    const id = idStr ? Number(idStr) : null;

    if (id && !Number.isNaN(id)) {
      setForm((prev) => ({
        ...prev,
        instructor_id: id,
      }));
    }
  }, [searchParams]);

  // State form
  const [form, setForm] = useState<CoursePayload>({
    instructor_id: null,
    category_id: null,
    sub_category_1_id: null,
    sub_category_2_id: null,

    title: "",
    description: "",
    learning_outcome: "",
    cover_image_url: "",

    price_coins: null,
    status: "draft", 
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
    const idStr = searchParams.get("instructorId");
    const id = idStr ? Number(idStr) : null;

    setForm({
      instructor_id: id && !Number.isNaN(id) ? id : null,
      category_id: null,
      sub_category_1_id: null,
      sub_category_2_id: null,

      title: "",
      description: "",
      learning_outcome: "",
      cover_image_url: "",

      price_coins: null,
      status: "draft",
    });

    setIsEditing(false);
    setEditId(null);
  };

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (err) {
        console.error(err);
        alert("โหลดหมวดหมู่ไม่สำเร็จ");
      }
    };

    loadCategories();
  }, []);


  // Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !form.title.trim() ||
      form.price_coins === null ||
      form.price_coins < 0
    ) {
      return alert("กรุณากรอกชื่อและราคาให้ถูกต้อง");
    }
    if (!form.learning_outcome?.trim()) {
      return alert("กรุณากรอกผลลัพธ์การเรียนรู้");
    }

    try {
    const instructorId = searchParams.get("instructorId");
    const instructorName = searchParams.get("instructorName");

    if (isEditing && editId) {
      await updateCourse(editId, form);
      alert("แก้ไขข้อมูลเรียบร้อย!");

      const params = new URLSearchParams();
      if (instructorId) params.append("instructorId", instructorId);
      if (instructorName) params.append("instructorName", instructorName);
      params.append("courseId", String(editId)); // ถ้าอยากส่ง courseId ตอน edit

      router.push(`/create/content?${params.toString()}`);
    } else {
      const created = await createCourse(form);
      alert("เพิ่มคอร์สเรียบร้อย!");

      const newId = created?.[0]?.id;

      const params = new URLSearchParams();
      if (instructorId) params.append("instructorId", instructorId);
      if (instructorName) params.append("instructorName", instructorName);
      if (newId) params.append("courseId", String(newId));

      router.push(`/create/content?${params.toString()}`);
    }

    resetForm();
    loadData();
  } catch (error: any) {
    alert("เกิดข้อผิดพลาด: " + error.message);
  }
  };

  // edit in table
  const handleEdit = (course: Course) => {
    setIsEditing(true);
    setEditId(course.id);

    setForm((prev) => ({
      ...prev,
      title: course.title,
      description: course.description ?? "",
      learning_outcome: course.learning_outcome ?? "",
      price_coins: course.price_coins,
      cover_image_url: course.cover_image_url ?? "",
      status: course.status ?? prev.status,
      category_id: course.category_id ?? prev.category_id,
      sub_category_1_id: course.sub_category_1_id ?? prev.sub_category_1_id,
      sub_category_2_id: course.sub_category_2_id ?? prev.sub_category_2_id,
      instructor_id: course.instructor_id ?? prev.instructor_id,
    }));

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
    <div className="max-w-8xl mx-auto space-y-8 pb-10 pl-20 pr-20">
      {/* Header */}
      <div>
        <h1 className="text-h2 font-bold text-primary">สร้างคอร์สเรียน</h1>
      </div>

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
            {isEditing ? "แก้ไขข้อมูลคอร์ส" : "เพิ่มคอร์สใหม่"}
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
              value={form.learning_outcome || ""}
              onChange={(e) => setForm({ ...form, learning_outcome: e.target.value })}
              required
            />
          </div>

          

          <div className="space-y-2 md:col-span-2">
            <label className="block text-h6 font-bold mb-4">อัพโหลดหน้าปกคอร์ส</label>

            {/* กล่องคลิกเพื่ออัปโหลด */}
            <label className="block cursor-pointer">
              <div className="w-full rounded-2xl border-2 border-dashed border-gray-400 bg-background p-6 flex items-center justify-center gap-3 transition">
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

            {/* preview รูป */}
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
            {/* ===== หมวดหมู่หลัก ===== */}
            <label className="block text-h6 font-bold mb-2">หมวดหมู่หลัก</label>
            <button
              type="button"
              onClick={() => {
                setCategoryTarget("primary");
                setCategoryOpen(true);
              }}
              className="px-6 py-2 text-white font-bold rounded-lg shadow-md cursor-pointer transition bg-primary hover:bg-primary/90 mt-2 mb-6"
            >
              เพิ่มหมวดหมู่
            </button>

            <input
              type="text"
              className="w-full p-2 border rounded-lg bg-background"
              value={
                categories.find((c) => c.id === primaryCategoryId)?.name || ""
              }
              readOnly
              placeholder="เลือกหมวดหมู่จากปุ่ม"
              required
            />

            {/* ===== หมวดหมู่รอง ===== */}
            <label className="block text-h6 font-bold mb-2 mt-6">
              หมวดหมู่รอง (ไม่เกิน 2 หมวดหมู่)
            </label>

            <button
              type="button"
              disabled={!primaryCategoryId}
              onClick={() => {
                if (!primaryCategoryId) return;
                setCategoryTarget("secondary");
                setCategoryOpen(true);
              }}
              className={`px-6 py-2 text-white font-bold rounded-lg shadow-md transition mt-2 mb-6
                ${primaryCategoryId ? "bg-primary hover:bg-primary/90" : "bg-gray-400 cursor-not-allowed"}`}
            >
              เพิ่มหมวดหมู่
            </button>

            {!primaryCategoryId && (
              <p className="text-sm text-gray-500 -mt-4 mb-3">
                * กรุณาเลือกหมวดหมู่หลักก่อน ถึงจะเลือกหมวดหมู่รองได้
              </p>
            )}

            <input
              type="text"
              className="w-full p-2 border rounded-lg bg-background"
              value={secondaryCategoryIds
                .map((id) => categories.find((c) => c.id === id)?.name)
                .join(", ")
              }
              readOnly
              placeholder="เลือกหมวดหมู่รองจากปุ่ม"
            />
          </div>
          
          <div className="space-y-1 md:col-span-2">
            <label className="block text-h6 font-bold mb-4">ราคาคอร์ส</label>
            <input
              type="number"
              min="0"
              value={form.price_coins ?? ""}
              className="w-full p-2 border rounded-lg bg-background"
              onChange={(e) =>
                setForm({
                  ...form,
                  price_coins: e.target.value ? Number(e.target.value) : null,
                })
              }
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
              // onClick={() => router.push("/create/content")}
              className="px-6 py-2 text-white font-bold rounded-lg shadow-md cursor-pointer transitionbg-primary bg-primary hover:bg-primary/90">
              ถัดไป
            </button>
          </div>
          
        </form>

      <CategoryPopup
        open={categoryOpen}
        categories={
          categoryTarget === "secondary"
            ? categories.filter((c) => c.id !== primaryCategoryId)
            : categories
        }
        defaultSelected={
          categoryTarget === "primary"
            ? (primaryCategoryId ? [primaryCategoryId] : [])
            : secondaryCategoryIds
        }
        onClose={() => setCategoryOpen(false)}
        onConfirm={(selected) => {
          if (categoryTarget === "primary") {
            const one = selected[0] ?? null;

            setPrimaryCategoryId(one);

            setForm((prev) => ({
              ...prev,
              category_id: one,
            }));

            setSecondaryCategoryIds((prev) =>
              prev.filter((id) => id !== one)
            );
          } else {
            const filtered = selected
              .filter((id) => id !== primaryCategoryId)
              .slice(0, 2);

            setSecondaryCategoryIds(filtered);

            setForm((prev) => ({
              ...prev,
              sub_category_1_id: filtered[0] ?? null,
              sub_category_2_id: filtered[1] ?? null,
            }));
          }

          setCategoryOpen(false);
        }}
      />

      </div>
        
    </div>
  );
}
