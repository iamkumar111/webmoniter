import { Loader2 } from "lucide-react";

export default function Loading() {
    return (
        <div className="h-screen w-screen flex items-center justify-center bg-gray-50 z-50 fixed inset-0">
            <div className="flex flex-col items-center gap-4">
                <div className="relative">
                    <div className="w-16 h-16 rounded-xl bg-indigo-100 flex items-center justify-center animate-pulse">
                        <div className="w-8 h-8 bg-indigo-600 rounded-lg"></div>
                    </div>
                    <Loader2 className="absolute -bottom-2 -right-2 w-8 h-8 text-indigo-600 animate-spin bg-white rounded-full p-1 shadow-md" />
                </div>
                <h2 className="text-xl font-semibold text-gray-800 animate-pulse">Loading WebMonitor...</h2>
            </div>
        </div>
    );
}
