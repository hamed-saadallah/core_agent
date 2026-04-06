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
  // Handle the wrapped response format from backend TransformInterceptor
  const responseData = response.data.data || response.data;
  return responseData;
};

export const login = async (data: LoginRequest): Promise<AuthResponse> => {
  const response = await client.post('/auth/login', data);
  // Handle the wrapped response format from backend TransformInterceptor
  const responseData = response.data.data || response.data;
  return responseData;
};

export const verifyEmail = async (data: VerifyEmailRequest) => {
  const response = await client.post('/auth/verify-email', data);
  // Handle the wrapped response format from backend TransformInterceptor
  const responseData = response.data.data || response.data;
  return responseData;
};

export const resendCode = async (data: ResendCodeRequest) => {
  const response = await client.post('/auth/resend-code', data);
  // Handle the wrapped response format from backend TransformInterceptor
  const responseData = response.data.data || response.data;
  return responseData;
};

export const getCurrentUser = async () => {
  const response = await client.get('/auth/me');
  // Handle the wrapped response format from backend TransformInterceptor
  const responseData = response.data.data || response.data;
  return responseData;
};
