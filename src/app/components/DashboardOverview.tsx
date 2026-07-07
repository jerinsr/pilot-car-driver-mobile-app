import Header from "./Header";
import {
  MapPin,
  DollarSign,
  Clock,
  Briefcase,
  TrendingUp,
  Navigation,
  PlayCircle,
  PauseCircle,
  Play,
  CheckCircle2,
  Filter,
} from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card } from "./ui/card";
import { Progress } from "./ui/progress";
import { useState } from "react";

interface DashboardOverviewProps {
  onNavigate?: (screen: string, data?: any) => void;
  onToggleSidebar?: () => void;
  hasActiveJob?: boolean;
}

export default function DashboardOverview({
  onNavigate,
  onToggleSidebar,
  hasActiveJob,
}: DashboardOverviewProps) {
  const [activeTab, setActiveTab] = useState<
    "all" | "active" | "upcoming" | "completed"
  >("all");

  // Mock active job data for pilot car driver
  const activeJob = {
    id: "PC-007",
    title: "Chase Pilot - Wide Load",
    status: "active" as const,
    route: {
      from: "Indianapolis, IN",
      to: "Columbus, OH",
      distance: "175 miles",
    },
    tracking: {
      currentLocation: "Richmond, IN",
      progress: 45,
      eta: "2h 15m",
    },
    payment: "$450.00",
    startTime: "06:00 AM",
    currentStatus: "En Route", // Can be: En Route, On Break, Waiting
    jobType: "Convoy",
    assignedDate: "Today",
  };

  // Mock upcoming assigned jobs (pilot car drivers only see their assigned jobs)
  const upcomingJobs = [
    {
      id: "PC-012",
      title: "Lead Pilot - Oversize Load",
      route: { from: "Cincinnati, OH", to: "Louisville, KY" },
      scheduledDate: "Tomorrow",
      scheduledTime: "07:00 AM",
      payment: "$380.00",
      jobType: "Convoy",
      status: "Assigned",
    },
    {
      id: "PC-015",
      title: "Chase Pilot - Wide Load",
      route: { from: "Dayton, OH", to: "Toledo, OH" },
      scheduledDate: "Jan 30",
      scheduledTime: "05:30 AM",
      payment: "$520.00",
      jobType: "Convoy",
      status: "Assigned",
    },
  ];

  // Stats for the week (only assigned jobs for pilot car driver)
  const weeklyStats = {
    jobsCompleted: 4,
    totalEarnings: 1850.0,
    hoursWorked: 32.5,
    activeJobs: 1,
    assignedJobs: 3, // Total assigned (active + upcoming)
  };

  return (
    <div className="flex flex-col bg-[#f6f6f6] h-full w-full overflow-y-auto">
      <Header
        title="Dashboard"
        showMenuButton={true}
        onMenuClick={onToggleSidebar}
        notificationCount={2}
        onNotificationClick={() =>
          onNavigate?.("notifications")
        }
        onProfileClick={() => onNavigate?.("profile")}
      />

      <div className="px-4 pb-24">
        {/* Overview Header */}
        <div className="pt-6 pb-4">
          <h2 className="text-base font-semibold text-gray-900">
            Overview
          </h2>
        </div>

        {/* Stats Cards */}
        <div className="pb-4">
          <div className="grid grid-cols-2 gap-3">
            {/* Active Jobs Card */}
            <div className="bg-white rounded-2xl p-4 border border-gray-100">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <Play className="w-4 h-4 text-blue-600" />
                </div>
              </div>
              <div className="mb-1">
                <div className="text-xs text-gray-500 mb-1">
                  Active Jobs
                </div>
                <div className="text-xl font-bold text-gray-900">
                  {weeklyStats.activeJobs}
                </div>
              </div>
              <div className="flex items-center gap-1 text-xs">
                <span className="text-green-600 font-medium">
                  ▲ {weeklyStats.activeJobs}
                </span>
                <span className="text-gray-500">
                  in progress
                </span>
              </div>
            </div>

            {/* Completed Jobs Card */}
            <div className="bg-white rounded-2xl p-4 border border-gray-100">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                </div>
              </div>
              <div className="mb-1">
                <div className="text-xs text-gray-500 mb-1">
                  Completed
                </div>
                <div className="text-xl font-bold text-gray-900">
                  {weeklyStats.jobsCompleted}
                </div>
              </div>
              <div className="flex items-center gap-1 text-xs">
                <span className="text-green-600 font-medium">
                  ▲{" "}
                  {Math.floor(weeklyStats.jobsCompleted * 0.75)}
                </span>
                <span className="text-gray-500">this week</span>
              </div>
            </div>
          </div>
        </div>

        {/* Job Activity Chart */}
        <div className="pb-4">
          <div className="bg-white rounded-2xl p-4 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-gray-900">
                Job Activity
              </h3>
              <button className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100 border border-gray-200">
                <Filter className="w-3 h-3" />
                Filter
              </button>
            </div>

            {/* Simple Activity Chart Visualization */}
            <div className="relative h-40 mb-2">
              {/* Y-axis labels */}
              <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-gray-400 pr-2">
                <div>{weeklyStats.jobsCompleted + 2}</div>
                <div>
                  {Math.floor(
                    (weeklyStats.jobsCompleted + 2) * 0.66,
                  )}
                </div>
                <div>
                  {Math.floor(
                    (weeklyStats.jobsCompleted + 2) * 0.33,
                  )}
                </div>
                <div>0</div>
              </div>

              {/* Chart area */}
              <div className="ml-8 h-full relative">
                {/* Grid lines */}
                <div className="absolute inset-0 flex flex-col justify-between">
                  <div className="border-t border-gray-100"></div>
                  <div className="border-t border-gray-100"></div>
                  <div className="border-t border-gray-100"></div>
                  <div className="border-t border-gray-100"></div>
                </div>

                {/* Line chart visualization */}
                <svg
                  className="w-full h-full"
                  viewBox="0 0 280 140"
                  preserveAspectRatio="none"
                >
                  {/* Light blue area under the line */}
                  <path
                    d="M 0 100 L 40 85 L 80 90 L 120 70 L 160 75 L 200 60 L 240 55 L 280 50 L 280 140 L 0 140 Z"
                    fill="#dbeafe"
                    opacity="0.3"
                  />
                  {/* Blue line */}
                  <path
                    d="M 0 100 L 40 85 L 80 90 L 120 70 L 160 75 L 200 60 L 240 55 L 280 50"
                    stroke="#3b82f6"
                    strokeWidth="2"
                    fill="none"
                  />
                  {/* Tooltip marker */}
                  <circle
                    cx="120"
                    cy="70"
                    r="4"
                    fill="#3b82f6"
                  />
                </svg>

                {/* Tooltip */}
                <div className="absolute top-8 left-1/3 bg-white border border-gray-200 rounded-lg px-2 py-1 shadow-sm">
                  <div className="text-xs font-semibold text-gray-900">
                    {weeklyStats.activeJobs}
                  </div>
                  <div className="text-xs text-gray-500">
                    Active Jobs
                  </div>
                  <div className="text-xs text-green-600">
                    ▲ 2.5%
                  </div>
                </div>

                {/* Vertical dotted line for tooltip */}
                <div className="absolute left-1/3 top-0 bottom-0 border-l border-dashed border-gray-300"></div>
              </div>
            </div>

            {/* X-axis labels */}
            <div className="ml-8 flex justify-between text-xs text-gray-400">
              <div>Jun</div>
              <div>Jul</div>
              <div>Aug</div>
              <div>Sep</div>
              <div>Oct</div>
              <div>Nov</div>
              <div>Dec</div>
            </div>
          </div>
        </div>

        {/* Active Job Card - Most Prominent */}
        {activeJob && (
          <Card className="overflow-hidden border-0 shadow-[0px_2px_8px_0px_rgba(0,0,0,0.08)] mb-4">
            {/* Header with status */}
            <div className="bg-white px-3 pt-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Badge className="bg-[#FFF3E0] text-[#C2410C] hover:bg-[#FFF3E0] text-xs px-2.5 py-1 border border-[#FFE0B2] font-medium shadow-none">
                      ● Active Now
                    </Badge>
                  </div>
                  <h3 className="text-gray-900 font-bold text-base mb-1">
                    {activeJob.title}
                  </h3>
                  <p className="text-gray-500 text-xs">
                    Job ID: {activeJob.id}
                  </p>
                </div>
                <div className="text-right ml-4">
                  <p className="text-gray-500 text-xs mb-1">
                    Payment
                  </p>
                  <p className="text-blue-600 font-bold text-2xl">
                    {activeJob.payment}
                  </p>
                </div>
              </div>

              {/* Route */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-xl p-3 space-y-2 border border-gray-200/50 mt-3">
                <div className="flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin className="h-3.5 w-3.5 text-green-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-500 text-xs font-medium mb-0.5">
                      Pickup Location
                    </p>
                    <p className="text-gray-900 font-semibold text-sm">
                      {activeJob.route.from}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="w-6 flex justify-center">
                    <div className="border-l-2 border-dashed border-gray-300 h-3"></div>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin className="h-3.5 w-3.5 text-red-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-500 text-xs font-medium mb-0.5">
                      Destination
                    </p>
                    <p className="text-gray-900 font-semibold text-sm">
                      {activeJob.route.to}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Progress & Current Status */}
            <div className="px-3 pb-3 space-y-3">
              {/* Current Location */}
              <div className="bg-blue-50/50 rounded-lg p-2.5 border border-blue-100">
                <div className="flex items-center gap-2 mb-1">
                  <Navigation className="h-4 w-4 text-[#155DFC]" />
                  <span className="text-gray-600 text-xs font-medium">
                    Current Location
                  </span>
                </div>
                <p className="text-gray-900 font-semibold text-sm ml-6">
                  {activeJob.tracking.currentLocation}
                </p>
              </div>

              {/* Progress Bar Section */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 text-xs font-semibold">
                    Job Progress
                  </span>
                  <div className="flex items-center gap-2.5">
                    <span className="text-gray-900 font-bold text-sm">
                      {activeJob.tracking.progress}%
                    </span>
                    <div className="flex items-center gap-1 bg-blue-50 px-2 py-1 rounded-md">
                      <Clock className="h-3 w-3 text-[#155DFC]" />
                      <span className="text-[#155DFC] font-semibold text-xs">
                        ETA {activeJob.tracking.eta}
                      </span>
                    </div>
                  </div>
                </div>
                <Progress
                  value={activeJob.tracking.progress}
                  className="h-2.5 bg-gray-200 [&>[data-slot='progress-indicator']]:bg-[#155DFC]"
                />
              </div>

              {/* Quick Actions */}
              <div className="flex gap-2.5">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 h-12 border-2 border-[#155DFC] text-[#155DFC] hover:bg-[#155DFC]/10 font-semibold"
                  onClick={() => onNavigate?.("my-jobs")}
                >
                  <PauseCircle className="h-4 w-4 mr-2" />
                  Add Break
                </Button>
                <Button
                  size="sm"
                  className="flex-1 h-12 bg-[#f89823] text-[#1a1a1a] hover:bg-[#e08820] active:scale-[0.98] transition-all duration-150 font-semibold shadow-[0_10px_15px_0px_rgba(0,0,0,0.1),0_4px_6px_0px_rgba(0,0,0,0.1)]"
                  onClick={() => {
                    onNavigate?.(hasActiveJob ? "active-job" : "my-jobs", {
                      openJobId: activeJob.id,
                    });
                  }}
                >
                  {hasActiveJob ? "Active Job" : "View Details"}
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Upcoming Jobs */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-semibold text-black">
              Upcoming Jobs
            </h3>
            <Button
              variant="ghost"
              size="sm"
              className="text-[#155DFC] hover:text-[#1e40af] hover:bg-transparent p-0 h-auto font-semibold text-sm"
              onClick={() => onNavigate?.("my-jobs")}
            >
              View All
            </Button>
          </div>

          <div className="space-y-3">
            {upcomingJobs.map((job) => (
              <Card
                key={job.id}
                className="p-4 border-0 shadow-[0px_2px_8px_0px_rgba(0,0,0,0.08)] cursor-pointer hover:shadow-[0px_4px_12px_0px_rgba(0,0,0,0.12)] transition-shadow"
                onClick={() => onNavigate?.("my-jobs")}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-semibold text-black text-sm mb-1">
                      {job.title}
                    </h4>
                    <p className="text-xs text-[#6b7280]">
                      Job ID: {job.id}
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className="bg-blue-50 text-[#155DFC] border-[#155DFC]/20 text-xs"
                  >
                    Assigned
                  </Badge>
                </div>

                <div className="flex items-center gap-2 text-xs text-[#6b7280] mb-2">
                  <MapPin className="h-3.5 w-3.5" />
                  <span>
                    {job.route.from} → {job.route.to}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1 text-[#6b7280]">
                    <Clock className="h-3.5 w-3.5" />
                    <span>
                      {job.scheduledDate} at {job.scheduledTime}
                    </span>
                  </div>
                  <span className="font-semibold text-[#10b981]">
                    {job.payment}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h3 className="text-base font-semibold text-black mb-3">
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 gap-3">
            <Button
              variant="outline"
              className="h-auto py-4 flex-col gap-2 border-[#e5e7eb] hover:border-[#155DFC] hover:bg-[#155DFC]/5"
              onClick={() => onNavigate?.("my-jobs")}
            >
              <PlayCircle className="h-6 w-6 text-[#155DFC]" />
              <span className="text-sm font-medium text-black">
                My Jobs
              </span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}