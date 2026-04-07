import type { MediaResponse } from "@/types/media";
import api from "./api";

export async function uploadMedia(file: File): Promise<MediaResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await api.post<MediaResponse>("api/media/upload", formData);
  return response.data;
}

export async function uploadProfileImage(file: File): Promise<void> {
  const formData = new FormData();
  formData.append("file", file);

  await api.post("api/users/profile-image", formData);
}
