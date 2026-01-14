'use client';

import { useState } from 'react';
import { Activity, Loader2 } from 'lucide-react';
import { runManualCheck } from '@/lib/actions';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function CheckNowButton({ monitorId }: { monitorId: string }) {
    const [isPending, setIsPending] = useState(false);
    const router = useRouter();

    const handleCheck = async () => {
        setIsPending(true);
        try {
            await runManualCheck(monitorId);
            toast.success('Check completed successfully');
            router.refresh();
        } catch (error) {
            console.error(error);
            toast.error('Failed to run manual check');
        } finally {
            setIsPending(false);
        }
    };

    return (
        <button
            onClick={handleCheck}
            disabled={isPending}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 rounded-md text-sm font-bold text-white hover:bg-indigo-700 shadow-md shadow-indigo-100 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
        >
            {isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
                <Activity className="w-4 h-4" />
            )}
            {isPending ? 'Checking...' : 'Check Now'}
        </button>
    );
}
