import type React from 'react';
import { useState, useEffect } from 'react';
import {
  Search,
  Plus,
  Trash2,
  FileText,
  ChevronLeft,
  ChevronRight,
  Edit2,
  ArrowUpDown,
} from 'lucide-react';
import { useEmployees } from '../hooks/useEmployees';
import { useAuth } from '../contexts/AuthContext';
import { EmployeeFormDialog } from '../components/employees/EmployeeFormDialog';
import { DeleteConfirmationDialog } from '../components/employees/DeleteConfirmationDialog';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Skeleton } from '../components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import type { Employee } from '../types';

export default function Dashboard() {
  const { user } = useAuth();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Dialog state
  const [isEmployeeFormOpen, setIsEmployeeFormOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(null);

  // Debounce search input (300ms as per enterprise requirements)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1); // Reset to page 1 on new search
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { data, isLoading, isError, error } = useEmployees({
    page,
    limit,
    search: debouncedSearch,
    sortBy,
    sortOrder,
  });

  const handleAddEmployee = () => {
    setSelectedEmployee(null);
    setIsEmployeeFormOpen(true);
  };

  const handleEditEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsEmployeeFormOpen(true);
  };

  const handleDeleteEmployee = (employee: Employee) => {
    setEmployeeToDelete(employee);
    setIsDeleteDialogOpen(true);
  };

  const toggleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
    setPage(1);
  };

  const SortableHeader = ({ field, label }: { field: string; label: string }) => (
    <TableHead
      className="font-medium text-slate-500 cursor-pointer hover:text-slate-800 transition-colors"
      onClick={() => toggleSort(field)}
    >
      <div className="flex items-center gap-1">
        {label}
        <ArrowUpDown
          className={`h-3 w-3 ${sortBy === field ? 'text-blue-600' : 'text-slate-300'}`}
        />
      </div>
    </TableHead>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Employee Hub</h1>
          <p className="text-sm text-slate-500 mt-1">Manage all employee registrations globally.</p>
        </div>
        <Button onClick={handleAddEmployee} className="rounded-lg shadow-sm h-10">
          <Plus className="mr-2 h-4 w-4" /> Add Registration
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search across all fields..."
            className="pl-9 h-10 rounded-lg border-slate-200 shadow-sm"
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <span>Rows per page:</span>
          <select
            className="h-9 w-20 rounded-md border border-slate-200 bg-white px-3 py-1 text-sm shadow-sm outline-none focus:ring-1 focus:ring-blue-500"
            value={limit}
            onChange={(e) => {
              setLimit(Number(e.target.value));
              setPage(1);
            }}
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        {isLoading ? (
          <div data-testid="loading-skeleton" className="p-4 space-y-4">
            <div className="flex gap-4 border-b border-slate-100 pb-4 px-2">
              <Skeleton className="h-4 w-[50px]" />
              <Skeleton className="h-4 w-[150px]" />
              <Skeleton className="h-4 w-[150px]" />
              <Skeleton className="h-4 w-[200px]" />
              <Skeleton className="h-4 w-[100px]" />
              <Skeleton className="h-4 w-[80px]" />
              <Skeleton className="h-4 w-[100px]" />
            </div>
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-4 px-2 py-3">
                <Skeleton className="h-5 w-[50px]" />
                <Skeleton className="h-5 w-[150px]" />
                <Skeleton className="h-5 w-[150px]" />
                <Skeleton className="h-5 w-[200px]" />
                <Skeleton className="h-5 w-[100px]" />
                <Skeleton className="h-5 w-[80px]" />
                <Skeleton className="h-8 w-16 ml-auto rounded-md" />
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center p-12 text-slate-600 bg-slate-50/50">
            <p className="font-medium text-slate-900">Failed to load employees</p>
            <p className="text-sm mt-1">
              {error instanceof Error ? error.message : 'Unknown error occurred.'}
            </p>
          </div>
        ) : data?.items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="bg-slate-50 p-4 rounded-full mb-4 border border-slate-100">
              <FileText className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-medium text-slate-900">No employees found</h3>
            <p className="text-sm text-slate-500 mt-1 max-w-sm">
              {debouncedSearch
                ? `No results matching "${debouncedSearch}". Try a different search term.`
                : 'No employees exist yet. Click the button above to add one.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
                  <TableHead className="font-medium text-slate-500 w-16">No.</TableHead>
                  <SortableHeader field="firstName" label="First Name" />
                  <SortableHeader field="lastName" label="Last Name" />
                  <SortableHeader field="email" label="Email" />
                  <TableHead className="font-medium text-slate-500">Contact</TableHead>
                  <SortableHeader field="department" label="Department" />
                  <SortableHeader field="createdAt" label="Created Date" />
                  <SortableHeader field="updatedAt" label="Updated Date" />
                  <TableHead className="text-right font-medium text-slate-500">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.items.map((employee: Employee, index: number) => {
                  const isOwner = employee.createdByUserId === user?.id;

                  return (
                    <TableRow
                      key={employee.id}
                      className="group hover:bg-slate-50 transition-colors"
                    >
                      <TableCell className="text-slate-500 text-sm">
                        {(page - 1) * limit + index + 1}
                      </TableCell>
                      <TableCell className="font-medium text-slate-900">
                        {employee.firstName}
                      </TableCell>
                      <TableCell className="font-medium text-slate-900">
                        {employee.lastName}
                      </TableCell>
                      <TableCell className="text-slate-500">{employee.email}</TableCell>
                      <TableCell className="text-slate-500">{employee.contact}</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700 border border-slate-200/60">
                          {employee.department}
                        </span>
                      </TableCell>
                      <TableCell className="text-slate-500 text-sm">
                        {new Date(employee.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-slate-500 text-sm">
                        {new Date(employee.updatedAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div
                          className="flex justify-end gap-2"
                          title={!isOwner ? 'You can only modify your own registrations.' : ''}
                        >
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg h-8 w-8 disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-slate-400"
                            onClick={() => handleEditEmployee(employee)}
                            disabled={!isOwner}
                          >
                            <Edit2 className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg h-8 w-8 disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-slate-400"
                            onClick={() => handleDeleteEmployee(employee)}
                            disabled={!isOwner}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Pagination Footer */}
        {data && data.total > 0 && (
          <div className="border-t border-slate-200 px-4 py-3 flex items-center justify-between sm:px-6 bg-white">
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-slate-500">
                  Showing{' '}
                  <span className="font-medium text-slate-900">{(page - 1) * limit + 1}</span> to{' '}
                  <span className="font-medium text-slate-900">
                    {Math.min(page * limit, data.total)}
                  </span>{' '}
                  of <span className="font-medium text-slate-900">{data.total}</span> results
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-lg shadow-sm h-8"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1 || isLoading}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>
                <div className="flex items-center px-2 text-sm text-slate-600 font-medium">
                  Page {page} of {data.totalPages}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-lg shadow-sm h-8"
                  onClick={() => setPage((p) => p + 1)}
                  disabled={page >= data.totalPages || isLoading}
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      <EmployeeFormDialog
        isOpen={isEmployeeFormOpen}
        onClose={() => setIsEmployeeFormOpen(false)}
        employee={selectedEmployee}
      />
      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        employee={employeeToDelete}
      />
    </div>
  );
}
