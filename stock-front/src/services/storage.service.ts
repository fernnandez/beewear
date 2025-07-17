import axios from "axios";
import api from "./api";

export async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await api.post("/upload", formData);
  return res.data.url;
}

export async function getImage(url: string): Promise<string> {
  const response = await axios.get(`${url}`, {
    responseType: "blob",
  });

  const blob = new Blob([response.data], {
    type: response.headers["content-type"],
  });
  return URL.createObjectURL(blob);
}
