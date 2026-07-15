import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import type {
  ApiResponse,
  Employee,
  PaginatedEmployees,
  CreateEmployeeRequest,
  UpdateEmployeeRequest,
} from '../types';

interface UseEmployeesParams {
  page: number;
  limit: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export function useEmployees(params: UseEmployeesParams) {
  return useQuery({
    queryKey: ['employees', params],
    queryFn: async () => {
      const response = await api.get<ApiResponse<PaginatedEmployees>>('/employees', { params });
      return response.data.data;
    },
    // Keep previous data while fetching new data for smooth pagination UI
    placeholderData: (previousData) => previousData,
  });
}

export function useCreateEmployee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateEmployeeRequest) => {
      const response = await api.post<ApiResponse<Employee>>('/employees', data);
      return response.data.data;
    },
    onSuccess: () => {
      // Invalidate the list so it refetches and shows the new employee
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
  });
}

export function useUpdateEmployee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateEmployeeRequest }) => {
      const response = await api.put<ApiResponse<Employee>>(`/employees/${id}`, data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
  });
}

export function useDeleteEmployee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/employees/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
  });
}
