import { Bus, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function BusNotFound() {
  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-full bg-neutral-100 flex items-center justify-center">
            <Bus className="w-10 h-10 text-neutral-400" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-neutral-800">Bus Not Found</h1>
          <p className="text-neutral-500">
            The bus you&apos;re looking for doesn&apos;t exist or has been removed.
          </p>
        </div>

        <Link
          href="/search"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-white font-medium rounded-lg transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Search
        </Link>
      </div>
    </div>
  );
}
