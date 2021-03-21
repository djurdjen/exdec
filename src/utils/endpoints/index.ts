import { get, post } from "../httpMethods";
import { LoginRequest, LoginResponse } from "./types";

export const login = async (data: LoginRequest) => {
  return post<LoginRequest, LoginResponse>("/api/login", data);
};
