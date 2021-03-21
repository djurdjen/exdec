export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  name: string;
  token: string;
}
