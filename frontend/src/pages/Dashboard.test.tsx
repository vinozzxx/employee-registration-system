import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Dashboard from './Dashboard';
import * as useEmployeesHook from '../hooks/useEmployees';

vi.mock('../hooks/useEmployees', () => ({
  useEmployees: vi.fn(),
  useCreateEmployee: vi.fn(() => ({
    mutateAsync: vi.fn(),
    isPending: false,
  })),
  useUpdateEmployee: vi.fn(() => ({
    mutateAsync: vi.fn(),
    isPending: false,
  })),
  useDeleteEmployee: vi.fn(() => ({
    mutateAsync: vi.fn(),
    isPending: false,
  })),
}));

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>{ui}</BrowserRouter>
    </QueryClientProvider>,
  );
};

describe('Dashboard Page', () => {
  it('renders loading state initially', () => {
    vi.mocked(useEmployeesHook.useEmployees).mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      error: null,
    } as never);

    renderWithProviders(<Dashboard />);
    expect(screen.getByTestId('loading-skeleton')).toBeInTheDocument();
  });

  it('renders empty state when no data', () => {
    vi.mocked(useEmployeesHook.useEmployees).mockReturnValue({
      data: { items: [], total: 0, page: 1, limit: 10, totalPages: 0 },
      isLoading: false,
      isError: false,
      error: null,
    } as never);

    renderWithProviders(<Dashboard />);
    expect(screen.getByText(/No employees found/i)).toBeInTheDocument();
  });

  it('renders data table correctly', () => {
    vi.mocked(useEmployeesHook.useEmployees).mockReturnValue({
      data: {
        items: [
          {
            id: '1',
            firstName: 'Vinoth',
            lastName: 'Kumar',
            email: 'vino@gmail.com',
            contact: '9876543210',
            gender: 'Male',
            department: 'Engineering',
            designation: 'Software Engineer',
            dateOfBirth: '1990-01-01',
            address: '123 Main St',
            city: 'Chennai',
            state: 'Tamil Nadu',
            country: 'India',
            postalCode: '600001',
            createdBy: 'user-1',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ],
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      },
      isLoading: false,
      isError: false,
      error: null,
    } as never);

    renderWithProviders(<Dashboard />);
    expect(screen.getByText('Vinoth')).toBeInTheDocument();
    expect(screen.getByText('Kumar')).toBeInTheDocument();
    expect(screen.getByText('vino@gmail.com')).toBeInTheDocument();
    expect(screen.getByText('Male')).toBeInTheDocument();
  });
});
