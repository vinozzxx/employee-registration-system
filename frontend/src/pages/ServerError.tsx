import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { AlertTriangle } from 'lucide-react';

export default function ServerError() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="bg-red-100 p-4 rounded-full mb-6">
        <AlertTriangle className="h-12 w-12 text-red-500" />
      </div>
      <h1 className="text-4xl font-semibold text-slate-900 tracking-tight mb-2">500</h1>
      <h2 className="text-xl font-medium text-slate-700 mb-2">Internal Server Error</h2>
      <p className="text-slate-500 mb-8 max-w-sm text-center">
        Something went wrong on our end. Please try again later.
      </p>
      <Button asChild className="rounded-lg h-10 px-8">
        <Link to="/">Back to Dashboard</Link>
      </Button>
    </div>
  );
}
