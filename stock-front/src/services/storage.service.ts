import api from "./api";

export async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await api.post("/upload", formData);
  return res.data.imageUrl;
}

export async function getImage(filename: string): Promise<string> {
  console.log(filename);
  const response = await api.get(`/upload/${filename}`, {
    responseType: "blob",
  });

  const blob = new Blob([response.data], {
    type: response.headers["content-type"],
  });
  return URL.createObjectURL(blob);
}
