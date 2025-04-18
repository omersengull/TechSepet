// services/specifications.ts
import axios from 'axios';

export const getCategorySpecifications = async (categoryId: string) => {
  try {
    const response = await axios.get(`/api/specifications/${categoryId}`);
    return response.data;
  } catch (error) {
    throw new Error('Özellikler alınamadı');
  }
};