import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "./ui/tabs";
import {
  MapPin,
  Calendar,
  Truck,
  DollarSign,
  Clock,
  ChevronRight,
  Filter,
  Search,
  TrendingUp,
  Package,
  Ruler,
  Weight,
  Navigation,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Timer,
  ArrowRight,
  RefreshCw,
  Briefcase,
} from "lucide-react";
import Header from "./Header";
import PilotCarJobDetail, {
  PilotCarJob,
} from "./PilotCarJobDetail";
import AssignedJobsDashboard from "./AssignedJobsDashboard";
import { AssignedJob } from "./AssignedJobCard";
import { TimerState } from "./ActiveTimerIndicator";
import OutlineButton from "./OutlineButton";

// Mock data for pilot car jobs
const PILOT_CAR_JOBS: PilotCarJob[] = [
  {
    id: "PC-001",
    tripId: "TR-8945",
    jobType: "Route Survey",
    origin: "Dallas, TX",
    destination: "Phoenix, AZ",
    departureDate: "2026-01-12",
    returnDate: "2026-01-14",
    distance: "1,067 mi",
    loadType: "Oversized Machinery",
    commodityType: "Excavator CAT 349",
    vehicleType: "Flatbed",
    dimensions: {
      length: "85'",
      width: "14'6\"",
      height: "13'8\"",
      weight: "48,000 lbs",
    },
    positions: [
      {
        type: "Lead",
        needed: 1,
        rateType: "Per Mile",
        suggestedRate: "$2.50/mi",
      },
      {
        type: "Chase",
        needed: 1,
        rateType: "Per Mile",
        suggestedRate: "$2.25/mi",
      },
    ],
    status: "open",
    postedDate: "2026-01-08",
    jurisdictions: ["TX", "NM", "AZ"],
    specialRequirements: [
      "Height poles required",
      "Weekend travel",
    ],
    carrierInfo: {
      name: "Lone Star Heavy Haul",
      contact: "Mike Johnson",
      email: "dispatch@lonestar.com",
    },
  },
  {
    id: "PC-002",
    tripId: "TR-8967",
    jobType: "Convoy",
    origin: "Atlanta, GA",
    destination: "Miami, FL",
    departureDate: "2026-01-10",
    returnDate: "2026-01-11",
    distance: "663 mi",
    loadType: "Wide Load",
    commodityType: "Construction Equipment",
    vehicleType: "Lowboy",
    dimensions: {
      length: "72'",
      width: "16'",
      height: "11'2\"",
      weight: "62,000 lbs",
    },
    positions: [
      {
        type: "Lead",
        needed: 1,
        rateType: "Flat Rate",
        suggestedRate: "$1,850",
        bidStatus: "pending",
        yourBid: "$1,950",
      },
      {
        type: "Chase",
        needed: 1,
        rateType: "Flat Rate",
        suggestedRate: "$1,650",
        bidStatus: "pending",
        yourBid: "$1,750",
      },
    ],
    status: "bidding",
    postedDate: "2026-01-07",
    jurisdictions: ["GA", "FL"],
    carrierInfo: {
      name: "Southeast Logistics",
      contact: "Sarah Davis",
      email: "sdavis@selogistics.com",
    },
  },
  {
    id: "PC-003",
    tripId: "TR-8823",
    jobType: "Convoy",
    origin: "Seattle, WA",
    destination: "Portland, OR",
    departureDate: "2026-01-09",
    returnDate: "2026-01-09",
    distance: "173 mi",
    loadType: "Modular Home",
    commodityType: "Housing Unit Section A",
    vehicleType: "Specialized Trailer",
    dimensions: {
      length: "76'",
      width: "16'",
      height: "13'6\"",
      weight: "38,000 lbs",
    },
    positions: [
      {
        type: "Lead",
        needed: 1,
        rateType: "Hourly",
        suggestedRate: "$85/hr",
        bidStatus: "accepted",
        yourBid: "$90/hr",
      },
    ],
    status: "awarded",
    postedDate: "2026-01-06",
    jurisdictions: ["WA", "OR"],
    carrierInfo: {
      name: "Pacific Modular",
      contact: "David Wilson",
      email: "dwilson@pacmod.com",
    },
  },
  {
    id: "PC-004",
    tripId: "TR-9012",
    jobType: "Convoy",
    origin: "Chicago, IL",
    destination: "Detroit, MI",
    departureDate: "2026-01-15",
    returnDate: "2026-01-16",
    distance: "283 mi",
    loadType: "Heavy Equipment",
    commodityType: "Industrial Press",
    vehicleType: "Flatbed",
    dimensions: {
      length: "68'",
      width: "12'6\"",
      height: "12'",
      weight: "52,000 lbs",
    },
    positions: [
      {
        type: "Lead",
        needed: 2,
        rateType: "Per Mile",
        suggestedRate: "$2.35/mi",
      },
    ],
    status: "open",
    postedDate: "2026-01-08",
    jurisdictions: ["IL", "IN", "MI"],
    specialRequirements: [
      "Multi-pilot coordination",
      "Night travel possible",
      "Police Escort Required",
    ],
    carrierInfo: {
      name: "Midwest Haulers",
      contact: "Tom Baker",
      email: "dispatch@mwhaulers.com",
    },
  },
  {
    id: "PC-005",
    tripId: "TR-8756",
    jobType: "Convoy",
    origin: "Houston, TX",
    destination: "New Orleans, LA",
    departureDate: "2026-01-11",
    returnDate: "2026-01-12",
    distance: "348 mi",
    loadType: "Industrial Tank",
    commodityType: "Chemical Tank",
    vehicleType: "Specialized Carrier",
    dimensions: {
      length: "82'",
      width: "14'",
      height: "14'2\"",
      weight: "55,000 lbs",
    },
    positions: [
      {
        type: "Lead",
        needed: 1,
        rateType: "Flat Rate",
        suggestedRate: "$1,200",
      },
      {
        type: "Chase",
        needed: 1,
        rateType: "Flat Rate",
        suggestedRate: "$1,050",
      },
    ],
    status: "open",
    postedDate: "2026-01-08",
    jurisdictions: ["TX", "LA"],
    carrierInfo: {
      name: "Gulf Coast Transport",
      contact: "Jim Smith",
      email: "jsmith@gct.com",
    },
  },
  {
    id: "PC-006",
    tripId: "TR-9100",
    jobType: "Route Survey",
    origin: "Denver, CO",
    destination: "Salt Lake City, UT",
    departureDate: "2026-02-01",
    returnDate: "2026-02-02",
    distance: "534 mi",
    loadType: "Wind Turbine Blade",
    commodityType: "Energy Component",
    vehicleType: "Steerable Trailer",
    dimensions: {
      length: "120'",
      width: "12'",
      height: "14'",
      weight: "42,000 lbs",
    },
    positions: [
      {
        type: "Lead",
        needed: 1,
        rateType: "Per Mile",
        suggestedRate: "$2.75/mi",
        bidStatus: "accepted",
        yourBid: "$2.75/mi",
      },
    ],
    status: "active",
    postedDate: "2026-01-05",
    jurisdictions: ["CO", "UT"],
    carrierInfo: {
      name: "Wind Power Logistics",
      contact: "Alice Green",
      email: "agreen@wpl.com",
    },
  },
];

export default function PilotCarJobBoard({
  activeTimer,
  onStartTimer,
  onStopTimer,
  initialJobId,
  initialViewMode = "assigned",
  onJobStarted,
  onProfileClick,
}: {
  activeTimer?: TimerState | null;
  onStartTimer?: (timer: TimerState) => void;
  onStopTimer?: () => void;
  initialJobId?: string;
  initialViewMode?: "assigned" | "marketplace";
  onJobStarted?: (job: any) => void;
  onProfileClick?: () => void;
}) {
  const [viewMode, setViewMode] = useState<"assigned" | "marketplace">(initialViewMode);
  const [activeTab, setActiveTab] = useState("available");
  const [selectedJob, setSelectedJob] =
    useState<PilotCarJob | null>(null);
  const [showSurvey, setShowSurvey] = useState(false);
  const [surveyJob, setSurveyJob] =
    useState<AssignedJob | null>(null);
  const [surveyMode, setSurveyMode] = useState<
    "new" | "continue" | "view"
  >("new");
  const [closeSurveyTrigger, setCloseSurveyTrigger] =
    useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  // Handler for when survey state changes in AssignedJobsDashboard
  const handleSurveyStateChange = (
    isActive: boolean,
    job: AssignedJob | null,
    mode?: "new" | "continue" | "view",
  ) => {
    setShowSurvey(isActive);
    setSurveyJob(job);
    if (mode) {
      setSurveyMode(mode);
    }
  };

  const handleSurveyBack = () => {
    setShowSurvey(false);
    setSurveyJob(null);
    // Trigger close in AssignedJobsDashboard
    setCloseSurveyTrigger((prev) => prev + 1);
  };

  // Filter jobs by status
  const availableJobs = PILOT_CAR_JOBS.filter(
    (job) => job.status === "open",
  );
  const biddingJobs = PILOT_CAR_JOBS.filter((job) =>
    job.positions.some(
      (p) =>
        p.bidStatus === "pending" ||
        p.bidStatus === "accepted" ||
        p.bidStatus === "rejected",
    ),
  );
  const activeJobs = PILOT_CAR_JOBS.filter(
    (job) =>
      job.status === "active" || job.status === "awarded",
  );
  const completedJobs = PILOT_CAR_JOBS.filter(
    (job) => job.status === "completed",
  );

  const getStatusBadge = (status: PilotCarJob["status"]) => {
    switch (status) {
      case "open":
        return (
          <Badge className="bg-[#E3F2FD] text-[#1565C0] border border-[#BBDEFB] hover:bg-[#E3F2FD] shadow-none text-[11px] px-2 py-0 h-[20px] rounded-md">
            Open
          </Badge>
        );
      case "bidding":
        return (
          <Badge className="bg-[#FFF3E0] text-[#BF360C] border border-[#FFE0B2] hover:bg-[#FFF3E0] shadow-none text-[11px] px-2 py-0 h-[20px] rounded-md">
            Bid Sent
          </Badge>
        );
      case "awarded":
        return (
          <Badge className="bg-[#F3E5F5] text-[#6A1B9A] border border-[#E1BEE7] hover:bg-[#F3E5F5] shadow-none text-[11px] px-2 py-0 h-[20px] rounded-md">
            Assigned
          </Badge>
        );
      case "active":
        return (
          <Badge className="bg-[#FFF3E0] text-[#BF360C] border border-[#FFE0B2] hover:bg-[#FFF3E0] shadow-none text-[11px] px-2 py-0 h-[20px] rounded-md">
            In Transit
          </Badge>
        );
      case "completed":
        return (
          <Badge className="bg-[#E8F5E9] text-[#2E7D32] border border-[#C8E6C9] hover:bg-[#E8F5E9] shadow-none text-[11px] px-2 py-0 h-[20px] rounded-md">
            Completed
          </Badge>
        );
    }
  };

  // Get the best (highest) rate from all positions for a job
  const getPrimaryRate = (job: PilotCarJob) => {
    const primary = job.positions[0];
    return { rate: primary.suggestedRate, type: primary.rateType };
  };

  const getBidStatusIcon = (status?: string) => {
    switch (status) {
      case "pending":
        return <Timer className="w-3 h-3 text-amber-600" />;
      case "accepted":
        return <CheckCircle2 className="w-3 h-3 text-green-600" />;
      case "rejected":
        return <XCircle className="w-3 h-3 text-red-600" />;
      default:
        return null;
    }
  };

  const JobCard = ({ job }: { job: PilotCarJob }) => {
    const isBiddingTab = activeTab === "mybids";
    const hasMultiplePositions = job.positions.length > 1;

    return (
      <Card
        className="mb-3 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer bg-white active:scale-[0.99]"
        onClick={() => setSelectedJob(job)}
      >
        <CardContent className="p-3.5">
          {/* Title + Status Badge */}
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="text-[15px] font-bold text-gray-900 leading-tight flex-1">
              {job.loadType}
            </h3>
            {getStatusBadge(job.status)}
          </div>

          {/* Route - Secondary */}
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[14px] text-gray-700 font-medium truncate">
              {job.origin.split(',')[0]}
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            <span className="text-[14px] text-gray-700 font-medium truncate">
              {job.destination.split(',')[0]}
            </span>
          </div>

          {/* Date + Distance - Tertiary */}
          <div className="flex items-center gap-2 mb-3 text-[13px] text-gray-500">
            <span>
              {new Date(job.departureDate).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </span>
            <span>•</span>
            <span>{job.distance}</span>
          </div>

          {/* Positions & Rates - Grouped */}
          <div className="space-y-1.5 mb-3">
            {job.positions.map((position, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between bg-blue-50 border border-blue-100 rounded-md px-2.5 py-1.5"
              >
                <div className="flex items-center gap-1.5">
                  <span className="text-[13px] font-semibold text-gray-900">
                    {position.type} Pilot
                  </span>
                  {position.needed > 1 && (
                    <span className="text-[11px] text-gray-500">
                      ({position.needed} positions)
                    </span>
                  )}
                  {isBiddingTab && position.bidStatus && (
                    <div className="flex items-center gap-1 ml-1">
                      {getBidStatusIcon(position.bidStatus)}
                    </div>
                  )}
                </div>
                <div className="text-right">
                  {isBiddingTab && position.yourBid ? (
                    <div className="flex flex-col items-end">
                      <span className="text-[13px] font-bold text-blue-700">
                        {position.yourBid}
                      </span>
                      <span className="text-[10px] text-gray-500">Your Bid</span>
                    </div>
                  ) : (
                    <span className="text-[13px] font-bold text-gray-900">
                      {position.suggestedRate}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Additional Info - Light */}
          <div className="flex items-center justify-between text-[12px]">
            <span className="text-gray-500 truncate flex-1">
              {job.jurisdictions.join(", ")} • {job.carrierInfo?.name}
            </span>
            <ChevronRight className="w-4 h-4 text-gray-300 shrink-0 ml-2" />
          </div>

          {/* Bid Status Badge for My Bids */}
          {isBiddingTab && job.positions.some(p => p.bidStatus) && (
            <div className="mt-2 pt-2 border-t border-gray-100">
              <div className="flex items-center gap-2">
                {job.positions[0].bidStatus === "pending" && (
                  <Badge className="bg-amber-50 text-amber-700 border-amber-200 text-[11px] h-5">
                    <Timer className="w-3 h-3 mr-1" />
                    Under Review
                  </Badge>
                )}
                {job.positions[0].bidStatus === "accepted" && (
                  <Badge className="bg-green-50 text-green-700 border-green-200 text-[11px] h-5">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Accepted
                  </Badge>
                )}
                {job.positions[0].bidStatus === "rejected" && (
                  <Badge className="bg-red-50 text-red-700 border-red-200 text-[11px] h-5">
                    <XCircle className="w-3 h-3 mr-1" />
                    Declined
                  </Badge>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  // Show job detail view if a job is selected
  if (selectedJob) {
    return (
      <PilotCarJobDetail
        job={selectedJob}
        onBack={() => setSelectedJob(null)}
      />
    );
  }

  return (
    <div className="flex flex-col min-h-full">
      {/* Header */}
      <div className="flex-none z-20">
        <Header
          title={showSurvey ? "Route Survey" : viewMode === "marketplace" ? "Browse Jobs" : "My Jobs"}
          showBackButton={showSurvey}
          onBack={showSurvey ? handleSurveyBack : undefined}
          notificationCount={showSurvey ? undefined : 2}
          showNotifications={!showSurvey}
          onProfileClick={onProfileClick}
          rightElement={
            showSurvey ? (
              surveyMode === "view" ? (
                <Badge className="bg-[#E8F5E9] text-[#2E7D32] border-2 border-[#C8E6C9]">Completed</Badge>
              ) : (
                <Badge
                  variant="outline"
                  className="bg-yellow-50 text-yellow-700 border-yellow-200"
                >
                  Draft
                </Badge>
              )
            ) : undefined
          }
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-[#f6f6f6] rounded-t-[20px] shadow-[0_-4px_10px_rgba(0,0,0,0.1)] flex flex-col">
        {showSurvey && surveyJob ? (
          <div className="h-full bg-white rounded-t-[20px] overflow-hidden">
            <AssignedJobsDashboard
              activeTimer={activeTimer}
              onStartTimer={onStartTimer}
              onStopTimer={onStopTimer}
              initialSurveyJob={surveyJob}
              initialSurveyMode={surveyMode}
              onSurveyStateChange={handleSurveyStateChange}
              closeSurveyTrigger={closeSurveyTrigger}
              onJobStarted={onJobStarted}
            />
          </div>
        ) : viewMode === "assigned" ? (
          <div className="h-full bg-white rounded-t-[20px] overflow-hidden relative">
            {/* View Toggle Button */}
            <div className="absolute top-3 right-3 z-30">
              <Button
                onClick={() => setViewMode("marketplace")}
                size="sm"
                variant="outline"
                className="bg-white shadow-sm border-gray-200 text-[#155DFC] hover:bg-gray-50 h-[32px] text-xs font-semibold"
              >
                Browse Available Jobs
              </Button>
            </div>
            
            <AssignedJobsDashboard
              activeTimer={activeTimer}
              onStartTimer={onStartTimer}
              onStopTimer={onStopTimer}
              onSurveyStateChange={handleSurveyStateChange}
              closeSurveyTrigger={closeSurveyTrigger}
              onJobStarted={onJobStarted}
            />
          </div>
        ) : (
          <div className="flex flex-col flex-1">
            {/* View Toggle - Back to My Jobs */}
            <div className="px-4 pt-3 pb-2 bg-white border-b border-[#e6e3df]">
              <Button
                onClick={() => setViewMode("assigned")}
                variant="ghost"
                className="text-[#155DFC] hover:bg-gray-50 h-[36px] -ml-2 font-semibold"
              >
                ← Back to My Jobs
              </Button>
            </div>

            {/* Search and Filter */}
            <div className="px-4 py-3 bg-white border-b border-[#e6e3df]">
              <div className="flex gap-2.5">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#83838D]" />
                  <Input
                    placeholder="Search by location, job ID, or load type..."
                    className="pl-10 bg-white border-[#e5e7eb] h-[45px] rounded-lg text-sm"
                    value={searchQuery}
                    onChange={(e) =>
                      setSearchQuery(e.target.value)
                    }
                  />
                </div>
                <Sheet>
                  <SheetTrigger asChild>
                    <OutlineButton className="w-[45px] h-[45px] p-0">
                      <Filter className="w-4 h-4 text-[#4A5565]" />
                    </OutlineButton>
                  </SheetTrigger>
                  <SheetContent
                    side="bottom"
                    className="rounded-t-xl h-[80vh]"
                    aria-describedby={undefined}
                  >
                    <SheetHeader className="text-left mb-4">
                      <SheetTitle>Filter Jobs</SheetTitle>
                      <SheetDescription>
                        Narrow down the job list by applying
                        filters.
                      </SheetDescription>
                    </SheetHeader>

                    <div className="space-y-6 overflow-y-auto px-4 pb-20">
                      <div className="space-y-3">
                        <p className="text-base font-medium">
                          Job Type
                        </p>
                        <div className="grid grid-cols-2 gap-2">
                          {[
                            "Open",
                            "Bidding",
                            "Awarded",
                            "Active",
                            "Completed",
                          ].map((type) => (
                            <div
                              key={type}
                              className="flex items-center justify-center h-10 rounded-lg border cursor-pointer text-sm font-medium transition-colors bg-white border-gray-200 text-gray-700 hover:border-gray-300"
                            >
                              {type}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <p className="text-base font-medium">
                          States
                        </p>
                        <div className="grid grid-cols-4 gap-2">
                          {[
                            "TX",
                            "NM",
                            "AZ",
                            "GA",
                            "FL",
                            "WA",
                            "OR",
                            "IL",
                            "IN",
                            "MI",
                            "LA",
                          ].map((state) => (
                            <div
                              key={state}
                              className="flex items-center justify-center h-10 rounded-lg border cursor-pointer text-sm font-medium transition-colors bg-white border-gray-200 text-gray-700 hover:border-gray-300"
                            >
                              {state}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <SheetFooter className="absolute bottom-0 left-0 right-0 p-4 border-t bg-white flex flex-row gap-3 sm:justify-between">
                      <Button
                        variant="outline"
                        className="flex-1"
                      >
                        Reset
                      </Button>
                      <SheetClose asChild>
                        <Button className="flex-1 bg-[#0066cc]">
                          Apply Filters
                        </Button>
                      </SheetClose>
                    </SheetFooter>
                  </SheetContent>
                </Sheet>
              </div>
            </div>

            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto">
              {/* Tab Bar - Exact Figma Design - Sticky */}
              <div className="bg-white p-[5px] rounded-[8px] relative overflow-hidden sticky top-0 z-10 mx-4 mt-3 mb-3">
                <div
                  aria-hidden="true"
                  className="absolute border border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[8px]"
                />
                <div
                  className="overflow-x-auto overflow-y-hidden -mx-[5px] px-[5px]"
                  style={{
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                  }}
                >
                  <style>{`.overflow-x-auto::-webkit-scrollbar { display: none; }`}</style>
                  <div className="flex gap-[8px] items-center relative w-full">
                    <button
                      onClick={() => setActiveTab("available")}
                      className={`flex items-center justify-center h-[38.997px] shrink-0 flex-1 transition-all ${
                        activeTab === "available"
                          ? "rounded-[5px] shadow-[0px_0px_2px_0px_#949ec5] px-[16px] py-[7px]"
                          : "rounded-[8px] px-[13.108px] py-[7.108px] relative"
                      }`}
                      style={
                        activeTab === "available"
                          ? {
                              backgroundImage:
                                "linear-gradient(136.686deg, rgb(37, 99, 235) 29.703%, rgb(78, 121, 216) 92.928%)",
                            }
                          : undefined
                      }
                    >
                      {activeTab !== "available" && (
                        <div
                          aria-hidden="true"
                          className="absolute border-[1.108px] border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]"
                        />
                      )}
                      <p
                        className={`font-medium leading-[16px] text-[14px] text-center whitespace-nowrap ${
                          activeTab === "available"
                            ? "text-white"
                            : "text-[#0a0a0a]"
                        }`}
                      >
                        Available ({availableJobs.length})
                      </p>
                    </button>

                    <button
                      onClick={() => setActiveTab("mybids")}
                      className={`flex items-center justify-center h-[38.997px] shrink-0 flex-1 transition-all ${
                        activeTab === "mybids"
                          ? "rounded-[5px] shadow-[0px_0px_2px_0px_#949ec5] px-[16px] py-[7px]"
                          : "rounded-[8px] px-[13.108px] py-[7.108px] relative"
                      }`}
                      style={
                        activeTab === "mybids"
                          ? {
                              backgroundImage:
                                "linear-gradient(136.686deg, rgb(37, 99, 235) 29.703%, rgb(78, 121, 216) 92.928%)",
                            }
                          : undefined
                      }
                    >
                      {activeTab !== "mybids" && (
                        <div
                          aria-hidden="true"
                          className="absolute border-[1.108px] border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]"
                        />
                      )}
                      <p
                        className={`font-medium leading-[16px] text-[14px] text-center whitespace-nowrap ${
                          activeTab === "mybids"
                            ? "text-white"
                            : "text-[#0a0a0a]"
                        }`}
                      >
                        My Bids ({biddingJobs.length})
                      </p>
                    </button>
                  </div>
                </div>
              </div>

              {/* Tab Content */}
              <div>
                {activeTab === "available" && (
                  <div className="p-4 pb-20">
                    {availableJobs.length > 0 ? (
                      <div>
                        {availableJobs.map((job) => (
                          <JobCard key={job.id} job={job} />
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-16">
                        <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Briefcase className="w-7 h-7 text-gray-400" />
                        </div>
                        <p className="text-gray-900 mb-1">
                          No jobs available right now
                        </p>
                        <p className="text-sm text-gray-500 mb-4">
                          New opportunities are posted daily
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-[#155DFC] border-gray-200"
                          onClick={() => {/* refresh */}}
                        >
                          <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
                          Refresh
                        </Button>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "mybids" && (
                  <div className="p-4 pb-20">
                    {biddingJobs.length > 0 ? (
                      <div>
                        {biddingJobs.map((job) => (
                          <JobCard key={job.id} job={job} />
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-16">
                        <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <DollarSign className="w-7 h-7 text-gray-400" />
                        </div>
                        <p className="text-gray-900 mb-1">
                          No active bids
                        </p>
                        <p className="text-sm text-gray-500 mb-4">
                          Browse available jobs to place your first bid
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-[#155DFC] border-gray-200"
                          onClick={() => setActiveTab("available")}
                        >
                          Browse Jobs
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}