"use client";

import { useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Dialog } from "@/components/ui/dialog";
import ApplicationForm from "./application-form";
import { MapPin, ArrowRight } from "lucide-react";

interface Job {
    title: string;
    team: string;
    location: string;
    type: string;
}

interface JobListingsProps {
    jobs: Job[];
}

export default function JobListings({ jobs }: JobListingsProps) {
    const [selectedJob, setSelectedJob] = useState<string | null>(null);

    return (
        <div className="space-y-4">
            {jobs.map((job, index) => (
                <div
                    key={index}
                    onClick={() => setSelectedJob(job.title)}
                    className="group p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-indigo-600 transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                    <div>
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors mb-2">{job.title}</h3>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-500 font-medium">
                            <div className="flex items-center gap-1.5">
                                <Badge variant="secondary" className="bg-gray-100 text-gray-900 border-none">{job.team}</Badge>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <MapPin className="w-4 h-4" />
                                {job.location}
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Badge variant="outline" className="text-gray-600 border-gray-200">{job.type}</Badge>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center text-indigo-600 font-bold group-hover:translate-x-1 transition-transform">
                        Apply Now
                        <ArrowRight className="ml-2 w-5 h-5" />
                    </div>
                </div>
            ))}

            <Dialog isOpen={!!selectedJob} onClose={() => setSelectedJob(null)}>
                {selectedJob && (
                    <ApplicationForm
                        jobTitle={selectedJob}
                        onClose={() => setSelectedJob(null)}
                    />
                )}
            </Dialog>
        </div>
    );
}
