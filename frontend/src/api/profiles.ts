import client from './client';

export interface ProfileData {
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
}

export const fetchProfile = async () => {
  const response = await client.get('/profiles/me');
  // Handle the wrapped response format from backend TransformInterceptor
  const responseData = response.data.data || response.data;
  return responseData;
};

export const updateProfile = async (data: ProfileData) => {
  const response = await client.patch('/profiles/me', data);
  // Handle the wrapped response format from backend TransformInterceptor
  const responseData = response.data.data || response.data;
  return responseData;
};
