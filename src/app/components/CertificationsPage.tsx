import React from "react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  ChevronLeft,
  Shield,
  Award,
  Calendar,
  CheckCircle2,
  Clock,
  Plus,
  FileText,
} from "lucide-react";

interface CertificationsPageProps {
  onBack: () => void;
}

export function CertificationsPage({ onBack }: CertificationsPageProps) {
  const certifications = [
    {
      name: "Oversize Load Certified",
      issuer: "Texas Department of Transportation",
      issueDate: "Jan 15, 2024",
      expiryDate: "Jan 15, 2027",
      status: "active",
      certificateNumber: "OSL-TX-45678",
    },
    {
      name: "DOT Compliant",
      issuer: "U.S. Department of Transportation",
      issueDate: "Mar 10, 2024",
      expiryDate: "Mar 10, 2025",
      status: "active",
      certificateNumber: "DOT-2024-8901",
    },
    {
      name: "First Aid Certified",
      issuer: "American Red Cross",
      issueDate: "Jun 5, 2023",
      expiryDate: "Jun 5, 2025",
      status: "active",
      certificateNumber: "ARC-FA-23456",
    },
    {
      name: "Defensive Driving",
      issuer: "National Safety Council",
      issueDate: "Sep 20, 2023",
      expiryDate: "Sep 20, 2024",
      status: "expiring",
      certificateNumber: "NSC-DD-67890",
    },
  ];

  const getStatusBadge = (status: string) => {
    if (status === "active") {
      return (
        <Badge className="bg-green-100 text-green-700 border-0">
          <CheckCircle2 className="size-3 mr-1" />
          Active
        </Badge>
      );
    } else if (status === "expiring") {
      return (
        <Badge className="bg-orange-100 text-[#f89823] border-0">
          <Clock className="size-3 mr-1" />
          Expiring Soon
        </Badge>
      );
    }
    return null;
  };

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
          <h1 className="text-lg font-bold text-white">Certifications</h1>
          <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
            <Plus className="size-6 text-white" />
          </button>
        </div>

        {/* Summary Card */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold text-white mb-0.5">
              {certifications.filter((c) => c.status === "active").length}
            </p>
            <p className="text-sm text-gray-300">Active Certifications</p>
          </div>
          <div className="bg-green-100 rounded-full p-3">
            <Shield className="size-6 text-green-600" />
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto pb-24">
        <div className="p-4 space-y-3">
          {certifications.map((cert, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {cert.name}
                  </h3>
                  <p className="text-sm text-gray-500">{cert.issuer}</p>
                </div>
                {getStatusBadge(cert.status)}
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2">
                  <Calendar className="size-4 text-gray-400" />
                  <p className="text-xs text-gray-600">
                    Issued: {cert.issueDate}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="size-4 text-gray-400" />
                  <p className="text-xs text-gray-600">
                    Expires: {cert.expiryDate}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="size-4 text-gray-400" />
                  <p className="text-xs text-gray-600">
                    Certificate #: {cert.certificateNumber}
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 h-9 text-xs"
                >
                  View Certificate
                </Button>
                {cert.status === "expiring" && (
                  <Button
                    size="sm"
                    className="flex-1 h-9 text-xs bg-[#f89823] text-white hover:bg-[#e08820]"
                  >
                    Renew
                  </Button>
                )}
              </div>
            </div>
          ))}

          {/* Add Certification Card */}
          <button className="w-full bg-white rounded-xl p-6 shadow-sm border border-gray-100 border-dashed hover:border-[#f89823] hover:bg-orange-50/50 transition-all">
            <div className="flex flex-col items-center gap-2">
              <div className="bg-orange-100 rounded-full p-3">
                <Plus className="size-6 text-[#f89823]" />
              </div>
              <p className="font-semibold text-gray-900">
                Add New Certification
              </p>
              <p className="text-xs text-gray-500">
                Upload your certification documents
              </p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}