import api from "./api";

export interface RegisterParams {
  name: string;
  email: string;
  password: string;
}

export interface LoginParams {
  email: string;
  password: string;
}

export const register = async (
  registerParams: RegisterParams
): Promise<any> => {
  const res = await api.post("/auth/register", registerParams);

  return res?.data.access_token;
};

export const loginFunction = async (loginParams: LoginParams): Promise<any> => {
  const res = await api.post("/auth/login", loginParams);

  return res?.data.access_token;
};

export const getProfileInfo = async (): Promise<any> => {
  const res = await api.get("/auth/me");

  return res?.data;
};
