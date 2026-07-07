import React from "react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  ChevronLeft,
  ChevronRight,
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Shield,
  Bell,
  Lock,
  HelpCircle,
  FileText,
  LogOut,
  Star,
  DollarSign,
  Award,
  Clock,
} from "lucide-react";

interface ProfileScreenProps {
  onClose?: () => void;
  onLogout: () => void;
  onNavigate: (page: string) => void;
}

export function ProfileScreen({
  onClose,
  onLogout,
  onNavigate,
}: ProfileScreenProps) {
  // Mock user data - in real app, this would come from state/API
  const userData = {
    name: "Michael Thompson",
    email: "michael.thompson@pilotcar.com",
    phone: "+1 (555) 123-4567",
    role: "Pilot Car Driver",
    company: "SafeRoute Escort Services",
    location: "Austin, TX",
    joinDate: "January 2024",
    licenseNumber: "PC-TX-45678",
    rating: 4.8,
    completedJobs: 127,
    totalEarnings: "$45,230",
    hoursWorked: 1248,
    certifications: ["Oversize Load Certified", "DOT Compliant", "First Aid"],
  };

  const stats = [
    {
      icon: Star,
      label: "Rating",
      value: userData.rating.toFixed(1),
      color: "text-[#f89823]",
      bgColor: "bg-orange-50",
    },
    {
      icon: Briefcase,
      label: "Completed Jobs",
      value: userData.completedJobs.toString(),
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      icon: DollarSign,
      label: "Total Earnings",
      value: userData.totalEarnings,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      icon: Clock,
      label: "Hours Worked",
      value: `${userData.hoursWorked}h`,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
  ];

  const settingsSections = [
    {
      title: "Account",
      items: [
        {
          icon: User,
          label: "Personal Information",
          action: "personal-info",
          description: "Update your profile details",
        },
        {
          icon: Lock,
          label: "Security & Privacy",
          action: "security",
          description: "Password, 2FA, and privacy settings",
        },
        {
          icon: Bell,
          label: "Notifications",
          action: "notifications",
          description: "Manage notification preferences",
        },
      ],
    },
    {
      title: "Professional",
      items: [
        {
          icon: Award,
          label: "Certifications",
          action: "certifications",
          description: "View and manage your certifications",
        },
        {
          icon: FileText,
          label: "Documents",
          action: "documents",
          description: "License, insurance, and permits",
        },
        {
          icon: Briefcase,
          label: "Performance",
          action: "performance",
          description: "View your performance metrics",
        },
      ],
    },
    {
      title: "Support",
      items: [
        {
          icon: HelpCircle,
          label: "Help Center",
          action: "help",
          description: "FAQs and tutorials",
        },
        {
          icon: Mail,
          label: "Contact Support",
          action: "support",
          description: "Get help from our team",
        },
        {
          icon: FileText,
          label: "Terms & Privacy",
          action: "legal",
          description: "Legal information and policies",
        },
      ],
    },
  ];

  const handleLogoutClick = () => {
    if (
      window.confirm(
        "Are you sure you want to logout? Any unsaved changes will be lost.",
      )
    ) {
      onLogout();
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-50 z-50 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 px-4 py-4 sticky top-0 z-10">
        <div className="flex items-center justify-between mb-4">
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <ChevronLeft className="size-6 text-white" />
            </button>
          )}
          <h1 className="text-lg font-bold text-white">Profile</h1>
          <div className="w-10" />
        </div>

        {/* Profile Info Card */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
          <div className="flex items-start gap-4">
            {/* Avatar */}
            <div className="size-16 rounded-full bg-gradient-to-br from-[#f89823] to-orange-600 flex items-center justify-center text-white font-bold text-2xl flex-shrink-0 ring-4 ring-white/20">
              {userData.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-bold text-white mb-0.5">
                {userData.name}
              </h2>
              <p className="text-sm text-gray-300 mb-2">{userData.role}</p>
              <div className="flex items-center gap-1.5">
                <div className="flex items-center gap-0.5">
                  <Star className="size-4 text-[#f89823] fill-[#f89823]" />
                  <span className="text-sm font-semibold text-white">
                    {userData.rating.toFixed(1)}
                  </span>
                </div>
                <span className="text-sm text-gray-400">•</span>
                <span className="text-sm text-gray-300">
                  {userData.completedJobs} jobs
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto pb-24">
        <div className="p-4 space-y-4">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm"
                >
                  <div className={`${stat.bgColor} rounded-lg p-2 w-fit mb-2`}>
                    <Icon className={`size-5 ${stat.color}`} />
                  </div>
                  <p className="text-2xl font-bold text-gray-900 mb-0.5">
                    {stat.value}
                  </p>
                  <p className="text-xs text-gray-500">{stat.label}</p>
                </div>
              );
            })}
          </div>

          {/* Quick Info */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
              Contact Information
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="bg-gray-100 rounded-lg p-2">
                  <Mail className="size-4 text-gray-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {userData.email}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-gray-100 rounded-lg p-2">
                  <Phone className="size-4 text-gray-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500">Phone</p>
                  <p className="text-sm font-medium text-gray-900">
                    {userData.phone}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-gray-100 rounded-lg p-2">
                  <MapPin className="size-4 text-gray-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500">Location</p>
                  <p className="text-sm font-medium text-gray-900">
                    {userData.location}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-gray-100 rounded-lg p-2">
                  <Briefcase className="size-4 text-gray-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500">Company</p>
                  <p className="text-sm font-medium text-gray-900">
                    {userData.company}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Certifications */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                Certifications
              </h3>
              <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-0">
                {userData.certifications.length} Active
              </Badge>
            </div>
            <div className="flex flex-wrap gap-2">
              {userData.certifications.map((cert, index) => (
                <div
                  key={index}
                  className="bg-green-50 border border-green-200 rounded-lg px-3 py-1.5 flex items-center gap-2"
                >
                  <Shield className="size-3.5 text-green-600" />
                  <span className="text-xs font-medium text-green-700">
                    {cert}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Settings Sections */}
          {settingsSections.map((section, sectionIndex) => (
            <div
              key={sectionIndex}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
            >
              <div className="px-4 pt-4 pb-2">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  {section.title}
                </h3>
              </div>
              <div className="divide-y divide-gray-100">
                {section.items.map((item, itemIndex) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={itemIndex}
                      onClick={() => onNavigate(item.action)}
                      className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors"
                    >
                      <div className="bg-gray-100 rounded-lg p-2">
                        <Icon className="size-4 text-gray-600" />
                      </div>
                      <div className="flex-1 text-left min-w-0">
                        <p className="text-sm font-medium text-gray-900">
                          {item.label}
                        </p>
                        <p className="text-xs text-gray-500">
                          {item.description}
                        </p>
                      </div>
                      <ChevronRight className="size-5 text-gray-400 flex-shrink-0" />
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Account Info */}
          <div className="bg-gray-100 rounded-xl p-4 border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-gray-500">License Number</p>
              <p className="text-xs font-medium text-gray-700">
                {userData.licenseNumber}
              </p>
            </div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-gray-500">Member Since</p>
              <p className="text-xs font-medium text-gray-700">
                {userData.joinDate}
              </p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-500">App Version</p>
              <p className="text-xs font-medium text-gray-700">2.4.1</p>
            </div>
          </div>

          {/* Logout Button */}
          <Button
            onClick={handleLogoutClick}
            variant="outline"
            className="w-full h-12 border-2 border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400 font-semibold"
          >
            <LogOut className="size-5 mr-2" />
            Logout
          </Button>

          {/* Bottom spacing for fixed elements */}
          <div className="h-8" />
        </div>
      </div>
    </div>
  );
}