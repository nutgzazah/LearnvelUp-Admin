import { supabase } from "@/lib/supabase";

export const getVideoDurationSeconds = (file: File): Promise<number> => {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const video = document.createElement("video");

    video.preload = "metadata";
    video.src = url;

    video.onloadedmetadata = () => {
      const duration = Math.floor(video.duration || 0);
      URL.revokeObjectURL(url);
      resolve(duration);
    };

    video.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("ไม่สามารถอ่านความยาววิดีโอได้"));
    };
  });
};

type UploadChapterVideoPayload = {
  file: File;
  courseId: number;
  chapterId: number;
};

export async function uploadChapterVideo({
  file,
  courseId,
  chapterId,
}: UploadChapterVideoPayload) {
  const filePath = `courses/${courseId}/chapters/${chapterId}.mp4`;
  const bucket = "videos";

  const { error } = await supabase.storage
    .from(bucket)
    .upload(filePath, file, {
      upsert: true,
      contentType: file.type || "video/mp4",
    });

  if (error) throw error;

  return {
    filePath,
  };
}

export async function deleteChapterVideo(filePath: string) {
  const { error } = await supabase.storage
    .from("videos")
    .remove([filePath]);

  if (error) throw error;
}

export async function getVideoPreviewUrl(filePath: string) {
  const { data, error } = await supabase.storage
    .from("videos")
    .createSignedUrl(filePath, 60 * 60);

  if (error) throw error;

  return data.signedUrl;
}