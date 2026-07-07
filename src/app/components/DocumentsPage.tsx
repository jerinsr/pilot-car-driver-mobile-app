import React from "react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  ChevronLeft,
  FileText,
  Plus,
  Download,
  Eye,
  Calendar,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

interface DocumentsPageProps {
  onBack: () => void;
}

export function DocumentsPage({ onBack }: DocumentsPageProps) {
  const documents = [
    {
      category: "Driver's License",
      items: [
        {
          name: "Commercial Driver's License",
          type: "CDL Class A",
          expiryDate: "Dec 31, 2025",
          status: "valid",
          uploadDate: "Jan 10, 2024",
        },
      ],
    },
    {
      category: "Insurance",
      items: [
        {
          name: "Vehicle Insurance",
          type: "Liability Coverage",
          expiryDate: "Aug 15, 2024",
          status: "expiring",
          uploadDate: "Aug 15, 2023",
        },
        {
          name: "General Liability Insurance",
          type: "Business Insurance",
          expiryDate: "Nov 30, 2025",
          status: "valid",
          uploadDate: "Dec 1, 2023",
        },
      ],
    },
    {
      category: "Permits & Licenses",
      items: [
        {
          name: "Pilot Car Operator License",
          type: "Texas PC License",
          expiryDate: "Jun 20, 2026",
          status: "valid",
          uploadDate: "Jun 20, 2024",
        },
        {
          name: "Oversize Load Permit",
          type: "State Permit",
          expiryDate: "Mar 15, 2025",
          status: "valid",
          uploadDate: "Mar 15, 2024",
        },
      ],
    },
    {
      category: "Vehicle Documents",
      items: [
        {
          name: "Vehicle Registration",
          type: "2023 Ford F-150",
          expiryDate: "May 10, 2025",
          status: "valid",
          uploadDate: "May 10, 2024",
        },
        {
          name: "Vehicle Inspection",
          type: "Annual Safety Inspection",
          expiryDate: "Sep 5, 2024",
          status: "expiring",
          uploadDate: "Sep 5, 2023",
        },
      ],
    },
  ];

  const getStatusBadge = (status: string) => {
    if (status === "valid") {
      return (
        <Badge className="bg-green-100 text-green-700 border-0 text-xs">
          <CheckCircle2 className="size-3 mr-1" />
          Valid
        </Badge>
      );
    } else if (status === "expiring") {
      return (
        <Badge className="bg-orange-100 text-[#f89823] border-0 text-xs">
          <AlertCircle className="size-3 mr-1" />
          Expiring Soon
        </Badge>
      );
    }
    return null;
  };

  const totalDocs = documents.reduce((acc, cat) => acc + cat.items.length, 0);
  const expiringDocs = documents
    .flatMap((cat) => cat.items)
    .filter((doc) => doc.status === "expiring").length;

  return (
    <div className="fixed inset-0 bg-gray-50 z-50 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 px-4 py-4 sticky top-0 z-10">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <ChevronLeft className="size-6 text-white" />
          </button>
          <h1 className="text-lg font-bold text-white">Documents</h1>
          <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
            <Plus className="size-6 text-white" />
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
            <p className="text-2xl font-bold text-white mb-0.5">{totalDocs}</p>
            <p className="text-xs text-gray-300">Total Documents</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
            <p className="text-2xl font-bold text-orange-300 mb-0.5">
              {expiringDocs}
            </p>
            <p className="text-xs text-gray-300">Expiring Soon</p>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto pb-24">
        <div className="p-4 space-y-4">
          {documents.map((category, catIndex) => (
            <div key={catIndex}>
              <div className="flex items-center gap-2 mb-3">
                <div className="bg-gray-200 rounded-lg p-2">
                  <FileText className="size-4 text-gray-600" />
                </div>
                <h3 className="font-semibold text-gray-900">{category.category}</h3>
                <Badge className="bg-gray-100 text-gray-600 border-0 text-xs">
                  {category.items.length}
                </Badge>
              </div>

              <div className="space-y-2 mb-4">
                {category.items.map((doc, docIndex) => (
                  <div
                    key={docIndex}
                    className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 text-sm mb-1">
                          {doc.name}
                        </h4>
                        <p className="text-xs text-gray-500">{doc.type}</p>
                      </div>
                      {getStatusBadge(doc.status)}
                    </div>

                    <div className="space-y-1.5 mb-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">Expires:</span>
                        <span className="font-medium text-gray-700">
                          {doc.expiryDate}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">Uploaded:</span>
                        <span className="font-medium text-gray-700">
                          {doc.uploadDate}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 h-8 text-xs"
                      >
                        <Eye className="size-3 mr-1.5" />
                        View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 h-8 text-xs"
                      >
                        <Download className="size-3 mr-1.5" />
                        Download
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Upload New Document Card */}
          <button className="w-full bg-white rounded-xl p-6 shadow-sm border border-gray-100 border-dashed hover:border-[#f89823] hover:bg-orange-50/50 transition-all">
            <div className="flex flex-col items-center gap-2">
              <div className="bg-orange-100 rounded-full p-3">
                <Plus className="size-6 text-[#f89823]" />
              </div>
              <p className="font-semibold text-gray-900">Upload New Document</p>
              <p className="text-xs text-gray-500">
                Add licenses, permits, or insurance documents
              </p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}