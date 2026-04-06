import client from './client';

export interface RegisterRequest {
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface VerifyEmailRequest {
  code: string;
}

export interface ResendCodeRequest {
  email: string;
}

export interface AuthResponse {
  access_token: string;
  user: any;
  isEmailVerified: boolean;
}

export const register = async (data: RegisterRequest) => {
  const response = await client.post('/auth/register', data);
  return response.data;
};

export const login = async (data: LoginRequest): Promise<AuthResponse> => {
  const response = await client.post('/auth/login', data);
  return response.data;
};

export const verifyEmail = async (data: VerifyEmailRequest) => {
  const response = await client.post('/auth/verify-email', data);
  return response.data;
};

export const resendCode = async (data: ResendCodeRequest) => {
  const response = await client.post('/auth/resend-code', data);
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await client.get('/auth/me');
  return response.data;
};
