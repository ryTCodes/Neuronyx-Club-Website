import { uploadFile } from "@/lib/fileUpload";

export async function uploadImage(
  file: File,
  folder?: "team" | "events"
): Promise<string> {
  if (!file.type.startsWith("image/")) {
    throw new Error("Please select a valid image file.");
  }

  const result = await uploadFile(file, folder || "events");
  return result.url;
}

