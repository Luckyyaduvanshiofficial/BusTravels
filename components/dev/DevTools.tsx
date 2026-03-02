'use client';

import { useState, useEffect } from 'react';
import { X, Wifi, WifiOff, Database, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

const isUsingMock = process.env.NEXT_PUBLIC_USE_MOCK === 'true';

export function DevTools() {
  const [isOpen, setIsOpen] = useState(false);
  const [backendStatus, setBackendStatus] = useState<'unknown' | 'online' | 'offline'>('unknown');

  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;
    
    checkBackend();
  }, []);

  const checkBackend = async () => {
    try {
      const res = await fetch('http://127.0.0.1:8000/api/v1/', { 
        method: 'HEAD',
        signal: AbortSignal.timeout(3000) 
      });
      setBackendStatus(res.ok ? 'online' : 'offline');
    } catch {
      setBackendStatus('offline');
    }
  };

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  const backendStatusIndicator = (() => {
    if (backendStatus === 'online') {
      return (
        <span className="flex items-center gap-1 text-xs text-green-600">
          <Wifi className="w-3 h-3" /> Online
        </span>
      );
    }

    if (backendStatus === 'offline') {
      return (
        <span className="flex items-center gap-1 text-xs text-red-500">
          <WifiOff className="w-3 h-3" /> Offline
        </span>
      );
    }

    return (
      <span className="text-xs text-neutral-400">Checking...</span>
    );
  })();

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-50 w-12 h-12 bg-neutral-800 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-neutral-700 transition-colors"
        aria-label="Developer tools"
      >
        <Database className="w-5 h-5" />
      </button>

      {isOpen && (
        <div className="fixed bottom-20 right-4 z-50 w-72 bg-white rounded-xl shadow-2xl border border-neutral-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-neutral-800">Dev Tools</h3>
            <button onClick={() => setIsOpen(false)}>
              <X className="w-4 h-4 text-neutral-500" />
            </button>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
              <span className="text-sm text-neutral-600">Data Mode</span>
              <span className={`px-2 py-1 rounded text-xs font-medium ${
                isUsingMock ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
              }`}>
                {isUsingMock ? 'Mock Data' : 'Real API'}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
              <span className="text-sm text-neutral-600">Backend</span>
              {backendStatusIndicator}
            </div>

            <Button 
              variant="outline" 
              size="sm" 
              className="w-full"
              onClick={checkBackend}
            >
              <RefreshCw className="w-3 h-3 mr-2" />
              Check Backend
            </Button>

            <p className="text-xs text-neutral-400 text-center">
              Set NEXT_PUBLIC_USE_MOCK=false in .env.local to use real API
            </p>
          </div>
        </div>
      )}
    </>
  );
}
