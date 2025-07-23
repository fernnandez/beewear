import { AxiosError } from "axios";

export function getAxiosErrorMessage(
  error: unknown,
  fallback = "Erro desconhecido"
) {
  const err = error as AxiosError<{ message?: string }>;
  return err.response?.data?.message ?? fallback;
}
