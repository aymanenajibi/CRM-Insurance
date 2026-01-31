import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Helper to get the token from localStorage (assuming that's where you store it)
const getAuthHeader = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
});

export const vehiculeService = {
  getAll: () => axios.get(`${API_URL}/vehicules/`, getAuthHeader()),
  getOne: (id: number) => axios.get(`${API_URL}/vehicules/${id}`, getAuthHeader()),
  create: (data: VehiculeCreate) => axios.post(`${API_URL}/vehicules/`, data, getAuthHeader()),
  update: (id: number, data: Partial<VehiculeCreate>) => axios.put(`${API_URL}/vehicules/${id}`, data, getAuthHeader()),
  delete: (id: number) => axios.delete(`${API_URL}/vehicules/${id}`, getAuthHeader()),
};