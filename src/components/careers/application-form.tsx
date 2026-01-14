"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface ApplicationFormProps {
    jobTitle: string;
    onClose: () => void;
}

export default function ApplicationForm({ jobTitle, onClose }: ApplicationFormProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        resumeUrl: "",
        coverLetter: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch("/api/careers/apply", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...formData, jobTitle }),
            });

            if (!response.ok) throw new Error("Failed to submit application");

            toast.success("Application submitted successfully!");
            onClose();
        } catch (error) {
            toast.error("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6 py-4">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Apply for {jobTitle}</h2>
                <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-100">Engineering</Badge>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">First Name</label>
                        <Input
                            required
                            placeholder="Jane"
                            value={formData.firstName}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, firstName: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Last Name</label>
                        <Input
                            required
                            placeholder="Doe"
                            value={formData.lastName}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, lastName: e.target.value })}
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Email Address</label>
                    <Input
                        required
                        type="email"
                        placeholder="jane@example.com"
                        value={formData.email}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, email: e.target.value })}
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Phone Number (Optional)</label>
                    <Input
                        placeholder="+1 (555) 000-0000"
                        value={formData.phone}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, phone: e.target.value })}
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Resume URL (Drive, Dropbox, etc.)</label>
                    <Input
                        required
                        placeholder="https://link-to-your-resume.pdf"
                        value={formData.resumeUrl}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, resumeUrl: e.target.value })}
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Cover Letter</label>
                    <Textarea
                        placeholder="Tell us why you're a great fit for this role..."
                        rows={5}
                        value={formData.coverLetter}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, coverLetter: e.target.value })}
                    />
                </div>

                <div className="flex gap-4 pt-4">
                    <Button
                        type="button"
                        variant="outline"
                        className="flex-1"
                        onClick={onClose}
                        disabled={loading}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        className="flex-1 bg-indigo-600 hover:bg-indigo-700"
                        disabled={loading}
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Submit Application"}
                    </Button>
                </div>
            </form>
        </div>
    );
}
