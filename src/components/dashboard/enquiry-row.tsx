"use client";

import { useState, useTransition } from "react";
import { format } from "date-fns";
import { MessageSquare, MoreVertical, CheckCircle2, Clock, Loader2 } from "lucide-react";
import { updateEnquiryStatus } from "@/lib/actions";

export default function EnquiryRow({ enquiry }: { enquiry: any }) {
  const [isPending, startTransition] = useTransition();
  const [showDetails, setShowDetails] = useState(false);
  const [status, setStatus] = useState(enquiry.status);
  const [comment, setComment] = useState(enquiry.adminComment || "");

  const handleUpdate = () => {
    startTransition(async () => {
      await updateEnquiryStatus(enquiry.id, status, comment);
      setShowDetails(false);
    });
  };

  return (
    <>
      <tr className="hover:bg-gray-50 cursor-pointer" onClick={() => setShowDetails(!showDetails)}>
        <td className="px-6 py-4">
          <div className="font-medium text-gray-900">{enquiry.firstName} {enquiry.lastName}</div>
          <div className="text-xs text-gray-500">{enquiry.email}</div>
        </td>
        <td className="px-6 py-4 max-w-xs truncate">
          {enquiry.message}
        </td>
        <td className="px-6 py-4">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            status === 'RESOLVED' ? 'bg-green-100 text-green-800' : 
            status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
          }`}>
            {status}
          </span>
        </td>
        <td className="px-6 py-4 text-gray-500 text-xs">
          {format(new Date(enquiry.createdAt), "MMM d, yyyy")}
        </td>
        <td className="px-6 py-4 text-right">
          <button className="text-gray-400 hover:text-indigo-600">
            <MoreVertical className="w-4 h-4" />
          </button>
        </td>
      </tr>
      {showDetails && (
        <tr>
          <td colSpan={5} className="px-6 py-6 bg-gray-50 border-b border-gray-200">
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-bold text-gray-500 uppercase mb-1">Message</h4>
                <p className="text-sm text-gray-800 whitespace-pre-wrap">{enquiry.message}</p>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Status</label>
                  <select 
                    value={status} 
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full h-10 px-3 rounded-md border border-gray-300 text-sm"
                  >
                    <option value="NEW">NEW</option>
                    <option value="IN_PROGRESS">IN_PROGRESS</option>
                    <option value="RESOLVED">RESOLVED</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Admin Comment</label>
                  <textarea 
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full p-3 rounded-md border border-gray-300 text-sm"
                    rows={2}
                    placeholder="Add a comment..."
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <button 
                  onClick={() => setShowDetails(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button 
                  disabled={isPending}
                  onClick={handleUpdate}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 flex items-center gap-2"
                >
                  {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                  Save Changes
                </button>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
