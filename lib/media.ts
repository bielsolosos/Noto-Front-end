import type { MediaResponse } from "@/types/media";
import type { PageResponse } from "@/types/pagination";
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

export async function getMedia(
  page: number = 0,
  size: number = 20,
  filter?: string
): Promise<PageResponse<MediaResponse>> {
  const params = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
  });
  
  if (filter) {
    params.append("filter", filter);
  }

  const response = await api.get<PageResponse<MediaResponse>>(`api/media?${params.toString()}`);
  return response.data;
}

export async function deleteMedia(id: string): Promise<void> {
  await api.delete(`api/media/${id}`);
}
