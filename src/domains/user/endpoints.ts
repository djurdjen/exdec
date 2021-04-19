import { get, post } from "../../utils/httpMethods";
import { EnsureAuthorizedResponse, LoginRequest, LoginResponse } from "./types";

export const login = async (data: LoginRequest) => {
  return post<LoginRequest, LoginResponse>("/api/login", data);
};

export const logout = async () => {
  return post<any, any>("/api/logout", {});
};

export const ensureAuthorized = async () => {
  return get<EnsureAuthorizedResponse>("/api/verify");
};
