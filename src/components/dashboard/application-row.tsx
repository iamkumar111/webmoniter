"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { FileText, Mail, Phone, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

interface ApplicationRowProps {
    application: {
        id: string;
        jobTitle: string;
        firstName: string;
        lastName: string;
        email: string;
        phone: string | null;
        resumeUrl: string | null;
        coverLetter: string | null;
        status: string;
        createdAt: Date;
    };
}

export default function ApplicationRow({ application }: ApplicationRowProps) {
    const [expanded, setExpanded] = useState(false);

    const statusStyles: any = {
        NEW: "bg-blue-50 text-blue-700 border-blue-200",
        REVIEWING: "bg-yellow-50 text-yellow-700 border-yellow-200",
        REJECTED: "bg-red-50 text-red-700 border-red-200",
        HIRED: "bg-green-50 text-green-700 border-green-200",
    };

    return (
        <>
            <tr
                className={cn(
                    "hover:bg-gray-50 transition-colors cursor-pointer",
                    expanded && "bg-indigo-50/30"
                )}
                onClick={() => setExpanded(!expanded)}
            >
                <td className="px-6 py-4">
                    <div className="font-bold text-gray-900">{application.firstName} {application.lastName}</div>
                    <div className="text-xs text-gray-500 font-medium">{application.jobTitle}</div>
                </td>
                <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-gray-600">
                        <Mail className="w-4 h-4" />
                        {application.email}
                    </div>
                    {application.phone && (
                        <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                            <Phone className="w-3 h-3" />
                            {application.phone}
                        </div>
                    )}
                </td>
                <td className="px-6 py-4">
                    <Badge variant="outline" className={statusStyles[application.status]}>
                        {application.status}
                    </Badge>
                </td>
                <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
                    {format(new Date(application.createdAt), "MMM d, yyyy")}
                </td>
                <td className="px-6 py-4 text-right">
                    <button className="text-indigo-600 font-bold hover:underline">
                        {expanded ? "Hide" : "View Details"}
                    </button>
                </td>
            </tr>
            {expanded && (
                <tr>
                    <td colSpan={5} className="px-8 py-6 bg-gray-50/50">
                        <div className="space-y-6 animate-in slide-in-from-top-2 duration-300">
                            <div className="grid md:grid-cols-2 gap-8">
                                <div>
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Resume</h4>
                                    {application.resumeUrl ? (
                                        <a
                                            href={application.resumeUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 p-3 bg-white border border-gray-200 rounded-xl text-indigo-600 font-bold hover:border-indigo-600 hover:shadow-sm transition-all"
                                        >
                                            <FileText className="w-5 h-5" />
                                            View Attachment
                                            <ExternalLink className="w-4 h-4" />
                                        </a>
                                    ) : (
                                        <span className="text-gray-400 italic">No resume provided</span>
                                    )}
                                </div>
                            </div>
                            <div>
                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Cover Letter</h4>
                                <div className="p-6 bg-white border border-gray-200 rounded-2xl text-gray-700 leading-relaxed shadow-sm">
                                    {application.coverLetter || "No cover letter provided."}
                                </div>
                            </div>
                        </div>
                    </td>
                </tr>
            )}
        </>
    );
}
