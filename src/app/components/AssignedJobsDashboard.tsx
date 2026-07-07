import React, { useState, useEffect } from "react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Briefcase,
  TrendingUp,
  Play,
  CheckCircle2,
  Search,
  Filter,
} from "lucide-react";
import {
  AssignedJobCard,
  AssignedJob,
} from "./AssignedJobCard";
import { AssignedJobDetailsDrawer } from "./AssignedJobDetailsDrawer";
import RouteSurveyForm from "./RouteSurveyForm";
import { AddBreakModal } from "./AddBreakModal";
import { AddWaitingTimeModal } from "./AddWaitingTimeModal";
import { EndJobModal } from "./EndJobModal";
import { CompleteJobModal } from "./CompleteJobModal";
import {
  InvoiceSubmissionModal,
  InvoiceData,
} from "./InvoiceSubmissionModal";
import { InvoiceStatusModal } from "./InvoiceStatusModal";
import { OdometerCaptureModal, OdometerReading } from "./OdometerCaptureModal";
import { PerMileInvoiceModal, PerMileInvoiceData } from "./PerMileInvoiceModal";
import { TimerState } from "./ActiveTimerIndicator";
import {
  PilotJobStateValidator,
  PilotJobStateActions,
  PilotJobNotifications,
} from "./PilotJobStateMachine";
import { toast } from "sonner";

// Mock data for assigned jobs with NEW state machine
const INITIAL_JOBS: AssignedJob[] = [
  {
    id: "PC-006",
    requestId: "RQ-2385",
    tripId: "TR-8967",
    jobTitle: "Lead Pilot - Oversized Load",
    jobType: "Route Survey",
    origin: "Chicago, IL",
    destination: "Detroit, MI",
    departureDate: "2026-01-10T08:00:00Z",
    returnDate: "2026-01-11T16:00:00Z",
    distance: "283 mi",
    loadType: "Heavy Machinery",
    vehicleType: "Lowboy Trailer",
    assignedPay: "$2,125.00",
    requestingCompany: "Midwest Hauling LLC",
    status: "upcoming", // NEW: Using new state machine
    assignedDate: "2026-01-08",
    position: "Lead",
    jurisdiction: {
      state: "Illinois",
      code: "IL",
    },
    routeSurveyRequired: true,
    routeSurveyStatus: "not-started",
    loadSummary: "Excavator CAT 349",
    loadLength: "65'",
    loadWidth: "12'6\"",
    loadHeight: "13'2\"",
    loadWeight: "42,000 lbs",
    commodityType: "Construction Equipment",
    heightPoleRequired: true,
    specialPermitsRequired: true,
    specialInstructions:
      "Height poles required. Winter weather conditions - monitor I-94 conditions.",
    attachments: [
      { name: "Route_Map.pdf", url: "#", type: "map" },
      { name: "IL_Permit.pdf", url: "#", type: "permit" },
    ],
    billingActive: false,
  },
  {
    id: "PC-007",
    requestId: "RQ-2391",
    tripId: "TR-8982",
    jobTitle: "Chase Pilot - Wide Load",
    jobType: "Convoy",
    origin: "Indianapolis, IN",
    destination: "Columbus, OH",
    departureDate: "2026-01-12T06:00:00Z",
    returnDate: "2026-01-12T14:00:00Z",
    distance: "176 mi",
    loadType: "Modular Home",
    vehicleType: "Flatbed",
    assignedPay: "$1,450.00",
    requestingCompany: "Central Transport Inc",
    status: "awaiting-acceptance", // NEW: Driver activated jurisdiction
    assignedDate: "2026-01-07",
    position: "Chase",
    jurisdiction: {
      state: "Indiana",
      code: "IN",
      activatedAt: "2026-02-11T05:30:00Z",
      activatedBy: "John Driver",
    },
    routeSurveyRequired: false,
    loadSummary: "Modular Home Section A",
    loadLength: "70'",
    loadWidth: "14'",
    loadHeight: "11'",
    loadWeight: "35,000 lbs",
    commodityType: "Housing Unit",
    policeEscortRequired: false,
    heightPoleRequired: false,
    specialPermitsRequired: true,
    specialInstructions: "Same-day job. Depart 6:00 AM.",
    timeTracking: {
      breaks: [],
      waitingTime: [],
    },
    billingActive: false,
  },
  {
    id: "PC-008",
    requestId: "RQ-2405",
    tripId: "TR-9001",
    jobTitle: "Lead Pilot - Superload",
    jobType: "Convoy",
    origin: "Louisville, KY",
    destination: "Nashville, TN",
    departureDate: "2026-01-15T05:00:00Z",
    returnDate: "2026-01-16T14:00:00Z",
    distance: "175 mi",
    loadType: "Industrial Equipment",
    vehicleType: "Multi-Axle Trailer",
    assignedPay: "$3,200.00",
    requestingCompany: "Heavy Haul Solutions",
    status: "completed", // CHANGED: Now completed
    assignedDate: "2026-01-05",
    position: "Lead",
    jurisdiction: {
      state: "Kentucky",
      code: "KY",
      activatedAt: "2026-02-11T04:00:00Z",
      activatedBy: "Mike Trucker",
      completedAt: "2026-02-11T13:30:00Z", // ADDED: Completed timestamp
    },
    routeSurveyRequired: true,
    routeSurveyStatus: "completed",
    loadSummary: "Turbine Generator",
    loadLength: "85'",
    loadWidth: "16'",
    loadHeight: "15'6\"",
    loadWeight: "120,000 lbs",
    commodityType: "Power Generation",
    policeEscortRequired: true,
    heightPoleRequired: true,
    specialPermitsRequired: true,
    specialInstructions:
      "Police escort required. Multi-state permits verified.",
    attachments: [
      {
        name: "Superload_Permit_KY.pdf",
        url: "#",
        type: "permit",
      },
      {
        name: "Superload_Permit_TN.pdf",
        url: "#",
        type: "permit",
      },
      { name: "Bridge_Survey.pdf", url: "#", type: "map" },
    ],
    timeTracking: {
      acceptedAt: "2026-02-11T04:10:00Z",
      startedAt: "2026-02-11T04:45:00Z",
      endTime: "2026-02-11T13:30:00Z", // ADDED: End time
      breaks: [
        {
          duration: 20,
          notes: "Rest break",
          timestamp: "2026-02-11T08:00:00Z",
        },
      ],
      waitingTime: [
        {
          duration: 15,
          reason: "Waiting for police escort",
          timestamp: "2026-02-11T06:30:00Z",
        },
      ],
    },
    billingActive: false, // CHANGED: Billing stopped
    invoice: {
      status: "submitted", // CHANGED: Invoice submitted
      invoiceNumber: "INV-2026-008",
      totalAmount: 3200.0,
      submittedAt: "2026-02-11T14:00:00Z",
    },
  },
  {
    id: "PC-010",
    requestId: "RQ-2420",
    tripId: "TR-9025",
    jobTitle: "Lead Pilot - Transformer",
    jobType: "Convoy",
    origin: "Houston, TX",
    destination: "Dallas, TX",
    departureDate: "2026-02-20T06:00:00Z",
    returnDate: "2026-02-21T18:00:00Z",
    distance: "240 mi",
    loadType: "Electrical Transformer",
    vehicleType: "Heavy Haul Trailer",
    assignedPay: "$2,850.00",
    requestingCompany: "Texas Power Grid LLC",
    status: "completed",
    assignedDate: "2026-02-15",
    position: "Lead",
    driverName: "Michael Thompson",
    jurisdiction: {
      state: "Texas",
      code: "TX",
      activatedAt: "2026-02-20T05:30:00Z",
      activatedBy: "Michael Thompson",
      completedAt: "2026-02-21T17:45:00Z",
    },
    routeSurveyRequired: false,
    loadSummary: "Power Transformer - 380kV",
    loadLength: "45'",
    loadWidth: "15'",
    loadHeight: "14'8\"",
    loadWeight: "95,000 lbs",
    commodityType: "Electrical Equipment",
    policeEscortRequired: false,
    heightPoleRequired: true,
    specialPermitsRequired: true,
    specialInstructions:
      "Escort through urban areas. Avoid rush hour traffic.",
    attachments: [
      {
        name: "TX_Permit.pdf",
        url: "#",
        type: "permit",
      },
      { name: "Route_Map.pdf", url: "#", type: "map" },
    ],
    timeTracking: {
      acceptedAt: "2026-02-20T05:40:00Z",
      startedAt: "2026-02-20T06:00:00Z",
      endTime: "2026-02-21T17:45:00Z",
      breaks: [
        {
          duration: 30,
          notes: "Lunch break",
          timestamp: "2026-02-20T12:00:00Z",
        },
      ],
      waitingTime: [
        {
          duration: 45,
          reason: "Traffic delay - highway construction",
          timestamp: "2026-02-21T10:30:00Z",
        },
      ],
    },
    billingActive: false,
    // NO INVOICE - needs to generate payment request
    driverRating: {
      overall: 4.3,
      categories: {
        safety: 5,
        driving: 4,
        communication: 4,
        professionalism: 4,
        vehicle: 4,
        asset: 5,
      },
      comments: "Great job overall! Very professional and safe driver. Communication was excellent throughout the trip.",
      ratedAt: "2026-02-21T18:30:00Z",
    },
  },
  {
    id: "PC-011",
    requestId: "RQ-2430",
    tripId: "TR-9035",
    jobTitle: "Lead Pilot - Bridge Girder",
    jobType: "Convoy",
    origin: "Memphis, TN",
    destination: "Little Rock, AR",
    departureDate: "2026-06-22T07:00:00Z",
    returnDate: "2026-06-22T13:00:00Z",
    distance: "137 mi",
    loadType: "Bridge Girder",
    vehicleType: "Lowboy Trailer",
    assignedPay: "$376.75",
    requestingCompany: "Southern Bridge Constructors",
    status: "accepted",
    assignedDate: "2026-06-19",
    position: "Lead",
    jurisdiction: {
      state: "Tennessee",
      code: "TN",
      activatedAt: "2026-06-19T12:00:00Z",
      activatedBy: "Dispatch – Southern Bridge",
    },
    routeSurveyRequired: false,
    loadSummary: "Steel Bridge Girder – 95ft",
    loadLength: "95'",
    loadWidth: "12'",
    loadHeight: "13'6\"",
    loadWeight: "56,000 lbs",
    commodityType: "Bridge Components",
    heightPoleRequired: true,
    specialPermitsRequired: true,
    specialInstructions: "Per-mile compensation. Capture odometer at start and end of escort.",
    rateType: "per-mile",
    ratePerMile: 2.75,
    timeTracking: {
      acceptedAt: "2026-06-19T12:30:00Z",
      breaks: [],
      waitingTime: [],
    },
    billingActive: false,
  },
  {
    id: "PC-009",
    requestId: "RQ-2410",
    tripId: "TR-9015",
    jobTitle: "Front Pilot - Wind Turbine",
    jobType: "Convoy",
    origin: "Des Moines, IA",
    destination: "Omaha, NE",
    departureDate: "2026-01-18T07:00:00Z",
    returnDate: "2026-01-18T15:00:00Z",
    distance: "135 mi",
    loadType: "Wind Turbine Blade",
    vehicleType: "Extendable Trailer",
    assignedPay: "$1,800.00",
    requestingCompany: "Renewable Transport Co",
    status: "accepted", // NEW: Accepted but not started
    assignedDate: "2026-01-10",
    position: "Front",
    jurisdiction: {
      state: "Iowa",
      code: "IA",
      activatedAt: "2026-02-11T06:00:00Z",
      activatedBy: "Sarah Operator",
    },
    routeSurveyRequired: false,
    loadSummary: "Wind Turbine Blade - 180ft",
    loadLength: "180'",
    loadWidth: "12'",
    loadHeight: "14'",
    loadWeight: "38,000 lbs",
    commodityType: "Renewable Energy",
    heightPoleRequired: true,
    specialPermitsRequired: true,
    specialInstructions:
      "Extremely long load. Requires wide turns and special coordination.",
    timeTracking: {
      acceptedAt: "2026-02-11T06:05:00Z",
      breaks: [],
      waitingTime: [],
    },
    billingActive: false, // Accepted but billing not started yet
  },
];

interface AssignedJobsDashboardProps {
  onShowSurvey?: (
    job: AssignedJob,
    mode: "new" | "continue" | "view",
  ) => void;
  onSurveyStateChange?: (
    isActive: boolean,
    job: AssignedJob | null,
    mode?: "new" | "continue" | "view",
  ) => void;
  closeSurveyTrigger?: number;
  activeTimer?: TimerState | null;
  onStartTimer?: (timer: TimerState) => void;
  onStopTimer?: () => void;
  // Props for showing survey directly
  initialSurveyJob?: AssignedJob | null;
  initialSurveyMode?: "new" | "continue" | "view";
  // Prop for showing job detail directly
  initialJobId?: string;
  // Callback when a job is started (navigates to Active Job screen)
  onJobStarted?: (job: AssignedJob) => void;
}

export default function AssignedJobsDashboard({
  onShowSurvey,
  onSurveyStateChange,
  closeSurveyTrigger,
  activeTimer,
  onStartTimer,
  onStopTimer,
  initialSurveyJob,
  initialSurveyMode,
  initialJobId,
  onJobStarted,
}: AssignedJobsDashboardProps = {}) {
  const [activeTab, setActiveTab] = useState<
    "all" | "assigned" | "in-progress" | "completed"
  >("all");
  const [selectedJob, setSelectedJob] =
    useState<AssignedJob | null>(initialSurveyJob || null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSurveyForm, setShowSurveyForm] =
    useState(!!initialSurveyJob);
  const [surveyMode, setSurveyMode] = useState<
    "new" | "continue" | "view"
  >(initialSurveyMode || "new");

  // Set initial survey state when props are provided (for updates)
  useEffect(() => {
    if (initialSurveyJob && initialSurveyMode) {
      setSelectedJob(initialSurveyJob);
      setSurveyMode(initialSurveyMode);
      setShowSurveyForm(true);
    }
  }, [initialSurveyJob, initialSurveyMode]);

  const [surveyDrafts, setSurveyDrafts] = useState<
    Record<string, any>
  >({
    "PC-006": {
      surveyDate: "2026-01-05",
      pcOperatorName: "John Smith",
      vehicleId: "PC-VEH-001",
      jobReference: "PC-006 / RQ-2385",
      route: {
        origin: "Chicago, IL",
        destination: "Detroit, MI",
        distance: "283 mi",
      },
      loadDimensions: {
        length: "65'",
        width: "12'6\"",
        height: "13'2\"",
        weight: "42,000 lbs",
      },
      jurisdictions: ["IL", "IN", "MI"],
      units: "imperial" as const,
      observations: [
        {
          id: "1",
          category: "height" as const,
          location: "I-94 Exit 167 - Main St Overpass",
          measurement: "13'6\"",
          description:
            "Low clearance bridge. Measured 13'6\" - adequate for load at 13'2\" but minimal margin.",
          severity: "moderate" as const,
        },
        {
          id: "2",
          category: "turning" as const,
          location: "US-12 and State Road intersection",
          measurement: "",
          description:
            "Sharp right turn requires wide swing. Recommend blocking right lane during turn.",
          severity: "minor" as const,
        },
      ],
      compliance: {
        permitRequired: true,
        policeEscortRequired: false,
        heightPoleRequired: true,
        steerAxlesRequired: false,
      },
      layoverPoints: [
        {
          id: "1",
          location: "Indiana Toll Road Plaza (MM 23)",
          facilities:
            "Fuel, restrooms, food. Large vehicle parking available.",
        },
      ],
      backupRoutes: [
        {
          id: "1",
          description: "US-12 alternate route avoiding I-94",
          reason:
            "If height clearance becomes an issue or weather conditions worsen",
        },
      ],
      permitApprovalRecommended: true,
      surveyorNotes:
        "Route is feasible with proper permits and height pole. Winter conditions require monitoring. Recommend early morning departure to avoid heavy traffic on I-94.",
      attachments: [
        {
          id: "1",
          type: "map" as const,
          name: "Route_Map_Chicago_Detroit.pdf",
          timestamp: "2026-01-05T10:30:00Z",
        },
        {
          id: "2",
          type: "photo" as const,
          name: "Low_Clearance_Bridge.jpg",
          timestamp: "2026-01-05T11:15:00Z",
        },
      ],
      signature: "John Smith",
      signoffDate: "2026-01-05",
      certification: true,
    },
  });

  // Time tracking modals
  const [showBreakModal, setShowBreakModal] = useState(false);
  const [showWaitingModal, setShowWaitingModal] =
    useState(false);
  const [showEndJobModal, setShowEndJobModal] = useState(false);
  const [showCompleteJobModal, setShowCompleteJobModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] =
    useState(false);
  const [showInvoiceStatusModal, setShowInvoiceStatusModal] =
    useState(false);
  const [jobForTimeAction, setJobForTimeAction] =
    useState<AssignedJob | null>(null);

  // Per-mile flow state
  const [showOdometerStartModal, setShowOdometerStartModal] = useState(false);
  const [showOdometerEndModal, setShowOdometerEndModal] = useState(false);
  const [showPerMileInvoiceModal, setShowPerMileInvoiceModal] = useState(false);
  const [pendingPerMileJob, setPendingPerMileJob] = useState<AssignedJob | null>(null);
  const [capturedStartOdometer, setCapturedStartOdometer] = useState<OdometerReading | null>(null);
  const [capturedEndOdometer, setCapturedEndOdometer] = useState<OdometerReading | null>(null);

  // Jobs state
  const [jobs, setJobs] = useState<AssignedJob[]>(INITIAL_JOBS);

  // Auto-open job details when initialJobId is provided
  useEffect(() => {
    if (initialJobId) {
      const job = jobs.find((j) => j.id === initialJobId);
      if (job) {
        setSelectedJob(job);
      }
    }
  }, [initialJobId, jobs]);

  // Calculate summary stats
  const assignedCount = jobs.filter(
    (j) => ["upcoming", "awaiting-acceptance", "accepted"].includes(j.status),
  ).length;
  const inProgressCount = jobs.filter(
    (j) => j.status === "in-progress",
  ).length;
  const completedCount = jobs.filter(
    (j) => j.status === "completed",
  ).length;
  const totalCount = jobs.length;

  // Filter jobs based on active tab and search
  const filteredJobs = jobs.filter((job) => {
    // Tab filter - map "assigned" to include upcoming, awaiting-acceptance, and accepted states
    if (activeTab === "assigned") {
      if (!["upcoming", "awaiting-acceptance", "accepted"].includes(job.status)) {
        return false;
      }
    } else if (activeTab !== "all" && job.status !== activeTab) {
      return false;
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        job.jobTitle.toLowerCase().includes(query) ||
        job.id.toLowerCase().includes(query) ||
        job.origin.toLowerCase().includes(query) ||
        job.destination.toLowerCase().includes(query) ||
        job.requestingCompany.toLowerCase().includes(query)
      );
    }

    return true;
  });

  // Sort: action-needed jobs first (awaiting-acceptance > in-progress > accepted > upcoming > completed)
  const getStatusPriority = (status: string): number => {
    switch (status) {
      case 'awaiting-acceptance': return 0;
      case 'in-progress': return 1;
      case 'accepted': return 2;
      case 'upcoming': return 3;
      case 'completed': return 4;
      default: return 5;
    }
  };

  const sortedJobs = [...filteredJobs].sort(
    (a, b) => getStatusPriority(a.status) - getStatusPriority(b.status)
  );

  const handleStartSurvey = (job: AssignedJob) => {
    if (onShowSurvey) {
      onShowSurvey(job, "new");
    } else {
      setSelectedJob(job);
      setSurveyMode("new");
      setShowSurveyForm(true);
    }
    if (onSurveyStateChange) {
      onSurveyStateChange(true, job, "new");
    }
  };

  const handleContinueSurvey = (job: AssignedJob) => {
    if (onShowSurvey) {
      onShowSurvey(job, "continue");
    } else {
      setSelectedJob(job);
      setSurveyMode("continue");
      setShowSurveyForm(true);
    }
    if (onSurveyStateChange) {
      onSurveyStateChange(true, job, "continue");
    }
  };

  const handleViewSurvey = (job: AssignedJob) => {
    if (onShowSurvey) {
      onShowSurvey(job, "view");
    } else {
      setSelectedJob(job);
      setSurveyMode("view");
      setShowSurveyForm(true);
    }
    if (onSurveyStateChange) {
      onSurveyStateChange(true, job, "view");
    }
  };

  const handleCloseSurvey = () => {
    setShowSurveyForm(false);
    setSelectedJob(null);
    if (onSurveyStateChange) {
      onSurveyStateChange(false, null);
    }
  };

  const handleSaveSurveyDraft = (jobId: string, data: any) => {
    setSurveyDrafts((prev) => ({
      ...prev,
      [jobId]: data,
    }));
  };

  // Time tracking handlers
  const handleAddBreak = (job: AssignedJob) => {
    if (job.status !== "in-progress") {
      alert("Can only add breaks to jobs in progress");
      return;
    }
    setJobForTimeAction(job);
    setShowBreakModal(true);
    setSelectedJob(null); // Close drawer
  };

  const handleAddWaitingTime = (job: AssignedJob) => {
    if (job.status !== "in-progress") {
      alert("Can only add waiting time to jobs in progress");
      return;
    }
    setJobForTimeAction(job);
    setShowWaitingModal(true);
    setSelectedJob(null); // Close drawer
  };

  const handleEndJob = (job: AssignedJob) => {
    if (job.status !== "in-progress") {
      alert("Can only end jobs that are in progress");
      return;
    }

    // Per-mile jobs: capture end odometer then show invoice
    if (job.rateType === "per-mile") {
      setPendingPerMileJob(job);
      setShowOdometerEndModal(true);
      setSelectedJob(null);
      return;
    }

    // Check if there are active timers
    if (job.timeTracking?.activeBreak) {
      alert(
        "Please end the active break before ending the job",
      );
      return;
    }

    if (job.timeTracking?.activeWaiting) {
      alert(
        "Please end the active waiting time before ending the job",
      );
      return;
    }

    setJobForTimeAction(job);
    setShowCompleteJobModal(true);
    setSelectedJob(null); // Close drawer
  };

  const handleSaveBreak = (breakData: {
    duration: number;
    notes?: string;
  }) => {
    if (!jobForTimeAction) return;

    setJobs((prevJobs) =>
      prevJobs.map((job) => {
        if (job.id === jobForTimeAction.id) {
          const updatedJob = { ...job };
          if (!updatedJob.timeTracking) {
            updatedJob.timeTracking = {
              startTime: new Date().toISOString(),
              breaks: [],
              waitingTime: [],
            };
          }
          updatedJob.timeTracking = {
            ...updatedJob.timeTracking,
            breaks: [
              ...updatedJob.timeTracking.breaks,
              {
                ...breakData,
                timestamp: new Date().toISOString(),
              },
            ],
            activeBreak: null, // Clear active break
          };
          return updatedJob;
        }
        return job;
      }),
    );

    setShowBreakModal(false);
    setJobForTimeAction(null);
    alert(
      `Break recorded: ${breakData.duration} minute${breakData.duration > 1 ? "s" : ""}${breakData.notes ? ` (${breakData.notes})` : ""}`,
    );
  };

  const handleSaveWaitingTime = (waitingData: {
    duration: number;
    reason: string;
  }) => {
    if (!jobForTimeAction) return;

    setJobs((prevJobs) =>
      prevJobs.map((job) => {
        if (job.id === jobForTimeAction.id) {
          const updatedJob = { ...job };
          if (!updatedJob.timeTracking) {
            updatedJob.timeTracking = {
              startTime: new Date().toISOString(),
              breaks: [],
              waitingTime: [],
            };
          }
          updatedJob.timeTracking = {
            ...updatedJob.timeTracking,
            waitingTime: [
              ...updatedJob.timeTracking.waitingTime,
              {
                ...waitingData,
                timestamp: new Date().toISOString(),
              },
            ],
            activeWaiting: null, // Clear active waiting
          };
          return updatedJob;
        }
        return job;
      }),
    );

    setShowWaitingModal(false);
    setJobForTimeAction(null);
    alert("Waiting time added successfully!");
  };

  const handleConfirmEndJob = (
    endTime: string,
    notes: string,
    submitInvoice: boolean = false,
  ) => {
    if (!jobForTimeAction) return;

    // Stop the timer if handler provided
    if (onStopTimer) {
      onStopTimer();
    }

    // Update job status to completed
    setJobs((prevJobs) =>
      prevJobs.map((job) => {
        if (job.id === jobForTimeAction.id) {
          const updatedJob = { ...job };
          updatedJob.status = "completed";
          updatedJob.billingActive = false; // Stop billing
          
          if (updatedJob.timeTracking) {
            updatedJob.timeTracking.endTime = endTime;
          }
          
          // If jurisdiction is active, mark it as completed
          if (updatedJob.jurisdiction) {
            updatedJob.jurisdiction = {
              ...updatedJob.jurisdiction,
              completedAt: endTime,
            };
          }
          
          // Set invoice status
          if (submitInvoice) {
            // Generate invoice number
            const invoiceNumber = `INV-2026-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`;
            const totalAmount = parseFloat(job.assignedPay.replace(/[$,]/g, ''));
            
            updatedJob.invoice = {
              status: "submitted",
              invoiceNumber,
              totalAmount,
              submittedAt: new Date().toISOString(),
            };
          } else {
            updatedJob.invoice = {
              status: "pending",
            };
          }
          
          return updatedJob;
        }
        return job;
      }),
    );

    // Close end job modal
    setShowEndJobModal(false);

    if (submitInvoice) {
      // Show success message for invoice submission
      toast.success(`Job ${jobForTimeAction.id} completed and invoice submitted!`, {
        description: "The truck driver will review your invoice shortly.",
      });
      
      setJobForTimeAction(null);
    } else {
      // Open invoice modal if user didn't choose to submit invoice
      setTimeout(() => {
        setShowInvoiceModal(true);
      }, 300);
    }
  };

  const handleSubmitInvoice = (invoiceData: InvoiceData) => {
    if (!jobForTimeAction) return;

    // Update job with invoice data
    setJobs((prevJobs) =>
      prevJobs.map((job) => {
        if (job.id === jobForTimeAction.id) {
          const updatedJob = { ...job };
          updatedJob.invoice = {
            status: "submitted",
            invoiceNumber: invoiceData.invoiceNumber,
            totalAmount: invoiceData.totalAmount,
            submittedAt: invoiceData.submittedAt,
          };
          return updatedJob;
        }
        return job;
      }),
    );

    setShowInvoiceModal(false);
    setJobForTimeAction(null);

    alert(
      `✅ Invoice ${invoiceData.invoiceNumber} submitted successfully!\n\nAmount: $${invoiceData.totalAmount.toFixed(2)}\nSubmitted to: ${jobs.find((j) => j.id === jobForTimeAction.id)?.requestingCompany}\n\nYou'll receive a notification once the truck driver reviews and approves your invoice.`,
    );
  };

  const handleViewInvoice = (job: AssignedJob) => {
    if (!job.invoice || job.invoice.status === "pending") {
      alert("No invoice has been submitted for this job yet");
      return;
    }

    setJobForTimeAction(job);
    setShowInvoiceStatusModal(true);
    setSelectedJob(null); // Close drawer
  };

  // NEW STATE TRANSITION HANDLERS

  /**
   * Handle Accept Job action
   * Transition: awaiting-acceptance → accepted
   */
  const handleAcceptJob = (job: AssignedJob) => {
    const validation = PilotJobStateValidator.canAcceptJob(job);

    if (!validation.allowed) {
      toast.error(validation.reason || "Cannot accept job");
      return;
    }

    const acceptedAt = new Date().toISOString();
    const updatedJob = PilotJobStateActions.acceptJob(
      job,
      acceptedAt,
    );

    setJobs((prevJobs) =>
      prevJobs.map((j) => (j.id === job.id ? updatedJob : j)),
    );

    toast.success(
      `Job ${job.id} accepted! You can now start the job when ready.`,
    );

    // Close drawer if open
    if (selectedJob?.id === job.id) {
      setSelectedJob(updatedJob);
    }
  };

  /**
   * Handle Start Job action (START BILLING)
   * Transition: accepted → in-progress
   */
  const handleStartJob = (job: AssignedJob) => {
    // Per-mile jobs require odometer capture before starting
    if (job.rateType === "per-mile") {
      setPendingPerMileJob(job);
      setShowOdometerStartModal(true);
      setSelectedJob(null);
      return;
    }

    // Check if any other job is already in progress
    const jobInProgress = jobs.find(
      (j) => j.id !== job.id && j.status === "in-progress",
    );

    if (jobInProgress) {
      console.log(
        "❌ Another job in progress:",
        jobInProgress.id,
      );
      toast.error(`Cannot start job ${job.id}`, {
        description: `Job ${jobInProgress.id} is already in progress. Please end that job first.`,
      });
      return;
    }

    const validation = PilotJobStateValidator.canStartJob(job);
    console.log("🚀 Validation result:", validation);

    if (!validation.allowed) {
      console.log("❌ Validation failed:", validation.reason);
      toast.error(validation.reason || "Cannot start job");
      return;
    }

    const startedAt = new Date().toISOString();
    const updatedJob = PilotJobStateActions.startJob(
      job,
      startedAt,
    );
    console.log("✅ Job started, updatedJob:", updatedJob);

    setJobs((prevJobs) =>
      prevJobs.map((j) => (j.id === job.id ? updatedJob : j)),
    );

    // Start timer if handler provided
    if (onStartTimer) {
      onStartTimer({
        jobId: job.id,
        jobTitle: job.jobTitle,
        startTime: startedAt,
        type: "job",
      });
    }

    toast.success(`Billing started for job ${job.id}`, {
      description:
        "Timer is now running. Track your time accurately.",
    });

    // Close drawer and open map navigation view
    setSelectedJob(null);
    if (onJobStarted) {
      onJobStarted(updatedJob);
    }
  };

  // Per-mile: after start odometer captured → actually start the job
  const handlePerMileOdometerStart = (reading: OdometerReading) => {
    if (!pendingPerMileJob) return;
    const job = pendingPerMileJob;
    setCapturedStartOdometer(reading);
    setShowOdometerStartModal(false);

    // Check another job isn't already in progress
    const jobInProgress = jobs.find((j) => j.id !== job.id && j.status === "in-progress");
    if (jobInProgress) {
      toast.error(`Cannot start job ${job.id}`, {
        description: `Job ${jobInProgress.id} is already in progress.`,
      });
      setPendingPerMileJob(null);
      return;
    }

    const validation = PilotJobStateValidator.canStartJob(job);
    if (!validation.allowed) {
      toast.error(validation.reason || "Cannot start job");
      setPendingPerMileJob(null);
      return;
    }

    const startedAt = new Date().toISOString();
    const updatedJob: AssignedJob = {
      ...PilotJobStateActions.startJob(job, startedAt),
      startOdometer: reading,
    };

    setJobs((prev) => prev.map((j) => (j.id === job.id ? updatedJob : j)));

    if (onStartTimer) {
      onStartTimer({ jobId: job.id, jobTitle: job.jobTitle, startTime: startedAt, type: "job" });
    }

    toast.success(`Escort started for job ${job.id}`, {
      description: `Starting odometer: ${reading.reading.toLocaleString()} mi`,
    });

    setPendingPerMileJob(null);
    if (onJobStarted) onJobStarted(updatedJob);
  };

  // Per-mile: after end odometer captured → show invoice modal
  const handlePerMileOdometerEnd = (reading: OdometerReading) => {
    if (!pendingPerMileJob) return;
    setCapturedEndOdometer(reading);
    setShowOdometerEndModal(false);

    // Mark job as completed now
    const endedAt = new Date().toISOString();
    setJobs((prev) =>
      prev.map((j) => {
        if (j.id !== pendingPerMileJob.id) return j;
        return {
          ...j,
          endOdometer: reading,
          status: "completed" as const,
          billingActive: false,
          timeTracking: j.timeTracking
            ? { ...j.timeTracking, endTime: endedAt }
            : { breaks: [], waitingTime: [], endTime: endedAt },
          jurisdiction: j.jurisdiction
            ? { ...j.jurisdiction, completedAt: endedAt }
            : j.jurisdiction,
          invoice: { status: "pending" as const },
        };
      })
    );

    if (onStopTimer) onStopTimer();

    // Show per-mile invoice modal
    setShowPerMileInvoiceModal(true);
  };

  // Per-mile: invoice submitted
  const handlePerMileInvoiceSubmit = (invoiceData: PerMileInvoiceData) => {
    if (!pendingPerMileJob) return;

    setJobs((prev) =>
      prev.map((j) => {
        if (j.id !== pendingPerMileJob.id) return j;
        return {
          ...j,
          invoice: {
            status: "submitted" as const,
            invoiceNumber: invoiceData.invoiceNumber,
            totalAmount: invoiceData.netPayout,
            submittedAt: invoiceData.submittedAt,
          },
        };
      })
    );

    setShowPerMileInvoiceModal(false);
    setPendingPerMileJob(null);
    setCapturedStartOdometer(null);
    setCapturedEndOdometer(null);

    toast.success(`Invoice ${invoiceData.invoiceNumber} submitted!`, {
      description: `Net payout: $${invoiceData.netPayout.toFixed(2)}`,
    });
  };

  /**
   * Simulate Jurisdiction Activation by Truck Driver
   * Transition: upcoming → awaiting-acceptance
   */
  const simulateJurisdictionActivation = (job: AssignedJob) => {
    const validation =
      PilotJobStateValidator.canTransitionToAwaitingAcceptance(
        job,
      );

    if (!validation.allowed) {
      toast.error(
        validation.reason || "Cannot activate jurisdiction",
      );
      return;
    }

    const activatedAt = new Date().toISOString();
    const activatedBy = "Truck Driver (Simulated)";

    const updatedJob =
      PilotJobStateActions.notifyJurisdictionActivated(
        job,
        activatedBy,
        activatedAt,
      );

    setJobs((prevJobs) =>
      prevJobs.map((j) => (j.id === job.id ? updatedJob : j)),
    );

    // Send notification
    toast.info(
      PilotJobNotifications.jurisdictionActivated(
        job.jurisdiction?.code || "Unknown",
      ),
      {
        description: "Please accept the job to begin escort.",
      },
    );

    // Update selected job if it's open
    if (selectedJob?.id === job.id) {
      setSelectedJob(updatedJob);
    }
  };

  const handleDownloadInvoice = (job: AssignedJob) => {
    // Generate invoice document (simulated)
    alert(
      `📄 Downloading Invoice...\n\nInvoice: ${job.invoice?.invoiceNumber}\nJob: ${job.jobTitle}\nAmount: $${job.invoice?.totalAmount?.toFixed(2)}\n\n✅ Invoice PDF downloaded successfully!`,
    );

    // In a real app, you would generate a PDF here
    // const invoiceData = generateInvoicePDF(job);
    // downloadFile(invoiceData, `${job.invoice?.invoiceNumber}.pdf`);
  };

  const handleDownloadTripReport = (job: AssignedJob) => {
    // Generate job report document (simulated)
    const timeTracking = job.timeTracking;
    if (!timeTracking) {
      alert("No time tracking data available for this job");
      return;
    }

    const startDate = new Date(timeTracking.startTime!);
    const endDate = new Date(timeTracking.endTime!);
    const totalMinutes = Math.floor(
      (endDate.getTime() - startDate.getTime()) / 1000 / 60,
    );
    const totalHours = (totalMinutes / 60).toFixed(2);

    alert(
      `📋 Downloading Job Report...\n\nJob: ${job.jobTitle}\nRoute: ${job.origin} → ${job.destination}\nDate: ${startDate.toLocaleDateString()}\nTotal Time: ${totalHours}h\nBreaks: ${timeTracking.breaks.length}\nWaiting Periods: ${timeTracking.waitingTime.length}\n\n✅ Job Report PDF downloaded successfully!`,
    );

    // In a real app, you would generate a PDF here
    // const reportData = generateJobReportPDF(job);
    // downloadFile(reportData, `Job-Report-${job.id}.pdf`);
  };

  // Show route survey form if active
  if (showSurveyForm && selectedJob) {
    return (
      <RouteSurveyForm
        job={selectedJob}
        onBack={handleCloseSurvey}
        existingSurvey={surveyDrafts[selectedJob.id]}
        readOnly={surveyMode === "view"}
        onSaveDraft={handleSaveSurveyDraft}
      />
    );
  }
  
  return (
    <div className="flex flex-col h-full">
      {/* Header Section */}
      <div className="px-4 pt-4 pb-3">
        <h2 className="text-base font-semibold text-gray-900">
          My Jobs
        </h2>
      </div>

      {/* Filter Tabs */}
      <div className="px-4 pb-3">
        <div className="flex gap-2 overflow-x-auto">
          <button
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
              activeTab === "all"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
            onClick={() => setActiveTab("all")}
          >
            All ({totalCount})
          </button>

          <button
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
              activeTab === "assigned"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
            onClick={() => setActiveTab("assigned")}
          >
            Assigned ({assignedCount})
          </button>

          <button
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
              activeTab === "in-progress"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
            onClick={() => setActiveTab("in-progress")}
          >
            In Progress ({inProgressCount})
          </button>

          <button
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
              activeTab === "completed"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
            onClick={() => setActiveTab("completed")}
          >
            Completed ({completedCount})
          </button>
        </div>
      </div>

      {/* Job List - Scrollable */}
      <div className="flex-1 overflow-y-auto px-4 pb-24 bg-[#f6f6f6]">
        {sortedJobs.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Briefcase className="size-12 text-gray-300 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-1">
                No Jobs Found
              </h3>
              <p className="text-sm text-gray-600">
                {searchQuery
                  ? "Try adjusting your search criteria"
                  : activeTab === "all"
                    ? "You have no assigned jobs yet"
                    : `You have no ${activeTab.replace("-", " ")} jobs`}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {sortedJobs.map((job) => (
              <AssignedJobCard
                key={job.id}
                job={job}
                onViewDetails={setSelectedJob}
                onAcceptJob={handleAcceptJob}
                onStartJob={handleStartJob}
                onStartSurvey={handleStartSurvey}
                onContinueSurvey={handleContinueSurvey}
                onViewSurvey={handleViewSurvey}
                onAddBreak={handleAddBreak}
                onAddWaitingTime={handleAddWaitingTime}
                onEndJob={handleEndJob}
              />
            ))}
          </div>
        )}
      </div>

      {/* Job Details Drawer */}
      <AssignedJobDetailsDrawer
        job={selectedJob}
        onClose={() => setSelectedJob(null)}
        onStartSurvey={handleStartSurvey}
        onContinueSurvey={handleContinueSurvey}
        onViewSurvey={handleViewSurvey}
        onAddBreak={handleAddBreak}
        onAddWaitingTime={handleAddWaitingTime}
        onEndJob={handleEndJob}
        onViewInvoice={handleViewInvoice}
        onAcceptJob={handleAcceptJob}
        onStartJob={handleStartJob}
        onSimulateJurisdictionActivation={
          simulateJurisdictionActivation
        }
        onRateDriver={(job, ratingData) => {
          // Update the job with the rating
          setJobs((prevJobs) =>
            prevJobs.map((j) =>
              j.id === job.id
                ? { ...j, driverRating: ratingData }
                : j
            )
          );
          // Update selected job if it's open
          if (selectedJob?.id === job.id) {
            setSelectedJob({ ...job, driverRating: ratingData });
          }
        }}
      />

      {/* Time Tracking Modals */}
      {showBreakModal && jobForTimeAction && (
        <AddBreakModal
          onClose={() => {
            setShowBreakModal(false);
            setJobForTimeAction(null);
          }}
          onSave={handleSaveBreak}
        />
      )}

      {showWaitingModal && jobForTimeAction && (
        <AddWaitingTimeModal
          onClose={() => {
            setShowWaitingModal(false);
            setJobForTimeAction(null);
          }}
          onSave={handleSaveWaitingTime}
        />
      )}

      {showCompleteJobModal && jobForTimeAction && (
        <CompleteJobModal
          open={showCompleteJobModal}
          job={jobForTimeAction}
          onClose={() => {
            setShowCompleteJobModal(false);
            setJobForTimeAction(null);
          }}
          onConfirm={(payoutMethod) => {
            setShowCompleteJobModal(false);
            handleConfirmEndJob(new Date().toISOString(), "", true);
          }}
        />
      )}

      {showInvoiceModal && jobForTimeAction && (
        <InvoiceSubmissionModal
          job={jobForTimeAction}
          onClose={() => {
            setShowInvoiceModal(false);
            setJobForTimeAction(null);
          }}
          onSubmit={handleSubmitInvoice}
        />
      )}

      {showInvoiceStatusModal && jobForTimeAction && (
        <InvoiceStatusModal
          job={jobForTimeAction}
          onClose={() => {
            setShowInvoiceStatusModal(false);
            setJobForTimeAction(null);
          }}
          onDownloadInvoice={handleDownloadInvoice}
          onDownloadTripReport={handleDownloadTripReport}
        />
      )}

      {/* Per-Mile Flow Modals */}
      <OdometerCaptureModal
        open={showOdometerStartModal}
        type="start"
        jobTitle={pendingPerMileJob?.jobTitle ?? ""}
        jobId={pendingPerMileJob?.id}
        origin={pendingPerMileJob?.origin}
        destination={pendingPerMileJob?.destination}
        ratePerMile={pendingPerMileJob?.ratePerMile}
        onConfirm={handlePerMileOdometerStart}
        onClose={() => {
          setShowOdometerStartModal(false);
          setPendingPerMileJob(null);
        }}
      />

      <OdometerCaptureModal
        open={showOdometerEndModal}
        type="end"
        jobTitle={pendingPerMileJob?.jobTitle ?? ""}
        jobId={pendingPerMileJob?.id}
        origin={pendingPerMileJob?.origin}
        destination={pendingPerMileJob?.destination}
        ratePerMile={pendingPerMileJob?.ratePerMile}
        startReading={
          pendingPerMileJob
            ? jobs.find((j) => j.id === pendingPerMileJob.id)?.startOdometer?.reading
            : undefined
        }
        onConfirm={handlePerMileOdometerEnd}
        onClose={() => {
          setShowOdometerEndModal(false);
          setPendingPerMileJob(null);
        }}
      />

      {showPerMileInvoiceModal && pendingPerMileJob && capturedStartOdometer && capturedEndOdometer && (
        <PerMileInvoiceModal
          open={showPerMileInvoiceModal}
          job={pendingPerMileJob}
          startOdometer={capturedStartOdometer}
          endOdometer={capturedEndOdometer}
          onSubmit={handlePerMileInvoiceSubmit}
          onClose={() => {
            setShowPerMileInvoiceModal(false);
          }}
        />
      )}
    </div>
  );
}