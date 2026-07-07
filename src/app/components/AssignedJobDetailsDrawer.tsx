import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs";
import {
  ChevronLeft,
  Navigation,
  MapPin,
  Calendar,
  Truck,
  Shield,
  FileText,
  AlertCircle,
  Clock,
  CheckCircle2,
  PlayCircle,
  Timer,
  Coffee,
  CircleStop,
  Zap,
  AlertTriangle,
  DollarSign,
  CheckCircle,
  Receipt,
  Eye,
  FileCheck,
  Flag,
  Star,
} from "lucide-react";
import { AssignedJob } from "./AssignedJobCard";
import {
  getStatusDisplay,
  calculateElapsedTime,
} from "./PilotJobStateMachine";
import {
  SubmitInvoiceModal,
  InvoiceSubmissionData,
} from "./SubmitInvoiceModal";
import type { PilotCarJob } from "./PilotCarJobDetail";
import { RatingPrompt } from "./RatingPrompt";
import { RatePilotCarDrawer, SubmittedRating } from "./RatePilotCarDrawer";

interface AssignedJobDetailsDrawerProps {
  job: AssignedJob | null;
  onClose: () => void;
  onStartSurvey?: (job: AssignedJob) => void;
  onContinueSurvey?: (job: AssignedJob) => void;
  onViewSurvey?: (job: AssignedJob) => void;
  onAddBreak?: (job: AssignedJob) => void;
  onAddWaitingTime?: (job: AssignedJob) => void;
  onEndJob?: (job: AssignedJob) => void;
  onViewInvoice?: (job: AssignedJob) => void;
  onAcceptJob?: (job: AssignedJob) => void;
  onStartJob?: (job: AssignedJob) => void;
  onSimulateJurisdictionActivation?: (job: AssignedJob) => void;
  onRatePilotCar?: (job: AssignedJob, rating: SubmittedRating) => void;
}

export function AssignedJobDetailsDrawer({
  job,
  onClose,
  onStartSurvey,
  onContinueSurvey,
  onViewSurvey,
  onAddBreak,
  onAddWaitingTime,
  onEndJob,
  onViewInvoice,
  onAcceptJob,
  onStartJob,
  onSimulateJurisdictionActivation,
  onRatePilotCar,
}: AssignedJobDetailsDrawerProps) {
  const [elapsedTime, setElapsedTime] =
    useState<string>("00:00:00");
  const [isRequestPaymentOpen, setIsRequestPaymentOpen] =
    useState(false);
  const [activeTab, setActiveTab] = useState<string>("details");
  const [showRatingScreen, setShowRatingScreen] = useState(false);

  // Update elapsed time for in-progress jobs
  useEffect(() => {
    if (
      job?.status === "in-progress" &&
      job?.timeTracking?.startedAt
    ) {
      const interval = setInterval(() => {
        setElapsedTime(
          calculateElapsedTime(job.timeTracking!.startedAt!),
        );
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [job?.status, job?.timeTracking?.startedAt]);

  if (!job) return null;

  const statusDisplay = getStatusDisplay(job.status);

  const handleRatingSubmit = (rating: SubmittedRating) => {
    const ratingData = {
      overall: rating.overallRating,
      categories: {
        safety: rating.categories.find(c => c.id === 'safety')?.value || 0,
        driving: rating.categories.find(c => c.id === 'driving')?.value || 0,
        communication: rating.categories.find(c => c.id === 'communication')?.value || 0,
        professionalism: rating.categories.find(c => c.id === 'professionalism')?.value || 0,
        vehicle: rating.categories.find(c => c.id === 'vehicle')?.value || 0,
        asset: rating.categories.find(c => c.id === 'assetHealth')?.value || 0,
      },
      comments: rating.comments,
      ratedAt: rating.timestamp,
    };
    
    // Call the callback if provided
    if (onRatePilotCar) {
      onRatePilotCar(job, rating);
    }
    
    alert(
      `✅ Rating Submitted Successfully!\n\n` +
        `Overall Rating: ${rating.overallRating.toFixed(1)} stars\n` +
        `Pilot Car: ${job.driverName || "Pilot Car"}\n` +
        `Job: JOB-${job.id}\n\n` +
        `Thank you for your feedback!`,
    );
    
    setShowRatingScreen(false);
  };

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto bg-gray-50">
        {/* Header - Where am I going? */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 px-4 py-4 sticky top-0 z-10">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <ChevronLeft className="size-6 text-white" />
            </button>
            <h1 className="text-lg font-bold text-white">{`JOB-${job.id}`}</h1>
            <div className="w-10" />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white/10 rounded-full size-12 flex items-center justify-center">
                <Navigation className="size-6 text-white" />
              </div>
              <div>
                <p className="font-bold text-white text-base">
                  {job.position} Pilot
                </p>
                <p className="text-gray-300 text-sm">
                  {statusDisplay.label} •{" "}
                  {job.jobType || "Standard"}
                </p>
              </div>
            </div>
            {/* CTA in header for quick access */}
            {job.routeSurveyRequired &&
              job.routeSurveyStatus !== "completed" &&
              onStartSurvey && (
                <Button
                  size="sm"
                  onClick={() => onStartSurvey(job)}
                  className="bg-[#f89823] hover:bg-[#e08820] text-[#1a1a1a] font-medium"
                >
                  Start
                </Button>
              )}
          </div>
        </div>

        <div className="p-4 space-y-4 pb-32">
          {/* STATE-SPECIFIC ALERTS */}

          {/* Upcoming State Alert */}
          {job.status === "upcoming" && job.jurisdiction && (
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 shadow-sm">
              <div className="flex items-start gap-3">
                <Clock className="size-5 text-gray-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 text-sm mb-1">
                    Waiting for Jurisdiction Activation
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed mb-3">
                    Jurisdiction{" "}
                    <strong>{job.jurisdiction.code}</strong> has
                    not been activated yet. You'll receive a
                    notification when the truck driver activates
                    this jurisdiction and you can begin the
                    escort.
                  </p>
                  {/* Demo/Test Button */}
                  {onSimulateJurisdictionActivation && (
                    <Button
                      onClick={() =>
                        onSimulateJurisdictionActivation(job)
                      }
                      variant="outline"
                      size="sm"
                      className="border-blue-300 text-blue-700 hover:bg-blue-50"
                    >
                      <Zap className="size-4 mr-2" />
                      Simulate Activation (Demo)
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Awaiting Acceptance Alert */}
          {job.status === "awaiting-acceptance" &&
            job.jurisdiction && (
              <div className="bg-blue-50 border-2 border-blue-300 rounded-xl p-4 shadow-sm">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="size-5 text-blue-600 flex-shrink-0 mt-0.5 animate-pulse" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-blue-900 text-sm mb-1">
                      Jurisdiction Activated!
                    </h3>
                    <p className="text-sm text-blue-800 leading-relaxed mb-1">
                      <strong>{job.jurisdiction.code}</strong>{" "}
                      is now active. The truck driver{" "}
                      <strong>
                        {job.jurisdiction.activatedBy}
                      </strong>{" "}
                      has activated this jurisdiction.
                    </p>
                    <p className="text-xs text-blue-700 mb-3">
                      Activated at{" "}
                      {job.jurisdiction.activatedAt
                        ? new Date(
                            job.jurisdiction.activatedAt,
                          ).toLocaleString()
                        : "Unknown"}
                    </p>
                    {onAcceptJob && (
                      <Button
                        onClick={() => onAcceptJob(job)}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 shadow-md"
                      >
                        <CheckCircle className="size-5 mr-2" />
                        Accept Job
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            )}

          {/* Accepted State Alert */}
          {job.status === "accepted" && (
            <div className="bg-purple-50 border-2 border-purple-300 rounded-xl p-4 shadow-sm">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="size-5 text-purple-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-semibold text-purple-900 text-sm mb-1">
                    Job Accepted - Ready to Start
                  </h3>
                  <p className="text-sm text-purple-800 leading-relaxed mb-1">
                    You've accepted this job. When you're ready
                    to begin the escort, click "Start Job" to
                    begin billing.
                  </p>
                  <p className="text-xs text-purple-700 mb-3">
                    Accepted at{" "}
                    {job.timeTracking?.acceptedAt
                      ? new Date(
                          job.timeTracking.acceptedAt,
                        ).toLocaleString()
                      : "Unknown"}
                  </p>
                  {onStartJob && (
                    <Button
                      onClick={() => onStartJob(job)}
                      className="w-full bg-[#f89823] hover:bg-[#e08820] text-[#1a1a1a] h-12 shadow-md font-semibold"
                    >
                      <PlayCircle className="size-5 mr-2" />
                      Start Job (Begin Billing)
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* In Progress State - Billing Timer */}
          {job.status === "in-progress" &&
            job.billingActive && (
              <div className="bg-gradient-to-r from-orange-50 to-amber-50 border-2 border-orange-300 rounded-xl p-4 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    <div className="bg-orange-500 rounded-full p-2 animate-pulse">
                      <Timer className="size-5 text-white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-orange-900 text-sm">
                        Billing Active
                      </h3>
                      <Badge className="bg-orange-600 text-white border-0">
                        LIVE
                      </Badge>
                    </div>
                    <p className="text-sm text-orange-800 leading-relaxed mb-3">
                      Timer started at{" "}
                      {job.timeTracking?.startedAt
                        ? new Date(
                            job.timeTracking.startedAt,
                          ).toLocaleString("en-US", {
                            hour: "numeric",
                            minute: "2-digit",
                          })
                        : "Unknown"}
                    </p>
                    <div className="bg-white rounded-lg p-4 border border-orange-200">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-orange-700 uppercase tracking-wide">
                          Elapsed Time
                        </span>
                        <div className="text-3xl font-mono font-bold text-orange-700">
                          {elapsedTime}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

          {/* Completed State Alert */}
          {job.status === "completed" && (
            <div className="bg-green-50 border border-green-300 rounded-xl p-4 shadow-sm">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="size-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-semibold text-green-900 text-sm mb-1">
                    Job Completed
                  </h3>
                  <p className="text-sm text-green-800 leading-relaxed mb-2">
                    This job has been completed. Time tracking
                    has been locked.
                  </p>
                  {job.timeTracking?.endTime && (
                    <p className="text-xs text-green-700">
                      Completed at{" "}
                      {new Date(
                        job.timeTracking.endTime,
                      ).toLocaleString()}
                    </p>
                  )}
                  {onViewInvoice &&
                    job.invoice &&
                    job.invoice.status !== "pending" && (
                      <Button
                        onClick={() => onViewInvoice(job)}
                        variant="outline"
                        className="w-full mt-3 border-green-400 text-green-700 hover:bg-green-50"
                      >
                        <FileText className="size-4 mr-2" />
                        View Invoice
                      </Button>
                    )}
                </div>
              </div>
            </div>
          )}

          {/* Tabs for Job Details */}
          <Tabs
            defaultValue={activeTab}
            onValueChange={setActiveTab}
          >
            <TabsList
              className="bg-gray-100 border border-gray-200 rounded-lg p-1 grid w-full"
              style={{
                gridTemplateColumns:
                  job.status === "completed"
                    ? "repeat(3, 1fr)"
                    : "1fr",
              }}
            >
              <TabsTrigger
                value="details"
                className="data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                Details
              </TabsTrigger>
              {job.status === "completed" && (
                <>
                  <TabsTrigger
                    value="payment"
                    className="data-[state=active]:bg-white data-[state=active]:shadow-sm"
                  >
                    Payment
                  </TabsTrigger>
                  <TabsTrigger
                    value="rating"
                    className="data-[state=active]:bg-white data-[state=active]:shadow-sm"
                  >
                    Rating
                  </TabsTrigger>
                </>
              )}
            </TabsList>

            {/* Job Details Tab */}
            <TabsContent value="details" className="space-y-4">
              {/* 1. Job Summary */}
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
                  Job Summary
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-0.5">
                      Job Status
                    </p>
                    <Badge
                      className={`${statusDisplay.bgColor} ${statusDisplay.color} ${statusDisplay.borderColor} border-2 rounded-md px-2 py-0.5`}
                    >
                      {statusDisplay.label}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-0.5">
                      Assigned Pay
                    </p>
                    <p className="font-bold text-gray-900 flex items-center">
                      {job.assignedPay}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-0.5">
                      Service Type
                    </p>
                    <p className="font-medium text-gray-900">
                      {job.jobType || "Convoy"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-0.5">
                      Company
                    </p>
                    <p className="font-medium text-gray-900 truncate">
                      {job.requestingCompany}
                    </p>
                  </div>
                </div>
              </div>

              {/* 2. Route Information */}
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
                  Route Information
                </h3>

                {/* Route Preview Map */}
                <div className="bg-gradient-to-br from-gray-100 via-gray-50 to-gray-100 rounded-lg h-32 w-full mb-4 relative overflow-hidden border border-gray-200">
                  <svg
                    className="w-full h-full"
                    viewBox="0 0 400 130"
                    preserveAspectRatio="xMidYMid meet"
                  >
                    {/* Grid background */}
                    <defs>
                      <pattern
                        id="route-grid"
                        width="20"
                        height="20"
                        patternUnits="userSpaceOnUse"
                      >
                        <path
                          d="M 20 0 L 0 0 0 20"
                          fill="none"
                          stroke="#e5e7eb"
                          strokeWidth="0.5"
                        />
                      </pattern>
                    </defs>
                    <rect
                      width="400"
                      height="130"
                      fill="url(#route-grid)"
                    />
                    {/* Route line */}
                    <path
                      d="M 50 65 Q 120 30 200 55 Q 280 80 350 45"
                      stroke="#3b82f6"
                      strokeWidth="3"
                      strokeLinecap="round"
                      fill="none"
                      strokeDasharray="6 4"
                    />
                    {/* Origin marker */}
                    <circle
                      cx="50"
                      cy="65"
                      r="6"
                      fill="#22C55E"
                      stroke="white"
                      strokeWidth="2"
                    />
                    {/* Destination marker */}
                    <circle
                      cx="350"
                      cy="45"
                      r="6"
                      fill="#EF4444"
                      stroke="white"
                      strokeWidth="2"
                    />
                  </svg>
                  <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
                    <span className="text-[10px] text-gray-500 bg-white/80 px-1.5 py-0.5 rounded">
                      {job.origin}
                    </span>
                    <span className="text-[10px] text-gray-500 bg-white/80 px-1.5 py-0.5 rounded">
                      {job.destination}
                    </span>
                  </div>
                </div>

                <div className="relative pl-4 border-l-2 border-gray-100 space-y-6">
                  <div className="relative">
                    <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-blue-600 border-2 border-white ring-1 ring-gray-100"></div>
                    <div>
                      <p className="text-xs text-gray-500 mb-0.5">
                        Origin
                      </p>
                      <p className="font-semibold text-gray-900">
                        {job.origin}
                      </p>
                      <p className="text-xs text-gray-500 mt-1 flex items-center">
                        <Calendar className="size-3 mr-1" />
                        {new Date(
                          job.departureDate,
                        ).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          hour: "numeric",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="relative">
                    <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-orange-500 border-2 border-white ring-1 ring-gray-100"></div>
                    <div>
                      <p className="text-xs text-gray-500 mb-0.5">
                        Destination
                      </p>
                      <p className="font-semibold text-gray-900">
                        {job.destination}
                      </p>
                      <p className="text-xs text-gray-500 mt-1 flex items-center">
                        <Calendar className="size-3 mr-1" />
                        {job.returnDate
                          ? new Date(
                              job.returnDate,
                            ).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })
                          : "TBD"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-50 flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    Total Distance
                  </span>
                  <span className="font-semibold text-gray-900">
                    {job.distance}
                  </span>
                </div>
              </div>

              {/* 3. Load Details - What am I escorting? */}
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    Load Details
                  </h3>
                  <Truck className="size-4 text-gray-400" />
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-gray-50">
                    <span className="text-sm text-gray-600">
                      Commodity
                    </span>
                    <span className="font-medium text-gray-900">
                      {job.commodityType || job.loadType}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-xs text-gray-500 mb-1">
                        Dimensions
                      </p>
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-400">
                            L
                          </span>
                          <span className="font-mono font-medium text-gray-700">
                            {job.loadLength || "--"}
                          </span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-400">
                            W
                          </span>
                          <span className="font-mono font-medium text-gray-700">
                            {job.loadWidth || "--"}
                          </span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-400">
                            H
                          </span>
                          <span className="font-mono font-medium text-gray-700">
                            {job.loadHeight || "--"}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg flex flex-col justify-center">
                      <p className="text-xs text-gray-500 mb-1">
                        Total Weight
                      </p>
                      <p className="font-mono font-semibold text-gray-900 text-lg">
                        {job.loadWeight || "--"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 4. Compliance & Requirements - What do I need to do? */}
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    Requirements
                  </h3>
                  <Shield className="size-4 text-gray-400" />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 rounded-lg bg-gray-50">
                    <div className="flex items-center gap-2">
                      <FileText className="size-4 text-gray-500" />
                      <span className="text-sm font-medium text-gray-700">
                        Route Survey
                      </span>
                    </div>
                    {job.routeSurveyRequired ? (
                      <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100 border-0">
                        Required
                      </Badge>
                    ) : (
                      <span className="text-xs text-gray-400 font-medium">
                        Not Required
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-lg bg-gray-50">
                    <div className="flex items-center gap-2">
                      <Shield className="size-4 text-gray-500" />
                      <span className="text-sm font-medium text-gray-700">
                        Police Escort
                      </span>
                    </div>
                    {job.policeEscortRequired ? (
                      <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-0">
                        Required
                      </Badge>
                    ) : (
                      <span className="text-xs text-gray-400 font-medium">
                        No
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-lg bg-gray-50">
                    <div className="flex items-center gap-2">
                      <Flag className="size-4 text-gray-500" />
                      <span className="text-sm font-medium text-gray-700">
                        Height Pole
                      </span>
                    </div>
                    {job.heightPoleRequired ? (
                      <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-0">
                        Required
                      </Badge>
                    ) : (
                      <span className="text-xs text-gray-400 font-medium">
                        No
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-lg bg-gray-50">
                    <div className="flex items-center gap-2">
                      <FileCheck className="size-4 text-gray-500" />
                      <span className="text-sm font-medium text-gray-700">
                        Special Permits
                      </span>
                    </div>
                    {job.specialPermitsRequired ? (
                      <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100 border-0">
                        On File
                      </Badge>
                    ) : (
                      <span className="text-xs text-gray-400 font-medium">
                        None
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* 5. Special Instructions */}
              {job.specialInstructions && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 shadow-sm">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="size-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-amber-900 text-sm mb-1">
                        Special Instructions
                      </h3>
                      <p className="text-sm text-amber-800 leading-relaxed">
                        {job.specialInstructions}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>

            {/* Payment Tab */}
            <TabsContent value="payment" className="space-y-4">
              {/* Dynamic Status-Driven Banner */}
              {!job.invoice ? (
                // Case 1: Awaiting Invoice Submission
                <div className="bg-white rounded-xl p-5 border border-gray-200">
                  <div className="flex items-start gap-4">
                    <div className="bg-gray-100 rounded-full p-3">
                      <DollarSign className="size-6 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base font-bold text-gray-900 mb-1">
                        Invoice Pending Action
                      </h3>
                      <p className="text-sm text-gray-600 mb-4">
                        Submit your invoice to receive payment
                        for this completed job.
                      </p>
                      <Button
                        onClick={() =>
                          setIsRequestPaymentOpen(true)
                        }
                        className="w-full bg-[#f89823] hover:bg-[#e08820] text-[#1a1a1a] font-semibold h-12"
                      >
                        <FileText className="w-5 h-5 mr-2" />
                        Submit Invoice
                      </Button>
                    </div>
                  </div>
                </div>
              ) : job.invoice.status === "pending" ||
                job.invoice.status === "submitted" ? (
                // Case 2: Invoice Submitted
                <div className="bg-blue-50 rounded-xl p-5 border border-blue-200">
                  <div className="flex items-start gap-4">
                    <div className="bg-white rounded-full p-3">
                      <Clock className="size-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base font-bold text-gray-900 mb-1">
                        Invoice Submitted
                      </h3>
                      <p className="text-sm text-gray-600 mb-4">
                        Your invoice is awaiting carrier review.
                        Review typically takes 24–48 hours.
                      </p>
                      <Button
                        variant="outline"
                        onClick={() => onViewInvoice?.(job)}
                        className="w-full bg-white border-blue-300 text-blue-700 hover:bg-blue-50 h-11"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View Invoice
                      </Button>
                    </div>
                  </div>
                </div>
              ) : job.invoice.status === "approved" ? (
                // Case 3: Awaiting Carrier Review (Approved)
                <div className="bg-orange-50 rounded-xl p-5 border border-orange-200">
                  <div className="flex items-start gap-4">
                    <div className="bg-white rounded-full p-3">
                      <Clock className="size-6 text-[#f89823]" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base font-bold text-gray-900 mb-1">
                        Awaiting Carrier Review
                      </h3>
                      <p className="text-sm text-gray-600 mb-4">
                        Your invoice has been approved and
                        payment will be transferred shortly.
                      </p>
                      <Button
                        variant="outline"
                        onClick={() => onViewInvoice?.(job)}
                        className="w-full bg-white border-orange-300 text-[#f89823] hover:bg-orange-50 h-11"
                      >
                        <Receipt className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              ) : job.invoice.status === "paid" ? (
                // Case 4: Paid
                <div className="bg-green-50 rounded-xl p-5 border border-green-200">
                  <div className="flex items-start gap-4">
                    <div className="bg-white rounded-full p-3">
                      <CheckCircle className="size-6 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base font-bold text-gray-900 mb-1">
                        Payment Completed
                      </h3>
                      <p className="text-sm text-gray-600 mb-4">
                        Payment has been successfully processed
                        and transferred to your account.
                      </p>
                      <Button
                        variant="outline"
                        onClick={() => onViewInvoice?.(job)}
                        className="w-full bg-white border-green-300 text-green-700 hover:bg-green-50 h-11"
                      >
                        <Receipt className="w-4 h-4 mr-2" />
                        View Invoice
                      </Button>
                    </div>
                  </div>
                </div>
              ) : null}

              {/* Payment Timeline - Improved Visual Hierarchy */}
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="size-4 text-gray-400" />
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    Payment Timeline
                  </h3>
                </div>

                <div className="relative pl-6 space-y-4">
                  {/* Vertical line */}
                  <div className="absolute left-[11px] top-2 bottom-2 w-[2px] bg-gray-200"></div>

                  {/* Step 1: Job Completed */}
                  <div className="relative flex items-start gap-3">
                    <div className="absolute -left-6 w-6 h-6 rounded-full border-2 border-green-500 bg-green-500 flex items-center justify-center z-10">
                      <CheckCircle className="w-3.5 h-3.5 text-white" />
                    </div>
                    <div className="flex-1 pt-0.5 ml-3">
                      <p className="text-sm font-semibold text-gray-900">
                        Job Completed
                      </p>
                      {job.timeTracking?.endTime && (
                        <p className="text-xs text-gray-500 mt-0.5">
                          {new Date(
                            job.timeTracking.endTime,
                          ).toLocaleString("en-US", {
                            month: "short",
                            day: "numeric",
                            hour: "numeric",
                            minute: "2-digit",
                          })}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Step 2: Invoice Status */}
                  {job.invoice?.submittedAt ? (
                    <div className="relative flex items-start gap-3">
                      <div className="absolute -left-6 w-6 h-6 rounded-full border-2 border-blue-500 bg-blue-500 flex items-center justify-center z-10">
                        <CheckCircle className="w-3.5 h-3.5 text-white" />
                      </div>
                      <div className="flex-1 pt-0.5 ml-3">
                        <p className="text-sm font-semibold text-gray-900">
                          Invoice Submitted
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {new Date(
                            job.invoice.submittedAt,
                          ).toLocaleString("en-US", {
                            month: "short",
                            day: "numeric",
                            hour: "numeric",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="relative flex items-start gap-3">
                      <div className="absolute -left-6 w-6 h-6 rounded-full border-2 border-gray-300 bg-white flex items-center justify-center z-10">
                        <div className="w-2.5 h-2.5 rounded-full bg-gray-300"></div>
                      </div>
                      <div className="flex-1 pt-0.5 ml-3">
                        <p className="text-sm font-medium text-gray-500">
                          Invoice Submission
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          Submit payment request to continue
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Step 3: Payment Approved */}
                  {job.invoice?.status === "approved" ||
                  job.invoice?.status === "paid" ? (
                    <div className="relative flex items-start gap-3">
                      <div className="absolute -left-6 w-6 h-6 rounded-full border-2 border-blue-500 bg-blue-500 flex items-center justify-center z-10">
                        <CheckCircle className="w-3.5 h-3.5 text-white" />
                      </div>
                      <div className="flex-1 pt-0.5">
                        <p className="text-sm font-semibold text-gray-900">
                          Payment Approved
                        </p>
                        {job.invoice?.approvedAt && (
                          <p className="text-xs text-gray-500 mt-0.5">
                            {new Date(
                              job.invoice.approvedAt,
                            ).toLocaleString("en-US", {
                              month: "short",
                              day: "numeric",
                              hour: "numeric",
                              minute: "2-digit",
                            })}
                          </p>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="relative flex items-start gap-3">
                      <div className="absolute -left-6 w-6 h-6 rounded-full border-2 border-gray-300 bg-white flex items-center justify-center z-10">
                        <div className="w-2.5 h-2.5 rounded-full bg-gray-300"></div>
                      </div>
                      <div className="flex-1 pt-0.5 ml-3">
                        <p className="text-sm font-medium text-gray-500">
                          Payment Approval
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          Pending review
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Step 4: Paid */}
                  {job.invoice?.status === "paid" ? (
                    <div className="relative flex items-start gap-3">
                      <div className="absolute -left-6 w-6 h-6 rounded-full border-2 border-green-500 bg-green-500 flex items-center justify-center z-10">
                        <CheckCircle className="w-3.5 h-3.5 text-white" />
                      </div>
                      <div className="flex-1 pt-0.5 ml-3">
                        <p className="text-sm font-semibold text-gray-900">
                          Payment Transferred
                        </p>
                        {job.invoice?.paidAt && (
                          <p className="text-xs text-gray-500 mt-0.5">
                            {new Date(
                              job.invoice.paidAt,
                            ).toLocaleString("en-US", {
                              month: "short",
                              day: "numeric",
                              hour: "numeric",
                              minute: "2-digit",
                            })}
                          </p>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="relative flex items-start gap-3">
                      <div className="absolute -left-6 w-6 h-6 rounded-full border-2 border-gray-300 bg-white flex items-center justify-center z-10">
                        <div className="w-2.5 h-2.5 rounded-full bg-gray-300"></div>
                      </div>
                      <div className="flex-1 pt-0.5 ml-3">
                        <p className="text-sm font-medium text-gray-500">
                          Payment Transfer
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          Pending approval
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* Rating Tab */}
            <TabsContent value="rating" className="space-y-4">
              {!job.driverRating ? (
                // No rating yet - show prompt to rate
                <RatingPrompt
                  driverName={job.driverName || "John Smith"}
                  jobId={job.id}
                  rating={job.driverRating?.overall}
                  onRateClick={() => setShowRatingScreen(true)}
                />
              ) : (
                // Rating exists - show detailed view matching the image design
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                  {/* Header */}
                  <div className="mb-4">
                    <h3 className="font-semibold text-gray-900">Rate Pilot Car</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      JOB-{job.id} • {job.origin.split(',')[0]}
                    </p>
                  </div>

                  {/* Progress Indicator */}
                  <p className="text-xs text-gray-500 mb-4">6 of 6 completed</p>

                  {/* Category Ratings */}
                  <div className="space-y-3">
                    {[
                      { key: 'safety', label: 'Safety' },
                      { key: 'driving', label: 'Driving & Compliance' },
                      { key: 'communication', label: 'Communication' },
                      { key: 'professionalism', label: 'Professionalism' },
                      { key: 'vehicle', label: 'Vehicle & Equipment' },
                      { key: 'asset', label: 'Asset Health' },
                    ].map(({ key, label }) => {
                      const rating = job.driverRating?.categories[key as keyof typeof job.driverRating.categories] || 0;
                      const ratingLabels = ['Poor', 'Fair', 'Good', 'Great', 'Excellent'];
                      const ratingLabel = rating > 0 ? ratingLabels[rating - 1] : '';
                      
                      return (
                        <div key={key} className="flex items-center justify-between">
                          <span className="text-sm text-gray-700 flex-1">{label}</span>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-0.5">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`w-5 h-5 ${
                                    star <= rating
                                      ? 'text-[#f89823] fill-[#f89823]'
                                      : 'text-gray-300 fill-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-sm text-gray-400 min-w-[60px] text-right">
                              {ratingLabel}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Comments Section */}
                  <div className="mt-6 pt-4 border-t border-gray-100">
                    <label className="text-sm text-gray-700 block mb-2">
                      Comments (Optional)
                    </label>
                    {job.driverRating.comments ? (
                      <div className="bg-gray-50 rounded-lg p-3 min-h-[80px]">
                        <p className="text-sm text-gray-700">{job.driverRating.comments}</p>
                      </div>
                    ) : (
                      <div className="bg-gray-50 rounded-lg p-3 min-h-[80px]">
                        <p className="text-sm text-gray-400 italic">No comments added</p>
                      </div>
                    )}
                  </div>

                  {/* Footer with rating date */}
                  <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                    <p className="text-xs text-gray-500">
                      Rated on {new Date(job.driverRating.ratedAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit'
                      })}
                    </p>
                    <div className="flex items-center gap-1 text-[#f89823]">
                      <Star className="w-4 h-4 fill-[#f89823]" />
                      <span className="text-sm font-semibold">
                        {job.driverRating.overall.toFixed(1)}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>

          {/* Action Buttons for In-Progress Jobs */}
          {job.status === "in-progress" && (
            <div className="fixed bottom-0 left-0 right-0 flex gap-2 p-4 bg-white border-t border-gray-200 shadow-[0_-2px_10px_rgba(0,0,0,0.1)]">
              {onAddBreak && (
                <Button
                  onClick={() => onAddBreak(job)}
                  variant="outline"
                  className="flex-1 h-12 border-amber-400 text-amber-700 hover:bg-amber-50 hover:border-amber-500"
                >
                  <Coffee className="size-4 mr-1.5" />
                  Break
                </Button>
              )}

              {onAddWaitingTime && (
                <Button
                  onClick={() => onAddWaitingTime(job)}
                  variant="outline"
                  className="flex-1 h-12 border-orange-400 text-orange-700 hover:bg-orange-50 hover:border-orange-500"
                >
                  <CircleStop className="size-4 mr-1.5" />
                  Wait Time
                </Button>
              )}

              {onEndJob && (
                <Button
                  onClick={() => onEndJob(job)}
                  variant="default"
                  className="flex-1 h-12 bg-[#f89823] hover:bg-[#e08820] text-[#1a1a1a] border-0 shadow-sm"
                >
                  <Timer className="size-5 mr-1.5" />
                  End Job
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Payment Request Modal */}
      {job.status === "completed" && !job.invoice && (
        <SubmitInvoiceModal
          job={
            {
              id: job.id,
              tripId: job.tripId || "",
              origin: job.origin,
              destination: job.destination,
              departureDate: job.departureDate,
              returnDate: job.returnDate || "",
              distance: job.distance,
              loadType: job.loadType,
              vehicleType: job.vehicleType || "N/A",
              positions: [
                {
                  type: job.position,
                  needed: 1,
                  rateType: "Flat Rate",
                  suggestedRate: job.assignedPay,
                },
              ],
              status: "completed",
              postedDate: job.assignedDate || "",
              jurisdictions: job.jurisdiction
                ? [job.jurisdiction.code]
                : [],
            } as PilotCarJob
          }
          open={isRequestPaymentOpen}
          onClose={() => setIsRequestPaymentOpen(false)}
          onSubmit={(data: InvoiceSubmissionData) => {
            const invoiceNumber = `INV-2026-${String(Math.floor(Math.random() * 1000)).padStart(3, "0")}`;

            alert(
              `✅ Invoice Submitted Successfully!\\n\\n` +
                `Invoice: ${invoiceNumber}\\n` +
                `Net Amount: $${data.netAmount.toFixed(2)}\\n` +
                `Service Cost: $${data.serviceCost.toFixed(2)}\\n` +
                `Additional Charges: $${data.additionalChargesTotal.toFixed(2)}\\n` +
                `Distance: ${data.distance} mi\\n\\n` +
                `Your invoice is now awaiting carrier review. This typically takes 24-48 hours.`,
            );

            setIsRequestPaymentOpen(false);
            onClose();
          }}
        />
      )}

      {/* Rate Driver Screen */}
      {showRatingScreen && (
        <RatePilotCarDrawer
          pilotCarName={job.driverName || "John Smith"}
          jobId={job.id}
          tripId={job.tripId}
          location={job.origin.split(',')[0]}
          onClose={() => setShowRatingScreen(false)}
          onSubmit={handleRatingSubmit}
        />
      )}
    </div>
  );
}