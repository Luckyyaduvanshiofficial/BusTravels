'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Bus, ArrowLeft, AlertCircle } from 'lucide-react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function BusDetailError({ error, reset }: ErrorProps) {
  const router = useRouter();

  useEffect(() => {
    console.error('Bus detail page error:', error);
  }, [error]);

  const isNotFound = error.message?.includes('not found') || 
                     error.message?.includes('404');

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="flex justify-center">
          {isNotFound ? (
            <div className="w-20 h-20 rounded-full bg-neutral-100 flex items-center justify-center">
              <Bus className="w-10 h-10 text-neutral-400" />
            </div>
          ) : (
            <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center">
              <AlertCircle className="w-10 h-10 text-red-500" />
            </div>
          )}
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-neutral-800">
            {isNotFound ? 'Bus Not Found' : 'Something Went Wrong'}
          </h1>
          <p className="text-neutral-500">
            {isNotFound 
              ? 'The bus you\'re looking for doesn\'t exist or has been removed.'
              : 'We couldn\'t load the bus details. Please try again.'}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => router.push('/search')}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-white font-medium rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Search
          </button>
          
          {!isNotFound && (
            <button
              onClick={reset}
              className="px-6 py-3 border border-neutral-300 hover:bg-neutral-100 text-neutral-700 font-medium rounded-lg transition-colors"
            >
              Try Again
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
