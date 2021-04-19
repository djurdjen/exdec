export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  name: string;
  token: string;
}

export interface EnsureAuthorizedResponse {
  username: string;
  id: string;
}
