'use client';

import { useEffect } from 'react';
import { AlertTriangle, Home, RefreshCcw } from 'lucide-react';
import Link from 'next/link';

export default function ErrorBoundary({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error('Uncaught error:', error);
    }, [error]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-gray-100 p-8 text-center">
                <div className="flex justify-center mb-6">
                    <div className="p-3 bg-red-100 rounded-full">
                        <AlertTriangle className="w-12 h-12 text-red-600" />
                    </div>
                </div>

                <h1 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h1>
                <p className="text-gray-600 mb-8">
                    We've encountered an unexpected error. Don't worry, your monitors are still running in the background.
                </p>

                <div className="flex flex-col gap-3">
                    <button
                        onClick={() => reset()}
                        className="flex items-center justify-center gap-2 w-full bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                    >
                        <RefreshCcw className="w-4 h-4" />
                        Try again
                    </button>

                    <Link
                        href="/"
                        className="flex items-center justify-center gap-2 w-full bg-white text-gray-700 border border-gray-200 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                    >
                        <Home className="w-4 h-4" />
                        Go to Homepage
                    </Link>
                </div>

                {process.env.NODE_ENV === 'development' && (
                    <div className="mt-8 pt-6 border-t border-gray-100 text-left">
                        <p className="text-xs font-mono text-red-500 bg-red-50 p-3 rounded overflow-auto max-h-40">
                            {error.message}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
