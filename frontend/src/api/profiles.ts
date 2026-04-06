import client from './client';

export interface ProfileData {
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
}

export const fetchProfile = async () => {
  const response = await client.get('/profiles/me');
  return response.data;
};

export const updateProfile = async (data: ProfileData) => {
  const response = await client.patch('/profiles/me', data);
  return response.data;
};
