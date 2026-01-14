"use client";

import { useTransition } from "react";
import { setSuperAdminOrg } from "@/lib/actions";
import { Building2, ChevronDown } from "lucide-react";

export default function OrgSelector({ organizations, currentOrgId }: { organizations: any[], currentOrgId: string | null }) {
  const [isPending, startTransition] = useTransition();

  const handleSelect = (orgId: string) => {
    startTransition(async () => {
      await setSuperAdminOrg(orgId === "ALL" ? null : orgId);
    });
  };

  return (
    <div className="relative group">
      <button className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors">
        <Building2 className="w-4 h-4 text-indigo-600" />
        <span className="truncate max-w-[150px]">
          {currentOrgId ? organizations.find(o => o.id === currentOrgId)?.name || "Unknown Org" : "All Organizations"}
        </span>
        <ChevronDown className="w-4 h-4 text-gray-400" />
      </button>
      
      <div className="absolute right-0 mt-1 w-56 bg-white border border-gray-200 rounded-md shadow-lg opacity-0 invisible group-hover:visible group-hover:opacity-100 transition-all z-50">
        <div className="py-1">
          <button
            onClick={() => handleSelect("ALL")}
            className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${!currentOrgId ? 'text-indigo-600 font-bold' : 'text-gray-700'}`}
          >
            All Organizations
          </button>
          <div className="border-t border-gray-100 my-1"></div>
          {organizations.map((org) => (
            <button
              key={org.id}
              onClick={() => handleSelect(org.id)}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${currentOrgId === org.id ? 'text-indigo-600 font-bold' : 'text-gray-700'}`}
            >
              {org.name}
            </button>
          ))}
        </div>
      </div>
      
      {isPending && (
        <div className="absolute inset-0 bg-white/50 flex items-center justify-center rounded-md">
          <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
}
