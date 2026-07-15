import type React from 'react';
import { Outlet } from 'react-router-dom';
import { LogOut, Users } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Avatar, AvatarFallback } from '../components/ui/avatar';

const MainLayout: React.FC = () => {
  const { user, logout } = useAuth();

  // Get initials for Avatar fallback
  const getInitials = (name?: string) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-[#FBFBFC] flex flex-col">
      {/* Top Navbar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo / Brand */}
            <div className="flex items-center gap-2 text-slate-900 font-semibold text-lg tracking-tight">
              <div className="bg-slate-900 text-white p-1.5 rounded-lg shadow-sm">
                <Users className="h-5 w-5" />
              </div>
              Employee<span className="text-slate-500 font-normal">Hub</span>
            </div>

            {/* User Nav */}
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-3">
                <div className="text-right">
                  <div className="text-sm font-medium text-slate-900 leading-none">
                    {user?.name}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">{user?.email}</div>
                </div>
                <Avatar className="h-9 w-9 border border-slate-200 shadow-sm">
                  <AvatarFallback className="bg-slate-100 text-slate-600 font-medium">
                    {getInitials(user?.name)}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="h-6 w-px bg-slate-200 hidden sm:block mx-1"></div>
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
              >
                <LogOut className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Sign out</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
