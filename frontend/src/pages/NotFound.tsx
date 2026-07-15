import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { FileQuestion } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="bg-slate-100 p-4 rounded-full mb-6">
        <FileQuestion className="h-12 w-12 text-slate-400" />
      </div>
      <h1 className="text-4xl font-semibold text-slate-900 tracking-tight mb-2">404</h1>
      <h2 className="text-xl font-medium text-slate-700 mb-2">Page Not Found</h2>
      <p className="text-slate-500 mb-8 max-w-sm text-center">
        The page you are looking for doesn&apos;t exist or has been moved.
      </p>
      <Button asChild className="rounded-lg h-10 px-8">
        <Link to="/">Back to Dashboard</Link>
      </Button>
    </div>
  );
}
